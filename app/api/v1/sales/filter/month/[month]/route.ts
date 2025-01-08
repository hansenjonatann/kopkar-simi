import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const db = new PrismaClient();

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ month: string }> }
) => {
  try {
    const month = (await params).month; // Ambil parameter 'month' dari URL

    // Validasi format MM-YYYY
    const validMonthFormat = /^(0[1-9]|1[0-2])-\d{4}$/;
    if (!validMonthFormat.test(month)) {
      return NextResponse.json({
        success: false,
        message: "Invalid month format. Use MM-YYYY (e.g., 01-2025)",
        statusCode: 400,
      });
    }

    // Pisahkan bulan dan tahun
    const [targetMonth, targetYear] = month.split("-");

    // Filter data penjualan berdasarkan bulan dan tahun
    const sales = await db.sale.findMany({
      where: {
        date: {
          contains: `-${targetMonth}-${targetYear}`, // Format sesuai data di database
        },
      },
    });

    // Hitung total penjualan
    const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);

    return NextResponse.json({
      success: true,
      message: `Sales for Month ${month}`,
      data: sales,
      totalSales,
      statusCode: 200,
    });
  } catch (error: any) {
    console.error("Error:", error.message);
    return NextResponse.json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
      statusCode: 500,
    });
  }
};
