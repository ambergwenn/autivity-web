import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    response = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Robust user session check using getUser()
    const { data: { user } } = await supabase.auth.getUser()

    const pathname = request.nextUrl.pathname
    const isProtectedRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/admin")

    if (isProtectedRoute) {
        // 1. Session check: if not logged in, redirect to login
        if (!user) {
            const loginUrl = new URL("/login", request.url)
            loginUrl.searchParams.set("next", pathname)
            const redirectResponse = NextResponse.redirect(loginUrl)
            
            // Prevent back-button page caching
            redirectResponse.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate")
            return redirectResponse
        }

        // 2. Role check: only allow 'admin' role
        let role = user.user_metadata?.role

        // Defense-in-depth: fallback to query profiles table if not present in metadata
        if (role !== "admin") {
            const { data: profile } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", user.id)
                .single()
            role = profile?.role
        }

        if (role !== "admin") {
            // Unauthorized role access: Sign out session and redirect to login with error
            await supabase.auth.signOut()
            const unauthorizedUrl = new URL("/login", request.url)
            unauthorizedUrl.searchParams.set("error", "unauthorized")
            
            const redirectResponse = NextResponse.redirect(unauthorizedUrl)
            redirectResponse.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate")
            return redirectResponse
        }

        // Prevent browser caching for all allowed requests to protected dashboard routes
        response.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate")
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - images (public images/assets)
         */
        "/((?!api|_next/static|_next/image|favicon.ico|images).*)",
    ],
}
