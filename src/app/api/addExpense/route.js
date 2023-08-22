import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { verifyFirebaseIdToken } from '@/utils/getFirebaseId';
import { parseQueryString } from '../../../utils/queryString'

const prisma = new PrismaClient()


export async function GET(request) {
    try {
        const currentUser = await verifyFirebaseIdToken(request);
        const parsedParams = parseQueryString(request.url);

        const startDate = convertToEpoch(new Date(parsedParams.date));
        const endDate = convertToEpoch(getNextMonthFirstDay(new Date(parsedParams.date)));


        function convertToEpoch(date) {
            const epochTimestamp = Math.floor(date.getTime() / 1000);
            console.log("AE", epochTimestamp);
            return epochTimestamp;
        }

        function getNextMonthFirstDay(date) {
            if (!date) {
                return null;
            }
            return new Date(date.getFullYear(), date.getMonth() + 1, 1);
        }

        // const needValues = await prisma.Expense.groupBy({
        const needValues = await prisma.Expense2.groupBy({
            by: ["need"],
            where: {
                user_id: currentUser,
                createdAt: {
                    gte: startDate,
                    lte: endDate
                },
            },
            _sum: {
                amount: true,
            },
        });

        const result = JSON.stringify(needValues);
        return NextResponse.json({ result }, { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


export async function POST(request) {
    const currentUser = await verifyFirebaseIdToken(request);
    const data = await request.json();
    try {
        // const newEntry = await prisma.Expense.create({
        const newEntry = await prisma.Expense2.create({
            data: {
                need: data.need,
                user_id: currentUser,
                note: data.note,
                amount: parseInt(data.amount),
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
            }
        });
        console.log("New expense entry:", newEntry);
        return NextResponse.json({ "message": "Expense entry created successfully" }, { status: 200 });
    } catch (error) {
        console.error('Error creating expense entry:', error);
        return NextResponse.json({ 'error': "Internal Server Error" }, { status: 500 });
    }
}
