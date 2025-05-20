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
  TableFooter,
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
  const [loanId, setLoanId] = useState<string>("");
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split("T")[0] // Defaults to today: 2025-05-20
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [totalLoan, setTotalLoan] = useState<number>(0);

  const fetchPayments = async () => {
    try {
      setFetching(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}loan-and-savings/payment`
      );
      if (response.data) {
        setPayments(response.data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch payments.");
    } finally {
      setFetching(false);
    }
  };

  const totalPokok = payments.reduce(
    (acc, p: any) => acc + (p.loan?.principalInstallment || 0),
    0
  );
  const totalBagiHasil = payments.reduce(
    (acc, p: any) => acc + (p.loan?.totalInterest || 0),
    0
  );
  const totalBerjalan = payments.reduce(
    (acc, p: any) => acc + (p.totalInterest || 0),
    0
  );
  const totalSemua = payments.reduce(
    (acc, p: any) =>
      acc +
      (p.loan?.principalInstallment || 0) +
      (p.totalInterest || 0) +
      (p.loan?.totalInterest || 0),
    0
  );

  const fetchLoans = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}loan-and-savings/loan`
      );
      if (response.data) {
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
      if (response.data) {
        setTotalLoan(response.data.data.remainingPrincipal || 0);
        setPaymentAmount(response.data.data.principalInstallment || 0);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch loan details.");
      setPaymentAmount(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loanId || !paymentDate || paymentAmount <= 0) {
      toast.error("Please fill in all fields correctly.");
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

  const maxDate = new Date().getDate() >= 26;

  if (new Date(paymentDate).getDate() >= 26) {
    toast.error("Sorry your transaction can not be run after date : 25");
  }

  useEffect(() => {
    fetchPayments();
    fetchLoans();
  }, []);

  useEffect(() => {
    if (loanId) {
      fetchSelectedLoan(loanId);
    } else {
      setPaymentAmount(0);
      setTotalLoan(0);
    }
  }, [loanId]);

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
                <Label htmlFor="paymentDate">
                  Payment Date ( Max Transaction Date : 25 )
                </Label>
                <Input
                  id="paymentDate"
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  required
                  disabled={maxDate}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalLoan">Remaining Principal</Label>
                <Input
                  id="totalLoan"
                  type="text"
                  value={totalLoan.toLocaleString("id-ID")}
                  readOnly
                  className="bg-gray-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentAmount">Payment Amount</Label>
                <Input
                  id="paymentAmount"
                  type="text"
                  value={paymentAmount.toLocaleString("id-ID")}
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
            <TableHead>NIK</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Cicilan Pokok</TableHead>
            <TableHead>Cicilan Bagi Hasil</TableHead>
            <TableHead>Bagi Hasil Berjalan</TableHead>
            <TableHead>Penalty</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Tanggal Transaksi</TableHead>
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
              <TableCell>{payment.customer?.nik || "-"}</TableCell>
              <TableCell>{payment.customer?.name || "-"}</TableCell>
              <TableCell>
                {(payment.loan?.principalInstallment || 0).toLocaleString(
                  "id-ID"
                )}
              </TableCell>
              <TableCell>
                {(payment.loan?.totalInterest || 0).toLocaleString("id-ID")}
              </TableCell>
              <TableCell>
                {(payment.totalInterest || 0).toLocaleString("id-ID")}
              </TableCell>
              <TableCell>
                {(payment.penalty || 0).toLocaleString("id-ID")}
              </TableCell>
              <TableCell>
                {(
                  (payment.loan?.principalInstallment || 0) +
                  (payment.totalInterest || 0) +
                  (payment.loan?.totalInterest || 0)
                ).toLocaleString("id-ID")}
              </TableCell>
              <TableCell>
                {new Date(payment.paymentDate).toLocaleDateString("id-ID")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell>{totalPokok.toLocaleString("id-ID")}</TableCell>
            <TableCell>{totalBagiHasil.toLocaleString("id-ID")}</TableCell>
            <TableCell>{totalBerjalan.toLocaleString("id-ID")}</TableCell>
            <TableCell></TableCell>
            <TableCell>{totalSemua.toLocaleString("id-ID")}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
}
