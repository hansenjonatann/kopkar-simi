"use client";

import CustomForm from "@/components/custom-form";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Suspense, FormEvent, useEffect, useState, useMemo } from "react";
import {  useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/statemanagement/item/store";

function PaymentContent() {
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const { data: session } = useSession();
  const params = useSearchParams();
  const saleId = useMemo(() => params.get("id"), [params]);

  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const items = useSelector((state: RootState) => state.items.items)


  const [isModal , setIsModal] = useState(false)

  const handleOpenNotes = () => setIsModal(true)



  // const router = useRouter();
  const generateChange = useMemo(
    () => (paymentAmount ?? 0) - total,
    [paymentAmount, total]
  );

  const paymentMethodList = [
    { id: 1, name: "Cash", value: "CASH" },
    { id: 2, name: "Card", value: "CARD" },
    { id: 3, name: "Digital", value: "DIGITAL" },
  ];

  useEffect(() => {
    const fetchSaleDetail = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}sale/${saleId}`
        );
        const data = res.data.data;
        if (!data) throw new Error("No sale data received");

        setDate(data.date);
        setSubtotal(data.subtotal);
        setDiscount(data.discount);
        setTotal(data.total);
      } catch (error) {
        toast.error("Failed to fetch sale details");
        console.log("Error fetching sale details:", error);
      }
    };

    fetchSaleDetail();
  }, [saleId]);

  const handleProcessBilling = async (e: FormEvent) => {
    e.preventDefault();

    if (!saleId) {
      toast.error("Sale ID is missing");
    }

    if (paymentAmount < total) {
      toast.error("Your balance is not enough");
    }

    const payload = {
      saleId,
      paymentAmount,
      paymentmethod: paymentMethod,
      change: generateChange,
    };


    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}transaction`,
        payload
      );
      toast.success(res.data.message);
      handleOpenNotes()
      // router.push("/cashier/transaction");
      // router.refresh()
    } catch (error) {
      toast.error("Transaction failed");
      console.error("Error processing transaction:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print()
  }

  return (
    <>
    <div className="m-6">
      <h1 className="text-2xl font-bold text-center">Sale Details</h1>
      <div className="mt-6">
        <h1 className="text-2xl font-bold">Details</h1>
        <div className="flex flex-col">
          <div className="flex justify-between items-center">
            <h1>Date</h1>
            <span className="font-extrabold">{date || "-"}</span>
          </div>
          <div className="flex justify-between items-center">
            <h1>Cashier Name</h1>
            <span className="font-extrabold">{session?.user.name || "-"}</span>
          </div>
          <div className="flex flex-col mt-4">
            <div className="flex justify-between items-center">
              <h1>Subtotal</h1>
              <span className="font-extrabold">
                Rp {subtotal.toLocaleString("id")}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <h1>Discount</h1>
              <span className="font-extrabold">
                Rp {discount === 0 ? "-" : discount.toLocaleString("id")}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <h1 className="font-bold">Total</h1>
              <span className="font-extrabold">
                Rp {total.toLocaleString("id")}
              </span>
            </div>
          </div>
        </div>
        <hr className="my-3 border-2 border-black" />

        <div className="mt-8">
          <h1 className="text-2xl font-bold">Payment</h1>
          <form onSubmit={handleProcessBilling}>
            <div className="flex flex-col">
              <label>Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-2 rounded-lg border-black border"
              >
                <option value="">Choose your payment method</option>
                {paymentMethodList.map((method) => (
                  <option key={method.id} value={method.value}>
                    {method.name}
                  </option>
                ))}
              </select>

              <CustomForm
                label="Payment Amount"
                name="paymentamount"
                type="number"
                onchange={(e) => setPaymentAmount(Number(e.target.value))}
              />

              <span className="font-bold">
                Change: Rp {generateChange.toLocaleString("id")}
              </span>
            </div>

            <Button
              type="submit"
              className="flex w-full mt-6"
              disabled={loading}
            >
              {loading ? "Processing..." : "Pay"}
            </Button>

          </form>
        </div>
      </div>
    </div>

    {isModal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm  ">
      <div className="bg-white w-[420px] h-[400px] rounded-lg shadow-xl">
        <h1 className="text-center text-xl font-bold mt-4">KOPKAR BATAMAS MEGAH</h1>
        <div className="mt-8 mx-3">
          <h1>Item Details</h1>
          <hr className="border border-black mt-2"/>

          <div className="mt-4">
                <div  className="flex flex-col text-black ">
              {items.map((item: any  , idx: number) => (
                  <div key={idx} className="flex items-center justify-between">
                    <h1>{item.name}</h1>
                    <div className="flex flex-col">
                    <h1>@1</h1>
                    </div>
                    <h1>{item.price.toLocaleString('id')}</h1>
                  </div>
                ))}
                </div>
              </div>
        </div>
      </div>
    </div>}
    </>
  );
}

export default function CashierPaymentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
