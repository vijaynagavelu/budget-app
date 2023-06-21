import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
    const users = await prisma.inquiry.findMany()
    const result = JSON.stringify(users);
    return NextResponse.json({ result })
}


export async function POST(req) {
    const data = await req.json();
    console.log(data);
    await createInquiry(data)
    return NextResponse.json({ "hello": "salary POST api" })
}


async function createInquiry(data) {
    try {
        const newEntry = await prisma.inquiry.create({
            data: {
                name: data.name,
                salary: data.salary,
            }
        })
        console.log(newEntry);
    } catch (error) {
        console.error('Request error', error)
    }
}