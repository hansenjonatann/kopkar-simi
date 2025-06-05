"use server";

import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const db = new PrismaClient();

export const GET = async () => {
  try {
    const transactions = await db.transaction.findMany({
      include: {
        Sale: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "List of Transaction",
      data: transactions,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const transaction = await db.transaction.create({
    data: {
      saleId: body.saleId,
      paymentAmount: Number(body.paymentAmount),
      paymentmethod: body.paymentmethod,
      change: Number(body.change),
    },
  });

  if (transaction) {
    return NextResponse.json({
      status: true,
      statusCode: 201,
      message: "Transaction created",
      data: transaction,
    });
  }
};
