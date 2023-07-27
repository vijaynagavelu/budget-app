import { PrismaClient } from '@prisma/client'
import admin from "firebase-admin";
import { headers } from "next/headers";
import { NextResponse } from 'next/server'
import { createFirebaseAdminApp } from '@/utils/createFirebaseAdminApp';

const prisma = new PrismaClient()

// let defaultAuth = admin.auth(createFirebaseAdminApp());

// export async function GET(request, { params }) {
 
// console.log("Low");

// const headersList = headers();
// const referer = headersList.get("authorization");

// console.log( {referer});
// console.log(params.username);
// console.log(request.method)

// defaultAuth
//   .verifyIdToken(referer)
//   .then((decodedToken) => {
//      const uid = decodedToken.uid;
//     console.log(uid);
//        return NextResponse.json({"Success":"working good"});
//   })

//   .catch((error) => {
//     console.log(error);
//   });
// }



export async function GET(request, { params }) {
  // headers
  // const currentUser = getCurrentUser(headers.idToken)
  // findOne({ id: currentUser.id })

  const headersList = headers();
const referer = headersList.get("Content-Type");

  console.log("hai da")
  console.log(headersList,referer)
    const email = params.username;
    const users = await prisma.User.findMany({
        where: {
            email: email,
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



