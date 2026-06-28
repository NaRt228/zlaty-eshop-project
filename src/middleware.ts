import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('jwtToken')?.value;
    const url = new URL(request.url);

    // Pokud je uživatel na /login a má token, ověříme ho
    if (url.pathname === '/login' && token) {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://golde-shop-production.up.railway.app'}/api/auth/isAdmin`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                credentials: 'include',
            });

            const data = await res.json();

            if (data.isAdmin) {
                return NextResponse.redirect(new URL('/admin/produkty', request.url));
            }
        } catch (err) {
            console.error("Token verification on login page failed:", err);
        }
        
        // Pokud token není platný, smažeme ho z cookies a necháme uživatele na /login
        const response = NextResponse.next();
        response.cookies.set('jwtToken', '', { maxAge: 0 });
        return response;
    }

    // Ověření admina na /admin routes
    if (url.pathname.startsWith('/admin')) {
        if (!token) {
            return NextResponse.redirect(new URL('/', request.url));
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://golde-shop-production.up.railway.app'}/api/auth/isAdmin`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                credentials: 'include',
            });

            const data = await res.json();

            if (!data.isAdmin) {
                const response = NextResponse.redirect(new URL('/login', request.url));
                response.cookies.set('jwtToken', '', { maxAge: 0 });
                return response;
            }

            if (url.pathname === '/admin' || url.pathname === '/admin/') {
                return NextResponse.redirect(new URL('/admin/produkty', request.url));
            }
        } catch (err) {
            console.error("Middleware auth check failed:", err);
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.set('jwtToken', '', { maxAge: 0 });
            return response;
        }
    }

    return NextResponse.next();
}

// ⬇️ Tady upravíme matcher pro oba případy
export const config = {
    matcher: ['/admin/:path*', '/login'],
};
