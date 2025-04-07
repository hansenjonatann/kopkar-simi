"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { TrashIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DashboardUserPage() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}user`);
      setUsers(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}user/delete/${userId}`
    );
    if (res) {
      toast.success(res.data.message);
      fetchUsers();
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <h1 className="font-bold text-xl">User</h1>
      <div className="mt-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Username</TableHead>
              <TableHead className="text-center">Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(
              (
                user: {
                  name: string;
                  username: string;
                  role: string;
                  id: string;
                },
                index: number
              ) => (
                <TableRow key={index} className="mt-3">
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell className="flex justify-center">
                    <div className="bg-sky-600 w-[200px] text-center text-white p-2 rounded-lg">
                      {user.role}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant={"destructive"}
                      onClick={() => handleDeleteUser(user.id)}
                      className=" text-white text-center font-bold px-4 rounded-md "
                    >
                      <TrashIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
