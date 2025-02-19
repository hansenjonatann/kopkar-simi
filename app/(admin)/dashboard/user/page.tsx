'use client'
import axios from "axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function DashboardUserPage ( ) {
    const [users , setUsers] = useState([])
    

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}user`)
                setUsers(res.data.data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleDeleteUser = async (userId: string) => {
        const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}user/delete/${userId}`)
        if(res) {
            toast.success(res.data.message)
            fetchUsers()
        }
    }

    useEffect(() => {
        fetchUsers()
    } , [])
    
    return (
        <>
        <h1 className="font-bold text-xl">User</h1>
        <div className="mt-8">
            <table className="table-default">
                <thead>
                    <tr>
                        <th className="border-t border-r border-1 border-gray-300">#</th>
                        <th className="border-t border-r border-1 border-gray-300">Name</th>
                        <th className="border-t border-r border-1 border-gray-300">Username</th>
                        <th className="border-t border-r border-1 border-gray-300">Role</th>
                        <th className="border-t border-r border-1 border-gray-300">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user : any , index: number) => (
                        <tr key={index} className="mt-3">
                            <td className="border p-2 border-gray-500 text-center">{index + 1 }</td>
                            <td className="border p-2 border-gray-500 text-center">{user.name }</td>
                            <td className="border p-2 border-gray-500 text-center">{user.username }</td>
                            <td className="border p-2 border-gray-500 text-center">{user.role }</td>
                            <td className="border p-2 border-gray-500 text-center">
                                <button onClick={() => handleDeleteUser(user.id)} className="bg-red-500 text-white text-center font-bold px-4 rounded-md ">Delete </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </>
    )
}