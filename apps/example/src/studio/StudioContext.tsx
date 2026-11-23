"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useSearchParams } from "next/navigation";
import {
  defineSiteConfig,
  siteConfigSchema,
  toCssVars,
  type PresetName,
  type Project,
  type Post,
  type SiteConfig,
} from "model-ui";
import { BRAND_PROFILES, siteConfig as defaultBaseConfig } from "@/site.config";
import { posts as defaultPosts, projects as defaultProjects } from "@/content/data";

const STORAGE_KEY = "model-ui-studio-v1";

export interface DraftHero {
  headlineLead: string;
  headlineMuted: string;
  headlineTail: string;
  sublineMuted: string;
  sublineInk: string;
  statementText: string;
}

export interface StudioPost extends Post {
  bodyParagraphs: string[];
}

export interface DraftBrand {
  name: string;
  logo: string;
  monogram: string;
  wordmark: string;
  tagline: string;
  footerHeadline: string;
  footerCtaLabel: string;
}

export interface DraftLocation {
  enabled: boolean;
  city: string;
  timeZone: string;
  locale: string;
}

export interface DraftTheme {
  accentMode: "preset" | "custom";
  preset: PresetName;
  customHex: string;
  defaultMode: "light" | "dark" | "system";
}

export interface DraftSocials {
  github: string;
  x: string;
  linkedin: string;
  email: string;
}

export interface StudioContextValue {
  isHydrated: boolean;
  studioEnabled: boolean;
  activePersona: "apex" | "elena" | "kuro" | "custom";
  isCustomized: boolean;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  activeTab: "brand" | "location" | "content" | "export";
  setActiveTab: (tab: "brand" | "location" | "content" | "export") => void;

  draftBrand: DraftBrand;
  draftLocation: DraftLocation;
  draftTheme: DraftTheme;
  draftSocials: DraftSocials;
  hero: DraftHero;
  projects: Project[];
  posts: StudioPost[];

  validConfig: SiteConfig;
  fieldErrors: Record<string, string | undefined>;

  loadPersona: (persona: "apex" | "elena" | "kuro") => void;
  updateDraftBrand: (partial: Partial<DraftBrand>) => void;
  updateDraftLocation: (partial: Partial<DraftLocation>) => void;
  updateDraftTheme: (partial: Partial<DraftTheme>) => void;
  updateDraftSocials: (partial: Partial<DraftSocials>) => void;
  updateHero: (partial: Partial<DraftHero>) => void;
  updateProject: (slug: string, updated: Partial<Project>) => void;
  updatePost: (slug: string, updated: Partial<StudioPost>) => void;
  resetToPersona: (persona?: "apex" | "elena" | "kuro") => void;
}

const StudioContext = createContext<StudioContextValue | null>(null);

const DEFAULT_HERO: DraftHero = {
  headlineLead: "studio apex... ",
  headlineMuted: "builds",
  headlineTail: " systems.",
  sublineMuted: "&",
  sublineInk: " interfaces",
  statementText:
    "lowercase, always. ink fades instead of changing colour. the handwriting is where the personality lives, and things you can touch get a little tilt. the colour is hiding in the footer.",
};

const DEFAULT_POST_PARAGRAPHS: Record<string, string[]> = {
  "thinking-like-a-systems-builder": [
    "okay, before anybody starts fighting me, i still love interface work.",
    "i love clean interfaces, stupidly good spacing, typography that actually feels intentional, smooth motion, tiny hover states nobody asked for, and spending 45 minutes moving something 4px to the left because “something feels off.”",
    "moving from isolated components to end-to-end systems is where the craft compounds. not because UI is boring — it's because the interface is only one half of the loop.",
    "that's the shift: caring about the whole thing from the database schema to the 300ms hover curve.",
  ],
  "why-monochrome-interfaces-feel-calmer": [
    "when every component fights for attention with a different accent hue, nothing feels tactile. stripping a system down to one ink and an 11-step opacity ramp forces spacing, elevation, and motion to do the real work.",
    "monochrome paper interfaces don't bore the user; they create breathing room so actual content and tactile moments stand out with quiet confidence.",
  ],
};

