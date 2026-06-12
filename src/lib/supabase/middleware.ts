import { environment } from "@/configs/environment";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next();

  const { SUPABASE_URL, SUPABASE_ANON_KEY } = environment;

  const supabase = createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Jika pengguna belum login dan tidak mengakses halaman login
  if (!user && !request.nextUrl.pathname.startsWith("/login")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    const redirectResponse = NextResponse.redirect(url);
    redirectResponse.cookies.delete("user_profile");
    return redirectResponse;
  }

  // Jika pengguna sudah login dan mencoba mengakses halaman login
  if (user && request.nextUrl.pathname.startsWith("/login")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

// Konfigurasi untuk menentukan path mana yang diproses middleware
export const config = {
  matcher: [
    /*
     * Proses semua path KECUALI:
     * - api (route API)
     * - _next/static (file statis)
     * - _next/image (optimasi gambar)
     * - favicon.ico (icon website)
     * - file publik (seperti: robots.txt)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
