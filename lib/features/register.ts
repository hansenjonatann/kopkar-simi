'use server'

import { PrismaClient } from "@prisma/client"
import { hashSync } from "bcrypt-ts"

const db = new PrismaClient()

export const registerUser = async (name: string , username: string , password: string) => {
    const hashedPassword = await hashSync(password , 10)

    const newUser = await db.user.create({
        data: {
            name , 
            username, 
            password: hashedPassword , 
            role: 'CASHIER'
        }
    })

    return newUser
}