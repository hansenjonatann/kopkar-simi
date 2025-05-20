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
        customer: true,
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
      paymentDate: Date
    ): {
      interest: number;
      activeDays: number;
    } => {
      const paymentYear = paymentDate.getFullYear();
      const paymentMonth = paymentDate.getMonth();
      let dueDate: Date;

      if (paymentDate.getDate() <= 25) {
        dueDate = new Date(paymentYear, paymentMonth, 25);
      } else {
        dueDate = new Date(paymentYear, paymentMonth + 1, 25);
      }

      const activeDays = Math.max(
        0,
        Math.ceil(
          (dueDate.getTime() - paymentDate.getTime()) / (1000 * 60 * 60 * 24)
        )
      );

      const getTanggal30Safe = (year: any, month: any) => {
        const tgl30 = new Date(year, month, 30);
        if (tgl30.getMonth() !== month) {
          return new Date(year, month + 1, 0);
        }
        return tgl30;
      };

      const akhirBulan = getTanggal30Safe(paymentYear, paymentMonth);

      const selisih = Math.max(
        0,
        Math.ceil(
          (akhirBulan.getTime() - paymentDate.getTime()) / (1000 * 60 * 60 * 24)
        )
      );

      const fullMonthlyInterest = loan.totalInterest;
      const fixCalculate = 30 - 25;
      const duration = fixCalculate + selisih;
      const interest = (duration * fullMonthlyInterest) / 30;

      return {
        interest: Math.round(interest),
        activeDays,
      };
    };

    const isPayoff = paymentAmount >= loan.remainingPrincipal;
    const jatuhTempo = new Date(
      paymentDateObj.getFullYear(),
      paymentDateObj.getMonth(),
      25
    );
    const isBeforeDueDate = paymentDateObj < jatuhTempo;

    // Initialize interest and penalty
    let interest = 0;
    let penalty = 0;

    // Calculate accrued interest if payment is before due date
    if (isBeforeDueDate) {
      const { interest: calculatedInterest } =
        calculateAccruedInterestUntil25(paymentDateObj);
      interest = calculatedInterest;
      penalty = Math.round(0.01 * loan.loanAmount);
    }

    const totalDue =
      isPayoff && isBeforeDueDate
        ? loan.remainingPrincipal + interest + penalty
        : paymentAmount;

    const principalPaid = Math.max(0, paymentAmount);

    // Save to database
    const payment = await db.payment.create({
      data: {
        customerId: loan.customerId,
        paymentDate: paymentDateObj,
        loanId,
        paymentAmount,
        interestRate: Number(loan.interestRate),
        totalInterest: interest,
        totalDue: totalDue,
        penalty,
      },
    });

    // Update the loan
    if (payment) {
      const newRemainingPrincipal = isPayoff
        ? 0
        : Math.max(0, loan.remainingPrincipal - principalPaid);

      await db.loan.update({
        where: { id: loanId },
        data: {
          remainingPrincipal: newRemainingPrincipal,
          totalPaid: loan.totalPaid + paymentAmount,
          isPaidOff: newRemainingPrincipal === 0 ? "PAID" : "UNPAID",
          accruedInterest: interest, // Always update accruedInterest
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Payment created",
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Unknown error" },
      { status: 500 }
    );
  }
};
