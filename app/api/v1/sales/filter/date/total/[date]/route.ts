import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const db = new PrismaClient()

export const GET = async (req: NextRequest , {params} : {params: Promise<{date: string}>}) => {
    const date = (await params).date 

    const totalSalesByDate = await db.sale.aggregate({
        _sum: {
            total: true
        },
        where: {
            date
        }
    })

    return NextResponse.json({
        success: true,
        message: 'Total Sale by Date',
        data: totalSalesByDate,
        statusCode: 200
    });
}