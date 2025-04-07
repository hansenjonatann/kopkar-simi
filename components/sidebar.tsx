"use client";
import { useRole } from "@/hooks/use-role";
import { ChevronDown, ChevronUp } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Sidebar() {
  const [isDropdown, setIsDropDown] = useState(false);

  const handleDropdownToggle = () => setIsDropDown(!isDropdown);
  const { role, name } = useRole();
  const router = useRouter();
  const handleSignOut = async () => {
    await signOut({ redirect: false, callbackUrl: "/sign-in" }).then(() => {
      localStorage.removeItem("token");
      toast.success("Logout success");
      router.push("/sign-in");
    });
  };

  const pathname = usePathname();
  const masterList = [
    {
      id: 1,
      label: "User",
      path: "/dashboard/user",
    },

    {
      id: 2,
      label: "Category",
      path: "/dashboard/category",
    },
    {
      id: 3,
      label: "Inventory",
      path: "/dashboard/inventory",
    },
    {
      id: 4,
      label: "Product",
      path: "/dashboard/product",
    },
    {
      id: 5,
      label: "Sale",
      path: "/dashboard/sale",
    },
  ];

  const adminloanandsavingsLink = [
    {
      id: 1,
      label: "Loan",
      path: "/dashboard/loan",
    },
    {
      id: 2,
      label: "Principal Savings",
      path: "/dashboard/principal-savings",
    },
    {
      id: 3,
      label: "Customer",
      path: "/dashboard/customer",
    },
  ];

  return (
    <div className="hidden md:flex m-4 w-48 h-[700px] rounded-lg bg-primary text-secondary">
      <div className="m-3">
        <h1 className="text-center font-bold">{name}</h1>
        {role == "ADMIN" && (
          <div className="mt-8">
            <div className="flex">
              <Link
                href={"/dashboard"}
                className={
                  pathname == "/dashboard"
                    ? "bg-secondary w-full text-primary font-bold p-2 rounded-lg "
                    : " w-full text-secondary font-bold  "
                }
              >
                Dashboard
              </Link>
            </div>

            <h1 className="text-gray-400 font-bold mt-8">Master</h1>
            <div className="flex flex-col  space-y-2">
              {masterList.map((list: any, index: number) => (
                <div key={index} className="flex items-center">
                  <Link
                    href={list.path}
                    className={
                      pathname === list.path
                        ? "mt-3 bg-secondary text-primary p-2 rounded-md w-full"
                        : "mt-3   text-secondary hover:bg-secondary hover:text-primary  p-2 rounded-md w-full"
                    }
                  >
                    {list.label}
                  </Link>
                  {list.label == "Sale" ? (
                    <button onClick={handleDropdownToggle} className="mt-3">
                      {isDropdown ? <ChevronUp /> : <ChevronDown />}
                    </button>
                  ) : null}
                </div>
              ))}

              {isDropdown ? (
                <div className="flex flex-col">
                  <Link
                    href={"/dashboard/sales_return"}
                    className="mt-3   text-secondary hover:bg-secondary hover:text-primary  p-2 rounded-md w-full"
                  >
                    Sales Return
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {role == "ADMIN_LOANANDSAVINGS" && (
          <div className="mt-8">
            <div className="flex">
              <Link
                href={"/dashboard"}
                className={
                  pathname == "/dashboard"
                    ? "bg-secondary w-full text-primary font-bold p-2 rounded-lg "
                    : " w-full text-secondary font-bold  "
                }
              >
                Dashboard
              </Link>
            </div>

            <h1 className="text-gray-400 font-bold mt-8">Master</h1>
            <div className="flex flex-col  space-y-2">
              {adminloanandsavingsLink.map((list: any, index: number) => (
                <div key={index} className="flex items-center">
                  <Link
                    href={list.path}
                    className={
                      pathname === list.path
                        ? "mt-3 bg-secondary text-primary p-2 rounded-md w-full"
                        : "mt-3   text-secondary hover:bg-secondary hover:text-primary  p-2 rounded-md w-full"
                    }
                  >
                    {list.label}
                  </Link>
                </div>
              ))}

              {isDropdown ? (
                <div className="flex flex-col">
                  <Link
                    href={"/dashboard/sales_return"}
                    className="mt-3   text-secondary hover:bg-secondary hover:text-primary  p-2 rounded-md w-full"
                  >
                    Sales Return
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        )}

        <div className="mt-4">
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white font-bold px-2 py-2 rounded-md  w-full"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
