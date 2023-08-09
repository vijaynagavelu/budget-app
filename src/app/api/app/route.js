import { verifyFirebaseIdToken } from '@/utils/getFirebaseId';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {

   const currentUser = await verifyFirebaseIdToken(request);
   console.log("currentUser", currentUser);

   if (!currentUser) {
      return NextResponse.json({});
   }
   return NextResponse.json({ currentUser });
}



