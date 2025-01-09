'use client'

import axios from "axios"
import { useEffect, useState } from "react"

export default function Dashboardpage () {

    const [totalSalesToday , setTotalSalesToday] = useState(0)
    const [products, setProducts] = useState([])
    const [totalSalesPerMonth , setTotalSalesPerMonth] = useState(0)
    const date = new Date().toLocaleDateString().replaceAll('/' , '-')
    const month = new Date().getMonth() + 1
    const year = new Date().getFullYear()

    const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
      ];
      const today = new Date();
      const monthName = months[today.getMonth()];


    const fetchSalesToday = async () => {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}sales/filter/date/total/${date}`)
        setTotalSalesToday(res.data.data._sum.total)
       
    }

    const fetchSalesMonth = async () => {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}sales/filter/month/total/${month < 10 ? `0${month}` : month}-${year}`)
        setTotalSalesPerMonth(res.data.totalSales)
    }

    const fetchProducts = async () => {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}products`)
        setProducts(res.data.data)
    }

    useEffect(() => {
        fetchSalesToday()
        fetchSalesMonth()
        fetchProducts()
    } , [])
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white bg-opacity-50 w-full h-[100px] shadow-lg rounded-lg">
                    <div className="flex flex-col text-white">
                        <h1 className="text-center text-xl font-bold m-3">Total Penjualan Hari Ini</h1>
                        <h1 className="text-center text-xl text-green-300 font-bold mt-2">Rp <span>{totalSalesToday.toLocaleString('id')}</span></h1>
                   
                    </div>
                </div>
                <div className="bg-white bg-opacity-50 w-full h-[100px] shadow-lg rounded-lg">
                    <div className="flex flex-col text-white">
                        <h1 className="text-center text-xl font-bold m-3">Total Penjualan Periode {monthName}</h1>
                        <h1 className="text-center text-xl text-green-300 font-bold mt-2">Rp <span>{totalSalesPerMonth.toLocaleString('id')}</span></h1>
                   
                    </div>
                </div>
                <div className="bg-white bg-opacity-50 w-full h-[100px] shadow-lg rounded-lg">
                    <div className="flex flex-col text-white">
                        <h1 className="text-center text-xl font-bold m-3">Total Produk</h1>
                        <h1 className="text-center text-xl text-green-300 font-bold mt-2">{products.length} Produk</h1>
                   
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <div className="bg-white bg-opacity-70 w-full h-[500px] rounded-lg"></div>
            </div>
        </>
    )
}