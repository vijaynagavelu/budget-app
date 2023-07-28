import { verifyFirebaseIdToken } from '@/utils/getFirebaseId';
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

// const headersList = headers();
// const referer = headersList.get("authorization");
export async function GET(request, { params }) {

const prisma = new PrismaClient()
const headersList =  request.headers;
const idToken = headersList.get("authorization");
//console.log("idToken",idToken)

 const currentUser =  verifyFirebaseIdToken(idToken);
// console.log(currentUser);
  // findOne({ id: currentUser.id })

    const email = params.username;
    const users = await prisma.User.findMany({
        where: {
            email: 'vijaynaga.0503@gmail.com',
        },
      })
    const result = JSON.stringify(users);
    return NextResponse.json({result});
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



