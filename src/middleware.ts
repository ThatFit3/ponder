import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { isAdmin } from "./app/utils/userCookies";

export function middleware (request: NextRequest) {
    if(request.nextUrl.pathname ==='/login' || request.nextUrl.pathname === '/sign-up'){
        if(cookies().has('token')){
            return NextResponse.redirect(new URL('/' , request.url))
        }
    
        return NextResponse.next()
    }

    if(request.nextUrl.pathname.startsWith('/admin')){
        if(isAdmin()){            
            if(request.nextUrl.pathname ==='/admin'){
                return NextResponse.redirect(new URL('/admin/ponds' , request.url))
            }
            return NextResponse.next()
        }
        return NextResponse.redirect(new URL('/' , request.url))
    }

    if (request.nextUrl.pathname ==='/' && isAdmin()){
        return NextResponse.redirect(new URL('/admin' , request.url))
    }
}

export const config = {
    matcher: ['/login' , '/sign-up', '/admin/:path*', "/"]
};