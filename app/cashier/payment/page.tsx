"use client";

import CustomForm from "@/components/custom-form";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  Suspense,
  FormEvent,
  useEffect,
  useState,
  useMemo,
  useRef, // Make sure useRef is imported
} from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/statemanagement/item/store";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useReactToPrint } from "react-to-print"; // Make sure useReactToPrint is imported

function PaymentContent() {
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const { data: session } = useSession();
  const params = useSearchParams();
  const saleId = useMemo(() => params.get("id"), [params]);
  const [customerName, setCustomerName] = useState("");

  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const items = useSelector((state: RootState) => state.items.items);

  // Create a ref for the component you want to print
  const componentRef = useRef<HTMLDivElement>(null);

  const [isModal, setIsModal] = useState(false);

  const handleOpenNotes = () => setIsModal(true);

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
        setCustomerName(data.customer.name);
        setDiscount(data.discount);
        setTotal(data.total);
      } catch (error) {
        toast.error("Failed to fetch sale details");
        console.error("Error fetching sale details:", error); // Use console.error for errors
      }
    };

    if (saleId) {
      // Only fetch if saleId exists
      fetchSaleDetail();
    }
  }, [saleId]); // Dependency array includes saleId

  const handleProcessBilling = async (e: FormEvent) => {
    e.preventDefault();

    if (!saleId) {
      toast.error("Sale ID is missing");
      return; // Stop execution if saleId is missing
    }

    if (paymentAmount < total) {
      toast.error("Your balance is not enough");
      return; // Stop execution if payment is insufficient
    }

    if (!paymentMethod) {
      // Added validation for paymentMethod if needed
      toast.error("Please select a payment method.");
      return;
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
      handleOpenNotes(); // Open the modal after successful transaction
    } catch (error) {
      toast.error("Transaction failed");
      console.error("Error processing transaction:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- BEGIN: handlePrint function using useReactToPrint ---
  const handlePrint = useReactToPrint({
    contentRef: componentRef, // Reference to the component to print
    documentTitle: `Nota Pembayaran - ${saleId}`, // Optional: set a title for the print dialog/PDF
    pageStyle: `
      @page {
        size: 58mm auto; /* Common thermal receipt paper width, auto height */
        margin: 0; /* Remove default page margins */
      }
      body {
        margin: 0;
        font-family: monospace; /* Monospace font for receipt look */
        font-size: 10pt;
        color: black; /* Ensure text is black for printing */
      }
      /* Ensure all text within the print area is black */
      .print-area * {
          color: black !important;
      }
      /* Remove default margins/padding on text elements for tighter layout */
      .print-area p, .print-area span, .print-area h1 {
          margin: 0;
          padding: 0;
      }
      /* Specific item row styling for better alignment */
      .receipt-item {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 2px;
      }
      .receipt-item-name {
        flex: 1;
        text-align: left;
        padding-right: 5px; /* Small padding between name and total */
      }
      .receipt-item-total {
        width: 80px; /* Adjust as needed */
        text-align: right;
      }
      hr {
        border-top: 1px dashed black;
        margin: 5px 0;
      }
      /* Override Tailwind's overflow/height for printing to show all items */
      .print-area .max-h-48 {
          max-height: none !important;
      }
      .print-area .overflow-y-auto {
          overflow-y: visible !important;
      }
    `,
    // Making callbacks async to satisfy TypeScript
    onBeforePrint: async () => {
      console.log("Printing started...");
      // Any async operations (e.g., state updates) can go here
    },
    onAfterPrint: async () => {
      console.log("Printing finished!");
      // Any async cleanup (e.g., closing modal, navigating) can go here
    },
  });
  // --- END: handlePrint function using useReactToPrint ---

  return (
    <>
      {/* This main content div will be hidden when printing */}
      <div className="m-6 print:hidden">
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
              <span className="font-extrabold">
                {session?.user.name || "-"}
              </span>
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
                  required // Added required
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

      {isModal && (
        <Dialog open={isModal} onOpenChange={setIsModal}>
          {/* The DialogContent wrapper itself is hidden when printing, 
              but its children (the receipt content) will be printed via the ref. */}
          <DialogContent className="max-w-md p-6 print:hidden">
            {/* THIS IS THE DIV THAT useReactToPrint WILL TARGET for printing.
                Apply the ref here and a class for print-specific styling. */}
            <div
              ref={componentRef}
              className="p-4 bg-white text-black print-area"
            >
              <DialogTitle className="text-center font-bold text-lg">
                🧾 KOPKAR BATAMAS MEGAH
              </DialogTitle>

              <div className="text-sm text-center mb-4">
                <p>Jl. Contoh No.123, Batam</p>
                <p>Telp: (0778) 1234567</p>
                <p>{new Date().toLocaleString("id-ID")}</p>
              </div>

              <hr className="border border-dashed my-2" />

              <div className="text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Pelanggan</span>
                  <span>{customerName || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Tanggal</span>
                  <span>{date || "-"}</span>
                </div>
              </div>

              <hr className="border border-dashed my-2" />

              {/* Apply receipt-item styling and override scroll for print */}
              <div className="text-sm space-y-1">
                {items.map((item) => (
                  <div key={item.id} className="receipt-item">
                    <div className="receipt-item-name">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} x Rp {item.price.toLocaleString("id")}
                      </p>
                    </div>
                    <div className="receipt-item-total">
                      Rp {(item.price * item.quantity).toLocaleString("id")}
                    </div>
                  </div>
                ))}
              </div>

              <hr className="border border-dashed my-2" />

              <div className="text-sm space-y-1">
                <div className="flex justify-between font-medium">
                  <span>Subtotal</span>
                  <span>Rp {subtotal.toLocaleString("id")}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Diskon</span>
                  <span>Rp {discount.toLocaleString("id")}</span>
                </div>
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span>Rp {total.toLocaleString("id")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Bayar</span>
                  <span>Rp {paymentAmount.toLocaleString("id")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Kembalian</span>
                  <span>Rp {generateChange.toLocaleString("id")}</span>
                </div>
              </div>

              <hr className="border border-dashed my-2" />

              <div className="text-center text-xs mt-3 text-muted-foreground">
                <p>Terima kasih telah berbelanja!</p>
                <p>Struk ini adalah bukti pembayaran yang sah.</p>
              </div>
            </div>

            {/* This button is inside the DialogContent but outside the ref, so it won't be printed by react-to-print's content function. It will be hidden by print:hidden applied to DialogContent. */}
            <Button
              onClick={handlePrint}
              className="w-full mt-4"
              variant="outline"
            >
              Print Nota
            </Button>
          </DialogContent>
        </Dialog>
      )}
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
