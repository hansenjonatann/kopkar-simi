import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server";

const db = new PrismaClient()


export const GET = async () => {
    const allproducts = await db.product.findMany({
        include: {
            category: true
        }
    })

    return NextResponse.json({
        success: true,
        message: 'List of Products',
        data: allproducts,
        statusCode: 200
    });
}