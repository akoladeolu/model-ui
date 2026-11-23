import { z } from "zod";
import { PRESET_NAMES, type PresetName } from "./presets.js";

export function isValidIanaZone(tz: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

export const imageRefSchema = z.object({
  src: z.string().min(1),
  alt: z.string().default(""),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});

export type ImageRef = z.infer<typeof imageRefSchema>;

export const customAccentSchema = z.object({
  hex: z
    .string()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Expected a valid 3 or 6 digit hex color (e.g. #22d3ee)"),
  wordmarkAlpha: z.number().min(0.05).max(1).optional(),
  ringAlpha: z.number().min(0.1).max(1).optional(),
  selectionAlpha: z.number().min(0.05).max(1).optional(),
});

export type CustomAccent = z.infer<typeof customAccentSchema>;

export const siteConfigSchema = z.object({
  brand: z.object({
    /** Full brand or person name (e.g. "Elena Vance" or "Studio Apex") */
    name: z.string().min(1, "Brand name is required"),
    /** Short dock-tab & byline mark (e.g. "elena." or "apex.") */
    logo: z.string().min(1, "Brand logo text is required"),
    /** 1-3 character monogram for avatars and fallback banners (e.g. "EV") */
    monogram: z
      .string()
      .min(1)
      .max(3, "Monogram must be at most 3 characters"),
    /** Giant footer wordmark text (max 12 graphemes so fit-to-width remains bold) */
    wordmark: z
      .string()
      .min(1)
      .refine((s) => [...s].length <= 12, {
        message: "Wordmark must be 12 characters or fewer",
      }),
    /** Hero tagline / role description */
    tagline: z.string().min(1),
    /** Optional avatar image for the dock-tab nav */
    avatar: imageRefSchema.optional(),
    /** Optional footer headline override */
    footerHeadline: z
      .string()
      .default("Let's build something people actually use."),
    /** Optional footer CTA label */
    footerCtaLabel: z.string().default("Get in touch"),
  }),
  location: z
    .object({
      /** Uppercase city label displayed next to the live monospace clock */
      city: z.string().min(1),
      /** Valid IANA time zone (e.g. "America/Los_Angeles", "Europe/London") */
      timeZone: z.string().refine(isValidIanaZone, {
        message: "Invalid IANA timeZone identifier",
      }),
      /** BCP 47 locale tag for time/weekday formatting */
      locale: z.string().default("en-US"),
    })
    .optional(),
  theme: z
    .object({
      /** Accent preset name or custom hex specification */
      accent: z
        .union([z.enum(PRESET_NAMES), customAccentSchema])
        .default("lime"),
      /** Initial color mode preference */
      defaultMode: z.enum(["light", "dark", "system"]).default("system"),
      /** Optional CSS font-family overrides (e.g. from next/font variables) */
      fonts: z
        .object({
          sans: z.string().optional(),
          hand: z.string().optional(),
          prose: z.string().optional(),
          mono: z.string().optional(),
        })
        .optional(),
    })
    .default({ accent: "lime", defaultMode: "system" }),
  nav: z
    .array(
      z.object({
        label: z.string().min(1),
        href: z.string().min(1),
      })
    )
    .default([
      { label: "projects", href: "/#projects" },
      { label: "blog", href: "/blog" },
    ]),
  socials: z
    .object({
      github: z.string().url().optional(),
      x: z.string().url().optional(),
      linkedin: z.string().url().optional(),
      email: z.string().email().optional(),
    })
    .default({}),
  seo: z
    .object({
      siteUrl: z.string().url().default("https://example.com"),
      ogImage: z.string().optional(),
    })
    .default({ siteUrl: "https://example.com" }),
});

export type SiteConfig = z.output<typeof siteConfigSchema>;
export type SiteConfigInput = z.input<typeof siteConfigSchema>;

export function defineSiteConfig(input: SiteConfigInput): SiteConfig {
  return siteConfigSchema.parse(input);
}

export type ResolvedAccent = {
  preset?: PresetName;
  hex: string;
  rgb: [number, number, number];
  wordmarkAlpha: number;
  ringAlpha: number;
  selectionAlpha: number;
};
