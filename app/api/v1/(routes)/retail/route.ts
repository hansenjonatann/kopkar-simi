"use server";

import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const db = new PrismaClient();

export const GET = async () => {
  try {
    const retails = await db.retailUnit.findMany();
    return NextResponse.json({
      success: true,
      message: "List of Retail Unit",
      data: retails,
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
  try {
    const body = await req.json();

    if (!body)
      return NextResponse.json({
        success: false,
        message: "All fields are required",
      });

    const generateSlug = body.name.toLowerCase();

    const newRetail = await db.retailUnit.create({
      data: {
        name: body.name,
        slug: generateSlug,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Retail unit created!",
      data: newRetail,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};
