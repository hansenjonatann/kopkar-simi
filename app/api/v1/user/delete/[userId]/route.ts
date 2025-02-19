'use server'


import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient()

export const DELETE = async (req: NextRequest , {params} : {params: Promise<{userId: string}>}) => {
    const userId = (await params).userId

    if(userId) {
        const deletedUser = await db.user.delete({
            where: {
                id: userId
            }
        })

        if(deletedUser) {
            return NextResponse.json({
                success: true , 
                message: 'Success delete user' , 
                
            })
        }
    }
}