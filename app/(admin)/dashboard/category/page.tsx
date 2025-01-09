"use client";
import CustomForm from "@/components/custom-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function DashboardCategoryPage() {
    const [page , setPage] = useState(0)
  const [isModal, setIsModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [name , setName] = useState('')
  const [loading , setLoading] = useState(false)
  const router = useRouter()
  

  const fetchCategories = async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}category?page=${page}`);
    setCategories(res.data.data.category);
    setPage(res.data.data.pagination.currentpage)
  };

  const handleCreateCategory = async (e: FormEvent) => {
   e.preventDefault()
   try {
    setLoading(true)
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}category` , {
        name
    })
    setLoading(false)
    toast.success(res.data.message)
    handleCloseModal()
    window.location.reload()

   } catch (error) {
    setLoading(false)
    toast.error(error)
    router.refresh()
   }
  }



  const handleNext = () => {
    setPage(page + 1)
  }

  
  const handlePrevious = () => {
    setPage(page -1 )
  }

  const handleDelete =  async (params: string) => {
    const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}category/action/${params}`)
    toast.success(res.data.message)
    window.location.reload()
  }
  const handleModalOpen = () => setIsModal(true)

  const handleCloseModal = () => setIsModal(false)
  useEffect(() => {
    fetchCategories();
  }, [page]);


  return (
    <>
      <div className={isModal ? 'hidden' : 'bolock'}>
      <h1 className="font-bold">{"Dashbord / Category"}</h1>
      <div className="mt-4">
        <div className="flex">
          <button onClick={handleModalOpen} className="bg-blue-600 p-2 rounded-md">
            Add a new Category
          </button>
        </div>
        <div className="mt-8">
          <table className="table-auto w-full ">
            <thead>
              <tr>
                <th className="border-t border-r border-l border-gray-500">#</th>
                <th className="border-t border-r border-l border-gray-500">Name</th>
                <th className="border-t border-r border-l border-gray-500">Slug</th>
                <th className="border-t border-r border-l border-gray-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat: any, index: number) => (
                <tr key={index} className="mt-3">
                  <td className="border p-2 border-gray-500 text-center">{page > 1 ? index + 1 + 5 : index + 1}</td>
                  <td className="border border-gray-500 text-center">{cat.name}</td>
                  <td className="border border-gray-500 text-center">{cat.slug}</td>
                  <td className="border border-gray-500 text-center">
                    <button onClick={() => handleDelete(cat.id)} className="bg-red-500 text-white p-2 m-2 rounded-md">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex gap-4 items-center mt-4">
            <button onClick={handlePrevious} disabled={page == 1} className="bg-gray-600 px-4 py-1 rounded-md text-white font-bold ">{'<'}</button>
            <p>{page}</p>
            <button onClick={handleNext}  className="bg-gray-600 px-4 py-1 rounded-md text-white font-bold ">{'>'}</button>

          </div>
        </div>
      </div>
      </div>

      {isModal && (

    <div className=" flex justify-center items-center h-screen">
        <div className=" w-80 h-[200px]  bg-white text-primary rounded-md">
            <div className="flex flex-col m-3 ">
                <h1 className="font-bold">Add New Category Form</h1>
                <form onSubmit={handleCreateCategory} method="POST" >
                    <CustomForm variant="light" label="Name" type="text" name="name" onchange={(e) => setName(e.target.value)}/>
                    <button type="submit" className="w-full bg-blue-800 text-white font-bold p-2 rounded-lg">{loading ? 'Saving...' : 'Save' }</button>
                </form>
            </div>
        </div>

    </div>
      )}
    </>
  );
}
