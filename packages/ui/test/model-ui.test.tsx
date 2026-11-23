import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import {
  ACCENT_PRESETS,
  defineSiteConfig,
  siteConfigSchema,
  resolveAccent,
  toCssVarStyleText,
  toCssVars,
  Wordmark,
  ThemeStyle,
  HomeTemplate,
  BlogIndexTemplate,
  BlogPostTemplate,
  CaseStudyTemplate,
} from "../src/index.js";
import {
  ActionOrbs,
  Clock,
  FilterPills,
  SegmentedFilter,
  ShareModal,
  ThemeProvider,
  ThemeToggle,
} from "../src/client/index.js";

const sampleConfig = defineSiteConfig({
  brand: {
    name: "Studio Apex",
    logo: "apex.",
    monogram: "SA",
    wordmark: "studioapex",
    tagline: "Design systems & infrastructure craft",
  },
  location: {
    city: "London",
    timeZone: "Europe/London",
    locale: "en-GB",
  },
  theme: {
    accent: "cyan",
    defaultMode: "light",
  },
  nav: [
    { label: "projects", href: "/#projects" },
    { label: "blog", href: "/blog" },
  ],
  socials: {
    github: "https://github.com/example",
    x: "https://x.com/example",
    email: "hello@example.com",
  },
  seo: {
    siteUrl: "https://apex.example.com",
  },
});

describe("defineSiteConfig & schema validation", () => {
  it("parses a valid config and populates defaults", () => {
    expect(sampleConfig.brand.name).toBe("Studio Apex");
    expect(sampleConfig.theme.accent).toBe("cyan");
    expect(sampleConfig.location?.timeZone).toBe("Europe/London");
  });

  it("rejects an invalid IANA timeZone", () => {
    expect(() =>
      defineSiteConfig({
        brand: sampleConfig.brand,
        location: { city: "Mars", timeZone: "Mars/Olympus_Mons" },
      })
    ).toThrow(/Invalid IANA timeZone/);
  });

  it("rejects a wordmark longer than 12 graphemes", () => {
    expect(() =>
      defineSiteConfig({
        brand: {
          ...sampleConfig.brand,
          wordmark: "thirteenchars",
        },
      })
    ).toThrow(/12 characters or fewer/);
  });

  it("rejects an invalid custom hex color", () => {
    expect(() =>
      defineSiteConfig({
        brand: sampleConfig.brand,
        theme: {
          accent: { hex: "not-a-hex" },
        },
      })
    ).toThrow();
  });
});

describe("Accent presets & toCssVars", () => {
  it("maps every built-in preset to tuned alpha variables", () => {
    for (const presetName of Object.keys(ACCENT_PRESETS) as Array<
      keyof typeof ACCENT_PRESETS
    >) {
      const cfg = defineSiteConfig({
        brand: sampleConfig.brand,
        theme: { accent: presetName },
      });
      const vars = toCssVars(cfg);
      const preset = ACCENT_PRESETS[presetName];
      expect(vars["--t-brand-accent"]).toBe(preset.hex);
      expect(vars["--t-brand-accent-wordmark"]).toContain(
        String(preset.wordmarkAlpha)
      );
      expect(vars["--t-brand-accent-ring"]).toContain(String(preset.ringAlpha));
    }
  });

  it("computes luminance-balanced alpha for custom hex accents", () => {
    const bright = resolveAccent({ hex: "#ffffff" });
    const dark = resolveAccent({ hex: "#1e40af" });
    expect(bright.wordmarkAlpha).toBeLessThan(dark.wordmarkAlpha);
  });

  it("renders ThemeStyle server tag with CSS vars and no-flash script", () => {
    const css = toCssVarStyleText(sampleConfig);
    expect(css).toContain("--t-brand-accent: #22d3ee;");
    const { container } = render(<ThemeStyle config={sampleConfig} />);
    expect(container.querySelector("#model-ui-theme-vars")?.textContent).toContain(
      "--t-brand-accent: #22d3ee;"
    );
    expect(container.querySelector("#model-ui-theme-init")).toBeTruthy();
  });
});

describe("Wordmark fit-to-width grapheme counting", () => {
  it("sets --chars equal to grapheme length including accented characters", () => {
    const { container } = render(<Wordmark text="élena✦" />);
    const p = container.querySelector(".t-wordmark") as HTMLElement;
    expect(p).toBeTruthy();
    expect(p.style.getPropertyValue("--chars")).toBe("6");
  });
});

