"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import DashboardCard from "./_components/dashboard-card";
import { useRole } from "@/hooks/use-role";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { formatDate } from "@/lib/features/format-date";

export default function Dashboardpage() {
  const [totalSalesToday, setTotalSalesToday] = useState(0);
  const [totalSalesPerMonth, setTotalSalesPerMonth] = useState(0);
  const [totalLoans, setTotalLoans] = useState(0);
  const [loans, setLoans] = useState([]);
  const [customers, setCustomers] = useState([]);
  const { role } = useRole();
  const date = new Date().toLocaleDateString("id").replaceAll("/", "-");
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  const fetchCustomers = async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}customer`);
    setCustomers(res.data.data);
  };

  const fetchLoans = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}loan-and-savings/loan`
    );
    setLoans(res.data.data);
    setTotalLoans(res.data.total._sum.totalLoan);
  };

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
      fetchSalesMonth();
      fetchCustomers();
      fetchLoans();
    }, 3000);

    return () => clearInterval(interval);
  }, [date]);
  return (
    <>
      {role == "ADMIN" ||
        (role == "MANAGER" && (
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
        ))}

      {role == "ADMIN_LOANANDSAVINGS" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DashboardCard
              title="Total Customer"
              content={`${customers.length} Person`}
            />
            <DashboardCard
              title="Total Loan"
              content={`${loans.length > 0 ? loans.length : 0} Transaction`}
            />
          </div>
          <div className="mx-3 mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <Link href={"/dashboard/customer"} className="font-bold">
                  Customer
                </Link>
                <div className="h-screen overflow-y-scroll">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer Code</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Principal Savings</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customers.map((customer: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{customer.customerCode}</TableCell>
                          <TableCell>{customer.name}</TableCell>
                          <TableCell>
                            {customer.savings[0]?.nominalSavings &&
                              customer.savings[0].nominalSavings.toLocaleString(
                                "id"
                              )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              <div className="flex flex-col">
                <Link href={"/dashboard/loan"} className="font-bold">
                  Loan
                </Link>
                <Table className="max-h-[400px] overflow-y-scroll">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Loan Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Loan Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loans.map((loan: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{formatDate(loan.loanDate)}</TableCell>
                        <TableCell>{formatDate(loan.dueDate)}</TableCell>
                        <TableCell>{loan.customer.name}</TableCell>
                        <TableCell>
                          {loan.loanAmount.toLocaleString("id")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell>Total </TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell>
                        {totalLoans !== 0
                          ? totalLoans?.toLocaleString("id")
                          : 0}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
