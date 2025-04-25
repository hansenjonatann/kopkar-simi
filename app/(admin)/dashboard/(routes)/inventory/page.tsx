"use client";
import { Button } from "@/components/ui/button";
import { useRole } from "@/hooks/use-role";
import axios from "axios";
import { File, FileSpreadsheet } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DashboardInventory() {
  const [page, setPage] = useState(0);
  const [listinventory, setListInventory] = useState([]);
  const [loading , setLoading] = useState(false)
  const { role } = useRole();

  // const handleDelete =  async (params: string) => {
  //     const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}product/${params}`)
  //     toast.success(res.data.message)
  //     window.location.reload()
  //   }

  const fetchInventory = async () => {
    setLoading(true)
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}inventory?page=${page}`
    );
   if(res) {
    setLoading(false)
    setListInventory(res.data.data.inventory);
    setPage(res.data.data.pagination.currentpage);
   }
  };

  const handleNext = () => {
    setPage(page + 1);
  };

  const handlePrevious = () => {
    setPage(page - 1);
  };

  useEffect(() => {
    fetchInventory();
  }, [page]);
  return (
    <>
      <h1 className=" font-bold">Dashboard / Inventory</h1>
      <div className="flex mt-4 gap-x-4">
        <Link
          className="bg-blue-600 text-white p-2 font-bold rounded-lg"
          href={"/dashboard/inventory/add"}
        >
          Add new Inventory
        </Link>
        {role == "MANAGER" && (
          <>
            <Button className="bg-green-600 hover:bg-green-800 text-white p-2 font-bold rounded-lg">
              <div className="flex items-center space-x-2">
                <FileSpreadsheet />
                <p>Export Excel</p>
              </div>
            </Button>
            <Button className="bg-red-950 text-white p-2 font-bold rounded-lg">
              <div className="flex items-center space-x-2">
                <File />
                <p>Export PDF</p>
              </div>
            </Button>
          </>
        )}
      </div>
      <div className="mt-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Change Type</TableHead>
              {/* <TableHead>Action</TableH> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell>Loading inventory data ...</TableCell>
              <TableCell></TableCell>
            </TableRow> : listinventory.map((inv: any, index: number) => (
              <TableRow key={index}>
                <TableCell>{page > 1 ? index + 1 + 5 : index + 1}</TableCell>

                <TableCell>{inv.date}</TableCell>
                <TableCell>{inv.Product.name}</TableCell>
                <TableCell>{inv.quantity}</TableCell>
                <TableCell
                  className={
                    inv.changeType == "PURCHASE"
                      ? "text-blue-600"
                      : "text-green-600"
                  }
                >
                  {inv.changeType}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex gap-4 items-center mt-4">
          <button
            onClick={handlePrevious}
            disabled={page == 1}
            className="bg-gray-600 px-4 py-1 rounded-md text-white font-bold "
          >
            {"<"}
          </button>
          <p>{page}</p>
          <button
            onClick={handleNext}
            className="bg-gray-600 px-4 py-1 rounded-md text-white font-bold "
          >
            {">"}
          </button>
        </div>
      </div>
    </>
  );
}
