import AuthStoreProvider from "@/providers/auth-store-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { Profile } from "@/types/auth";
import { cookies } from "next/headers";
import type { ReactNode } from "react";

type AdminLayoutProps = {
  children: ReactNode;
};

function parseProfileCookie(profileCookie?: string) {
  if (!profileCookie) {
    return undefined;
  }

  try {
    return JSON.parse(profileCookie) as Profile;
  } catch {
    return undefined;
  }
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const cookieStore = await cookies();
  const profileCookie = cookieStore.get("user_profile")?.value;
  const profile = parseProfileCookie(profileCookie);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <AuthStoreProvider profile={profile}>{children}</AuthStoreProvider>
    </ThemeProvider>
  );
}
