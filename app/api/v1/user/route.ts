'use server'

import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const db = new PrismaClient()

export const GET = async () => {
    try {
        const users = await db.user.findMany()

        return NextResponse.json({
            success: true , 
            message: 'List of users' , 
            data: users, 
            statusCode: 200
        })
    } catch (error) {
        return NextResponse.json({
            success: false , 
            message: 'Internal Server Error' , 
            error , 
            statusCode: 500
        })
    }
}