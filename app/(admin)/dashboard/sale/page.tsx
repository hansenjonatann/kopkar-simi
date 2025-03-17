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
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function SalesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = Number(searchParams.get("page")) || 1;
  const [sales, setSales] = useState([]);
//   const [selectedDate , setSelectedDate] = useState('')

  // Fetch Sales Data
  const fetchSales = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/sale?page=${page}`
      );
      setSales(res.data.data.sale);
    } catch (error) {
      console.log("Error fetching sales:", error);
    }
  };

  // Handle Page Change
  const changePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    fetchSales();
  }, [page]);

  return (
    <>
      <h1 className="text-xl font-bold">Sale</h1>
      <div className="mt-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Sub Total</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Total</TableHead>
              {/* <TableHead>Actions</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map(
              (
                sale: {
                  date: string;
                  discount: number;
                  subtotal: number;
                  total: number;
                },
                index: number
              ) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{sale.date}</TableCell>
                  <TableCell>{sale.subtotal.toLocaleString("id")}</TableCell>
                  <TableCell>{sale.discount.toLocaleString("id")}</TableCell>
                  <TableCell>{sale.total.toLocaleString("id")}</TableCell>
                  {/* <TableCell>
                    <Button variant="destructive">
                      <TrashIcon />
                    </Button>
                  </TableCell> */}
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
        <div className="flex justify-end mt-8 mr-28 space-x-8">
          <Button
            variant="default"
            disabled={page <= 1}
            onClick={() => changePage(page - 1)}
          >
            {"<"}
          </Button>

          <h1 className="font-bold text-xl">{page}</h1>

          <Button variant="default" onClick={() => changePage(page + 1)}>
            {">"}
          </Button>
        </div>
      </div>
    </>
  );
}

export default function DashboardSale() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SalesContent />
    </Suspense>
  );
}
