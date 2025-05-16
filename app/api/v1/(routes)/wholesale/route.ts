import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const db = new PrismaClient();

export const GET = async () => {
  try {
    const wholesales = await db.wholesalerUnit.findMany();

    return NextResponse.json({
      success: true,
      message: "List of Wholesale",
      data: wholesales,
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: "Internal Server Error",
      error: err,
    });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    if (!body) throw new Error("Please fill the fields!");

    const newWholesale = await db.wholesalerUnit.create({
      data: {
        name: body.name,
        slug: body.name.toLowerCase(),
      },
    });

    if (!newWholesale) throw new Error("Something went wrong!");

    return NextResponse.json({
      success: true,
      message: "Wholesale created!",
      data: newWholesale,
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: "Internal Server Error",
      error: err,
    });
  }
};
