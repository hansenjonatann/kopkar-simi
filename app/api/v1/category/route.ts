import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const db = new PrismaClient()


export const GET = async (req: NextRequest ) => {
    const page = Number(req.nextUrl.searchParams.get('page')) || 1
    const limit = 10 

    try {
        const offset = (page - 1) * limit 
        const totalCategories = await db.category.count()

        const category = await db.category.findMany({
       
            take: limit , 
            skip: offset
        })

        return NextResponse.json({
            success: true , 
            message :' List of Category',
            data: {
                category , 
                pagination: {
                    total: totalCategories , 
                    limit , 
                    offset
                }
            }, 

            statusCode: 200
        })
    } catch (error) {
        return NextResponse.json({
            success: false , 
            message: 'Internal Server Error',
            error , 
            stautsCode: 500
        })
    }
}

export const POST = async (req: NextRequest ) => {
    const body = await req.json()
    try {
        if(!body) {
            return NextResponse.json({
                success: false , 
                message: 'Something went wrong',
                statusCode: 400
            })
        }

        const generateSlug = body.name.toLowerCase()
        
        const newCategory = await db.category.create({
            data : {
                name: body.name , 
                slug: generateSlug
                
            }
        })

        return NextResponse.json({
            success: true , 
            message: 'Create category successs',
            data: newCategory , 
            statusCode: 201
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Internal Server Error',
            error , 
            statusCode: 500
        })
        
    }
}