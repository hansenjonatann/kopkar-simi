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
import { useRole } from "@/hooks/use-role";
import { exportSalesReportToPDF } from "@/lib/features/export-sales-report-to-pdf";
import axios from "axios";
import { Eye, File, FileSpreadsheet } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function SalesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { role } = useRole();
  const page = Number(searchParams.get("page")) || 1;
  const [selectedSale, setSelectedSale] = useState<any>(null);
  const [sales, setSales] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [filteredSales, setFilteredSales] = useState([]);
  const [summarize, setSummarize] = useState(0);

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
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/sales/filter/date?date=${date}`
      );
      setFilteredSales(res.data.data);
      setSummarize(res.data.total._sum.total);
    } catch (error) {
      console.log(error);
    }
  };

  const dataToShow = selectedDate ? filteredSales : sales;

  useEffect(() => {
    fetchSales();
    if (selectedDate) {
      fetchSalesByDate(selectedDate);
    }
  }, [page, selectedDate]);

  return (
    <>
      <h1 className="text-xl font-bold">Sale</h1>
      <div className="mt-4 flex items-center">
        <div className="flex gap-4 items-center">
          <select
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-primary text-white  px-3 py-2  rounded-md "
          >
            <option value="">Select date of sale</option>
            {sales.map((sale: any, index: number) => (
              <option key={index} value={sale.date}>
                {sale.date}
              </option>
            ))}
          </select>
          {role == "MANAGER" && (
            <>
              <Button className="bg-green-600 hover:bg-green-800 text-white p-2 font-bold rounded-lg">
                <div className="flex items-center space-x-2">
                  <FileSpreadsheet />
                  <p>Export Excel</p>
                </div>
              </Button>
              <Button
                onClick={() => exportSalesReportToPDF(dataToShow)}
                className="bg-red-950 text-white p-2 font-bold rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <File />
                  <p>Export PDF</p>
                </div>
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="mt-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Customer </TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Sub Total</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedDate
              ? filteredSales.map((sale: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{sale.customer.name}</TableCell>
                    <TableCell>{sale.date}</TableCell>
                    <TableCell>{sale.subtotal.toLocaleString("id")}</TableCell>
                    <TableCell>{sale.discount.toLocaleString("id")}</TableCell>
                    <TableCell>{sale.total.toLocaleString("id")}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => setSelectedSale(sale)}
                        className="bg-sky-600 py-2 px-4 rounded-lg"
                      >
                        <Eye />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              : sales.map((sale: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{sale.customer.name}</TableCell>

                    <TableCell>{sale.date}</TableCell>
                    <TableCell>{sale.subtotal.toLocaleString("id")}</TableCell>
                    <TableCell>{sale.discount.toLocaleString("id")}</TableCell>
                    <TableCell>{sale.total.toLocaleString("id")}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => setSelectedSale(sale)}
                        className="bg-sky-600 py-2 px-4 rounded-lg"
                      >
                        <Eye />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
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

      {selectedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-3xl">
            <h2 className="text-xl font-bold mb-4">
              Sale Detail : {selectedSale.date}
            </h2>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedSale.SaleItems?.map((item: any, idx: number) => (
                  <TableRow key={idx}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{item.product?.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.unitPrice.toLocaleString("id")}</TableCell>
                    <TableCell>
                      {(item.unitPrice * item.quantity).toLocaleString("id")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-6 flex justify-end">
              <Button variant="outline" onClick={() => setSelectedSale(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
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
