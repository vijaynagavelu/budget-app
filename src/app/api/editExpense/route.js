import { verifyFirebaseIdToken } from '@/utils/getFirebaseId';
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { parseQueryString } from '../../../utils/queryString'


export async function GET(request) {
    const prisma = new PrismaClient()
    const currentUser = await verifyFirebaseIdToken(request);

    const parsedParams = parseQueryString(request.url);
    const id = parseInt(parsedParams.id);

    const users = await prisma.Expense.findMany({
        where: {
            id: id,
            user_id: currentUser,
        },
    })
    const result = JSON.stringify(users);
    return NextResponse.json({ result });
}

export async function PUT(request) {
    const prisma = new PrismaClient()
    const currentUser = await verifyFirebaseIdToken(request);
    const data = await request.json();

    const parsedParams = parseQueryString(request.url);
    const id = parseInt(parsedParams.id);


    try {
        const updateUsers = await prisma.Expense.update({
            where: {
                id: id,
            },
            data: {
                amount: parseInt(data.amount),
                need: data.need,
                note: data.note,
            }
        })
        console.log("updateUsers:", updateUsers);
    } catch (error) {
        console.error('Request error', error)
    }
    return NextResponse.json({ "hello": "salary PUT api" })
}

export async function DELETE(request) {
    const prisma = new PrismaClient()
    const parsedParams = parseQueryString(request.url);
    const id = parseInt(parsedParams.id);

    const deleteUser = await prisma.Expense.delete({
        where: {
            id: id,
        },
    })
    return NextResponse.json({ "deleteUser": deleteUser })
}



