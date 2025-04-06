import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const db = new PrismaClient();

export const GET = async () => {
  const sales = await db.sale.findMany({});

  return NextResponse.json({
    success: true,
    message: "List of Sale",
    data: sales,
    statusCode: 200,
  });
};