function initialPosts(): StudioPost[] {
  return defaultPosts.map((p) => ({
    ...p,
    bodyParagraphs: DEFAULT_POST_PARAGRAPHS[p.slug] ?? [p.description],
  }));
}

function personaToDraft(cfg: SiteConfig): {
  draftBrand: DraftBrand;
  draftLocation: DraftLocation;
  draftTheme: DraftTheme;
  draftSocials: DraftSocials;
} {
  const accent = cfg.theme.accent;
  const isCustomHex = typeof accent !== "string";
  return {
    draftBrand: {
      name: cfg.brand.name,
      logo: cfg.brand.logo,
      monogram: cfg.brand.monogram,
      wordmark: cfg.brand.wordmark,
      tagline: cfg.brand.tagline,
      footerHeadline:
        cfg.brand.footerHeadline ?? "Let's build something people actually use.",
      footerCtaLabel: cfg.brand.footerCtaLabel ?? "Get in touch",
    },
    draftLocation: {
      enabled: Boolean(cfg.location),
      city: cfg.location?.city ?? "LONDON",
      timeZone: cfg.location?.timeZone ?? "Europe/London",
      locale: cfg.location?.locale ?? "en-GB",
    },
    draftTheme: {
      accentMode: isCustomHex ? "custom" : "preset",
      preset: isCustomHex ? "cyan" : (accent as PresetName),
      customHex: isCustomHex ? accent.hex : "#22d3ee",
      defaultMode: cfg.theme.defaultMode ?? "system",
    },
    draftSocials: {
      github: cfg.socials.github ?? "",
      x: cfg.socials.x ?? "",
      linkedin: cfg.socials.linkedin ?? "",
      email: cfg.socials.email ?? "",
    },
  };
}

