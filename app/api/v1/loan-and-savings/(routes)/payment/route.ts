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

    let totalInterest = 0;

    // Calculate accrued interest from paymentDate to the 25th of the relevant month
    const calculateAccruedInterestUntil25 = (
      paymentDate: Date,
      remainingPrincipal: number
    ): number => {
      let dueDate: Date;
      const paymentYear = paymentDate.getFullYear();
      const paymentMonth = paymentDate.getMonth(); // 0-indexed

      // Determine the relevant due date (25th of the payment month or next month if past the 25th)
      if (paymentDate.getDate() <= 25) {
        dueDate = new Date(paymentYear, paymentMonth, 25);
      } else {
        // If payment is after the 25th, calculate interest until the 25th of the next month
        dueDate = new Date(paymentYear, paymentMonth + 1, 25);
      }

      const year = dueDate.getFullYear();
      const month = dueDate.getMonth() + 1; // Months are 0-indexed, so add 1 for calculateDaysInMonth
      const daysInMonth = calculateDaysInMonth(month, year);

      const interestPerDay = 0.6 / daysInMonth / 100; // 0.6% monthly rate
      console.log({ interestPerDay });

      const activeDays = Math.max(
        0,
        Math.ceil(
          (dueDate.getTime() - paymentDate.getTime()) / (1000 * 60 * 60 * 24)
        )
      );

      console.log("Active Days:", activeDays);

      const interest = interestPerDay * activeDays * remainingPrincipal;
      totalInterest = interestPerDay * activeDays;

      console.log({ totalInterest });

      return Math.round(interest);
    };

    const interest = calculateAccruedInterestUntil25(
      paymentDateObj,
      loan.remainingPrincipal
    );

    // Save to database
    const payment = await db.payment.create({
      data: {
        paymentDate: paymentDateObj,
        loanId: loanId,
        paymentAmount: paymentAmount,
        interestRate: interest / loan.remainingPrincipal, // Interest as a percentage of remaining principal
        totalInterest,
        totalDue: paymentAmount + interest,
      },
    });

    // Update the loan
    if (payment) {
      const newRemainingPrincipal = Math.max(
        0,
        loan.remainingPrincipal - interest
          ? paymentAmount + interest
          : paymentAmount
      );

      await db.loan.update({
        where: { id: loanId },
        data: {
          remainingPrincipal: newRemainingPrincipal,
          totalPaid: loan.totalPaid + paymentAmount + interest,
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
