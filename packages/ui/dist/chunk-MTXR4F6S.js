// src/config/presets.ts
var ACCENT_PRESETS = {
  lime: {
    name: "lime",
    label: "Signature Lime",
    hex: "#bef264",
    rgb: [190, 242, 100],
    wordmarkAlpha: 0.3,
    ringAlpha: 0.55,
    selectionAlpha: 0.25
  },
  cyan: {
    name: "cyan",
    label: "Electric Cyan",
    hex: "#22d3ee",
    rgb: [34, 211, 238],
    wordmarkAlpha: 0.26,
    ringAlpha: 0.5,
    selectionAlpha: 0.22
  },
  amber: {
    name: "amber",
    label: "Sunset Amber",
    hex: "#fbbf24",
    rgb: [251, 191, 36],
    wordmarkAlpha: 0.26,
    ringAlpha: 0.55,
    selectionAlpha: 0.24
  },
  violet: {
    name: "violet",
    label: "Neo Violet",
    hex: "#a78bfa",
    rgb: [167, 139, 250],
    wordmarkAlpha: 0.34,
    ringAlpha: 0.5,
    selectionAlpha: 0.24
  },
  mono: {
    name: "mono",
    label: "Studio Monochrome",
    hex: "#ffffff",
    rgb: [255, 255, 255],
    wordmarkAlpha: 0.14,
    ringAlpha: 0.35,
    selectionAlpha: 0.16
  }
};
var PRESET_NAMES = Object.keys(ACCENT_PRESETS);
function parseHexToRgb(hex) {
  const clean = hex.trim().replace(/^#/, "");
  if (clean.length === 3) {
    const r2 = parseInt(clean[0] + clean[0], 16);
    const g2 = parseInt(clean[1] + clean[1], 16);
    const b2 = parseInt(clean[2] + clean[2], 16);
    return [r2, g2, b2];
  }
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return [r, g, b];
}
function relativeLuminance([r, g, b]) {
  const toLinear = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

// src/config/schema.ts
import { z } from "zod";
function isValidIanaZone(tz) {
  try {
    Intl.DateTimeFormat(void 0, { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}
var imageRefSchema = z.object({
  src: z.string().min(1),
  alt: z.string().default(""),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional()
});
var customAccentSchema = z.object({
  hex: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Expected a valid 3 or 6 digit hex color (e.g. #22d3ee)"),
  wordmarkAlpha: z.number().min(0.05).max(1).optional(),
  ringAlpha: z.number().min(0.1).max(1).optional(),
  selectionAlpha: z.number().min(0.05).max(1).optional()
});
var siteConfigSchema = z.object({
  brand: z.object({
    /** Full brand or person name (e.g. "Elena Vance" or "Studio Apex") */
    name: z.string().min(1, "Brand name is required"),
    /** Short dock-tab & byline mark (e.g. "elena." or "apex.") */
    logo: z.string().min(1, "Brand logo text is required"),
    /** 1-3 character monogram for avatars and fallback banners (e.g. "EV") */
    monogram: z.string().min(1).max(3, "Monogram must be at most 3 characters"),
    /** Giant footer wordmark text (max 12 graphemes so fit-to-width remains bold) */
    wordmark: z.string().min(1).refine((s) => [...s].length <= 12, {
      message: "Wordmark must be 12 characters or fewer"
    }),
    /** Hero tagline / role description */
    tagline: z.string().min(1),
    /** Optional avatar image for the dock-tab nav */
    avatar: imageRefSchema.optional(),
    /** Optional footer headline override */
    footerHeadline: z.string().default("Let's build something people actually use."),
    /** Optional footer CTA label */
    footerCtaLabel: z.string().default("Get in touch")
  }),
  location: z.object({
    /** Uppercase city label displayed next to the live monospace clock */
    city: z.string().min(1),
    /** Valid IANA time zone (e.g. "America/Los_Angeles", "Europe/London") */
    timeZone: z.string().refine(isValidIanaZone, {
      message: "Invalid IANA timeZone identifier"
    }),
    /** BCP 47 locale tag for time/weekday formatting */
    locale: z.string().default("en-US")
  }).optional(),
  theme: z.object({
    /** Accent preset name or custom hex specification */
    accent: z.union([z.enum(PRESET_NAMES), customAccentSchema]).default("lime"),
    /** Initial color mode preference */
    defaultMode: z.enum(["light", "dark", "system"]).default("system"),
    /** Optional CSS font-family overrides (e.g. from next/font variables) */
    fonts: z.object({
      sans: z.string().optional(),
      hand: z.string().optional(),
      prose: z.string().optional(),
      mono: z.string().optional()
    }).optional()
  }).default({ accent: "lime", defaultMode: "system" }),
  nav: z.array(
    z.object({
      label: z.string().min(1),
      href: z.string().min(1)
    })
  ).default([
    { label: "projects", href: "/#projects" },
    { label: "blog", href: "/blog" }
  ]),
  socials: z.object({
    github: z.string().url().optional(),
    x: z.string().url().optional(),
    linkedin: z.string().url().optional(),
    email: z.string().email().optional()
  }).default({}),
  seo: z.object({
    siteUrl: z.string().url().default("https://example.com"),
    ogImage: z.string().optional()
  }).default({ siteUrl: "https://example.com" })
});
function defineSiteConfig(input) {
  return siteConfigSchema.parse(input);
}

// src/config/to-css-vars.ts
function resolveAccent(accent) {
  if (typeof accent === "string") {
    const preset = ACCENT_PRESETS[accent];
    return {
      preset: preset.name,
      hex: preset.hex,
      rgb: preset.rgb,
      wordmarkAlpha: preset.wordmarkAlpha,
      ringAlpha: preset.ringAlpha,
      selectionAlpha: preset.selectionAlpha
    };
  }
  const rgb = parseHexToRgb(accent.hex);
  const lum = relativeLuminance(rgb);
  const autoWordmarkAlpha = lum > 0.85 ? 0.16 : lum > 0.55 ? 0.26 : lum > 0.25 ? 0.34 : 0.44;
  const autoRingAlpha = lum > 0.85 ? 0.38 : 0.52;
  const autoSelectionAlpha = lum > 0.85 ? 0.18 : 0.24;
  return {
    hex: accent.hex,
    rgb,
    wordmarkAlpha: accent.wordmarkAlpha ?? autoWordmarkAlpha,
    ringAlpha: accent.ringAlpha ?? autoRingAlpha,
    selectionAlpha: accent.selectionAlpha ?? autoSelectionAlpha
  };
}
function toCssVars(config) {
  const resolved = resolveAccent(config.theme.accent);
  const [r, g, b] = resolved.rgb;
  const vars = {
    "--t-brand-accent": resolved.hex,
    "--t-brand-accent-rgb": `${r} ${g} ${b}`,
    "--t-brand-accent-wordmark": `rgb(${r} ${g} ${b} / ${resolved.wordmarkAlpha})`,
    "--t-brand-accent-ring": `rgb(${r} ${g} ${b} / ${resolved.ringAlpha})`,
    "--t-brand-accent-selection": `rgb(${r} ${g} ${b} / ${resolved.selectionAlpha})`,
    "--t-accent": `rgb(${r} ${g} ${b} / ${resolved.wordmarkAlpha})`
  };
  const fonts = config.theme.fonts;
  if (fonts?.sans) vars["--t-font-sans"] = fonts.sans;
  if (fonts?.hand) vars["--t-font-hand"] = fonts.hand;
  if (fonts?.prose) vars["--t-font-prose"] = fonts.prose;
  if (fonts?.mono) vars["--t-font-mono"] = fonts.mono;
  return vars;
}
function toCssVarStyleText(config) {
  const vars = toCssVars(config);
  const entries = Object.entries(vars).map(([k, v]) => `  ${k}: ${v};`).join("\n");
  return `:root {
${entries}
}`;
}

export {
  ACCENT_PRESETS,
  PRESET_NAMES,
  parseHexToRgb,
  relativeLuminance,
  isValidIanaZone,
  imageRefSchema,
  customAccentSchema,
  siteConfigSchema,
  defineSiteConfig,
  resolveAccent,
  toCssVars,
  toCssVarStyleText
};
//# sourceMappingURL=chunk-MTXR4F6S.js.map