"use client";

import CustomForm from "@/components/custom-form";
import { Button } from "@/components/ui/button";
import { registerUser } from "@/lib/features/register";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleRegister = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      await registerUser(name, username, password)
        .then(() => {
          setLoading(false);
          router.push("/sign-in");
        })
        .catch((error) => {
          setLoading(false);
          router.refresh();
          toast.error(error);
        });
    } catch (error) {
      setLoading(false);
      toast.error(`Something went wrong. Please try again. ${error}`);
    }
  };

  return (
    <div className="flex items-center   h-screen justify-center">
      <form
        method="POST"
        onSubmit={handleRegister}
        className="border  text-secondary bg-primary p-6 w-[400px] h-[470px] rounded-md shadow-lg"
        autoComplete="false"
      >
        <h1 className="text-center text-3xl font-bold text-accsent">SIGN UP</h1>

        <div className="flex flex-col">
          <CustomForm
            label="Name"
            name="name"
            type="text"
            onchange={(e) => setName(e.target.value)}
          />
          <CustomForm
            label="Username"
            name="username"
            type="text"
            onchange={(e) => setUsername(e.target.value)}
          />
          <CustomForm
            label="Password"
            name="password"
            type="password"
            onchange={(e) => setPassword(e.target.value)}
          />

          <div className="mt-4">
            <Button
              type="submit"
              variant={"secondary"}
              className="text-primary font-semibold w-full"
            >
              {loading ? "Please wait ..." : "Sign Up"}
            </Button>
          </div>
          <small className="text-center mt-4">
            {" "}
            Have an account?{" "}
            <Link className="font-bold" href={"/sign-in"}>
              Sign In
            </Link>{" "}
            here
          </small>
        </div>
      </form>
    </div>
  );
}
