import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('jwtToken')?.value;
    const url = new URL(request.url);

    // Pokud je uživatel na /login a má token, přesměruj na /admin (nebo kamkoliv jinam)
    if (url.pathname === '/login' && token) {
        return NextResponse.redirect(new URL('/admin', request.url));
    }

    // Ověření admina na /admin routes
    if (url.pathname.startsWith('/admin')) {
        if (!token) {
            return NextResponse.redirect(new URL('/', request.url));
        }

        try {
            const res = await fetch('https://aspgoldeshop-production.up.railway.app/api/auth/isAdmin', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                credentials: 'include',
            });

            const data = await res.json();

            if (!data.isAdmin) {
                return NextResponse.redirect(new URL('/login', request.url));
            }
        } catch (err) {
            console.error("Middleware auth check failed:", err);
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

// ⬇️ Tady upravíme matcher pro oba případy
export const config = {
    matcher: ['/admin/:path*', '/login'],
};
