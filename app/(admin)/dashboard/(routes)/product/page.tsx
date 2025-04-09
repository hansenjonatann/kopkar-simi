"use client";
import CustomBarcode from "@/components/barcode";
import CustomForm from "@/components/custom-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrashIcon } from "lucide-react";

export default function DashboardProductPage() {
  const [page, setPage] = useState(0);
  const [isModal, setIsModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState(0);
  const [price, setPrice] = useState(0);
  const [cost, setCost] = useState(0);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchProducts = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}product?page=${page}`
    );
    setProducts(res.data.data.data);
    setPage(res.data.data.pagination.currentpage);
  };

  const fetchCategories = async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}categories`);
    setCategories(res.data.data);
  };

  const handleCreateProduct = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}product`,
        {
          name,
          stock,
          categoryId,
          price,
          cost,
          description,
        }
      );
      setLoading(false);
      toast.success(res.data.message);
      handleCloseModal();
      window.location.reload();
    } catch (error) {
      setLoading(false);
      toast.error(error);
      router.refresh();
    }
  };

  const handleNext = () => {
    setPage(page + 1);
  };

  const handlePrevious = () => {
    setPage(page - 1);
  };

  const handleDelete = async (params: string) => {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}product/${params}`
    );
    toast.success(res.data.message);
    window.location.reload();
  };
  const handleModalOpen = () => setIsModal(true);

  const handleCloseModal = () => setIsModal(false);
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [page]);

  return (
    <>
      <div className={isModal ? "hidden" : "block"}>
        <h1 className="font-bold">{"Dashbord / Product"}</h1>
        <div className="mt-4">
          <div className="flex">
            <button
              onClick={handleModalOpen}
              className="bg-blue-600 text-white p-2 rounded-md"
            >
              Add a new Product
            </button>
          </div>
          <div className="mt-8">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Barcode</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((pro: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>
                      {page > 1 ? index + 1 + 5 : index + 1}
                    </TableCell>
                    <TableCell>
                      <CustomBarcode value={pro.code} />
                    </TableCell>
                    <TableCell>{pro.code}</TableCell>
                    <TableCell>{pro.name}</TableCell>
                    <TableCell>{pro.category.name}</TableCell>
                    <TableCell>{pro.cost.toLocaleString("id")}</TableCell>
                    <TableCell>{pro.price.toLocaleString("id")}</TableCell>
                    <TableCell>{pro.stock}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleDelete(pro.id)}
                        className="bg-red-500 text-white p-2 m-2 rounded-md"
                      >
                        <TrashIcon />
                      </button>
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
        </div>
      </div>

      {isModal && (
        <div className=" flex justify-center items-center h-screen">
          <div className=" w-80    bg-white text-primary rounded-md">
            <div className="flex flex-col m-3 ">
              <h1 className="font-bold">Add New Product Form</h1>
              <form onSubmit={handleCreateProduct} method="POST">
                <CustomForm
                  label="Name"
                  type="text"
                  name="name"
                  onchange={(e) => setName(e.target.value)}
                />
                <div className="my-4 flex flex-col">
                  <label htmlFor="categoryId">Category</label>
                  <select
                    name="categoryId"
                    id="categoryId"
                    className="w-full p-2 border border-black rounded-md"
                    onChange={(e) => setCategoryId(e.target.value)}
                  >
                    <option value="1">Select Category for Product</option>
                    {categories.map((cat: any, index: number) => (
                      <option key={index} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <CustomForm
                  label="Cost"
                  type="number"
                  name="cost"
                  onchange={(e) => setCost(Number(e.target.value))}
                />
                <CustomForm
                  label="Price"
                  type="number"
                  name="price"
                  onchange={(e) => setPrice(Number(e.target.value))}
                />
                <CustomForm
                  label="Stock"
                  type="number"
                  name="stock"
                  onchange={(e) => setStock(Number(e.target.value))}
                />
                <div className="my-2 flex flex-col">
                  <label htmlFor="description">Description</label>
                  <textarea
                    name="description"
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 border border-black rounded-md"
                    id="description"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-800 text-white font-bold p-2 rounded-lg"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
