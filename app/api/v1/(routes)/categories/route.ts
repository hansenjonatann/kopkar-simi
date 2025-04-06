import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const db = new PrismaClient()


export const GET = async () => {
    const allcategories = await db.category.findMany({
        include: {
            products: true
        }
    })

    return NextResponse.json({
        success: true,
        message: 'List of Category',
        data: allcategories,
        statusCode: 200
    });
}
