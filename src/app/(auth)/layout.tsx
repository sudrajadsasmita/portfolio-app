import DarkModeToggle from "@/components/common/darkmode-toggle";
import AuthStoreProvider from "@/providers/auth-store-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { ReactNode } from "react";

type AuthLayoutPageProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutPageProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <AuthStoreProvider>
        <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
          <div className="absolute top-4 right-4">
            <DarkModeToggle />
          </div>
          <div className="flex w-full max-w-sm flex-col gap-6">{children}</div>
        </div>
      </AuthStoreProvider>
    </ThemeProvider>
  );
}
