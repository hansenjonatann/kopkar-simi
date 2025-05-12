"use client";

import { Button } from "@/components/ui/button";
import CustomForm from "@/components/custom-form";
import { useRole } from "@/hooks/use-role";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, FormEvent, useEffect } from "react";
import toast from "react-hot-toast";

interface RoleRedirects {
  [key: string]: string;
}

const roleRedirects: RoleRedirects = {
  ADMIN: "/dashboard",
  MANAGER: "/dashboard",
  ADMIN_LOANANDSAVINGS: "/dashboard",
  CASHIER: "/cashier/transaction",
};

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { role, isLoading: isSessionLoading } = useRole();
  const router = useRouter();
  const [isSignedIn, setIsSignedIn] = useState(false);

  // Handle redirect after successful sign-in and session update
  useEffect(() => {
    if (isSignedIn && !isSessionLoading && role) {
      const redirectPath = roleRedirects[role];
      if (redirectPath) {
        router.push(redirectPath);
      } else {
        toast.error("Role not assigned. Contact administrator.");
        router.push("/"); // Default redirect for unassigned roles
      }
    }
  }, [isSignedIn, isSessionLoading, role, router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid Credentials!");
        setIsLoading(false);
        return;
      }

      // Mark as signed in to trigger useEffect
      setIsSignedIn(true);
    } catch (error) {
      console.log("Sign-in error:", error);
      toast.error("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        method="POST"
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-md border bg-white p-8 shadow-lg"
        autoComplete="off"
      >
        <h1 className="mb-6 text-center text-3xl font-bold uppercase text-gray-800">
          Sign In
        </h1>

        <div className="space-y-4">
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

          <Button
            type="submit"
            className="w-full font-bold uppercase"
            variant="default"
            disabled={isLoading || isSessionLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>

          <p className="text-center text-sm text-gray-600">
            {"Don't have an account?"}
            <Link href="/sign-up" className="font-bold text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}