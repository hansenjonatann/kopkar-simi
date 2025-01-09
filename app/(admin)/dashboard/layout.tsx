'use client'

import Sidebar from "@/components/sidebar"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import React, { useEffect } from "react"
import { Toaster } from "react-hot-toast"

export default function DashboardLayout ({children} : {children: React.ReactNode}) {
    const {status} = useSession()
    const router = useRouter()
    useEffect(() => {
        if(status === 'unauthenticated' ) {
            router.push('/sign-in')
        } 
    } , [status])

    return (
       <>
       
        <div className="grid grid-cols-1 md:grid-cols-6">
            <Sidebar/>
            <div className="col-span-5 m-6 overflow-y-scroll max-h-[660px]">
                <Toaster position="top-right"/>
                {children}</div>
        </div>
       </>
    )
}