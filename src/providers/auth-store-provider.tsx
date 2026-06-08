"use client";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { INITIAL_STATE_PROFILE } from "@/constants/auth-constants";
import { Profile } from "@/types/auth";
import { ReactNode, useEffect } from "react";

export default function AuthStoreProvider({
  children,
  profile = INITIAL_STATE_PROFILE,
}: {
  children: ReactNode;
  profile?: Profile;
}) {
  useEffect(() => {
    useAuthStore.getState().setProfile(profile);

    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      useAuthStore.getState().setUser(user);
    });
  }, [profile]);

  return <>{children}</>;
}
