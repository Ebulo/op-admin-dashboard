import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
    exp: number;
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('access_token')?.value;

    const redirectToDashboard = () => NextResponse.redirect(new URL('/', request.url));
    const redirectToSignIn = () => NextResponse.redirect(new URL('/signin', request.url));

    // If user is on /signin and has valid token → redirect to dashboard
    if (pathname === '/signin') {
        if (token) {
            try {
                const decoded = jwtDecode<JwtPayload>(token);
                const currentTime = Date.now() / 1000;

                if (decoded.exp > currentTime) {
                    return redirectToDashboard();
                }
            } catch (error) {
                console.warn('Invalid token on /signin:', error);
                // Let them stay on signin
            }
        }
        return NextResponse.next(); // Let them stay on /signin
    }

    // For all other protected routes
    if (!token) {
        return redirectToSignIn();
    }

    try {
        const decoded = jwtDecode<JwtPayload>(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
            return redirectToSignIn();
        }

        return NextResponse.next();
    } catch (error) {
        console.warn('JWT decode error:', error);
        return redirectToSignIn();
    }
}

export const config = {
    // matcher: ['/((?!_next|api|favicon.ico|static).*)'],
    matcher: ['/((?!_next|api|favicon.ico|static|images).*)'],
};