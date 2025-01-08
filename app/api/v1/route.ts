import {  NextResponse } from "next/server";

export const GET = ( ) => {
    return NextResponse.json({
        message: 'Service is Running',
        statusCode: 200
    })
}