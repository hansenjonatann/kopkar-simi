"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function DashboardRetailPage() {
  const [isModal, setIsModal] = useState<boolean>(false);
  const [retails, setRetails] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");

  const storeRetail = async (e: FormEvent) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}retail`,
        {
          name,
        }
      );

      if (response) {
        setLoading(false);
        toast.success(response.data.message);
        setIsModal(false);
        fetchRetails();
      }
    } catch (error) {
      setLoading(false);
      toast.error(`${error}`);
    }
  };

  const fetchRetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}retail`
      );
      if (response) {
        setLoading(false);
        setRetails(response.data.data);
      }
    } catch (error) {
      setLoading(false);
      toast.error(`${error}`);
    }
  };

  const handleOpenModal = () => setIsModal(true);

  useEffect(() => {
    fetchRetails();
  }, []);
  return (
    <>
      <h1 className="text-xl font-bold">Dashboard / Retail Unit</h1>
      <Button onClick={handleOpenModal} className="mt-4">
        Create retail unit
      </Button>

      <div className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {retails.length < 1 ? (
              <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell className="font-bold text-red-500">
                  No retails data
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            ) : (
              retails.map((retail: any, idx: number) => (
                <TableRow key={idx}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{retail.name}</TableCell>
                  <TableCell>{retail.slug}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {isModal && (
        <Dialog open={isModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create retail unit form </DialogTitle>
              <DialogDescription>
                Fill the form to create a new retail{" "}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={storeRetail}>
              <div className="my-4">
                <Label>Name</Label>
                <div className="mt-4">
                  <Input
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    className="border border-black"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <div className="flex justify-end">
                  <Button type="submit">
                    {loading ? "Submitting..." : "Submit"}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
