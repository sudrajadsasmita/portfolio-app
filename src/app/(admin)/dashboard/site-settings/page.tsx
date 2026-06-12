import { createClient } from "@/lib/supabase/server";
import type {
  PortfolioHeroSnippetRow,
  PortfolioSiteSettingsRow,
} from "@/types/site-setting";
import SiteSettingsManagement from "./_components/site-settings-management";

export const metadata = {
  title: "SudrajadDS | Site Settings",
};

export default async function SiteSettingsPage() {
  const supabase = await createClient();

  const [siteSettingsResult, heroSnippetResult] = await Promise.all([
    supabase
      .from("portfolio_site_settings")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("portfolio_hero_snippets")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  return (
    <SiteSettingsManagement
      siteSettings={
        (siteSettingsResult.data as PortfolioSiteSettingsRow | null) ?? null
      }
      heroSnippet={
        (heroSnippetResult.data as PortfolioHeroSnippetRow | null) ?? null
      }
      siteSettingsError={siteSettingsResult.error?.message}
      heroSnippetError={heroSnippetResult.error?.message}
    />
  );
}
