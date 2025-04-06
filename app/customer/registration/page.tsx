"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

export default function CustomerRegistrationPage() {
  const [nik, setNik] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [transactionLimit, setTransactionLimit] = useState(0);
  const [department, setDepartment] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStoreCustomer = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}customer`,
        {
          nik,
          name,
          address,
          department,
          transactionLimit,
          phone,
        }
      );

      if (res) {
        setLoading(false);
        toast.success(res.data.message);
        router.refresh();
      }
    } catch (error) {
      setLoading(false);
      toast.error(`${error}`);
    }
  };
  return (
    <div className="m-4">
      <h1 className="text-center mt-4 text-4xl font-bold">
        CUSTOMER REGISTRATION
      </h1>
      <div className="mt-4">
        <form onSubmit={handleStoreCustomer} className="flex flex-col">
          <div className="my-4">
            <label>NIK</label>
            <input
              type="text"
              className="p-2 border w-full mt-2 border-black rounded-md"
              onChange={(e) => setNik(e.target.value)}
            />
          </div>
          <div className="my-4">
            <label>
              Name{" "}
              <span className="font-bold text-sm ">
                ( Same with Your KTP / Identity Card )
              </span>
            </label>
            <input
              type="text"
              className="p-2 border w-full mt-2 border-black rounded-md"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="my-4">
            <label>
              Phone{" "}
              <span className="font-bold text-sm ">
                ( Active Phone Number )
              </span>
            </label>
            <input
              type="text"
              placeholder="+6212345678"
              className="p-2 border w-full mt-2 border-black rounded-md"
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="my-4">
            <label>Transaction Limit </label>
            <input
              type="number"
              className="p-2 border w-full mt-2 border-black rounded-md"
              onChange={(e) => setTransactionLimit(Number(e.target.value))}
            />
          </div>
          <div className="my-4">
            <label>Department</label>
            <input
              type="text"
              className="p-2 border w-full mt-2 border-black rounded-md"
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>
          <div className="my-4">
            <label>Address</label>
            <textarea
              className="p-2 border w-full mt-2 border-black rounded-md"
              onChange={(e) => setAddress(e.target.value)}
            ></textarea>
          </div>
          <div className="my-4">
            <Button type="submit">
              {loading ? "Creating... " : "Add Customer"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
