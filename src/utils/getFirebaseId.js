import admin from "firebase-admin";
// import { headers } from "next/headers";
import { NextResponse } from 'next/server'
import { createFirebaseAdminApp } from '@/utils/createFirebaseAdminApp';




export async function verifyFirebaseIdToken(idToken) {

let defaultAuth = admin.auth(createFirebaseAdminApp());
console.log(defaultAuth)

// const headersList = headers();
// const referer = headersList.get("authorization");

await defaultAuth 
  .verifyIdToken(idToken)
  .then((decodedToken) => {
     const uid = decodedToken.uid;
    console.log(uid);
  })
  .catch((error) => {
    console.log(error);
    return true;
  });
   return NextResponse.json({"Success":"working good"});

return true;
  } 