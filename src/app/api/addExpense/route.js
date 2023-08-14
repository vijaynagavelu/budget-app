import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { verifyFirebaseIdToken } from '@/utils/getFirebaseId';


const prisma = new PrismaClient()


export async function GET(request) {
    const currentUser = await verifyFirebaseIdToken(request);

    const needValues = await prisma.Expense.groupBy({
        by: ["need"],
        where: {
            user_id: currentUser,
        },
        _sum: {
            amount: true,
        },
    });
    const result = JSON.stringify(needValues);
    //console.log(result);
    return NextResponse.json({ result })
}



export async function POST(request) {
    const currentUser = await verifyFirebaseIdToken(request);
    const data = await request.json();
    try {
        const newEntry = await prisma.Expense.create({
            data: {
                need: data.need,
                user_id: currentUser,
                note: data.note,
                amount: parseInt(data.amount),
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
            }
        })
        console.log(newEntry);
    } catch (error) {
        console.error('Request error', error)
    }
    return NextResponse.json({ "hello": "addExpense POST api" })
}