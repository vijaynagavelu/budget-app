import { verifyFirebaseIdToken } from '@/utils/getFirebaseId';
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { parseQueryString } from '../../../utils/queryString'



export async function GET(request) {
    try {
        const prisma = new PrismaClient()
        const currentUser = await verifyFirebaseIdToken(request);
        const parsedParams = parseQueryString(request.url);

        const singleDay = (parsedParams.singleDate)
        const tag = (parsedParams.tag);
        const startDate = new Date(parsedParams.date);
        const endDate = currentMonthLastDate(new Date(parsedParams.date));

        // const todayStartDate = new Date(parsedParams.singleDate);
        const todayStartDate = currentDateStartTime(new Date(parsedParams.singleDate));
        const todayEndDate = currentDateEndTime(new Date(parsedParams.singleDate));

        function currentMonthLastDate(date) {
            if (!date) {
                return null;
            }
            return new Date(date.getFullYear(), date.getMonth() + 1, 1);
        }

        function currentDateStartTime(date) {
            if (!date) {
                return null;
            }
            const result = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
            result.setUTCHours(0, 1, 0, 0);
            //console.log("start", result);
            return result;
        }

        function currentDateEndTime(date) {
            if (!date) {
                return null;
            }
            const result = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
            result.setUTCHours(23, 59, 0, 0);
            //console.log("end", result);
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
            return NextResponse.json({ result }, { status: 200 });
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
            //console.log("result", result)
            return NextResponse.json({ result }, { status: 200 });
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
            return NextResponse.json({ result }, { status: 200 });
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
            return NextResponse.json({ result }, { status: 200 });
        }
    }
    catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