describe("Client islands", () => {
  it("Clock formats time after mount using Intl.DateTimeFormat", () => {
    render(<Clock city="London" timeZone="Europe/London" />);
    const timeEl = screen.getByTestId("model-ui-clock");
    expect(timeEl.textContent).toBeTruthy();
    expect(timeEl.textContent).not.toBe("");
  });

  it("ActionOrbs toggles like and bookmark states and opens share", () => {
    const onLike = vi.fn();
    const onBookmark = vi.fn();
    const onShare = vi.fn();
    render(
      <ActionOrbs
        liked={false}
        bookmarked={false}
        onToggleLike={onLike}
        onToggleBookmark={onBookmark}
        onShare={onShare}
      />
    );
    fireEvent.click(screen.getByLabelText("Like post"));
    expect(onLike).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByLabelText("Bookmark post"));
    expect(onBookmark).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByLabelText("Share post"));
    expect(onShare).toHaveBeenCalledTimes(1);
  });

  it("ShareModal opens, copies link, and closes on Escape", () => {
    const onClose = vi.fn();
    render(
      <ShareModal
        open={true}
        onClose={onClose}
        url="https://apex.example.com/blog/test"
        title="Test Post"
      />
    );
    expect(screen.getByRole("dialog")).toBeTruthy();
    fireEvent.click(screen.getByText("Copy link"));
    expect(screen.getByText("Copied!")).toBeTruthy();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("ThemeProvider and ThemeToggle switch data-theme between light and dark", () => {
    render(
      <ThemeProvider defaultMode="light">
        <ThemeToggle />
      </ThemeProvider>
    );
    const btn = screen.getByLabelText("Toggle dark mode");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    fireEvent.click(btn);
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("SegmentedFilter & FilterPills update active selection", () => {
    const onSeg = vi.fn();
    render(
      <SegmentedFilter
        options={[
          { label: "all", value: "all" },
          { label: "systems", value: "systems" },
        ]}
        onChange={onSeg}
      />
    );
    fireEvent.click(screen.getByText("systems"));
    expect(onSeg).toHaveBeenCalledWith("systems");

    const onPill = vi.fn();
    render(<FilterPills tags={["design", "rust"]} onChange={onPill} />);
    fireEvent.click(screen.getByText("rust"));
    expect(onPill).toHaveBeenCalledWith("rust");
  });
});

describe("Templates render with white-label config", () => {
  const sampleProject = {
    slug: "helix",
    title: "Helix",
    subtitle: "Self-Hosted Localhost Tunneling Tool",
    description: "Persistent path-based tunneling relay.",
    year: "2025",
    tags: ["Node.js", "TypeScript", "CLI"],
    category: "systems",
    liveUrl: "https://example.com",
    codeUrl: "https://github.com/example/helix",
    monogram: "H",
    challenge: "Disposable subdomains break webhook testing.",
    solution: "Path-based persistent tunnels on your own relay.",
    impact: ["Zero ongoing hosting cost"],
    features: [{ body: "Persistent /tunnel/{name}/ paths" }],
    stack: ["Node.js + TypeScript"],
    lessons: ["Rewrite relative asset URLs on the relay"],
  };

  const samplePost = {
    slug: "calm-monochrome",
    title: "why monochrome interfaces feel calmer than colour palettes.",
    description: "stripping a system down to one ink and an opacity ramp.",
    date: "Oct 14, 2026",
    readMinutes: 4,
    reads: 512,
    likes: 58,
    comments: 1,
    tags: ["design", "engineering"],
  };

  it("renders HomeTemplate, BlogIndexTemplate, BlogPostTemplate, and CaseStudyTemplate", () => {
    const home = render(
      <HomeTemplate
        config={sampleConfig}
        projects={[sampleProject]}
        posts={[samplePost]}
      />
    );
    expect(home.container.textContent).toContain("studioapex");
    home.unmount();

    const blogIdx = render(
      <BlogIndexTemplate config={sampleConfig} posts={[samplePost]} />
    );
    expect(blogIdx.container.textContent).toContain("thoughts.");
    blogIdx.unmount();

    const blogPost = render(
      <BlogPostTemplate
        config={sampleConfig}
        post={samplePost}
        comments={[
          {
            id: "1",
            author: "Elena",
            date: "Oct 15",
            body: "Spot on.",
          },
        ]}
      >
        <p>Article body paragraph.</p>
      </BlogPostTemplate>
    );
    expect(blogPost.container.textContent).toContain("Article body paragraph.");
    expect(blogPost.container.textContent).toContain("apex.");
    blogPost.unmount();

    const caseStudy = render(
      <CaseStudyTemplate config={sampleConfig} project={sampleProject} />
    );
    expect(caseStudy.container.textContent).toContain("The Challenge");
    expect(caseStudy.container.textContent).toContain("Lessons Learned");
    caseStudy.unmount();
  });

  it("safeParse cleanly validates custom hex accents and exact 12-char wordmarks", () => {
    const raw = {
      brand: {
        name: "Nova Labs",
        logo: "nova.",
        monogram: "NL",
        wordmark: "123456789012", // exactly 12 chars
        tagline: "Systems research",
      },
      theme: {
        accent: { hex: "#ff5c00" },
      },
    };
    const parsed = siteConfigSchema.safeParse(raw);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.brand.name).toBe("Nova Labs");
      expect(parsed.data.brand.wordmark).toBe("123456789012");
      expect(parsed.data.theme.accent).toEqual({ hex: "#ff5c00" });
    }
  });

  it("safeParse returns structured validation errors without throwing for 13+ char wordmarks", () => {
    const raw = {
      brand: {
        name: "Nova Labs",
        logo: "nova.",
        monogram: "NL",
        wordmark: "thirteenchars",
        tagline: "Systems research",
      },
      location: {
        city: "BERLIN",
        timeZone: "Invalid/Timezone",
      },
    };
    const parsed = siteConfigSchema.safeParse(raw);
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      const paths = parsed.error.issues.map((i) => i.path.join("."));
      expect(paths).toContain("brand.wordmark");
      expect(paths).toContain("location.timeZone");
    }
  });
});

