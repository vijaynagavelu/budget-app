import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { verifyFirebaseIdToken } from '@/utils/getFirebaseId';
import { parseQueryString } from '../../../utils/queryString'

const prisma = new PrismaClient()


export async function GET(request) {
    const currentUser = await verifyFirebaseIdToken(request);
    const parsedParams = parseQueryString(request.url);

    const startDate = new Date(processInputString(parsedParams.date));
    const endDate = getNextMonthFirstDay(new Date(processInputString(parsedParams.date)));

    function processInputString(inputString) {
        return inputString.replace(/%20/g, ' ');
    }

    function getNextMonthFirstDay(date) {
        if (!date) {
            return null;
        }
        return new Date(date.getFullYear(), date.getMonth() + 1, 1);
    }

    const needValues = await prisma.Expense.groupBy({
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
                time: data.time,
            }
        })
        console.log(newEntry);
    } catch (error) {
        console.error('Request error', error)
    }
    return NextResponse.json({ "hello": "addExpense POST api" })
}