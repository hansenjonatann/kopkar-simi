"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function DashbordTransactionPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}transaction`
      );
      if (response) {
        setLoading(false);
        setTransactions(response.data.data);
      }
    } catch (error) {
      setLoading(false);
      toast.error(`${error}`);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <>
      <h1 className="text-xl font-bold">Dashboard / Transanction</h1>

      <div className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Sale Code</TableHead>
              <TableHead>Payment Amount</TableHead>
              <TableHead>Change</TableHead>
              <TableHead>Payment Method</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length < 1 ? (
              <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell className="text-red-600 font-bold ">
                  No transactions data
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            ) : (
              <TableRow></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
