# Model UI (`model-ui`)

A config-driven, paper-and-ink React / Next.js design system for **AI agents and humans**.

Model UI pairs a tactile monochrome surface (`#efefef` paper, `#fbfbfb` reading canvas, `#0d0e0e` dark stage, and an 11-step ink opacity ramp) with a typed `defineSiteConfig` layer, zero-flash built-in Dark Mode, luminance-balanced accent presets, and 4 complete page templates (**Home**, **Blog Index**, **Blog Post Article**, and **Project Case Study**).

---

## Package Structure

```text
model-ui/
├─ packages/ui/               # "model-ui" npm / GitHub package
│  ├─ src/config/             # Zod schema, defineSiteConfig, 5 accent presets, toCssVars
│  ├─ src/primitives/         # ThemeStyle, Page, Column, Rails, Section, HatchDivider, Button, Pill, Chip, Badge, Prose, Wordmark
│  ├─ src/blocks/             # SiteShell, DockNav, Hero, ArcGallery, Statement, Polaroids, ContributionHeatmap, PostList, Footer, Pagination
│  ├─ src/templates/          # HomeTemplate, BlogIndexTemplate, BlogPostTemplate, CaseStudyTemplate
│  ├─ src/client/             # "use client" islands: ThemeProvider, ThemeToggle, Clock, SegmentedFilter, FilterPills, ActionOrbs, ShareModal, CommentThread
│  ├─ src/styles/             # tokens.css, model.css, tailwind.theme.css
│  └─ src/fonts/              # Bundled Caveat & Piazzolla variable fonts
├─ apps/example/              # Next.js App Router demo app & visual test target
├─ reference/                 # Original static HTML/CSS reference extraction
└─ scripts/                   # Brand-leak guard & Playwright visual test suite
```

---

## 1. Installation (from GitHub or Workspace)

Install directly from GitHub in any Next.js project:

```bash
pnpm add github:akoladeolu/model-ui
# or with npm:
npm install github:akoladeolu/model-ui
```

---

## 2. Quickstart in Next.js (App Router)

### Step 1: Create `src/site.config.ts`

```ts
import { defineSiteConfig } from "model-ui";

export const siteConfig = defineSiteConfig({
  brand: {
    name: "Studio Apex",
    logo: "apex.",
    monogram: "SA",
    wordmark: "studioapex", // max 12 graphemes; auto-scales via CSS container queries
    tagline: "Design systems, distributed tooling, and tactile interfaces.",
  },
  location: {
    city: "LONDON",
    timeZone: "Europe/London",
    locale: "en-GB",
  },
  theme: {
    accent: "cyan", // "lime" | "cyan" | "amber" | "violet" | "mono" | { hex: "#ff5c00" }
    defaultMode: "system", // "light" | "dark" | "system"
  },
  nav: [
    { label: "projects", href: "/#projects" },
    { label: "blog", href: "/blog" },
  ],
  socials: {
    github: "https://github.com/your-org",
    x: "https://x.com/your-handle",
    email: "hello@example.com",
  },
  seo: {
    siteUrl: "https://example.com",
  },
});
```

### Step 2: Wire `app/layout.tsx`

`<ThemeStyle>` renders on the server and injects `--t-brand-accent*` CSS variables plus a tiny zero-flash dark mode script before first paint. `<ThemeProvider>` is a zero-dependency client provider (no `next-themes` required).

```tsx
import type { ReactNode } from "react";
import { ThemeStyle } from "model-ui";
import { ThemeProvider } from "model-ui/client";
import "model-ui/styles.css";
import { siteConfig } from "@/site.config";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeStyle config={siteConfig} />
      </head>
      <body className="t-body t-root">
        <ThemeProvider defaultMode={siteConfig.theme.defaultMode}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### Step 3: Drop in the 4 Page Templates

```tsx
// app/page.tsx
import { HomeTemplate } from "model-ui";
import { siteConfig } from "@/site.config";
import { projects, posts } from "@/content/data";

export default function HomePage() {
  return <HomeTemplate config={siteConfig} projects={projects} posts={posts} />;
}
```

```tsx
// app/blog/page.tsx
import { BlogIndexTemplate } from "model-ui";
import { siteConfig } from "@/site.config";
import { posts } from "@/content/data";

export default function BlogPage() {
  return <BlogIndexTemplate config={siteConfig} posts={posts} />;
}
```

```tsx
// app/blog/[slug]/page.tsx
import { BlogPostTemplate } from "model-ui";
import { siteConfig } from "@/site.config";

export default function ArticlePage({ post, comments }) {
  return (
    <BlogPostTemplate config={siteConfig} post={post} comments={comments}>
      <p>Your MDX or rich-text content renders inside .t-prose...</p>
    </BlogPostTemplate>
  );
}
```

```tsx
// app/projects/[slug]/page.tsx
import { CaseStudyTemplate } from "model-ui";
import { siteConfig } from "@/site.config";

export default function CaseStudyPage({ project }) {
  return <CaseStudyTemplate config={siteConfig} project={project} />;
}
```

---

## 3. Accent Presets & The Accent Restraint Rule

To preserve the quiet paper-and-ink aesthetic, **the brand accent is strictly limited to 4 micro-moments**:
1. The giant cropped footer wordmark (`--t-brand-accent-wordmark`)
2. The live timezone clock status dot (`--t-brand-accent`)
3. Text selection highlight (`--t-brand-accent-selection`)
4. Keyboard `:focus-visible` outlines (`--t-brand-accent-ring`)

Buttons, pills, chips, and headings remain monochrome ink-on-paper.

| Preset | Hex | Wordmark Alpha | Ring Alpha |
| :--- | :--- | :--- | :--- |
| `cyan` | `#22d3ee` | `0.26` | `0.50` |
| `lime` | `#bef264` | `0.30` | `0.55` |
| `amber` | `#fbbf24` | `0.26` | `0.55` |
| `violet` | `#a78bfa` | `0.34` | `0.50` |
| `mono` | `#ffffff` | `0.14` | `0.35` |

---

## 4. Development & Verification

```bash
pnpm install
pnpm typecheck      # Type-check packages/ui and apps/example
pnpm test           # Run Vitest unit & component tests
pnpm build          # Build model-ui dist/ and Next.js production app
pnpm check:brand    # Verify zero hardcoded personal branding leaks
pnpm test:visual    # Run Playwright visual & overflow verification
```

---

## Credits & Attribution

The visual language and paper-and-ink layout rhythms were originally extracted and generalized from Tayo's portfolio (`tayoszn.vercel.app`) for educational and design-system research. When deploying commercial or client projects with Model UI, customize your typography, brand configuration, and graphic slots to make the aesthetic distinctly your own.
