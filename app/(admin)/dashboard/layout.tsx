"use client";

import Sidebar from "@/components/sidebar";

import React from "react";
import { Toaster } from "react-hot-toast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-6">
        <Sidebar />
        <div className="col-span-5 m-6 overflow-y-scroll max-h-[660px]">
          <Toaster position="top-right" />
          {children}
        </div>
      </div>
    </>
  );
}
