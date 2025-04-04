"use client";
import { Button } from "@/components/ui/button";
import { useRole } from "@/hooks/use-role";
import axios from "axios";
import { File, FileSpreadsheet } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardInventory() {
  const [page, setPage] = useState(0);
  const [listinventory, setListInventory] = useState([]);
  const { role } = useRole();

  // const handleDelete =  async (params: string) => {
  //     const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}product/${params}`)
  //     toast.success(res.data.message)
  //     window.location.reload()
  //   }

  const fetchInventory = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}inventory?page=${page}`
    );
    setListInventory(res.data.data.inventory);
    setPage(res.data.data.pagination.currentpage);
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
        <table className="table-auto w-full ">
          <thead>
            <tr>
              <th className="border-t border-r border-l border-gray-500">#</th>
              <th className="border-t border-r border-l border-gray-500">
                Date
              </th>
              <th className="border-t border-r border-l border-gray-500">
                Product
              </th>
              <th className="border-t border-r border-l border-gray-500">
                Quantity
              </th>
              <th className="border-t border-r border-l border-gray-500">
                Change Type
              </th>
              {/* <th className="border-t border-r border-l border-gray-500">Action</th> */}
            </tr>
          </thead>
          <tbody>
            {listinventory.map((inv: any, index: number) => (
              <tr key={index} className="mt-3">
                <td className="border p-2 border-gray-500 text-center">
                  {page > 1 ? index + 1 + 5 : index + 1}
                </td>

                <td className="border border-gray-500 text-center my-3">
                  {inv.date}
                </td>
                <td className="border border-gray-500 text-center my-3">
                  {inv.Product.name}
                </td>
                <td className="border border-gray-500 text-center my-3">
                  {inv.quantity}
                </td>
                <td className="border border-gray-500 text-center my-3">
                  <div
                    className={
                      inv.changeType == "PURCHASE"
                        ? "bg-blue-600  mx-auto p-2 my-2 w-52 text-white rounded-md"
                        : "bg-green-600 p-2 mx-auto my-2 w-52 text-white rounded-md"
                    }
                  >
                    {inv.changeType}
                  </div>
                </td>
                {/* <td className="border border-gray-500 text-center my-3">
                            <button onClick={() => handleDelete(inv.id)} className="bg-red-500 text-white p-2 m-2 rounded-md">
                              Delete
                            </button>
                          </td> */}
              </tr>
            ))}
          </tbody>
        </table>
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
