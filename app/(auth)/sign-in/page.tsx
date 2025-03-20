"use client";

import CustomForm from "@/components/custom-form";
import { Button } from "@/components/ui/button";
import { useRole } from "@/hooks/use-role";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function SignInPage() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { role } = useRole();
  const session = useSession()

  const router = useRouter();
  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });




      if (!res || res.error) {
        setLoading(false)
        // Login gagal
        toast.error("Invalid Credentials!");
      }

      if(res) {
        setLoading(false)
        if (role === "ADMIN" || role === 'MANAGER') {
          setLoading(false);
          localStorage.setItem("token", String(session.data?.user.id));
          router.push("/dashboard");
        } else if (role === "CASHIER") {
          setLoading(false);
          localStorage.setItem("token", String(session.data?.user.id));

          router.push("/cashier/transaction");
        }
      }
      // Login berhasil
      
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex items-center h-screen justify-center">
      <form
        method="POST"
        onSubmit={handleLogin}
        className="border text-secondary bg-primary  p-6 w-[400px] h-[390px] rounded-md shadow-lg"
        autoComplete="false"
      >
        <h1 className="text-center text-3xl font-bold text-secondary uppercase">
          SIGN IN
        </h1>

        <div className="flex flex-col">
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
              className="w-full text-primary  font-bold uppercase"
              variant={"secondary"}
            >
              {loading ? "Signin In..." : "Sign In"}
            </Button>
          </div>
          <small className="text-center mt-4">
            {"Don't have an account?"}{" "}
            <Link className="font-bold" href={"/sign-up"}>
              Sign Up
            </Link>{" "}
            here
          </small>
        </div>
      </form>
    </div>
  );
}
