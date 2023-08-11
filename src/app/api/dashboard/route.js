import { verifyFirebaseIdToken } from '@/utils/getFirebaseId';
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { parseQueryString } from '../../../utils/queryString'


export async function GET(request) {

    const prisma = new PrismaClient()
    const currentUser = await verifyFirebaseIdToken(request);
    //console.log( currentUser, request.url)

    const parsedParams = parseQueryString(request.url);
    //console.log("heloooo", parsedParams);
    console.log("vera", parsedParams.tag);

    function replacePercentEncoding(inputString) {
        var modifiedString = inputString.replace(/%20/g, ' ');
        return modifiedString;
    }

    if (replacePercentEncoding(parsedParams.tag) !== 'All') {
        const filteredList = await prisma.Expense.findMany({
            where: {
                user_id: currentUser,
                need: replacePercentEncoding(parsedParams.tag),
            }
        });
        console.log(filteredList);
        const result = JSON.stringify(filteredList);
        return NextResponse.json({ result });
    }

    if (replacePercentEncoding(parsedParams.tag) == 'All') {

        const filteredList = await prisma.Expense.findMany({
            where: {
                user_id: currentUser,
            }
        });
        console.log(filteredList);
        const result = JSON.stringify(filteredList);
        return NextResponse.json({ result });
    }






}


