import { PrismaClient } from "@prisma/client" 
import { NextRequest, NextResponse } from "next/server"

const db = new PrismaClient()
export const GET = async (req: NextRequest) => {
    const barcode = req.nextUrl.searchParams.get('code')
    try {
        const products = await db.product.findFirst({
            where: {
                code: String(barcode)
            },
            include: {
                category: true,
            },
           

        })
        return NextResponse.json({
            success: true,
            message: 'List of Product',
            data: products,
            statusCode: 200,
         
        })
    } catch (error) {
        return NextResponse.json({
            success: false ,
            message: 'Internal Server Error',
            error ,
            statusCode: 500
        })
    }
}