'use client'

import CustomBarcode from "@/components/barcode"
import { Button } from "@/components/ui/button"
import axios from "axios"
import {  Printer } from "lucide-react"
import { useEffect, useState } from "react"

export default function DashboardBarcodePage () {
    const [products , setProducts] = useState([])

    const fetchProducts = async () => {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}products`)
                setProducts(res.data.data)
                

    }

    useEffect(() => {
        fetchProducts()
    } , [])
    
    return (
        <>
        <h1 className="font-bold">Dashboard / Barcode</h1>
        <Button className="flex space-x-2 mt-4"> 
            <Printer/>
            <p>Print Barcode</p>
        </Button>
        <div className="grid grid-cols-2 md:grid-cols-4 mt-4 gap-3 max-h-[600px] overflow-y-scroll">
            {products.map((product: any , idx: number) => (
                <div key={idx}>
                    <CustomBarcode value={product.code}/>
                </div>
            ))}
        </div>
        </>
    )
}