'use client';
import axios from "axios";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

export default function DashboardAddInventory() {
  const [itemCode, setItemCode] = useState(""); // Input kode barang
  const [product, setProduct] = useState<any>([]); // Data produk yang diambil
  const [error, setError] = useState(""); // Error jika produk tidak ditemukan
  const [showForm, setShowForm] = useState(false); // Untuk menampilkan form tambahan
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [changeType  , setChangeType] = useState('')
  const [quantity , setQuantity] = useState(0)
  const [productId , setProductId] = useState('') 
  const router =useRouter()

  const handleFetchProduct = async () => {
    setError("");
    setIsLoading(true);
    setShowForm(false);

    if (!itemCode.trim()) {
      setError("Please enter an item code.");
      setIsLoading(false);
      return;
    }

    try {
      // Replace `your-api-endpoint` with the actual API endpoint
     const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}product/code?code=${itemCode}`)
     if(res) {
         setIsLoading(false)
         console.log(res.data.data)
         setProduct(res.data.data)
         setProductId(res.data.data.id);
         console.log(productId)
         console.log(`${process.env.NEXT_PUBLIC_API_URL}inventory`);
     }
    } catch (err: any) {
        setIsLoading(false)
      toast.error(err.message)
    }
  };

  const handleInventory = async (e: FormEvent) => {
    e.preventDefault()
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}inventory` , {
        quantity , 
        changeType,
        productId
    })
    console.log(res)
    toast.success(res.data.message)
    router.push('/dashboard/inventory')
    console.log(res)
  }

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold mb-4">Add Inventory</h1>

      {/* Input Kode Barang */}
      <div className="mb-4">
        <label className="block mb-2">Enter Item Code:</label>
        <input
          type="text"
          className="p-2 border rounded-md text-black w-full mb-2"
          placeholder="Enter item code"
          value={itemCode}
          onChange={(e) => setItemCode(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white p-2 rounded-md"
          onClick={handleFetchProduct}
        >
          {isLoading ? "Loading..." : "Fetch Product"}
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Product Details */}
      {product && (
        <div className="p-4 border rounded-md bg-gray-100 text-primary mb-4">
          <h2 className="text-lg font-semibold">Product Details</h2>
          <p><strong>Code:</strong> {product.code}</p>
          <p><strong>Name:</strong> {product.name}</p>
          <p><strong>Stock:</strong> {product.stock}</p>

          <button
            className="bg-green-500 text-white mt-4 p-2 rounded-md"
            onClick={() => setShowForm(true)}
          >
            Show Form
          </button>
        </div>
      )}

      {/* Form Tambahan */}
      {showForm && (
        <form className="p-4 border rounded-md" onSubmit={handleInventory} method="POST">
          <h2 className="text-lg font-semibold mb-4">Add Inventory</h2>

        

          <label className="block mb-2">Quantity <span className="text-red-500 font-bold">*</span></label>
          <input
            type="number"
            className="p-2 border rounded-md w-full mb-4 text-primary"
            placeholder="Enter quantity"
            onChange={(e) => setQuantity(Number(e.target.value))}
          />

            <label className="block mb-2">Change Type <span className="text-red-500 font-bold">*</span></label>
          <select name="changeType" id="changeType" className="p-2 border text-primary rounded-md w-full mb-4" onChange={(e) => setChangeType(e.target.value)}>
            <option value="">Select Change Type</option>
            <option value="PURCHASE">PURCHASE</option>
            <option value="ADJUSTMENT">ADJUSTMENT</option>
          </select>

         
          <button  type="submit" className="bg-blue-500 text-white p-2 rounded-md">
            Submit
          </button>
        </form>
      )}
    </div>
  );
}
