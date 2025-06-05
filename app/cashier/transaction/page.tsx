"use client";

import { Input } from "@/components/ui/input";
import {
  addItem,
  updateItemQuantity,
  updateUnitType,
} from "@/lib/statemanagement/item/slice";
import { RootState } from "@/lib/statemanagement/item/store";
import axios from "axios";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const CashierTransactionPage = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const [discount, setDiscount] = useState(0);
  const [code, setCode] = useState(0);
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState("");

  const items = useSelector((state: RootState) => state.items.items);

  const subtotal = items.reduce((acc, item) => {
    const unitPrice =
      item.unitType === "retail" ? item.priceRetail : item.priceWholesale;
    return acc + unitPrice * item.quantity;
  }, 0);

  const total = subtotal - discount;

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}customer`
        );
        setCustomers(res.data.data);
      } catch {
        toast.error("Failed to fetch customers.");
      }
    };
    fetchCustomers();
  }, []);

  const fetchProductByCode = async (code: number) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}product/code?code=${code}`
      );
      const product = res.data.data;
      if (product) {
        dispatch(addItem({ ...product, unitType: "retail" }));
      }
    } catch {
      toast.error("Product not found.");
    }
  };

  const handleInputCode = (e: FormEvent) => {
    e.preventDefault();
    if (code > 0) {
      fetchProductByCode(code);
      setCode(0);
    }
  };

  const handlePayment = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}sale`, {
        items: items.map((item) => ({
          quantity: item.quantity,
          unitPrice:
            item.unitType === "retail" ? item.priceRetail : item.priceWholesale,
          productId: item.id,
        })),
        discount,
        customerId,
        subtotal,
        total,
      });

      toast.success(res.data.message);
      router.push(`/cashier/payment/?id=${res.data.data.id}`);
    } catch {
      toast.error("Failed to process payment.");
    }
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false, callbackUrl: "/sign-in" });
    localStorage.removeItem("token");
    toast.success("Logout success!");
    router.push("/sign-in");
  };

  const cashierMenu = [
    { id: 1, label: "Transaction", path: "/cashier/transaction" },
    { id: 2, label: "Price Checker", path: "/cashier/price-checker" },
    { id: 3, label: "Sales Return", path: "/cashier/salesreturn" },
  ];

  return (
    <div className="m-4">
      <form onSubmit={handlePayment}>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div>
            <div className="my-4 flex gap-x-2">
              <label className="w-40">Date</label>
              <span>
                : {new Date().toLocaleDateString("id").replaceAll("/", " - ")}
              </span>
            </div>

            <div className="my-4 flex gap-x-2">
              <label className="w-40">Barcode</label>
              <span>:</span>
              <Input
                type="number"
                className="w-64 text-black border-2 border-black rounded-md px-2"
                value={code}
                autoFocus
                onChange={(e) => setCode(Number(e.target.value))}
                onKeyDown={(e) => e.key === "Enter" && handleInputCode(e)}
              />
            </div>

            <div className="my-4 flex gap-x-2">
              <label className="w-40">Customer</label>
              <span>:</span>
              <select
                onChange={(e) => setCustomerId(e.target.value)}
                className="px-4 py-1 border border-black rounded-md"
              >
                <option value="">Select customer</option>
                {customers.map((cust: any) => (
                  <option key={cust.id} value={cust.id}>
                    {cust.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-green-600 flex items-center justify-center w-full">
            <h1 className="text-4xl font-semibold text-secondary">
              Subtotal:{" "}
              <span className="font-bold">
                Rp {subtotal.toLocaleString("id")}
              </span>
            </h1>
          </div>
        </div>

        <div className="bg-primary mt-3 h-[280px] w-full overflow-auto">
          <table className="table-auto w-full text-secondary">
            <thead>
              <tr>
                <th className="border border-white">#</th>
                <th className="border border-white">Product</th>
                <th className="border border-white">Qty</th>
                <th className="border border-white">Unit Type</th>
                <th className="border border-white">Price/Unit</th>
                <th className="border border-white">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item.id} className="text-center">
                  <td className="border border-white">{idx + 1}</td>
                  <td className="border border-white">{item.name}</td>
                  <td className="border border-white">
                    <input
                      type="number"
                      className="w-12 bg-transparent text-secondary text-center"
                      value={item.quantity}
                      onChange={(e) =>
                        dispatch(
                          updateItemQuantity({
                            id: item.id,
                            quantity: Math.max(Number(e.target.value), 1),
                          })
                        )
                      }
                    />
                  </td>
                  <td className="border border-white">
                    <select
                      value={item.unitType}
                      className="text-black"
                      onChange={(e) =>
                        dispatch(
                          updateUnitType({
                            id: item.id,
                            unitType: e.target.value as "retail" | "wholesale",
                          })
                        )
                      }
                    >
                      <option value="retail">Retail</option>
                      <option value="wholesale">wholesale</option>
                    </select>
                  </td>
                  <td className="border border-white">
                    Rp{" "}
                    {(item.unitType === "retail"
                      ? item.priceRetail
                      : item.priceWholesale
                    ).toLocaleString("id")}
                  </td>
                  <td className="border border-white">
                    Rp{" "}
                    {(
                      (item.unitType === "retail"
                        ? item.priceRetail
                        : item.priceWholesale) * item.quantity
                    ).toLocaleString("id")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-4">
          <div className="flex flex-col">
            <div className="flex items-center">
              <h1 className="font-bold text-2xl w-40">Discount</h1>
              <span className="font-bold text-2xl">
                : Rp
                <input
                  type="number"
                  className="w-32 bg-transparent text-primary border-b-2 border-black"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                />
              </span>
            </div>

            <div className="flex items-center mt-2">
              <h1 className="font-bold text-2xl w-40">Total</h1>
              <span className="font-bold text-2xl">
                : Rp {total.toLocaleString("id")}
              </span>
            </div>

            <button
              type="submit"
              className="bg-green-600 p-2 mt-4 text-white rounded-md font-bold"
            >
              Confirm
            </button>

            <button
              type="button"
              onClick={handleSignOut}
              className="bg-red-600 p-2 mt-2 text-white rounded-md font-bold"
            >
              Sign Out
            </button>
          </div>
        </div>
      </form>

      <div className="flex mt-4 gap-x-4">
        {cashierMenu.map((menu) => (
          <Link
            key={menu.id}
            href={menu.path}
            className={`${pathname === menu.path ? "bg-primary" : "bg-secondary"} text-accsent border border-white rounded-md font-bold p-3`}
          >
            {menu.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CashierTransactionPage;
