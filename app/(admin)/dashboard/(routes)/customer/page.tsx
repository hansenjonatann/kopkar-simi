"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useEffect, useState, FormEvent } from "react";
import toast from "react-hot-toast";
import * as XLSX from 'xlsx';

interface Customer {
  customerCode: string;
  name: string;
  nik: string;
  address: string;
  phone: string;
  department: string;
  transactionLimit: number;
  savings: { nominalSavings: number }[];
}

interface NewCustomer {
  name: string;
  nik: string;
  address: string;
  phone: string;
  department: string;
  transactionLimit: string;
}

export default function DashboardCustomerPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalImportOpen , setIsModalImportOpen] = useState<boolean>(false)
  const [newCustomer, setNewCustomer] = useState<NewCustomer>({
    name: "",
    nik: "",
    address: "",
    phone: "",
    department: "",
    transactionLimit: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [importFile , setImportFile ] = useState<File | null>(null);



const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = async (event: ProgressEvent<FileReader>) => {
      const data = event.target?.result;
      if (data) {
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0]; // Pilih sheet pertama
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const generateCustomerCode = () => {
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  const timePart = Date.now().toString().slice(-4); // ambil 4 digit terakhir waktu
  return `CU-${randomPart}${timePart}`;
};

console.log(generateCustomerCode());
// Hasil: CU-48237645 (unik)

        const formattedData = jsonData.map((row: any) => ({
          customerCode: generateCustomerCode,
          name: row["Name"], // Pastikan kolom sesuai dengan nama di Excel
          nik: row["NIK"],
          address: row["Address"],
          phone: row["Phone"],
          department: row["Department"],
          transactionLimit: row['Limit'],
        }));

        console.log("Formatted data: ", formattedData);

        try {
          const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}customer/import`, formattedData);
          if (res.status === 200) {
            toast.success("Customers berhasil diimpor!");
            fetchCustomers();
          } else {
            toast.error("Import failed");
          }
        } catch (error) {
          console.error("Import error:", error);
          toast.error("Import failed");
        }
      }
    };
    reader.readAsArrayBuffer(file);
  }
};

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}customer`);
      setCustomers(res.data.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast.error("Failed to load customers");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}customer`, {
        ...newCustomer,
        transactionLimit: parseFloat(newCustomer.transactionLimit),
      });
      toast.success("Customer added successfully");
      setNewCustomer({
        name: "",
        nik: "",
        address: "",
        phone: "",
        department: "",
        transactionLimit: "",
      });
      setIsModalOpen(false);
      fetchCustomers();
    } catch (error) {
      console.log("Error adding customer:", error);
      toast.error("Failed to add customer");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Customers</h1>
        <div className="flex gap-x-2">
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button>Add New Customer</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
             
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={newCustomer.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="nik">NIK</Label>
                <Input
                  id="nik"
                  name="nik"
                  value={newCustomer.nik}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={newCustomer.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={newCustomer.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  name="department"
                  value={newCustomer.department}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="transactionLimit">Transaction Limit</Label>
                <Input
                  id="transactionLimit"
                  name="transactionLimit"
                  type="number"
                  value={newCustomer.transactionLimit}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Customer"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog   open={isModalImportOpen} onOpenChange={setIsModalImportOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-700 text-white transition-all ease-in-out duration-500 text-center hover:bg-green-500 ">Import from Excel</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Import Customer Data From Excel</DialogTitle>
            </DialogHeader>
             
             
              <div>
                <Label htmlFor="file">File</Label>
                <Input
                  id="file"
                  name="file"
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileChange}
                  required
                />
              </div>
      
          </DialogContent>
        </Dialog>
        </div>
        
        
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>NIK</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Transaction Limit</TableHead>
            <TableHead>Total Savings</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer: Customer, idx: number) => (
            <TableRow key={idx}>
              <TableCell>{idx + 1}</TableCell>
              <TableCell>{customer.customerCode}</TableCell>
              <TableCell>{customer.name}</TableCell>
              <TableCell>{customer.nik}</TableCell>
              <TableCell>{customer.address}</TableCell>
              <TableCell>{customer.phone}</TableCell>
              <TableCell>{customer.department}</TableCell>
              <TableCell>{customer.transactionLimit.toLocaleString("id")}</TableCell>
              <TableCell>
                {customer.savings[0]?.nominalSavings.toLocaleString("id") || "0"}
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}