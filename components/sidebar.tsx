"use client";
import { useRole } from "@/hooks/use-role";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar() {
  const { role } = useRole();

  const router = useRouter();
  const handleSignOut = async () => {
    router.push("/sign-in");
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
      label: "Sale",
      path: "/dashboard/sale",
    },
    {
      id: 4,
      label: "Product",
      path: "/dashboard/product",
    },
    {
      id: 5,
      label: "Inventory",
      path: "/dashboard/inventory",
    },
  ];

  const reportList = [
    {
      id: 1,
      label: "Inventory",
      path: "/report/inventory",
    },
    {
      id: 2,
      label: "Sale",
      path: "/report/sale",
    },
  ];
  return (
    <div className=" m-4 w-48 h-[700px] rounded-lg bg-primary text-secondary">
      <div className="m-3">
        <h1 className="text-center font-bold">ADMIN PANEL</h1>
        <div className="mt-8">
          <div className="flex">
            <Link
              href={"/dashboard"}
              className="bg-secondary w-full text-primary font-bold p-2 rounded-lg "
            >
              Dashboard
            </Link>
          </div>

          <h1 className="text-gray-400 font-bold mt-8">Master</h1>
          <div className="flex flex-col space-y-2">
            {masterList.map((list: any, index: number) => (
              <Link
                key={index}
                href={list.path}
                className={
                  pathname === list.path
                    ? "mt-3 bg-secondary text-primary p-2 rounded-md w-full"
                    : "mt-3   text-secondary hover:bg-secondary hover:text-primary  p-2 rounded-md w-full"
                }
              >
                {list.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <h1
            className={
              role === "MANAGER" ? "text-gray-400 font-bold" : "hidden"
            }
          >
            Report
          </h1>
          <div className="flex flex-col space-y-2">
            {role === "MANAGER"
              ? reportList.map((list: any, index: number) => (
                  <Link
                    key={index}
                    href={list.path}
                    className={
                      pathname === list.path
                        ? "mt-3 bg-primary p-2 rounded-md w-full"
                        : "mt-3 bg-primary bg-opacity-30 backdrop-blur-lg p-2 rounded-md w-full"
                    }
                  >
                    {list.label}
                  </Link>
                ))
              : null}
          </div>

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
    </div>
  );
}
