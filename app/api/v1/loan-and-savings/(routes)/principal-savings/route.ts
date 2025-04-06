"use server";

import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

export const GET = async () => {
  try {
    const principalsavings = await db.principalSavings.findMany({
      include: {
        customer: true,
      },
    });

    return NextResponse.json({
      status: "success",
      message: "List of Principal Savings",
      data: principalsavings,
    });
  } catch (error) {
    return NextResponse.json({
      status: "failed",
      message: "Internal Server Error",
      error,
    });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const newPrincipalSavings = await db.principalSavings.create({
      data: {
        customerId: body.customerId,
        saveDate: body.saveDate,
        nominalSavings: body.nominalSavings,
      },
    });

    return NextResponse.json({
      status: "success",
      message: "Success create principal savings!",
      data: newPrincipalSavings,
    });
  } catch (error) {
    return NextResponse.json({
      status: "failed",
      message: "Internal Server Error",
      error,
    });
  }
};
