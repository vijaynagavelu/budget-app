import { verifyFirebaseIdToken } from '@/utils/getFirebaseId';
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'


export async function GET(request, { params }) {

    const prisma = new PrismaClient()

    const currentUser = await verifyFirebaseIdToken(request);
    console.log("currentUser", currentUser)

    const id = params.username;
    const users = await prisma.Expense.findMany({
        where: {
            user_id: id,
        },
    })
    const result = JSON.stringify(users);
    return NextResponse.json({ result });
}


