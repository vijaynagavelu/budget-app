import { NextResponse } from 'next/server'
import { isUserAuthorized } from './app/api/authorizationMiddleware/route';


export async function middleware(request) {

  const isAuthorized = await isUserAuthorized(request);
  console.log("ingha va",isAuthorized)
 
  const requestHeaders = new Headers();
  requestHeaders.append("heloo", "image/jpeg");
	requestHeaders.set("x-middleware-invoke" , "hi");

  if (isAuthorized) {
    return NextResponse.json({ message: 'Unauthorized' });
  }

  let url = new URL(request.url);
  let pathname = url.pathname.replace("/budget-app", "")
  console.log({original: url.pathname, "new": pathname})
  return NextResponse.rewrite(new URL(pathname, request.url),{
    request: {
      headers: requestHeaders,
    }
  })
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/budget-app/api(.*)',
}


