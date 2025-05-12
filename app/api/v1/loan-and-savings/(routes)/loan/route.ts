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

    const year = new Date().getFullYear()

    if(year % 4 == 0) {
      const leapYear = 366
    } else {
      const leapYear = 365
    }



    const interestRate = body.interestRate;
    const interestPerMonth = (body.loanAmount * (interestRate / 100)) / 12;
    const totalInterest = interestPerMonth * body.duration;

    const totalLoan = body.loanAmount;

    const installment = totalLoan / body.duration;

    const totalInstallment = installment + totalInterest;

    const newLoan = await db.loan.create({
      data: {
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
        installment: totalInstallment,
        principalInstallment: installment,
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
