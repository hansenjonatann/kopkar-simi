"use server";

import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export const GET = async (req: NextRequest) => {
  const date = req.nextUrl.searchParams.get("date");
  const url = `${process.env.NEXT_PUBLIC_API_URL}/sale/preview-pdf?date=${date}`;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({ format: "A4" });

  await browser.close();

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="sales-report-${date}.pdf"`,
    },
  });
};
