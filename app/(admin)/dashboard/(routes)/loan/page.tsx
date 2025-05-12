"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { formatDate } from "@/lib/features/format-date";
import axios from "axios";
import { Trash } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function DashboardLoanPage() {
  const [loans, setLoans] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [typeOfLoan, setTypeOfLoan] = useState("");
  const [duration, setDuration] = useState(0);
  const [interestRate, setInterestRate] = useState(0);
  const [loanAmount, setLoanAmount] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}customer`);
      setCustomers(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchLoans = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}loan-and-savings/loan`
    );
    setLoans(res.data.data);
  };

  const handleDeleteLoan = async (id: string) => {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}loan-and-savings/loan?id=${id}`
    );
    if (res) {
      toast.success(res.data.message);
      window.location.reload();
    }
  };

  const handleStoreLoan = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}loan-and-savings/loan`,
        {
          customerId,
          loanAmount,
          duration,
          interestRate,
          typeOfLoan,
        }
      );

      if (res) {
        setLoading(false);
        toast.success(res.data.message);
        setIsAddModalOpen(false);
        window.location.reload();
      }
    } catch (error) {
      setLoading(false);
      toast.error(`${error}`);
    }
  };

  useEffect(() => {
    fetchCustomers();
    fetchLoans();
  }, []);
  return (
    <div className="p-6">
     <div className="flex  justify-between items-center mb-6">
       <h1 className="text-xl font-bold">Loan</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>Add a new Loan</Button>

        {/* Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Loan</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleStoreLoan} method={"POST"}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="customer">Customer</Label>
                <select
                  id="customer"
                  className="w-full border rounded p-2 mt-1"
                  onChange={(e) => setCustomerId(e.target.value)}
                >
                  <option value="">Select a customer</option>
                  {customers.map((customer: any) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="typeofloan">Type of Loan</Label>
                <select
                  id="typeofloan"
                  className="w-full border rounded p-2 mt-1"
                  onChange={(e) => setTypeOfLoan(e.target.value)}
                >
                  <option value="">Select a type of loan</option>
                  <option value="RF">RF</option>
                  <option value="SPT_AND_MANAGER">SPT & MANAGER</option>
                </select>
              </div>
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  type="number"
                  onChange={(e) => setDuration(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="interestRate">Interest Rate</Label>
                <Input
                  id="interestRate"
                  type="number"
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="loanAmount">Loan Amount</Label>
                <Input
                  id="loanAmount"
                  type="number"
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="mt-4 flex gap-x-4">
              <Button
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">{loading ? "Saving..." : "Save"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
     </div>
      <div className="mt-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Loan Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Interest Rate ( % )</TableHead>
              <TableHead>Interest Per Month</TableHead>
              <TableHead>Total Interest</TableHead>
              <TableHead>Loan Amount</TableHead>
              <TableHead>Installment</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loans.map((loan: any, idx: number) => (
              <TableRow key={idx}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{formatDate(loan.loanDate)}</TableCell>
                <TableCell>{loan.customer.name}</TableCell>
                <TableCell>{formatDate(loan.dueDate)}</TableCell>
                <TableCell>{loan.typeofLoan}</TableCell>
                <TableCell>{`${loan.interestRate} %`}</TableCell>
                <TableCell>
                  {loan.interestPerMonth.toLocaleString("id")}
                </TableCell>
                <TableCell>{loan.totalInterest.toLocaleString("id")}</TableCell>
                <TableCell>{loan.loanAmount.toLocaleString("id")}</TableCell>
                <TableCell>{loan.installment.toLocaleString("id")}</TableCell>
                <TableCell>{`${loan.duration} month`}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleDeleteLoan(loan.id)}
                    variant={"destructive"}
                  >
                    <Trash />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      
    </div>
  );
}
