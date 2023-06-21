import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
    // const data = await req.json();
    const users = await prisma.inquiry.findUnique({
        where: {
          id: 1,
        },
      })
    const result = JSON.stringify(users);
    console.log(result, "l");
    return NextResponse.json({ result })
}











export async function DELETE() {
    const deleteUser = await prisma.inquiry.deleteMany({
        where: {
            name: {
                contains: 'example',
            },
        },
    })
    return NextResponse.json({ "deleteUser": "LK" })
}

