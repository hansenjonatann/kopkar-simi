import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const db = new PrismaClient();

export const GET = async (req: NextRequest) => {
  const date = req.nextUrl.searchParams.get("date");

  const filtersalebydate = await db.sale.findMany({
    where: {
      date: String(date),
    },
    include: {
      SaleItems: {
        include: {
          product: true,
        },
      },
    },
  });

  const totalSalesByDate = await db.sale.aggregate({
    where: {
      date: String(date),
    },
    _sum: {
      total: true,
    },
  });

  return NextResponse.json({
    success: true,
    message: "Filter Sale by Date",
    data: filtersalebydate,
    total: totalSalesByDate,
    statusCode: 200,
  });
};
