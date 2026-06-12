import AppSidebar from "@/components/common/app-sidebar";
import DarkModeToggle from "@/components/common/darkmode-toggle";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import AuthStoreProvider from "@/providers/auth-store-provider";
import { Profile } from "@/types/auth";
import { cookies } from "next/headers";
import type { ReactNode } from "react";
import DashboardBreadcrumb from "./_components/dashboard-breadcrumb";
import { Separator } from "@/components/ui/separator";

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
    <AuthStoreProvider profile={profile}>
      <SidebarProvider>
        <AppSidebar initialProfile={profile!} />
        <SidebarInset className="overflow-x-hidden">
          <header className="flex justify-between h-16 shrink-0 items-center gap-2 transition-[width, height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="cursor-pointer" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <DashboardBreadcrumb />
            </div>
            <div className="px-4">
              <DarkModeToggle />
            </div>
          </header>
          <main className="flex flex-1 flex-col items-start gap-4 p-4 pt-4">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AuthStoreProvider>
  );
}
