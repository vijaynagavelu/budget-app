import { verifyFirebaseIdToken } from '@/utils/getFirebaseId';
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { parseQueryString } from '../../../utils/queryString'


export async function GET(request) {

    const prisma = new PrismaClient()
    const currentUser = await verifyFirebaseIdToken(request);
    const parsedParams = parseQueryString(request.url);

    const singleDay = (parsedParams.singleDate)
    const tag = (parsedParams.tag);
    const startDate = new Date(parsedParams.date);
    const endDate = getNextMonthFirstDay(new Date(parsedParams.date));

    const todayStartDate = new Date(parsedParams.singleDate);
    const todayEndDate = getFirstDayOfFollowingMonth(new Date(parsedParams.singleDate));


    function processInputString(inputString) {
        return inputString.replace(/%20/g, ' ');
    }

    function processInputStringClone(inputString) {
        const stringWithSpaces = inputString.replace(/%20/g, ' ');
        const date = new Date(stringWithSpaces);
        if (isNaN(date)) {
            console.error("Invalid date format:", stringWithSpaces);
            return null; // or handle the error in an appropriate way
        }
        const result = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
        result.setUTCHours(0, 0, 0, 0);
        return result;
    }

    function getNextMonthFirstDay(date) {
        if (!date) {
            return null;
        }
        return new Date(date.getFullYear(), date.getMonth() + 1, 1);
    }

    function getFirstDayOfFollowingMonth(date) {
        if (!date) {
            return null;
        }
        const result = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 2)
        result.setUTCHours(0, 0, 0, 0);
        return result;
    }

    if (singleDay !== 'null' && tag == 'All' && todayStartDate && todayEndDate) {
        const filteredList = await prisma.Expense.findMany({
            where: {
                user_id: currentUser,
                createdAt: {
                    gte: startDate,
                    lte: endDate
                },
                updatedAt: {
                    gte: todayStartDate,
                    lte: todayEndDate
                }
            }
        });
        const result = JSON.stringify(filteredList);
        //console.log("result", result)
        return NextResponse.json({ result });
    }

    if (singleDay !== 'null' && tag !== 'All' && todayStartDate && todayEndDate) {
        //console.log("todayStartDate", todayStartDate);
        //console.log("todayEndDate", todayEndDate);
        const filteredList = await prisma.Expense.findMany({
            where: {
                user_id: currentUser,
                need: tag,
                createdAt: {
                    gte: startDate,
                    lte: endDate
                },
                updatedAt: {
                    gte: todayStartDate,
                    lte: todayEndDate
                }
            }
        });
        const result = JSON.stringify(filteredList);
        console.log("result", result)
        return NextResponse.json({ result });
    }

    if (tag !== 'All' && startDate && endDate) {
        //console.log("startDate", startDate);
        //console.log("endDate", endDate);
        const filteredList = await prisma.Expense.findMany({
            where: {
                user_id: currentUser,
                need: tag,
                createdAt: {
                    gte: startDate,
                    lte: endDate
                }
            }
        });
        const result = JSON.stringify(filteredList);
        return NextResponse.json({ result });
    }


    if (tag == 'All' && startDate && endDate) {
        const filteredList = await prisma.Expense.findMany({
            where: {
                user_id: currentUser,
                createdAt: {
                    gte: startDate,
                    lte: endDate
                }
            }
        });
        const result = JSON.stringify(filteredList);
        return NextResponse.json({ result });
    }
}


