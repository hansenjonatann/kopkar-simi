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
import { useRole } from "@/hooks/use-role";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function DashboardProductPage() {
  const { role } = useRole();
  const [page, setPage] = useState(0);
  const [isModal, setIsModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState(0);
  const [priceRetail, setPriceRetail] = useState(0);
  const [priceWholesale, setPriceWholesale] = useState(0);
  const [costRetail, setCostRetail] = useState(0);
  const [costWholesale, setCostWholesale] = useState(0);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [retails, setRetails] = useState([]);
  const [retailunitId, setRetailUnitId] = useState("");
  const [wholesales, setWholesales] = useState([]);
  const [wholesaleunitId, setWholesaleUnitId] = useState<string>("");
  const [wholesaleStock, setWholesaleStock] = useState(0);
  const [retailStock, setRetailStock] = useState(0);

  const [fetchloading, setFetchLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchWholesales = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}wholesale`
    );
    setWholesales(response.data.data);
  };

  const fetchRetails = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}retail`
    );
    setRetails(response.data.data);
  };

  const fetchProducts = async () => {
    try {
      setFetchLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}product?page=${page}`
      );
      if (res) {
        setFetchLoading(false);
        setProducts(res.data.data.data);
        setPage(res.data.data.pagination.currentpage);
      }
    } catch (error) {
      setFetchLoading(false);
      console.log(error);
    }
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
          priceRetail,
          priceWholesale,
          costRetail,
          costWholesale,
          description,
          wholesaleStock,
          retailStock,
          wholesaleunitId,
          retailunitId,
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
    fetchWholesales();
    fetchRetails();
  }, [page]);

  return (
    <>
      <div>
        <h1 className="font-bold">{"Dashbord / Product"}</h1>
        <div className="mt-4">
          {role == "ADMIN" && (
            <div className="flex">
              <button
                onClick={handleModalOpen}
                className="bg-blue-600 text-white p-2 rounded-md"
              >
                Add a new Product
              </button>
            </div>
          )}
          <div className="mt-8">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Barcode</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Cost ( Retail )</TableHead>
                  <TableHead>Cost ( Wholesale )</TableHead>
                  <TableHead>Price Retail</TableHead>
                  <TableHead>Price Wholesale</TableHead>
                  <TableHead>Stock Retail</TableHead>
                  <TableHead>Stock Wholesale</TableHead>
                  {role == "ADMIN" && <TableHead>Action</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {fetchloading ? (
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>Loading products data ...</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                ) : (
                  products.map((pro: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>
                        {page > 1 ? index + 1 + 5 : index + 1}
                      </TableCell>
                      <TableCell>
                        <CustomBarcode value={pro.code} />
                      </TableCell>

                      <TableCell>{pro.name}</TableCell>
                      <TableCell>{pro.category.name}</TableCell>
                      <TableCell>
                        {pro.costRetail.toLocaleString("id")}
                      </TableCell>
                      <TableCell>
                        {pro.costWholesale.toLocaleString("id")}
                      </TableCell>
                      <TableCell>
                        {pro.priceRetail.toLocaleString("id")}
                      </TableCell>
                      <TableCell>
                        {pro.priceWholesale.toLocaleString("id")}
                      </TableCell>
                      <TableCell>{pro.retailStock}</TableCell>
                      <TableCell>{pro.wholesaleStock}</TableCell>
                      {role == "ADMIN" && (
                        <TableCell>
                          <button
                            onClick={() => handleDelete(pro.id)}
                            className="bg-red-500 text-white p-2 m-2 rounded-md"
                          >
                            <TrashIcon />
                          </button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
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
        <Dialog open={isModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Form Create Product</DialogTitle>
              <DialogDescription>
                Fill the all fields to add a new product{" "}
              </DialogDescription>
              <form
                onSubmit={handleCreateProduct}
                method="POST"
                className="max-h-[500px] overflow-y-scroll"
              >
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
                    className="w-full p-2 mt-3 border border-black rounded-md"
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
                <div className="my-4 flex flex-col">
                  <label htmlFor="etailId">Retail Unit ( Satuan Ecer ) </label>
                  <select
                    name="retailId"
                    id="retailId"
                    className="w-full p-2 mt-3 border border-black rounded-md"
                    onChange={(e) => setRetailUnitId(e.target.value)}
                  >
                    <option value="1">Select Retail unit for Product</option>
                    {retails.map((ret: any, index: number) => (
                      <option key={index} value={ret.id}>
                        {ret.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="my-4 flex flex-col">
                  <label htmlFor="wholesaleId">
                    Wholesale Unit ( Satuan Grosir )
                  </label>
                  <select
                    name="wholesaleId"
                    id="wholesaleId"
                    className="w-full p-2 mt-3 border border-black rounded-md"
                    onChange={(e) => setWholesaleUnitId(e.target.value)}
                  >
                    <option value="1">Select wholesale unit for Product</option>
                    {wholesales.map((whole: any, index: number) => (
                      <option key={index} value={whole.id}>
                        {whole.name}
                      </option>
                    ))}
                  </select>
                </div>
                <CustomForm
                  label="Retail Cost"
                  type="number"
                  name="costRetail"
                  onchange={(e) => setCostRetail(Number(e.target.value))}
                />
                <CustomForm
                  label="Wholesale Cost"
                  type="number"
                  name="costWholesale"
                  onchange={(e) => setCostWholesale(Number(e.target.value))}
                />
                <CustomForm
                  label="Retail Price"
                  type="number"
                  name="priceRetail"
                  onchange={(e) => setPriceRetail(Number(e.target.value))}
                />
                <CustomForm
                  label="Wholesale Price"
                  type="number"
                  name="priceWholesale"
                  onchange={(e) => setPriceWholesale(Number(e.target.value))}
                />
                <CustomForm
                  label="Wholesale Stock"
                  type="number"
                  name="wholesaleStock"
                  onchange={(e) => setWholesaleStock(Number(e.target.value))}
                />
                <CustomForm
                  label="Retail Stock"
                  type="number"
                  name="retailStock"
                  onchange={(e) => setRetailStock(Number(e.target.value))}
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
                <DialogFooter>
                  <button
                    type="submit"
                    className="w-full bg-blue-800 text-white font-bold p-2 rounded-lg"
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                  <DialogClose asChild>
                    <Button onClick={() => setIsModal(false)} variant="outline">
                      Cancel
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </form>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
