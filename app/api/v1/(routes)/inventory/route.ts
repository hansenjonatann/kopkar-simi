import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const db = new PrismaClient();

export const GET = async (req: NextRequest) => {
  const page = Number(req.nextUrl.searchParams.get("page")) || 1;
  const limit = 5;

  try {
    const offset = (page - 1) * limit;
    const totalinventory = await db.inventoryLog.count();
    const paginatedInventory = await db.inventoryLog.findMany({
      include: {
        Product: true,
      },
      take: limit,
      skip: offset,
    });

    return NextResponse.json({
      success: true,
      message: "List of Paginated Inventory",
      data: {
        inventory: paginatedInventory,
        pagination: {
          total: totalinventory,
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
  const generateDate = new Date().toLocaleDateString("id").replaceAll("/", "-");
  const inventory = await db.inventoryLog.create({
    data: {
      date: generateDate, // Pastikan tanggal yang benar
      productId: body.productId,
      quantity: body.quantity,
      changeType: body.changeType,
    },
  });

  // Perbarui stok produk secara atomik dengan Prisma
  await db.product.update({
    where: { id: body.productId },
    data: {
      retailStock:
        body.changeType == "PURCHASE_RETAIL"
          ? { increment: body.quantity }
          : body.quantity,
      wholesaleStock:
        body.changeType == "PURCHASE_WHOLESALE"
          ? { increment: body.quantity }
          : body.quantity,
    },
  });

  return NextResponse.json({
    success: true,
    message: "Inventory Created",
    data: inventory,
    statusCode: 200,
  });
};
