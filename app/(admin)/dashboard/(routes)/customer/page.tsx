"use client";

// import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  // TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { useEffect, useState } from "react";
// import { TrashIcon } from "lucide-react";

export default function DashboardCustomerPage() {
  const [customers, setCustomers] = useState([]);

  const fetchCustomers = async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}customer`);
    setCustomers(res.data.data);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);
  return (
    <>
      <h1 className="text-xl font-bold">Customer</h1>
      <div className="mt-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>NIK</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Transaction Limit</TableHead>
              <TableHead>Total Savings</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer: any, idx: number) => (
              <TableRow key={idx}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{customer.customerCode}</TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.nik}</TableCell>
                <TableCell>{customer.address}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.department}</TableCell>
                <TableCell>
                  {customer.transactionLimit.toLocaleString("id")}
                </TableCell>
                <TableCell>
                  {customer.savings[idx].nominalSavings.toLocaleString("id")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
