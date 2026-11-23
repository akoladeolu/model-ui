import { defineSiteConfig, type PresetName, type SiteConfig } from "model-ui";

export const siteConfig = defineSiteConfig({
  brand: {
    name: "Studio Apex",
    logo: "apex.",
    monogram: "SA",
    wordmark: "studioapex",
    tagline:
      "Design systems, distributed tooling, and tactile paper-and-ink interfaces for humans and AI agents.",
    footerHeadline: "Let's build something people actually use.",
    footerCtaLabel: "Get in touch",
  },
  location: {
    city: "LONDON",
    timeZone: "Europe/London",
    locale: "en-GB",
  },
  theme: {
    accent: "cyan",
    defaultMode: "system",
  },
  nav: [
    { label: "projects", href: "/#projects" },
    { label: "blog", href: "/blog" },
    { label: "case study", href: "/projects/helix" },
  ],
  socials: {
    github: "https://github.com/example/model-ui",
    x: "https://x.com/example",
    email: "hello@apex.example.com",
  },
  seo: {
    siteUrl: "https://apex.example.com",
  },
});

export const BRAND_PROFILES: Record<string, SiteConfig> = {
  apex: siteConfig,
  elena: defineSiteConfig({
    ...siteConfig,
    brand: {
      name: "Elena Vance",
      logo: "elena.",
      monogram: "EV",
      wordmark: "elena",
      tagline: "Staff systems engineer & open-source infrastructure craft.",
      footerHeadline: "Let's architect resilient systems.",
      footerCtaLabel: "Send a note",
    },
    location: {
      city: "SAN FRANCISCO",
      timeZone: "America/Los_Angeles",
      locale: "en-US",
    },
    theme: {
      accent: "mono",
      defaultMode: "system",
    },
  }),
  kuro: defineSiteConfig({
    ...siteConfig,
    brand: {
      name: "Kuro Atelier",
      logo: "kuro.",
      monogram: "KA",
      wordmark: "kuro",
      tagline: "Quiet monochrome editorial & spatial software studio.",
      footerHeadline: "Available for Q2 collaborations.",
      footerCtaLabel: "Start a project",
    },
    location: {
      city: "TOKYO",
      timeZone: "Asia/Tokyo",
      locale: "en-US",
    },
    theme: {
      accent: "lime",
      defaultMode: "system",
    },
  }),
};

export function resolveDemoConfig(params?: {
  brand?: string;
  preset?: string;
  mode?: string;
}): SiteConfig {
  const base =
    (params?.brand && BRAND_PROFILES[params.brand]) || siteConfig;
  const validPresets: PresetName[] = ["lime", "cyan", "amber", "violet", "mono"];
  const preset =
    params?.preset && validPresets.includes(params.preset as PresetName)
      ? (params.preset as PresetName)
      : undefined;
  const mode =
    params?.mode === "dark" || params?.mode === "light"
      ? params.mode
      : undefined;

  if (!preset && !mode) return base;
  return defineSiteConfig({
    ...base,
    theme: {
      ...base.theme,
      accent: preset ?? base.theme.accent,
      defaultMode: mode ?? base.theme.defaultMode,
    },
  });
}
