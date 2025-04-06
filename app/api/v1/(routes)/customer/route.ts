"use server";

import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

export const GET = async () => {
  try {
    const customers = await db.customer.findMany({
      include: {
        savings: true,
      },
    });
    return NextResponse.json({
      status: "success",
      message: "List of Customer",
      data: customers,
    });
  } catch (error) {
    return NextResponse.json({
      status: "failed",
      message: "Internal Server Error",
      error,
    });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const generateCustomerCode = `CU-${Math.floor(Math.random() * 1000)}`;
    const newCustomer = await db.customer.create({
      data: {
        name: body.name,
        nik: body.nik,
        customerCode: generateCustomerCode,
        address: body.address,
        department: body.department,
        transactionLimit: body.transactionLimit,
        phone: body.phone,
      },
    });

    return NextResponse.json({
      status: "success",
      message: "Customer created!",
      data: newCustomer,
    });
  } catch (error) {
    return NextResponse.json({
      status: "failed",
      message: "Internal Server Error",
      error,
    });
  }
};
