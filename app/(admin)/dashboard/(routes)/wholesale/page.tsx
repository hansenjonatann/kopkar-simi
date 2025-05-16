"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function DashboardWholesalePage() {
  const [name, setName] = useState<string>("");
  const [wholesales, setWholesales] = useState([]);
  const [fetching, setFetching] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchWholesales = async () => {
    try {
      setFetching(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}wholesale`
      );
      if (response) {
        setFetching(false);
        setWholesales(response.data.data);
      }
    } catch (err) {
      setFetching(false);
      toast.error(err);
    }
  };

  const handleCreateWholesaleUnit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}wholesale`,
        {
          name,
        }
      );

      if (response) {
        setLoading(false);
        toast.success(response.data.message);
        setIsOpen(false);
        fetchWholesales();
      }
    } catch (error) {
      setLoading(false);
      toast.error(error);
    }
  };

  useEffect(() => {
    fetchWholesales();
  }, []);
  return (
    <>
      <h1 className="font-bold text-xl">Dashboard / Wholesale Unit</h1>
      <div className="mt-4">
        <Dialog open={isOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsOpen(true)}>
              Create new Wholesale
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add a new wholesale form</DialogTitle>
              <DialogDescription>
                The fields for adding a new wholesale!
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateWholesaleUnit}>
              <div className="mb-4">
                <Label>Name</Label>
                <Input
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  className="border-2 border-black mt-2"
                  required
                />
              </div>

              <div className="flex justify-end">
                <Button>{loading ? "Saving ..." : "Save Changes"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
            </TableRow>
          </TableHeader>
          {fetching ? (
            <TableBody>
              <TableRow className="flex justify-center">
                <TableCell>
                  <Loader2 className="animate-spin " />
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {wholesales.length < 1 ? (
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>No Wholesales data</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              ) : (
                wholesales.map((wholesale: any, idx: number) => (
                  <TableRow key={idx}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{wholesale.name}</TableCell>
                    <TableCell>{wholesale.slug}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          )}
        </Table>
      </div>
    </>
  );
}
