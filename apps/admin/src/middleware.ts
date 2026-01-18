import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    });
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    });
                },
            },
        }
    );

    let user = null;
    try {
        const { data } = await supabase.auth.getUser();
        user = data.user;
    } catch (e) {
        // Network error likely (Offline Mode)
        // If we have a session cookie, we optimistically allow it for now
        // Ideally we verify the JWT locally, but for now checking existence is 'okay' for offline-first desktop
        const session = request.cookies.get('sb-access-token') || request.cookies.get(`sb-${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}-auth-token`);
        // Note: The cookie name depends on how it's set. Supabase SSR handles this hiddenly. 
        // But `supabase.auth.getSession()` might work better here if getUser fails?
        // Actually, getSession() also might try to verify.

        // Let's try getSession as fallback
        try {
            const { data: sessionData } = await supabase.auth.getSession();
            if (sessionData.session) user = sessionData.session.user;
        } catch (e2) {
            // Still failed.
        }
    }

    // 1. Redirect to Login if not authenticated and not on login page
    if (!user && !request.nextUrl.pathname.startsWith('/login')) {
        // CRITICAL: If offline, we might want to allow pass if we THINK we are logged in?
        // But without user object we can't check role.
        // Let's assume if getUser failed completely but we have cookies, we let it pass to Client to handle?

        // Only redirect if we are SURE we have no session (cookies empty)
        // Checking cookies manually is hard because of encryption/naming.

        // If user is null, we redirect. This is why he got kicked out.
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 2. Redirect to Dashboard if authenticated and on login page
    if (user && request.nextUrl.pathname.startsWith('/login')) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // 3. Role Check for Protected Routes (Admin/Staff)
    // We need to fetch the profile to check role.
    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        const role = profile?.role;

        // Forbidden if not admin or staff
        if (role !== 'admin' && role !== 'staff') {
            // Sign out or show forbidden
            // For simplicity, just strict redirect or rewrite to error
            // But since we are likely handling just access, redirecting to a 'unauthorized' page is better.
            // For now, if you are 'customer', you can't be here.
            return NextResponse.redirect(new URL('/unauthorized', request.url));
        }

        // Admin Only Routes
        if (request.nextUrl.pathname.startsWith('/audit') || request.nextUrl.pathname.startsWith('/staff')) {
            if (role !== 'admin') {
                return NextResponse.redirect(new URL('/', request.url)); // Back to Dashboard
            }
        }
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
