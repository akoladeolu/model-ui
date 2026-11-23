import { z } from 'zod';

type PresetName = "lime" | "cyan" | "amber" | "violet" | "mono";
interface AccentPreset {
    name: PresetName;
    label: string;
    hex: string;
    rgb: [number, number, number];
    /** Alpha for giant footer wordmark on dark #0d0e0e background */
    wordmarkAlpha: number;
    /** Alpha for focus-visible rings and status glow */
    ringAlpha: number;
    /** Alpha for text selection highlight */
    selectionAlpha: number;
}
declare const ACCENT_PRESETS: Record<PresetName, AccentPreset>;
declare const PRESET_NAMES: [PresetName, ...PresetName[]];
declare function parseHexToRgb(hex: string): [number, number, number];
/**
 * Relative luminance (WCAG) used to compute balanced wordmark alpha
 * when a custom hex accent is provided without explicit alphas.
 */
declare function relativeLuminance([r, g, b]: [number, number, number]): number;

declare function isValidIanaZone(tz: string): boolean;
declare const imageRefSchema: z.ZodObject<{
    src: z.ZodString;
    alt: z.ZodDefault<z.ZodString>;
    width: z.ZodOptional<z.ZodNumber>;
    height: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    src: string;
    alt: string;
    width?: number | undefined;
    height?: number | undefined;
}, {
    src: string;
    alt?: string | undefined;
    width?: number | undefined;
    height?: number | undefined;
}>;
type ImageRef = z.infer<typeof imageRefSchema>;
declare const customAccentSchema: z.ZodObject<{
    hex: z.ZodString;
    wordmarkAlpha: z.ZodOptional<z.ZodNumber>;
    ringAlpha: z.ZodOptional<z.ZodNumber>;
    selectionAlpha: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    hex: string;
    wordmarkAlpha?: number | undefined;
    ringAlpha?: number | undefined;
    selectionAlpha?: number | undefined;
}, {
    hex: string;
    wordmarkAlpha?: number | undefined;
    ringAlpha?: number | undefined;
    selectionAlpha?: number | undefined;
}>;
type CustomAccent = z.infer<typeof customAccentSchema>;
declare const siteConfigSchema: z.ZodObject<{
    brand: z.ZodObject<{
        /** Full brand or person name (e.g. "Elena Vance" or "Studio Apex") */
        name: z.ZodString;
        /** Short dock-tab & byline mark (e.g. "elena." or "apex.") */
        logo: z.ZodString;
        /** 1-3 character monogram for avatars and fallback banners (e.g. "EV") */
        monogram: z.ZodString;
        /** Giant footer wordmark text (max 12 graphemes so fit-to-width remains bold) */
        wordmark: z.ZodEffects<z.ZodString, string, string>;
        /** Hero tagline / role description */
        tagline: z.ZodString;
        /** Optional avatar image for the dock-tab nav */
        avatar: z.ZodOptional<z.ZodObject<{
            src: z.ZodString;
            alt: z.ZodDefault<z.ZodString>;
            width: z.ZodOptional<z.ZodNumber>;
            height: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            src: string;
            alt: string;
            width?: number | undefined;
            height?: number | undefined;
        }, {
            src: string;
            alt?: string | undefined;
            width?: number | undefined;
            height?: number | undefined;
        }>>;
        /** Optional footer headline override */
        footerHeadline: z.ZodDefault<z.ZodString>;
        /** Optional footer CTA label */
        footerCtaLabel: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        logo: string;
        monogram: string;
        wordmark: string;
        tagline: string;
        footerHeadline: string;
        footerCtaLabel: string;
        avatar?: {
            src: string;
            alt: string;
            width?: number | undefined;
            height?: number | undefined;
        } | undefined;
    }, {
        name: string;
        logo: string;
        monogram: string;
        wordmark: string;
        tagline: string;
        avatar?: {
            src: string;
            alt?: string | undefined;
            width?: number | undefined;
            height?: number | undefined;
        } | undefined;
        footerHeadline?: string | undefined;
        footerCtaLabel?: string | undefined;
    }>;
    location: z.ZodOptional<z.ZodObject<{
        /** Uppercase city label displayed next to the live monospace clock */
        city: z.ZodString;
        /** Valid IANA time zone (e.g. "America/Los_Angeles", "Europe/London") */
        timeZone: z.ZodEffects<z.ZodString, string, string>;
        /** BCP 47 locale tag for time/weekday formatting */
        locale: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        timeZone: string;
        city: string;
        locale: string;
    }, {
        timeZone: string;
        city: string;
        locale?: string | undefined;
    }>>;
    theme: z.ZodDefault<z.ZodObject<{
        /** Accent preset name or custom hex specification */
        accent: z.ZodDefault<z.ZodUnion<[z.ZodEnum<[PresetName, ...PresetName[]]>, z.ZodObject<{
            hex: z.ZodString;
            wordmarkAlpha: z.ZodOptional<z.ZodNumber>;
            ringAlpha: z.ZodOptional<z.ZodNumber>;
            selectionAlpha: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            hex: string;
            wordmarkAlpha?: number | undefined;
            ringAlpha?: number | undefined;
            selectionAlpha?: number | undefined;
        }, {
            hex: string;
            wordmarkAlpha?: number | undefined;
            ringAlpha?: number | undefined;
            selectionAlpha?: number | undefined;
        }>]>>;
        /** Initial color mode preference */
        defaultMode: z.ZodDefault<z.ZodEnum<["light", "dark", "system"]>>;
        /** Optional CSS font-family overrides (e.g. from next/font variables) */
        fonts: z.ZodOptional<z.ZodObject<{
            sans: z.ZodOptional<z.ZodString>;
            hand: z.ZodOptional<z.ZodString>;
            prose: z.ZodOptional<z.ZodString>;
            mono: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            mono?: string | undefined;
            sans?: string | undefined;
            hand?: string | undefined;
            prose?: string | undefined;
        }, {
            mono?: string | undefined;
            sans?: string | undefined;
            hand?: string | undefined;
            prose?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        accent: PresetName | {
            hex: string;
            wordmarkAlpha?: number | undefined;
            ringAlpha?: number | undefined;
            selectionAlpha?: number | undefined;
        };
        defaultMode: "light" | "dark" | "system";
        fonts?: {
            mono?: string | undefined;
            sans?: string | undefined;
            hand?: string | undefined;
            prose?: string | undefined;
        } | undefined;
    }, {
        accent?: PresetName | {
            hex: string;
            wordmarkAlpha?: number | undefined;
            ringAlpha?: number | undefined;
            selectionAlpha?: number | undefined;
        } | undefined;
        defaultMode?: "light" | "dark" | "system" | undefined;
        fonts?: {
            mono?: string | undefined;
            sans?: string | undefined;
            hand?: string | undefined;
            prose?: string | undefined;
        } | undefined;
    }>>;
    nav: z.ZodDefault<z.ZodArray<z.ZodObject<{
        label: z.ZodString;
        href: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        label: string;
        href: string;
    }, {
        label: string;
        href: string;
    }>, "many">>;
    socials: z.ZodDefault<z.ZodObject<{
        github: z.ZodOptional<z.ZodString>;
        x: z.ZodOptional<z.ZodString>;
        linkedin: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        github?: string | undefined;
        x?: string | undefined;
        linkedin?: string | undefined;
        email?: string | undefined;
    }, {
        github?: string | undefined;
        x?: string | undefined;
        linkedin?: string | undefined;
        email?: string | undefined;
    }>>;
    seo: z.ZodDefault<z.ZodObject<{
        siteUrl: z.ZodDefault<z.ZodString>;
        ogImage: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        siteUrl: string;
        ogImage?: string | undefined;
    }, {
        siteUrl?: string | undefined;
        ogImage?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    brand: {
        name: string;
        logo: string;
        monogram: string;
        wordmark: string;
        tagline: string;
        footerHeadline: string;
        footerCtaLabel: string;
        avatar?: {
            src: string;
            alt: string;
            width?: number | undefined;
            height?: number | undefined;
        } | undefined;
    };
    theme: {
        accent: PresetName | {
            hex: string;
            wordmarkAlpha?: number | undefined;
            ringAlpha?: number | undefined;
            selectionAlpha?: number | undefined;
        };
        defaultMode: "light" | "dark" | "system";
        fonts?: {
            mono?: string | undefined;
            sans?: string | undefined;
            hand?: string | undefined;
            prose?: string | undefined;
        } | undefined;
    };
    nav: {
        label: string;
        href: string;
    }[];
    socials: {
        github?: string | undefined;
        x?: string | undefined;
        linkedin?: string | undefined;
        email?: string | undefined;
    };
    seo: {
        siteUrl: string;
        ogImage?: string | undefined;
    };
    location?: {
        timeZone: string;
        city: string;
        locale: string;
    } | undefined;
}, {
    brand: {
        name: string;
        logo: string;
        monogram: string;
        wordmark: string;
        tagline: string;
        avatar?: {
            src: string;
            alt?: string | undefined;
            width?: number | undefined;
            height?: number | undefined;
        } | undefined;
        footerHeadline?: string | undefined;
        footerCtaLabel?: string | undefined;
    };
    location?: {
        timeZone: string;
        city: string;
        locale?: string | undefined;
    } | undefined;
    theme?: {
        accent?: PresetName | {
            hex: string;
            wordmarkAlpha?: number | undefined;
            ringAlpha?: number | undefined;
            selectionAlpha?: number | undefined;
        } | undefined;
        defaultMode?: "light" | "dark" | "system" | undefined;
        fonts?: {
            mono?: string | undefined;
            sans?: string | undefined;
            hand?: string | undefined;
            prose?: string | undefined;
        } | undefined;
    } | undefined;
    nav?: {
        label: string;
        href: string;
    }[] | undefined;
    socials?: {
        github?: string | undefined;
        x?: string | undefined;
        linkedin?: string | undefined;
        email?: string | undefined;
    } | undefined;
    seo?: {
        siteUrl?: string | undefined;
        ogImage?: string | undefined;
    } | undefined;
}>;
type SiteConfig = z.output<typeof siteConfigSchema>;
type SiteConfigInput = z.input<typeof siteConfigSchema>;
declare function defineSiteConfig(input: SiteConfigInput): SiteConfig;
type ResolvedAccent = {
    preset?: PresetName;
    hex: string;
    rgb: [number, number, number];
    wordmarkAlpha: number;
    ringAlpha: number;
    selectionAlpha: number;
};

declare function resolveAccent(accent: PresetName | CustomAccent): ResolvedAccent;
declare function toCssVars(config: SiteConfig): Record<string, string>;
declare function toCssVarStyleText(config: SiteConfig): string;

export { ACCENT_PRESETS, type AccentPreset, type CustomAccent, type ImageRef, PRESET_NAMES, type PresetName, type ResolvedAccent, type SiteConfig, type SiteConfigInput, customAccentSchema, defineSiteConfig, imageRefSchema, isValidIanaZone, parseHexToRgb, relativeLuminance, resolveAccent, siteConfigSchema, toCssVarStyleText, toCssVars };
