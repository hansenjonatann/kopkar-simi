"use client";
import { Input } from "@/components/ui/input";
import { addItem, updateItemQuantity } from "@/lib/statemanagement/item/slice";
import { RootState } from "@/lib/statemanagement/item/store";
import axios from "axios";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function CashierTransactionPage() {
  const pathname = usePathname();
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [code, setCode] = useState(0);
  const dispatch = useDispatch();

  const items = useSelector((state: RootState) => state.items.items);

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const total = subtotal - discount;

  const fetchProducts = async (code: number) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}product/code?code=${code}`
      );

      const product = res.data.data;

      if (product) {
        dispatch(addItem(product));
      }
    } catch (error) {
      console.log("Error fetching product:", error);
    }
  };

  const paymentOptions = [
    { id: 1, label: "CASH", value: "CASH" },
    { id: 2, label: "CARD", value: "CARD" },
    { id: 3, label: "DIGITAL", value: "DIGITAL" },
  ];

  // Function to show the payment modal
  const handleShowPaymentModal = () => {
    setIsPaymentModalVisible(true);
  };

  // Function to close the payment modal
  const handleClosePaymentModal = () => {
    setIsPaymentModalVisible(false);
  };

  const handleInputCode = (e: FormEvent) => {
    e.preventDefault();
    fetchProducts(code);
    setCode(0);
  };

  // Watch for changes in `code` and trigger the fetch

  const cashierMenu = [
    { id: 1, label: "Transaction", path: "/cashier/transaction" },
    { id: 2, label: "Price Checker", path: "/cashier/price-checker" },
    { id: 3, label: "Sales Return", path: "/cashier/salesreturn" },
  ];

  return (
    <>
      <div className="m-4">
        <form action="">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div>
              <div className="my-4 flex gap-x-2">
                <label htmlFor="date" className="w-40">
                  Date
                </label>
                <span>
                  : {new Date().toLocaleDateString().replaceAll("/", " - ")}
                </span>
              </div>
              <div className="my-4 flex gap-x-2">
                <label htmlFor="code" className="w-40">
                  Barcode
                </label>
                <span>:</span>
                <Input
                  type="number"
                  className="w-64 rounded-md text-black px-2 border-2 border-black"
                  autoFocus
                  value={code}
                  onChange={(e) => setCode(Number(e.target.value))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleInputCode(e);
                    }
                  }}
                />
              </div>
            </div>
            <div className="bg-green-600 flex items-center justify-center w-full">
              <h1 className="text-4xl  text-secondary font-semibold">
                Sub Total :{" "}
                <span className="font-bold">
                  Rp {subtotal.toLocaleString("id")}
                </span>
              </h1>
            </div>
          </div>
          <div className="bg-primary h-[280px] w-full mt-3">
            <table className="table-auto w-full text-secondary">
              <thead>
                <tr>
                  <th className="border border-white text-center">#</th>
                  <th className="border border-white text-center">
                    Nama Produk
                  </th>
                  <th className="border border-white text-center">Jumlah</th>
                  <th className="border border-white text-center">
                    Harga Satuan
                  </th>
                  <th className="border border-white text-center">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id}>
                    <td className="border border-white text-center">
                      {index + 1}
                    </td>
                    <td className="border border-white text-center">
                      {item.name}
                    </td>
                    <td className="border border-white text-center">
                      <input
                        type="number"
                        className="bg-transparent text-secondary w-12 text-center"
                        value={item.quantity}
                        onChange={(e) =>
                          dispatch(
                            updateItemQuantity({
                              id: item.id,
                              quantity: Number(e.target.value),
                            })
                          )
                        }
                      />
                    </td>
                    <td className="border border-white text-center">
                      Rp {item.price.toLocaleString("id")}
                    </td>
                    <td className="border border-white text-center">
                      Rp {(item.price * item.quantity).toLocaleString("id")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end mt-4">
            <div className="flex flex-col">
              <div className="flex">
                <h1 className="font-bold text-2xl w-40">Discount</h1>
                <span className="font-bold text-2xl">
                  : Rp{" "}
                  <input
                    type="number"
                    className="w-32 bg-transparent text-primary rounded-md"
                    value={discount.toLocaleString("id")}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                  />
                </span>
              </div>
              <div className="flex">
                <h1 className="font-bold text-2xl w-40">Total</h1>
                <span className="font-bold text-2xl">
                  : Rp {total.toLocaleString("id")}
                </span>
              </div>
              {/* Bayar Button */}
              <button
                onClick={() => {
                  handleShowPaymentModal();
                }}
                className="bg-red-600 p-2 mt-4 rounded-md font-bold"
              >
                Bayar ( F8 )
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="flex m-4 gap-x-4">
        {cashierMenu.map((menu, index) => (
          <Link
            key={index}
            href={menu.path}
            className={
              pathname == menu.path
                ? "bg-primary text-accsent border border-white rounded-md font-bold p-3"
                : "bg-secondary text-accsent border border-white rounded-md font-bold p-3"
            }
          >
            {menu.label}
          </Link>
        ))}
      </div>

      {/* Payment Modal */}
      {isPaymentModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-md shadow-md p-6 w-1/3">
            <h1 className="text-2xl font-bold mb-4">Pembayaran</h1>
            <form action="">
              <div className="my-4 flex flex-col">
                <label htmlFor="paymentmethod">Metode Pembayaran</label>
                <select
                  value={selectedPaymentMethod}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  className="p-2 rounded-md text-black"
                >
                  <option value="">Pilih Metode Pembayaran</option>
                  {paymentOptions.map((payment, index) => (
                    <option key={index} value={payment.value}>
                      {payment.label}
                    </option>
                  ))}
                </select>
              </div>

              {selectedPaymentMethod === "CASH" && (
                <div className="my-4 flex flex-col">
                  <label htmlFor="paymentAmount">Jumlah Uang Dibayarkan</label>
                  <input
                    type="number"
                    id="paymentAmount"
                    className="p-2 rounded-md text-black"
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  />
                  <pre className="mt-4">
                    Rp {paymentAmount.toLocaleString("id")}
                  </pre>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleClosePaymentModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md mt-4"
                >
                  Tutup
                </button>
                <button className="bg-green-500 text-white px-4 py-2 rounded-md mt-4">
                  Bayar ( Enter )
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
