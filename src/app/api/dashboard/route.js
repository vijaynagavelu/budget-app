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
        const startDate = convertToEpoch(new Date(parsedParams.date));
        const endDate = convertToEpoch(currentMonthLastDate(new Date(parsedParams.date)));

        const todayStartDate = convertToEpoch(currentDateStartTime(new Date(parsedParams.singleDate)));
        const todayEndDate = convertToEpoch(currentDateEndTime(new Date(parsedParams.singleDate)));

        function convertToEpoch(date) {
            const epochTimestamp = Math.floor(date.getTime() / 1000);
            return epochTimestamp;
        }


        function currentMonthLastDate(date) {
            if (!date) {
                return null;
            }
            const result = new Date(date.getFullYear(), date.getMonth() + 1, 1)
            return result;
        }

        function currentDateStartTime(date) {
            if (!date) {
                return null;
            }
            const result = new Date(date.getFullYear(), date.getMonth(), date.getDate())
            //console.log("start", result);
            return result;
        }

        function currentDateEndTime(date) {
            if (!date) {
                return null;
            }
            const result = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
            //console.log("end", result);
            return result;
        }

        if (singleDay !== 'null' && tag == 'All' && todayStartDate && todayEndDate) {
            // const filteredList = await prisma.Expense.findMany({
            const filteredList = await prisma.Expense2.findMany({
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
            // const filteredList = await prisma.Expense.findMany({
            const filteredList = await prisma.Expense2.findMany({

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
            // const filteredList = await prisma.Expense.findMany({
            const filteredList = await prisma.Expense2.findMany({

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
            // const filteredList = await prisma.Expense.findMany({
            const filteredList = await prisma.Expense2.findMany({
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


