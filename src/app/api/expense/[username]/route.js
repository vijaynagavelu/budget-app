import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(request, { params }) {
    const email = params.username;
    const users = await prisma.inquiry.findMany({
        where: {
            email: email,
        },
      })
    const result = JSON.stringify(users);
    return NextResponse.json({result});
}



// export async function DELETE() {
//     const deleteUser = await prisma.inquiry.deleteMany({
//         where: {
//             name: {
//                 contains: 'example',
//             },
//         },
//     })
//     return NextResponse.json({ "deleteUser": "LK" })
// }



