# Model UI (`model-ui`) — AI Agent Specification

Follow these rules whenever you build, extend, or restyle a React / Next.js application using **Model UI** (`model-ui`).

---

## 1. Ten Non-Negotiable Aesthetic Rules

1. **Hierarchy is opacity, never hue.** Use the 11-step ink opacity ramp (`--t-ink-3` through `--t-ink-80`) on paper (`--t-bg: #efefef`, `--t-bg-reading: #fbfbfb` in light mode; `#0d0e0e` and `#111212` in dark mode). Never invent gray hex codes.
2. **Strict Accent Restraint.** `--t-brand-accent` and its alpha derivatives (`--t-brand-accent-wordmark`, `--t-brand-accent-ring`, `--t-brand-accent-selection`) are ONLY used on:
   - The giant cropped footer `<Wordmark />`
   - The `<Clock />` status dot
   - `::selection` text highlight
   - `:focus-visible` keyboard focus rings
   **Never** color buttons, pills, headings, or cards with the brand accent.
3. **Config travels as props + server CSS vars, never React Context.** Pass `config: SiteConfig` from `site.config.ts` directly into `<ThemeStyle config={config} />` and template/block props so layout and content remain Server Components.
4. **Two canvas surfaces.** Home (`/`) and Case Studies (`/projects/[slug]`) use warm paper (`surface="paper"` / `--t-bg`). Blog Index (`/blog`) and Blog Articles (`/blog/[slug]`) use brighter reading paper (`surface="reading"` / `--t-bg-reading`).
5. **Two vertical dashed rail widths.** Home and Blog pages use narrow rails (`rails="narrow"`, `25rem` inset). Case Study pages use wide rails (`rails="wide"`, `10rem` inset) around an `896px` column.
6. **Three type voices, never mixed.**
   - `--t-font-sans` (`-0.3px` body tracking; `-0.06em` display tracking with `0.8` line-height)
   - `--t-font-hand` (`Caveat`, used via `<Statement>`, `<ScriptHeading>`, and `.t-blog-hero__title`)
   - `--t-font-prose` (`Piazzolla`, used inside `<Prose>` article headings)
7. **Tactile physical objects.** Inline `<Sticker>` icons sit mid-sentence at `-7deg` rotation with a `3px` frame border. `<Polaroids>` fan from `-10deg` to `+8deg` and un-tilt on hover with word-by-word blur-reveal pill captions. Project cards sit inside inset wells (`.t-card__well`) that round from `0px` to `24px` (`1.5rem`) on hover.
8. **Hatched section dividers.** Separate major home sections with `<HatchDivider />` (`64px` tall, `-45deg` 1px hatch between horizontal long-dash rules).
9. **Fit-to-width footer wordmark.** Always render the footer watermark with `<Wordmark text={config.brand.wordmark} />`, which sets `--chars` to the grapheme count and scales cleanly up to 12 characters using `calc(96cqi / (var(--chars) * 0.56))`.
10. **Zero-flash Dark Mode.** Always place `<ThemeStyle config={siteConfig} />` in `<head>` and wrap `<body>` children in `<ThemeProvider>` from `model-ui/client`.

---

## 2. Entry Points & Component Selector

- **`model-ui`** (Server-safe entry point):
  - **Config**: `defineSiteConfig`, `siteConfigSchema`, `ACCENT_PRESETS`, `resolveAccent`, `toCssVars`, `toCssVarStyleText`
  - **Primitives**: `ThemeStyle`, `Page`, `Column`, `Rails`, `Section`, `HatchDivider`, `Button`, `Pill`, `Chip`, `Badge`, `Eyebrow`, `Display`, `ScriptHeading`, `MonoMeta`, `Prose`, `Panel`, `Sticker`, `Wordmark`
  - **Blocks**: `SiteShell`, `DockNav`, `Hero`, `ArcGallery`, `Statement`, `Polaroids`, `ContributionHeatmap`, `PostList`, `Footer`, `Pagination`
  - **Templates**: `HomeTemplate`, `BlogIndexTemplate`, `BlogPostTemplate`, `CaseStudyTemplate`
- **`model-ui/client`** (`"use client"` islands):
  - `ThemeProvider`, `ThemeToggle`, `useTheme`
  - `Clock` (hydration-safe IANA timezone ticker)
  - `SegmentedFilter`, `FilterPills`, `FilterableProjectGrid`, `FilterableBlogFeed`
  - `ActionOrbs`, `EngageBar`, `ShareModal`, `CommentThread`, `ArticleInteractiveShell`
- **`model-ui/styles.css`**: Full token + component stylesheet (`.t-*` namespace).
- **`model-ui/tailwind.css`**: Optional Tailwind CSS v4 `@theme` layer.

---

## 3. Canonical Page Recipes

### A. Home Page (`app/page.tsx`)
```tsx
import { HomeTemplate } from "model-ui";
import { siteConfig } from "@/site.config";
import { projects, posts } from "@/content/data";

export default function Page() {
  return <HomeTemplate config={siteConfig} projects={projects} posts={posts} />;
}
```

### B. Blog Index (`app/blog/page.tsx`)
```tsx
import { BlogIndexTemplate } from "model-ui";
import { siteConfig } from "@/site.config";
import { posts } from "@/content/data";

export default function BlogIndex() {
  return <BlogIndexTemplate config={siteConfig} posts={posts} />;
}
```

### C. Blog Post Article (`app/blog/[slug]/page.tsx`)
```tsx
import { BlogPostTemplate } from "model-ui";
import { siteConfig } from "@/site.config";

export default function BlogPost({ post, comments }) {
  return (
    <BlogPostTemplate config={siteConfig} post={post} comments={comments}>
      <p>Rich text or MDX children...</p>
    </BlogPostTemplate>
  );
}
```

### D. Project Case Study (`app/projects/[slug]/page.tsx`)
```tsx
import { CaseStudyTemplate } from "model-ui";
import { siteConfig } from "@/site.config";

export default function CaseStudy({ project }) {
  return <CaseStudyTemplate config={siteConfig} project={project} />;
}
```

---

## 4. Anti-Patterns (Never Do These)

- **Do not** hardcode brand names, cities, timezones, or `#bef264` in components or templates; read from `SiteConfig`.
- **Do not** apply `--t-brand-accent` to buttons, badges, or cards.
- **Do not** render `new Date().toLocaleString()` directly during SSR in a Server Component — use `<Clock />` from `model-ui/client`.
- **Do not** use `Math.random()` inside Server Components (e.g. `<ContributionHeatmap />` uses a deterministic hash).
