import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const db = new PrismaClient()

export const GET = async (req: NextRequest , {params} : {params: Promise<{date: string}>}) => {
    const date = (await params).date 

    const filtersalebydate = await db.sale.findMany({
        where: {
            date
        }
    })

    return NextResponse.json({
        success: true,
        message: 'Filter Sale by Date',
        data: filtersalebydate,
        statusCode: 200
    });
}