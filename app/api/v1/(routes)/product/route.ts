import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const db = new PrismaClient();

export const GET = async (req: NextRequest) => {
  const page = Number(req.nextUrl.searchParams.get("page")) || 1;
  const limit = 5;

  try {
    const offset = (page - 1) * limit;
    const totalproducts = await db.product.count();
    const product = await db.product.findMany({
      take: limit,
      skip: offset,
      include: {
        category: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "List of Product",
      data: {
        data: product,
        pagination: {
          total: totalproducts,
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

  const generateRandomCode = `899${Math.floor(Math.random() * 10000000000)
    .toString()
    .padStart(9, "0")}`;

  const newProduct = await db.product.create({
    data: {
      name: body.name,
      description: body.description,
      code: generateRandomCode,
      categoryId: body.categoryId,
      priceRetail: body.priceRetail,
      priceWholesale: body.priceWholesale,
      costRetail: body.costRetail,
      costWholesale: body.costWholesale,
      retailunitId: body.retailunitId,
      retailStock: body.retailStock,
      wholesaleStock: body.wholesaleStock,
      wholesaleunitId: body.wholesaleunitId,
    },
  });

  return NextResponse.json({
    success: true,
    message: "Create product success",
    data: newProduct,
    statusCode: 201,
  });
};
