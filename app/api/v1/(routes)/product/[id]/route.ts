import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const db = new PrismaClient()

export const GET = async (req: NextRequest , {params} : {params: Promise<{id: string}>}) => {
    const id = (await params).id 

    const detailproduct = await db.product.findFirst({
        where: {
            id
        } , 
        include: {
            category: true
        }
    })

    return NextResponse.json({
        success: true,
        message: 'Detail of Product',
        data: detailproduct,
        statusCode: 200
    });
    
}


export const PATCH = async (req: NextRequest , {params} : {params: Promise<{id: string}>}) => {
    const id = (await params).id 
    const body = await req.json()
    const updateproduct = await db.product.update({
        where:  {id},
        data: {
            name: body.name , 
            cost: body.cost , 
            price: body.price,
            description: body?.description

        }
    })

    return NextResponse.json({
        success: true,
        message: 'Update product success',
        data: updateproduct,
        statusCode: 200
    });
}

export const DELETE = async (req: NextRequest , {params }: {params: Promise<{id: string}>}) => {
    const id = (await params).id

    const deleteproduct = await db.product.delete({
        where: {id}
    })

    return NextResponse.json({
        success: true,
        message: 'Delete product success',
        data: deleteproduct,
        statusCode: 200
    });

    
}