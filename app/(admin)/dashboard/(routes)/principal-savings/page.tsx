"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function DashboardPrincipalSavingsPage() {
  const [principalSavings, setPrincipalSavings] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [saveDate, setSaveDate] = useState("");
  const [nominalSavings, setNominalSavings] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPrincipalSavings = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}loan-and-savings/principal-savings`
    );
    setPrincipalSavings(res.data.data);
  };

  const fetchCustomers = async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}customer`);
    setCustomers(res.data.data);
  };

  const handleAddPrincipalSavings = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}loan-and-savings/principal-savings`,
        {
          nominalSavings,
          customerId,
          saveDate,
        }
      );
      if (res) {
        setIsLoading(false);
        toast.success(res.data.message);
        setIsAddModalOpen(false);
        fetchPrincipalSavings()
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPrincipalSavings();
    fetchCustomers();
  }, []);

  return (
    <div className="p-6">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-xl font-bold">Principal Savings</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          Add a new Principal Savings
        </Button>

        {/* Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Principal Savings</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddPrincipalSavings} method={"POST"}>
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
                <Label htmlFor="saveDate">Save Date</Label>
                <Input
                  id="saveDate"
                  type="date"
                  onChange={(e) => setSaveDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="nominal">Nominal Savings</Label>
                <Input
                  id="nominal"
                  type="number"
                  onChange={(e) => setNominalSavings(Number(e.target.value))}
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
              <Button type="submit">{isLoading ? "Saving..." : "Save"}</Button>
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
              <TableHead>Customer</TableHead>
              <TableHead>Save Date</TableHead>
              <TableHead>Nominal Savings</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {principalSavings.map((prsv: any, index: number) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{prsv.customer.name}</TableCell>
                <TableCell>{prsv.saveDate}</TableCell>
                <TableCell>
                  {prsv.nominalSavings.toLocaleString("id")}
                </TableCell>
                <TableCell>-</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      
    </div>
  );
}
