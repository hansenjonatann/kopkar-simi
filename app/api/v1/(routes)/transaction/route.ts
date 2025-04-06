"use server";

import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const db = new PrismaClient();

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