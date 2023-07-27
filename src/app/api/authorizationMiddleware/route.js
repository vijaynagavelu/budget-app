// import { createFirebaseAdminApp } from '@/utils/createFirebaseAdminApp';
// import admin from "firebase-admin";
import {verifyFirebaseIdToken}  from "../../../utils/getFirebaseId";

export async function isUserAuthorized(request) {

const headersList = request.headers;
const idToken = headersList.get("authorization");
console.log("idToken",idToken)

  console.log(verifyFirebaseIdToken(idToken));

// let defaultAuth = admin.auth(createFirebaseAdminApp());

//  await defaultAuth 
//   .verifyIdToken(idToken)
//   .then((decodedToken) => {
//     const uid = decodedToken.uid;
//     console.log("uid",uid);
//   })
//   .catch((error) => {
//     console.log(error);
//   });
//    return NextResponse.json({"Success":"working good"});
   return true;
  }