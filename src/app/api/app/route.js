import { verifyFirebaseIdToken } from '@/utils/getFirebaseId';
import { NextResponse } from 'next/server';

export async function GET(request) {
   try {
      const currentUser = await verifyFirebaseIdToken(request);
      console.log("currentUser", currentUser);

      if (!currentUser) {
         return NextResponse.json({ message: "No current user found." });
      }

      return NextResponse.json({ currentUser });
   } catch (error) {
      console.error("Error verifying Firebase ID token:", error);
      return NextResponse.json({ message: "Error verifying Firebase ID token." });
   }
}


// export async function GET(request) {

//    const currentUser = await verifyFirebaseIdToken(request);
//    console.log("currentUser", currentUser);

//    if (!currentUser) {
//       return NextResponse.json({});
//    }
//    return NextResponse.json({ currentUser });
// }