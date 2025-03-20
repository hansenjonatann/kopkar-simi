"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import DashboardCard from "./_components/dashboard-card";

export default function Dashboardpage() {
  const [totalSalesToday, setTotalSalesToday] = useState(0);
  const [totalSalesPerMonth, setTotalSalesPerMonth] = useState(0);
  const date = new Date().toLocaleDateString('id').replaceAll("/", "-");
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const today = new Date();
  const monthName = months[today.getMonth()];

  const fetchSalesToday = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/sales/filter/date?date=${date}`
    );
    setTotalSalesToday(res.data.total._sum.total);
  };

  const fetchSalesMonth = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}sales/filter/month/total/${month < 10 ? `0${month}` : month}-${year}`
    );
    setTotalSalesPerMonth(res.data.totalSales);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchSalesToday();
    } , 3000)
    fetchSalesMonth();

    return () => clearInterval(interval)
    
  }, [date , ]);
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DashboardCard
          title="Total Penjualan Hari ini"
          content={`Rp ${totalSalesToday == 0 ? "-" : totalSalesToday > 0 ? totalSalesToday.toLocaleString("id") : 0} `}
        />
        <DashboardCard
          title={`Total Penjualan bulan : ${monthName}`}
          content={`Rp ${totalSalesPerMonth == 0 ? "-" : totalSalesPerMonth?.toLocaleString("id")}`}
        />
      </div>
      <div className="mt-4">
        <div className="bg-white bg-opacity-70 w-full h-[500px] rounded-lg"></div>
      </div>
    </>
  );
}
