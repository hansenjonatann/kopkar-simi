import {PrismaClient} from  '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const db = new PrismaClient()

export const GET = async (req: NextRequest , {params} : {params: Promise<{slug: string}>}) => {
    const slug = (await params).slug 

    try {
        if(!slug) {
            return NextResponse.json({
                success: false , 
                message: 'Slug not found ',
                statusCode: 404
            })
        }

        const detailCategoryBySlug = await db.category.findFirst({
            where: {slug}
        })

        return NextResponse.json({
            success: true , 
            message: 'Detail of Category',
            data: detailCategoryBySlug,
            statusCode: 200 , 
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