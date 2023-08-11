import { verifyFirebaseIdToken } from '@/utils/getFirebaseId';
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'


export async function GET(request, { params }) {

    const prisma = new PrismaClient()

    const currentUser = await verifyFirebaseIdToken(request);
    //console.log("currentUser", currentUser)

    const id = params.username;
    const users = await prisma.User.findMany({
        where: {
            id: id,
        },
    })
    const result = JSON.stringify(users);
    return NextResponse.json({ result });
}

// export async function DELETE() {
//     const deleteUser = await prisma.User.deleteMany({
//         where: {
//             name: {
//                 contains: 'example',
//             },
//         },
//     })
//     return NextResponse.json({ "deleteUser": "LK" })
// }



