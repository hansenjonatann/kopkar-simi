"use server";

import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

export const GET = async () => {
  try {
    const loans = await db.loan.findMany({
      include: {
        customer: true,
      },
    });

    const totalLoans = await db.loan.aggregate({
      _sum: {
        totalLoan: true,
      },
    });
    return NextResponse.json({
      status: "success",
      message: "List of Loan",
      data: loans,
      total: totalLoans,
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

    const loanDate = new Date();

    const dueDate = new Date(loanDate);
    dueDate.setMonth(dueDate.getMonth() + Number(body.duration));

    async function generateLoanCode(): Promise<string> {
      const year = new Date().getFullYear();

      let code: string;
      let exists = true;

      while (exists) {
        code = `LN-${year}${Math.floor(Math.random() * 9999999)}`;

        const existingLoan = await db.loan.findFirst({
          where: {
            loanCode: code,
          },
        });

        exists = !!existingLoan; // true kalau sudah ada
      }

      return code!;
    }

    const interestRate = body.interestRate;
    const interestPerMonth = (body.loanAmount * (interestRate / 100)) / 12;
    const totalInterest = interestPerMonth * body.duration;

    const totalLoan = body.loanAmount;

    const installment = totalLoan / body.duration;

    const totalInstallment = installment + interestPerMonth;

    const newLoan = await db.loan.create({
      data: {
        loanCode: await generateLoanCode(),
        customerId: body.customerId,
        loanDate: String(loanDate),
        dueDate: String(dueDate),
        typeofLoan: body.typeOfLoan,
        loanAmount: body.loanAmount,
        duration: body.duration,
        interestRate,
        interestPerMonth,
        totalInterest,
        totalLoan,
        installment: installment,
        principalInstallment: installment,
        totalInstallment,
        status: "PENDING",
        remainingPrincipal: body.loanAmount,
      },
    });
    const savings = await db.principalSavings.findFirst({
      where: {
        customerId: body.customerId,
      },
    });

    if (!savings) {
      throw new Error("PrincipalSavings record not found");
    }

    await db.principalSavings.update({
      where: {
        id: savings.id,
      },
      data: {
        nominalSavings: {
          increment: body.loanAmount,
        },
      },
    });

    return NextResponse.json({
      status: "success",
      message: "Loan created!",
      data: newLoan,
    });
  } catch (error) {
    return NextResponse.json({
      status: "failed",
      message: "Internal Server Error",
      error,
    });
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    const id = req.nextUrl.searchParams.get("id");
    await db.loan
      .delete({
        where: {
          id: String(id),
        },
      })
      .then(() => {
        return NextResponse.json({
          status: "success",
          message: "Delete loan success",
        });
      });
  } catch (error) {
    return NextResponse.json({
      status: "failed",
      message: "Internal Server Error",
      error,
    });
  }
};
