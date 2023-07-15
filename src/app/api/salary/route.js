import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
    const users = await prisma.inquiry.findMany()
    const result = JSON.stringify(users);
    return NextResponse.json({ result })
}


export async function PUT(req){
    const data = await req.json();
    try {
        const updateUsers = await prisma.inquiry.update({
            where: {
              email: data.email,
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
    try {
        const newEntry = await prisma.inquiry.create({
            data: {
                email:data.email,
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


// async function createInquiry(data) { 
// }