'use client'

import CustomForm from "@/components/custom-form"
import { registerUser } from "@/lib/features/register"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"

export default function SignUpPage  ()  {
    const [name , setName] = useState('')
    const [username , setUsername] = useState<string>('')
    const [password , setPassword] = useState<string>('')
    const [loading , setLoading] = useState(false)
    const router = useRouter()
    const handleRegister = async (e: any) => {
        e.preventDefault()
        try {
            setLoading(true)
            await registerUser(name ,username , password).then(() => {
                setLoading(false)
                router.push('/sign-in')

            }).catch((error) => {
                setLoading(false)
                router.refresh()
                toast.error(error)

            })


            

        } catch (error) {
            setLoading(false)
            toast.error(`Something went wrong. Please try again. ${error}` ,)
        }
    }


    return (
        <div className="flex items-center bg-primary h-screen justify-center">
            <form method="POST"  onSubmit={handleRegister} className="border bg-gradient-to-tr from-primary to-secondary p-6 w-[400px] h-[470px] rounded-md shadow-lg" autoComplete="false">
                
                <h1 className="text-center text-3xl font-bold text-accsent">
                    SIGN UP
                </h1>

                <div className="flex flex-col">
                    <CustomForm label="Name" name="name" type="text" onchange={(e) => setName(e.target.value)} />
                   <CustomForm label="Username" name="username" type="text" onchange={(e) => setUsername(e.target.value)}  />
                   <CustomForm label="Password" name="password" type="password" onchange={(e) => setPassword(e.target.value)}  />
                    
                    <div className="mt-4">
                        <button type="submit" className="bg-blue-800 text-accsent text-center p-2 rounded-md w-full">{loading? 'Please wait ...' : 'Sign Up' }</button>
                    </div>
                    <small className="text-center mt-2"> Have an account? <Link className="font-bold" href={'/sign-in'}>Sign In</Link> here</small>
                </div>
            </form>
        </div>
    )
}