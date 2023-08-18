import { verifyFirebaseIdToken } from '@/utils/getFirebaseId';
import { NextResponse } from 'next/server';


export async function GET(request) {
   try {
      const currentUser = await verifyFirebaseIdToken(request);

      if (!currentUser) {
         return NextResponse.json({ message: "No current user found." }, { status: 404 });
      }
      return NextResponse.json({ currentUser }, { status: 200 });

   } catch (error) {
      console.error("Error verifying Firebase ID token:", error);
      return NextResponse.json({ message: "Error verifying Firebase ID token." }, { status: 500 });
   }
}
