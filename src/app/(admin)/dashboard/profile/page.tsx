import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/auth";
import ProfileManagement from "./_components/profile-management";

export const metadata = {
  title: "SudrajadDS | Profile Management",
};

export default async function ProfileManagementPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    <ProfileManagement
      initialProfile={(data as Profile | null) ?? null}
      errorMessage={error?.message}
    />
  );
}
