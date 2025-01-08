import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


const db = new PrismaClient()

export const PATCH = async (req: NextRequest , {params} : {params : Promise<{id: string}>} ) => {
    const id = (await params).id
    const body = await req.json()

    try {
        if(!id) {
            return NextResponse.json({
                success: false , 
                message: 'Category not found',
                statusCode: 404
            })
        }

        const updatedSlug = body.name.toLowerCase()

        const updateCategory = await db.category.update({
            where: {
                id
            }  , 
            data: {
                name: body.name ,
                slug: updatedSlug
            }
        })

        return NextResponse.json({
            success: true , 
            message: 'Update category success' , 
            data: updateCategory,
            statusCode: 200
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


export const DELETE = async (req: NextRequest , {params} : {params: Promise<{id: string}>}) => {
    const id = (await params).id

    try {
        if(!id) {
            return NextResponse.json({
                success: false , 
                message: 'Category not found',
                
            })
        }

        const deletecategory = await db.category.delete({
            where: {
                id: id
            }
        })

        return NextResponse.json({
            success: true , 
            message: 'Success delete category',
            data: deletecategory , 
            statusCode: 200
        })
    } catch (error) {
        return NextResponse.json({
            success: false , 
            message: 'Internal Server Error' , 
            error, 
            statusCode: 500
        })   
    }
}