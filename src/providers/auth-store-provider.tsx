"use client";
import { signOut } from "@/actions/auth-action";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { INITIAL_STATE_PROFILE } from "@/constants/auth-constants";
import { Profile } from "@/types/auth";
import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AuthStoreProvider({
  children,
  profile,
}: {
  children: ReactNode;
  profile?: Profile;
}) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const isProtectedRoute =
      pathname.startsWith("/dashboard") || pathname.startsWith("/admin");
    let logoutTimer: ReturnType<typeof setTimeout> | undefined;
    let isLoggingOut = false;

    const resetAuthState = () => {
      useAuthStore.getState().setUser(null);
      useAuthStore.getState().setProfile(INITIAL_STATE_PROFILE);
    };

    const handleInvalidSession = async () => {
      if (isLoggingOut) {
        return;
      }

      isLoggingOut = true;
      resetAuthState();

      if (isProtectedRoute) {
        await signOut(false);
        router.replace("/login");
        router.refresh();
      }
    };

    const scheduleAutoLogout = (expiresAt?: number) => {
      if (logoutTimer) {
        clearTimeout(logoutTimer);
      }

      if (!expiresAt) {
        return;
      }

      const delay = expiresAt * 1000 - Date.now();

      if (delay <= 0) {
        void handleInvalidSession();
        return;
      }

      logoutTimer = setTimeout(() => {
        void handleInvalidSession();
      }, delay);
    };

    useAuthStore.getState().setProfile(profile ?? INITIAL_STATE_PROFILE);

    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error || !session) {
        if (isProtectedRoute) {
          void handleInvalidSession();
        }
        return;
      }

      useAuthStore.getState().setUser(session.user);
      scheduleAutoLogout(session.expires_at);
    });

    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error || !user) {
        if (isProtectedRoute) {
          void handleInvalidSession();
        }
        return;
      }

      useAuthStore.getState().setUser(user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        void handleInvalidSession();
        return;
      }

      useAuthStore.getState().setUser(session.user);
      scheduleAutoLogout(session.expires_at);
    });

    return () => {
      if (logoutTimer) {
        clearTimeout(logoutTimer);
      }
      subscription.unsubscribe();
    };
  }, [pathname, profile, router]);

  return <>{children}</>;
}
