"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import FormInput from "@/components/common/form-input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  INITIAL_HERO_SNIPPET_FORM,
  INITIAL_SITE_SETTINGS_FORM,
  INITIAL_STATE_HERO_SNIPPET_FORM,
  INITIAL_STATE_SITE_SETTINGS_FORM,
} from "@/constants/site-setting-constant";
import type {
  PortfolioHeroSnippetRow,
  PortfolioSiteSettingsRow,
} from "@/types/site-setting";
import type {
  HeroSnippetForm,
  SiteSettingsForm,
} from "@/validations/site-setting-validation";
import {
  heroSnippetFormSchema,
  siteSettingsFormSchema,
} from "@/validations/site-setting-validation";
import { saveHeroSnippet, saveSiteSettings } from "../action";

type SiteSettingsManagementProps = {
  siteSettings: PortfolioSiteSettingsRow | null;
  heroSnippet: PortfolioHeroSnippetRow | null;
  siteSettingsError?: string;
  heroSnippetError?: string;
};

function getSiteSettingsDefaultValues(
  settings: PortfolioSiteSettingsRow | null,
): SiteSettingsForm {
  return {
    ...INITIAL_SITE_SETTINGS_FORM,
    site_name: settings?.site_name ?? INITIAL_SITE_SETTINGS_FORM.site_name,
    title: settings?.title ?? INITIAL_SITE_SETTINGS_FORM.title,
    description:
      settings?.description ?? INITIAL_SITE_SETTINGS_FORM.description,
    og_image_url: settings?.og_image_url ?? "",
    twitter_card:
      settings?.twitter_card ?? INITIAL_SITE_SETTINGS_FORM.twitter_card,
    favicon_url:
      settings?.favicon_url ?? INITIAL_SITE_SETTINGS_FORM.favicon_url,
    contact_cta_title:
      settings?.contact_cta_title ??
      INITIAL_SITE_SETTINGS_FORM.contact_cta_title,
    contact_cta_description:
      settings?.contact_cta_description ??
      INITIAL_SITE_SETTINGS_FORM.contact_cta_description,
  };
}

function getHeroSnippetDefaultValues(
  snippet: PortfolioHeroSnippetRow | null,
): HeroSnippetForm {
  return {
    ...INITIAL_HERO_SNIPPET_FORM,
    filename: snippet?.filename ?? INITIAL_HERO_SNIPPET_FORM.filename,
    code: snippet?.code ?? INITIAL_HERO_SNIPPET_FORM.code,
  };
}

export default function SiteSettingsManagement({
  siteSettings,
  heroSnippet,
  siteSettingsError,
  heroSnippetError,
}: SiteSettingsManagementProps) {
  const siteForm = useForm<SiteSettingsForm>({
    resolver: zodResolver(siteSettingsFormSchema),
    defaultValues: getSiteSettingsDefaultValues(siteSettings),
  });
  const heroForm = useForm<HeroSnippetForm>({
    resolver: zodResolver(heroSnippetFormSchema),
    defaultValues: getHeroSnippetDefaultValues(heroSnippet),
  });

  const [siteState, siteAction, isPendingSite] = useActionState(
    saveSiteSettings,
    INITIAL_STATE_SITE_SETTINGS_FORM,
  );
  const [heroState, heroAction, isPendingHero] = useActionState(
    saveHeroSnippet,
    INITIAL_STATE_HERO_SNIPPET_FORM,
  );

  const onSubmitSiteSettings = siteForm.handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
    if (siteSettings?.id) {
      formData.append("id", siteSettings.id);
    }
    startTransition(() => siteAction(formData));
  });

  const onSubmitHeroSnippet = heroForm.handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
    if (heroSnippet?.id) {
      formData.append("id", heroSnippet.id);
    }
    startTransition(() => heroAction(formData));
  });

  useEffect(() => {
    if (siteSettingsError) {
      toast.error("Get site settings failed", {
        description: siteSettingsError,
      });
    }
  }, [siteSettingsError]);

  useEffect(() => {
    if (heroSnippetError) {
      toast.error("Get hero snippet failed", {
        description: heroSnippetError,
      });
    }
  }, [heroSnippetError]);

  useEffect(() => {
    if (siteState.status === "error") {
      toast.error("Save site settings failed", {
        description: siteState.errors?._form?.[0],
      });
    }

    if (siteState.status === "success") {
      toast.success("Site settings saved successfully");
    }
  }, [siteState]);

  useEffect(() => {
    if (heroState.status === "error") {
      toast.error("Save hero snippet failed", {
        description: heroState.errors?._form?.[0],
      });
    }

    if (heroState.status === "success") {
      toast.success("Hero snippet saved successfully");
    }
  }, [heroState]);

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Site Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage SEO metadata, contact CTA copy, and the hero terminal snippet.
        </p>
      </div>

      <Card className="p-5">
        <div className="mb-5">
          <h2 className="text-lg font-semibold">SEO & Contact CTA</h2>
          <p className="text-sm text-muted-foreground">
            These values will be used by metadata and contact content when the
            landing page is integrated.
          </p>
        </div>
        <form onSubmit={onSubmitSiteSettings} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <FormInput
              form={siteForm}
              name="site_name"
              label="Site Name"
              placeholder="SudrajadDS Portfolio"
            />
            <FormInput
              form={siteForm}
              name="title"
              label="SEO Title"
              placeholder="SudrajadDS - Fullstack Developer"
            />
            <div className="md:col-span-2">
              <FormInput
                form={siteForm}
                name="description"
                label="SEO Description"
                placeholder="Portfolio description..."
                type="textarea"
              />
            </div>
            <FormInput
              form={siteForm}
              name="og_image_url"
              label="Open Graph Image URL"
              placeholder="https://... or /og-image.png"
            />
            <FormInput
              form={siteForm}
              name="twitter_card"
              label="Twitter Card"
              placeholder="summary_large_image"
            />
            <FormInput
              form={siteForm}
              name="favicon_url"
              label="Favicon URL"
              placeholder="/favicon.ico"
            />
            <FormInput
              form={siteForm}
              name="contact_cta_title"
              label="Contact CTA Title"
              placeholder="Interested in working together?"
            />
            <div className="md:col-span-2">
              <FormInput
                form={siteForm}
                name="contact_cta_description"
                label="Contact CTA Description"
                placeholder="Let's build something useful..."
                type="textarea"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isPendingSite}>
              {isPendingSite ? <Loader2 className="animate-spin" /> : <Save />}
              Save Site Settings
            </Button>
          </div>
        </form>
      </Card>

      <Card className="p-5">
        <div className="mb-5">
          <h2 className="text-lg font-semibold">Hero Terminal Snippet</h2>
          <p className="text-sm text-muted-foreground">
            This powers the terminal/code mockup in the hero section.
          </p>
        </div>
        <form onSubmit={onSubmitHeroSnippet} className="space-y-5">
          <FormInput
            form={heroForm}
            name="filename"
            label="Filename"
            placeholder="developer.ts"
          />
          <FormInput
            form={heroForm}
            name="code"
            label="Code"
            placeholder="const developer = ..."
            type="textarea"
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={isPendingHero}>
              {isPendingHero ? <Loader2 className="animate-spin" /> : <Save />}
              Save Hero Snippet
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
