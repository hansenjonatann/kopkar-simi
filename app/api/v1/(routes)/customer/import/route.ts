import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
    try {
        const data = await req.json();

        if (!data || !Array.isArray(data)) {
            return NextResponse.json({ message: "Invalid data format" }, { status: 400 });
        }

        // Validasi data
      

        const generateCustomerCode = () => {
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  const timePart = Date.now().toString().slice(-4); // ambil 4 digit terakhir waktu
  return `CU-${randomPart}${timePart}`;
};

        // Memasukkan produk ke database
        const customers = await prisma.customer.createMany({
            data: data.map((customer: any) => {
                

                return {
                    customerCode: generateCustomerCode(),
                    name: customer.name,
                    nik: String(customer.nik),
                    address: customer.address,
                    phone: customer.phone,
                    department: customer.department,
                    transactionLimit: customer.transactionLimit
                };
            }),
            skipDuplicates: true,
        });

        return NextResponse.json({ message: "Customers imported successfully" , data: customers }, { status: 200 });
    } catch (error:any ) {
        if (error.code === "P2002") {
            return NextResponse.json({ message: "Duplicate customer code found" }, { status: 400 });
        }
        console.error("Error during import:", error);
        return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
};
