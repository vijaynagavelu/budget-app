import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
    const users = await prisma.User.findMany()
    const result = JSON.stringify(users);
    return NextResponse.json({ result })
}


export async function PUT(req) {
    const data = await req.json();
    console.log(data.id)
    try {
        const updateUsers = await prisma.User.update({
            where: {
                id: data.id,
            },
            data: {
                essentials: data.essentials,
                non_essentials: data.non_essentials,
                savings: data.savings,
            }
        })
        console.log(updateUsers);
    } catch (error) {
        console.error('Request error', error)
    }
    return NextResponse.json({ "hello": "salary PUT api" })
}


export async function POST(req) {
    const data = await req.json();
    console.log("data.id", data.id);
    try {
        const newEntry = await prisma.User.create({
            data: {
                id: data.id,
                email: data.email,
                name: data.name,
                salary: data.salary
            }
        })
        console.log(newEntry);
    } catch (error) {
        console.error('Request error', error)
    }
    return NextResponse.json({ "hello": "salary POST api" })
}