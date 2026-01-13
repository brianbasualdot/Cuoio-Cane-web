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

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // 1. Redirect to Login if not authenticated and not on login page
    if (!user && !request.nextUrl.pathname.startsWith('/login')) {
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
