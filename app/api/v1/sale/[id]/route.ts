'use server'
import {NextResponse , NextRequest} from 'next/server'
import { PrismaClient } from '@prisma/client'

const db  = new PrismaClient()
export const GET = async (req: NextRequest , {params} : {params: Promise<{id: string}>} ) => {
try {
  const id = (await params).id
  const detailSale = await db.sale.findFirst({
    where: {
      id: id
    }
  })

  return NextResponse.json({
    success: true,
    message: 'Detail of Sale',
    data: detailSale, 
    statusCode: 200
  })
} catch (error) {
  return NextResponse.json({
    success: false,
    message: 'Internal Server Error',
    error,
    statusCode: 500
  })
}
}