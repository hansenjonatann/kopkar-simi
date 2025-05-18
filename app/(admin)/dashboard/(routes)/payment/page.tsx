"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loan, Payment } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function DashboardPaymentPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loans, setLoans] = useState<Loan[]>([]);
  // Form state
  const [loanId, setLoanId] = useState("");
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split("T")[0]
  ); // Default to today: 17 May 2025
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [totalLoan, setTotalLoan] = useState(0);

  const fetchPayments = async () => {
    try {
      setFetching(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}loan-and-savings/payment`
      );
      if (response) {
        setPayments(response.data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch payments.");
    } finally {
      setFetching(false);
    }
  };

  const fetchLoans = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}loan-and-savings/loan`
      );
      if (response) {
        setLoans(response.data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch loans.");
    }
  };

  const fetchSelectedLoan = async (id: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}loan-and-savings/loan/detail?id=${id}`
      );

      if (response) {
        console.log(response);
        setTotalLoan(response.data.data.remainingPrincipal);
        setPaymentAmount(response.data.data.totalInstallment); // Set paymentAmount to loanAmount
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch loan details.");
      setPaymentAmount(0); // Reset paymentAmount on error
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchLoans();
  }, []);

  // Fetch loan details when loanId changes
  useEffect(() => {
    if (loanId) {
      fetchSelectedLoan(loanId);
    } else {
      setPaymentAmount(0); // Reset paymentAmount when no loan is selected
    }
  }, [loanId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loanId || !paymentDate || paymentAmount <= 0) {
      toast.error("Please fill in all fields correctly.");
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}loan-and-savings/loan/detail?loanId=${loanId}`
      );
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch loan details.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}loan-and-savings/payment`,
        {
          loanId,
          paymentAmount,
          paymentDate,
        }
      );

      toast.success(response.data.message || "Payment created successfully");
      setIsDialogOpen(false);
      setLoanId("");
      setPaymentDate(new Date().toISOString().split("T")[0]); // Reset to today
      setPaymentAmount(0);
      fetchPayments();
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.error || "Failed to create payment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Dashboard / Payment</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create Payment</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Payment</DialogTitle>
              <DialogDescription>
                Fill the form below to add a new payment
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="loanId">Loan Code</Label>
                <select
                  id="loanId"
                  value={loanId}
                  onChange={(e) => setLoanId(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Select Loan
                  </option>
                  {loans.map((loan) => (
                    <option key={loan.id} value={loan.id}>
                      {loan.loanCode}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentDate">Payment Date</Label>
                <Input
                  id="paymentDate"
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  required
                  min={new Date().toISOString().split("T")[0]} // Restrict to today or future
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentAmount">Remaining Principal</Label>
                <Input
                  id="paymentAmount"
                  type="number"
                  value={totalLoan}
                  readOnly
                  className="bg-gray-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentAmount">Payment Amount</Label>
                <Input
                  id="paymentAmount"
                  type="number"
                  value={paymentAmount}
                  readOnly
                  className="bg-gray-100"
                />
              </div>

              <DialogFooter>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-2 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Daftar Pembayaran</h2>
        <Button variant="outline" onClick={fetchPayments} disabled={fetching}>
          {fetching ? "Loading..." : "Refresh"}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Loan Code</TableHead>
            <TableHead>Payment Amount</TableHead>
            <TableHead>Interest</TableHead>
            <TableHead>Total Interest </TableHead>
            <TableHead>Total Due</TableHead>
            <TableHead>Payment Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments?.length === 0 && !fetching && (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                Tidak ada data pembayaran
              </TableCell>
            </TableRow>
          )}

          {payments.map((payment: any, idx) => (
            <TableRow key={idx}>
              <TableCell>{idx + 1}</TableCell>
              <TableCell>{payment.loan?.loanCode || "-"}</TableCell>
              <TableCell>
                {payment.paymentAmount.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </TableCell>
              <TableCell>{payment.interestRate || 0}</TableCell>
              <TableCell>
                {(payment.totalInterest || 0).toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </TableCell>
              <TableCell>
                {payment.totalDue.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </TableCell>
              <TableCell>
                {new Date(payment.paymentDate).toLocaleDateString("id-ID")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
