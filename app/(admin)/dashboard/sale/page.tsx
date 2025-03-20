"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
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
  const [selectedDate , setSelectedDate] = useState('')
  const [filteredSales , setFilteredSales] = useState([])
  const [summarize , setSummarize] = useState(0)

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


  const fetchSalesByDate = async (date: string) => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sales/filter/date?date=${date}`)
      setFilteredSales(res.data.data)
      setSummarize(res.data.total._sum.total)
    } catch (error) {
      console.log(error)
    }
  }



  useEffect(() => {
    fetchSales();  
    fetchSalesByDate(selectedDate)
  }, [page , selectedDate]);

  return (
    <>
      <h1 className="text-xl font-bold">Sale</h1>
      <div className="mt-4 flex items-center">
        <div className="flex flex-col">
          <p>Filter by Date </p>
          <select
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-primary text-white  px-3 mt-4 rounded-md "
          >
            <option value="">Select date of sale</option>
            {sales.map((sale: any, index: number) => (
              <option key={index} value={sale.date}>
                {sale.date}
              </option>
            ))}
          </select>
        </div>
      </div>
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
            {selectedDate
              ? filteredSales.map(
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
                      <TableCell>
                        {sale.subtotal.toLocaleString("id")}
                      </TableCell>
                      <TableCell>
                        {sale.discount.toLocaleString("id")}
                      </TableCell>
                      <TableCell>{sale.total.toLocaleString("id")}</TableCell>
                      {/* <TableCell>
                    <Button variant="destructive">
                    <TrashIcon />
                    </Button>
                    </TableCell> */}
                    </TableRow>
                  )
                )
              : sales.map(
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
                      <TableCell>
                        {sale.subtotal.toLocaleString("id")}
                      </TableCell>
                      <TableCell>
                        {sale.discount.toLocaleString("id")}
                      </TableCell>
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
          {summarize ? (
            <TableFooter>
              <TableRow className="">
                <TableCell className="">Total</TableCell>
                <TableCell className=""></TableCell>
                <TableCell className=""></TableCell>
                <TableCell className=""></TableCell>
                <TableCell className="font-bold">
                  {summarize.toLocaleString("id")}
                </TableCell>
              </TableRow>
            </TableFooter>
          ) : null}
        </Table>
        <div
          className={
            selectedDate ? "hidden" : "flex justify-end mt-8 mr-28 space-x-8"
          }
        >
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
