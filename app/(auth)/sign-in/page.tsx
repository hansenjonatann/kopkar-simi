'use client'

import CustomForm from "@/components/custom-form"
import { useRole } from "@/hooks/use-role"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"

export default function SignInPage  ()  {
    const [username , setUsername] = useState<string>('')
    const [password , setPassword] = useState<string>('')
    const [loading , setLoading] = useState(false)
    const {role} = useRole()
    
    const router = useRouter()
    const handleLogin = async (e: any) => {
        e.preventDefault()
        try {
            setLoading(true)
            const res = await signIn('credentials', {
                username,
                password,
                redirect: false,
            })


            setLoading(false) // Pastikan loading di-reset

            if (!res || res.error) {
                // Login gagal
                toast.error('Invalid Credentials!')
                router.refresh() // Refresh halaman
                return
            }

            // Login berhasil
            if(role === 'ADMIN') {
                router.push('/dashboard')

            }else if (role === 'CASHIER') {
                router.push('/cashier/transaction')
            }

        } catch (error) {
            setLoading(false)
            console.log(error)
            toast.error('Something went wrong. Please try again.')
        }
    }


    return (
        <div className="flex items-center bg-primary h-screen justify-center">
            <form method="POST"  onSubmit={handleLogin} className="border bg-gradient-to-tr from-primary to-secondary p-6 w-[400px] h-[390px] rounded-md shadow-lg" autoComplete="false">
                
                <h1 className="text-center text-3xl font-bold text-accsent">
                    SIGN IN
                </h1>

                <div className="flex flex-col">
                   <CustomForm label="Username" name="username" type="text" onchange={(e) => setUsername(e.target.value)}  />
                   <CustomForm label="Password" name="password" type="password" onchange={(e) => setPassword(e.target.value)}  />
                    
                    <div className="mt-4">
                        <button type="submit" className="bg-blue-800 text-accsent text-center p-2 rounded-md w-full">{loading? 'Signin In...' : 'Sign In' }</button>
                    </div>
                    <small className="text-center mt-2">{"Don't have an account?"} <Link className="font-bold" href={'/sign-up'}>Sign Up</Link> here</small>
                </div>
            </form>
        </div>
    )
}