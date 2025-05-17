import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const db = new PrismaClient();

export const GET = async (req: NextRequest) => {
  try {
    const loanId = req.nextUrl.searchParams.get("id") as string;

    const detailloan = await db.loan.findFirst({
      where: {
        id: loanId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Detail of Loan",
      data: detailloan,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};
