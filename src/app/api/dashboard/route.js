import { verifyFirebaseIdToken } from '@/utils/getFirebaseId';
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { parseQueryString } from '../../../utils/queryString'


export async function GET(request) {

    const prisma = new PrismaClient()
    const currentUser = await verifyFirebaseIdToken(request);
    const parsedParams = parseQueryString(request.url);

    const tag = removePercent(parsedParams.tag);
    const startDate = new Date(removePercent(parsedParams.date));
    const endDate = firstNextDayOfMonth(new Date(removePercent(parsedParams.date)));


    function removePercent(inputString) {
        return inputString.replace(/%20/g, ' ');
    }

    function firstNextDayOfMonth(date) {
        if (!date) {
            return null;
        }
        return new Date(date.getFullYear(), date.getMonth() + 1, 1);
    }


    if (tag !== 'All' && startDate && endDate) {
        console.log("startDate", startDate);
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