export function StudioProvider({
  initialConfig,
  children,
}: {
  initialConfig?: SiteConfig;
  children: ReactNode;
}) {
  const searchParams = useSearchParams();
  const baseConfig = initialConfig ?? defaultBaseConfig;

  const studioOff = searchParams?.get("studio") === "off";
  const urlBrand = searchParams?.get("brand");
  const urlPreset = searchParams?.get("preset") as PresetName | null;
  const urlMode = searchParams?.get("mode") as "light" | "dark" | null;

  const initialDrafts = useMemo(() => {
    let chosen = baseConfig;
    if (urlBrand && BRAND_PROFILES[urlBrand]) {
      chosen = BRAND_PROFILES[urlBrand];
    }
    const d = personaToDraft(chosen);
    if (urlPreset) d.draftTheme.preset = urlPreset;
    if (urlMode) d.draftTheme.defaultMode = urlMode;
    return d;
  }, [baseConfig, urlBrand, urlPreset, urlMode]);

  const [isHydrated, setIsHydrated] = useState(false);
  const [activePersona, setActivePersona] = useState<
    "apex" | "elena" | "kuro" | "custom"
  >(urlBrand === "elena" || urlBrand === "kuro" ? urlBrand : "apex");
  const [isCustomized, setIsCustomized] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "brand" | "location" | "content" | "export"
  >("brand");

  const [draftBrand, setDraftBrand] = useState<DraftBrand>(
    initialDrafts.draftBrand
  );
  const [draftLocation, setDraftLocation] = useState<DraftLocation>(
    initialDrafts.draftLocation
  );
  const [draftTheme, setDraftTheme] = useState<DraftTheme>(
    initialDrafts.draftTheme
  );
  const [draftSocials, setDraftSocials] = useState<DraftSocials>(
    initialDrafts.draftSocials
  );
  const [hero, setHero] = useState<DraftHero>(DEFAULT_HERO);
  const [projectsList, setProjectsList] = useState<Project[]>(defaultProjects);
  const [postsList, setPostsList] = useState<StudioPost[]>(initialPosts());

  const [validConfig, setValidConfig] = useState<SiteConfig>(baseConfig);
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string | undefined>
  >({});

  // Validate draft inputs through siteConfigSchema.safeParse without throwing
  const validateDraft = useCallback(
    (
      b: DraftBrand,
      l: DraftLocation,
      t: DraftTheme,
      s: DraftSocials
    ): { valid: SiteConfig | null; errors: Record<string, string> } => {
      const rawConfig: Record<string, unknown> = {
        brand: {
          name: b.name.trim(),
          logo: b.logo.trim(),
          monogram: b.monogram.trim(),
          wordmark: b.wordmark.trim(),
          tagline: b.tagline.trim(),
          footerHeadline: b.footerHeadline.trim(),
          footerCtaLabel: b.footerCtaLabel.trim(),
        },
        theme: {
          accent:
            t.accentMode === "custom"
              ? { hex: t.customHex.trim() }
              : t.preset,
          defaultMode: t.defaultMode,
        },
        nav: [
          { label: "projects", href: "/#projects" },
          { label: "blog", href: "/blog" },
          { label: "case study", href: "/projects/helix" },
        ],
        socials: {
          github: s.github.trim() || undefined,
          x: s.x.trim() || undefined,
          linkedin: s.linkedin.trim() || undefined,
          email: s.email.trim() || undefined,
        },
        seo: {
          siteUrl: "https://example.com",
        },
      };

      if (l.enabled) {
        rawConfig.location = {
          city: l.city.trim().toUpperCase(),
          timeZone: l.timeZone.trim(),
          locale: l.locale.trim() || "en-US",
        };
      }

      const parsed = siteConfigSchema.safeParse(rawConfig);
      if (parsed.success) {
        return { valid: parsed.data, errors: {} };
      }

      const errMap: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const pathStr = issue.path.join(".");
        if (!errMap[pathStr]) {
          errMap[pathStr] = issue.message;
        }
      }
      return { valid: null, errors: errMap };
    },
    []
  );

  // Restore from localStorage on client mount if available
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw && !urlBrand) {
        const saved = JSON.parse(raw);
        if (saved && typeof saved === "object") {
          if (saved.draftBrand) setDraftBrand(saved.draftBrand);
          if (saved.draftLocation) setDraftLocation(saved.draftLocation);
          if (saved.draftTheme) setDraftTheme(saved.draftTheme);
          if (saved.draftSocials) setDraftSocials(saved.draftSocials);
          if (saved.hero) setHero(saved.hero);
          if (saved.projects) setProjectsList(saved.projects);
          if (saved.posts) setPostsList(saved.posts);
          if (saved.activePersona) setActivePersona(saved.activePersona);
          if (saved.isCustomized !== undefined)
            setIsCustomized(saved.isCustomized);

          const { valid } = validateDraft(
            saved.draftBrand ?? initialDrafts.draftBrand,
            saved.draftLocation ?? initialDrafts.draftLocation,
            saved.draftTheme ?? initialDrafts.draftTheme,
            saved.draftSocials ?? initialDrafts.draftSocials
          );
          if (valid) setValidConfig(valid);
        }
      }
    } catch {
      // ignore JSON parse errors
    }
    setIsHydrated(true);
  }, [urlBrand, initialDrafts, validateDraft]);

  // Validate on draft changes and update validConfig + CSS vars
  useEffect(() => {
    const { valid, errors } = validateDraft(
      draftBrand,
      draftLocation,
      draftTheme,
      draftSocials
    );
    setFieldErrors(errors);
    if (valid) {
      setValidConfig(valid);
      if (typeof document !== "undefined") {
        const cssVars = toCssVars(valid);
        const root = document.documentElement;
        for (const [k, v] of Object.entries(cssVars)) {
          root.style.setProperty(k, v);
        }
      }
    }
  }, [draftBrand, draftLocation, draftTheme, draftSocials, validateDraft]);

  // Persist to localStorage whenever custom edits are made
  useEffect(() => {
    if (!isHydrated) return;
    try {
      const payload = {
        activePersona,
        isCustomized,
        draftBrand,
        draftLocation,
        draftTheme,
        draftSocials,
        hero,
        projects: projectsList,
        posts: postsList,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // quota errors
    }
  }, [
    isHydrated,
    activePersona,
    isCustomized,
    draftBrand,
    draftLocation,
    draftTheme,
    draftSocials,
    hero,
    projectsList,
    postsList,
  ]);

  const loadPersona = useCallback((persona: "apex" | "elena" | "kuro") => {
    const profile = BRAND_PROFILES[persona];
    if (!profile) return;
    const d = personaToDraft(profile);
    setDraftBrand(d.draftBrand);
    setDraftLocation(d.draftLocation);
    setDraftTheme(d.draftTheme);
    setDraftSocials(d.draftSocials);
    setActivePersona(persona);
    setIsCustomized(false);
    setHero({
      headlineLead: `${profile.brand.name.toLowerCase()}... `,
      headlineMuted: persona === "elena" ? "architects" : "builds",
      headlineTail: persona === "elena" ? " infrastructure." : " systems.",
      sublineMuted: "&",
      sublineInk: persona === "kuro" ? " quiet spaces" : " interfaces",
      statementText:
        persona === "kuro"
          ? "minimalist typography, quiet spaces, and tactile monochrome rhythm."
          : persona === "elena"
          ? "resilient distributed systems, clear schemas, and tactile interfaces."
          : DEFAULT_HERO.statementText,
    });
    setProjectsList(defaultProjects);
    setPostsList(initialPosts());
  }, []);

  const resetToPersona = useCallback(
    (persona: "apex" | "elena" | "kuro" = "apex") => {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
      loadPersona(persona);
    },
    [loadPersona]
  );

  const updateDraftBrand = useCallback((partial: Partial<DraftBrand>) => {
    setDraftBrand((prev) => ({ ...prev, ...partial }));
    setIsCustomized(true);
    setActivePersona("custom");
  }, []);

  const updateDraftLocation = useCallback(
    (partial: Partial<DraftLocation>) => {
      setDraftLocation((prev) => ({ ...prev, ...partial }));
      setIsCustomized(true);
      setActivePersona("custom");
    },
    []
  );

  const updateDraftTheme = useCallback((partial: Partial<DraftTheme>) => {
    setDraftTheme((prev) => ({ ...prev, ...partial }));
    setIsCustomized(true);
    setActivePersona("custom");
  }, []);

  const updateDraftSocials = useCallback((partial: Partial<DraftSocials>) => {
    setDraftSocials((prev) => ({ ...prev, ...partial }));
    setIsCustomized(true);
    setActivePersona("custom");
  }, []);

  const updateHero = useCallback((partial: Partial<DraftHero>) => {
    setHero((prev) => ({ ...prev, ...partial }));
    setIsCustomized(true);
    setActivePersona("custom");
  }, []);

  const updateProject = useCallback(
    (slug: string, updated: Partial<Project>) => {
      setProjectsList((prev) =>
        prev.map((p) => (p.slug === slug ? { ...p, ...updated } : p))
      );
      setIsCustomized(true);
      setActivePersona("custom");
    },
    []
  );

  const updatePost = useCallback(
    (slug: string, updated: Partial<StudioPost>) => {
      setPostsList((prev) =>
        prev.map((p) => (p.slug === slug ? { ...p, ...updated } : p))
      );
      setIsCustomized(true);
      setActivePersona("custom");
    },
    []
  );

  const value = useMemo<StudioContextValue>(
    () => ({
      isHydrated,
      studioEnabled: !studioOff,
      activePersona,
      isCustomized,
      drawerOpen,
      setDrawerOpen,
      activeTab,
      setActiveTab,
      draftBrand,
      draftLocation,
      draftTheme,
      draftSocials,
      hero,
      projects: projectsList,
      posts: postsList,
      validConfig,
      fieldErrors,
      loadPersona,
      updateDraftBrand,
      updateDraftLocation,
      updateDraftTheme,
      updateDraftSocials,
      updateHero,
      updateProject,
      updatePost,
      resetToPersona,
    }),
    [
      isHydrated,
      studioOff,
      activePersona,
      isCustomized,
      drawerOpen,
      activeTab,
      draftBrand,
      draftLocation,
      draftTheme,
      draftSocials,
      hero,
      projectsList,
      postsList,
      validConfig,
      fieldErrors,
      loadPersona,
      updateDraftBrand,
      updateDraftLocation,
      updateDraftTheme,
      updateDraftSocials,
      updateHero,
      updateProject,
      updatePost,
      resetToPersona,
    ]
  );

  return (
    <StudioContext.Provider value={value}>{children}</StudioContext.Provider>
  );
}

export function useStudio() {
  const ctx = useContext(StudioContext);
  if (!ctx) {
    throw new Error("useStudio must be used within a StudioProvider");
  }
  return ctx;
}
