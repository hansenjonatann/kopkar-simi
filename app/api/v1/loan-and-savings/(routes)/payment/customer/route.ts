"use server";

import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const db = new PrismaClient();

export const GET = async (req: NextRequest) => {
  try {
    const customerId = req.nextUrl.searchParams.get("customer");

    if (!customerId) throw new Error("Customer is required");

    const payment = await db.payment.findMany({
      where: {
        customerId: customerId,
      },
      include: {
        customer: true,
        loan: true
      }
    });

    return NextResponse.json({
      success: true,
      message: "Detail of payment by customer",
      data: payment,
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: "Internal Server Error",
      error: err,
    });
  }
};
