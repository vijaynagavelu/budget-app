import admin from "firebase-admin";
import { createFirebaseAdminApp } from "./createFirebaseAdminApp";
import { headers } from "next/headers";


// export  function verifyFirebaseIdToken() {

//   const headersList = headers();
//   const idToken = headersList.get("authorization"); 

//  let defaultAuth =  admin.auth(createFirebaseAdminApp()); 

//  defaultAuth
//    .verifyIdToken(idToken)
//    .then((decodedToken) => {
//      const uid = decodedToken.uid;
//      console.log(uid);
//      return  uid;
//     })
//    .catch((error) => {
//      console.log(error);
//     });
// } 


export async function verifyFirebaseIdToken(request) {
  const headersList = headers();
  const idToken = headersList.get("authorization");

  try {
    const decodedToken = await admin.auth(createFirebaseAdminApp()).verifyIdToken(idToken);
    const uid = decodedToken.uid;
    //console.log("userID",uid);
    return uid;
  } catch (error) {
    console.log(error);
    return null; // Return null or handle the error accordingly based on your use case
  }
}
