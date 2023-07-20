import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()


export async function GET() {
    const users = await prisma.User.findMany()
    const result = JSON.stringify(users);
    return NextResponse.json({ result })
}

export async function POST(req) {
    const data = await req.json();
    try {
        const newEntry = await prisma.Expense.create({
            data: {
                tag:data.tag,
                user_id:data.userId,
                note:data.note,
                type:data.amount,
            }
        })
        console.log(newEntry);
    } catch (error) {
        console.error('Request error', error)
    }
    return NextResponse.json({ "hello": "tags POST api" })
}