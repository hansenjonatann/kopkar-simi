import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const db = new PrismaClient();

export const GET = async (req: NextRequest) => {
  const page = Number(req.nextUrl.searchParams.get("page")) || 1;

  const limit = 10;

  try {
    const offset = (page - 1) * limit;
    const totalsales = await db.sale.count();

    const sale = await db.sale.findMany({
      include: {
        SaleItems: {
          include: { product: true },
        },
      },
      take: limit,
      skip: offset,
    });

    const uniqueSales = Array.from(new Set(sale.map((s) => s.date))).map(
      (date) => {
        return sale.find((s) => s.date === date);
      }
    );

    return NextResponse.json({
      success: true,
      message: "List of Sale",
      data: {
        sale: uniqueSales,
        pagination: {
          total: totalsales,
          limit,
          currentpage: page,
        },
      },
      statusCode: 200,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Internal Server Error",
      error,
      statusCode: 500,
    });
  }
};

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  try {
    const generateDate = new Date()
      .toLocaleDateString("id")
      .replaceAll("/", "-");
    const newsale = await db.sale.create({
      data: {
        customerId: body.customerId,
        date: generateDate,
        discount: body.discount,
        total: body.discount ? body.subtotal - body.discount : body.subtotal,
        SaleItems: {
          create: body.items.map((item: any) => ({
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            productId: item.productId,
          })),
        },
        subtotal: body.subtotal,
      },
    });

    for (const item of body.items) {
      await db.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Sale created",
      data: newsale,
      statusCode: 200,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: "Internal Server Error",
      error,
      statusCode: 500,
    });
  }
};
