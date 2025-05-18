"use server";

import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const db = new PrismaClient();

// Function to check if a year is a leap year
const isLeapYear = (year: number): boolean =>
  (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

// Function to calculate the number of days in a month
const calculateDaysInMonth = (month: number, year: number): number => {
  switch (month) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
      return 31;
    case 4:
    case 6:
    case 9:
    case 11:
      return 30;
    case 2:
      return isLeapYear(year) ? 29 : 28;
    default:
      throw new Error("Invalid month");
  }
};

export const GET = async () => {
  try {
    const payments = await db.payment.findMany({
      include: {
        loan: true,
      },
    });

    if (!payments) throw new Error("Error Fetching Payments");

    return NextResponse.json({
      success: true,
      message: "List of payments",
      data: payments,
    });
  } catch (err) {
    console.log(err);
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

    const { paymentAmount, loanId, paymentDate } = body;

    const paymentDateObj = new Date(paymentDate);

    // Validation
    if (!loanId || typeof loanId !== "string") {
      return NextResponse.json({ error: "Invalid loanId" }, { status: 400 });
    }
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      return NextResponse.json(
        { error: "Invalid payment amount" },
        { status: 400 }
      );
    }

    if (isNaN(paymentDateObj.getTime())) {
      return NextResponse.json(
        { error: "Invalid payment date" },
        { status: 400 }
      );
    }

    const loan = await db.loan.findFirst({
      where: { id: loanId },
    });

    if (!loan) {
      return NextResponse.json({ error: "Loan not found" }, { status: 404 });
    }

    if (paymentAmount > loan.remainingPrincipal) {
      return NextResponse.json(
        {
          error: `Payment amount cannot exceed remaining principal: ${loan.remainingPrincipal.toLocaleString(
            "id-ID",
            { style: "currency", currency: "IDR" }
          )}`,
        },
        { status: 400 }
      );
    }

    // Calculate accrued interest from paymentDate to the 25th of the relevant month
    const calculateAccruedInterestUntil25 = (
      paymentDate: Date,
      remainingPrincipal: number
    ): {
      interest: number;
      interestRate: number;
      activeDays: number;
    } => {
      let dueDate: Date;
      const paymentYear = paymentDate.getFullYear();
      const paymentMonth = paymentDate.getMonth();

      if (paymentDate.getDate() <= 25) {
        dueDate = new Date(paymentYear, paymentMonth, 25);
      } else {
        dueDate = new Date(paymentYear, paymentMonth + 1, 25);
      }

      const year = dueDate.getFullYear();
      const month = dueDate.getMonth() + 1;
      const daysInMonth = calculateDaysInMonth(month, year);

      const interestPerDay = 0.006 / daysInMonth;

      const activeDays = Math.max(
        0,
        Math.ceil(
          (dueDate.getTime() - paymentDate.getTime()) / (1000 * 60 * 60 * 24)
        )
      );

      const interest = interestPerDay * activeDays * remainingPrincipal;
      const interestRate = interestPerDay * remainingPrincipal;

      return {
        interest: Math.round(interest),
        interestRate,
        activeDays,
      };
    };

    const { interest, interestRate, activeDays } =
      calculateAccruedInterestUntil25(paymentDateObj, loan.remainingPrincipal);

    const principalPaid = Math.max(0, paymentAmount - interest);

    // Save to database
    const payment = await db.payment.create({
      data: {
        paymentDate: paymentDateObj,
        loanId,
        paymentAmount,
        interestRate, // Interest as a percentage of remaining principal
        totalInterest: interest,
        totalDue: paymentAmount,
      },
    });

    // Update the loan
    if (payment) {
      const newRemainingPrincipal = Math.max(
        0,
        loan.remainingPrincipal - principalPaid
      );

      await db.loan.update({
        where: { id: loanId },
        data: {
          remainingPrincipal: newRemainingPrincipal,
          totalPaid: loan.totalPaid + paymentAmount,
          isPaidOff: newRemainingPrincipal === 0 ? "PAID" : "UNPAID",
          accruedInterest: interest, // Track accrued interest
        },
      });
    }

    return NextResponse.json({ payment });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Unknown error" },
      { status: 500 }
    );
  }
};
