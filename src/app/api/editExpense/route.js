import { verifyFirebaseIdToken } from '@/utils/getFirebaseId';
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { parseQueryString } from '../../../utils/queryString'

const prisma = new PrismaClient()


export async function GET(request) {
    try {
        const currentUser = await verifyFirebaseIdToken(request);
        const parsedParams = parseQueryString(request.url);
        const id = parseInt(parsedParams.id);

        const users = await prisma.Expense.findMany({
            where: {
                id: id,
                user_id: currentUser,
            },
        });
        if (!users || users.length === 0) {
            return NextResponse.json({ error: "Expense entry not found" }, { status: 404 });
        }
        const result = JSON.stringify(users);
        return NextResponse.json({ result }, { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const currentUser = await verifyFirebaseIdToken(request);

        if (currentUser) {
            const data = await request.json();
            const parsedParams = parseQueryString(request.url);
            const id = parseInt(parsedParams.id);

            const updateExpense = await prisma.Expense.update({
                where: {
                    id: id,
                },
                data: {
                    amount: parseInt(data.amount),
                    need: data.need,
                    note: data.note,
                }
            });
            console.log("Updated expense entry:", updateExpense);
            return NextResponse.json({ message: "Expense entry updated successfully" }, { status: 200 });
        } else {
            console.log("No valid user found");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); // Status: 401 Unauthorized
        }
    } catch (error) {
        console.error('Error updating expense entry:', error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const currentUser = await verifyFirebaseIdToken(request);
        if (currentUser) {
            const parsedParams = parseQueryString(request.url);
            const id = parseInt(parsedParams.id);

            const deleteUser = await prisma.Expense.delete({
                where: {
                    id: id,
                },
            });
            console.log(deleteUser);
            return NextResponse.json({ message: "Expense entry deleted successfully" }, { status: 200 });
        } else {
            console.log("No valid user found");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    } catch (error) {
        console.error('Error deleting expense entry:', error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}