import admin from "firebase-admin";
// import { headers } from "next/headers";
import { createFirebaseAdminApp } from '@/utils/createFirebaseAdminApp';


export async function verifyFirebaseIdToken(idToken) {


let defaultAuth =  admin.auth(createFirebaseAdminApp());
// const headersList = headers();
// const referer = headersList.get("authorization");
 await defaultAuth 
  .verifyIdToken(idToken)
  .then((decodedToken) => {
    const uid = decodedToken.uid;
    console.log(uid);
    return uid;
  })
  .catch((error) => {
    console.log(error);
    return true;
  });
  } 