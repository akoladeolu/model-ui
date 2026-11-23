import type { Post, Project, SiteConfig } from "model-ui";

/**
 * Serializes a SiteConfig object into a clean, human-readable, and valid
 * TypeScript module ready to be saved as `src/site.config.ts`.
 */
export function generateSiteConfigTs(config: SiteConfig): string {
  const brandProps = [
    `    name: ${JSON.stringify(config.brand.name)},`,
    `    logo: ${JSON.stringify(config.brand.logo)},`,
    `    monogram: ${JSON.stringify(config.brand.monogram)},`,
    `    wordmark: ${JSON.stringify(config.brand.wordmark)},`,
    `    tagline: ${JSON.stringify(config.brand.tagline)},`,
    config.brand.footerHeadline &&
      config.brand.footerHeadline !==
        "Let's build something people actually use."
      ? `    footerHeadline: ${JSON.stringify(config.brand.footerHeadline)},`
      : null,
    config.brand.footerCtaLabel &&
      config.brand.footerCtaLabel !== "Get in touch"
      ? `    footerCtaLabel: ${JSON.stringify(config.brand.footerCtaLabel)},`
      : null,
  ]
    .filter(Boolean)
    .join("\n");

  const locationSection = config.location
    ? `  location: {\n    city: ${JSON.stringify(
        config.location.city
      )},\n    timeZone: ${JSON.stringify(
        config.location.timeZone
      )},\n    locale: ${JSON.stringify(
        config.location.locale ?? "en-US"
      )},\n  },`
    : null;

  const accentValue =
    typeof config.theme.accent === "string"
      ? JSON.stringify(config.theme.accent)
      : JSON.stringify(config.theme.accent, null, 2).replace(
          /\n/g,
          "\n    "
        );

  const themeSection = `  theme: {\n    accent: ${accentValue},\n    defaultMode: ${JSON.stringify(
    config.theme.defaultMode ?? "system"
  )},\n  },`;

  const navSection = `  nav: ${JSON.stringify(config.nav, null, 2)
    .replace(/\n/g, "\n  ")},`;

  const socialKeys = Object.entries(config.socials || {}).filter(
    ([, v]) => Boolean(v)
  );
  const socialsSection =
    socialKeys.length > 0
      ? `  socials: {\n${socialKeys
          .map(([k, v]) => `    ${k}: ${JSON.stringify(v)},`)
          .join("\n")}\n  },`
      : `  socials: {},`;

  const seoSection = `  seo: {\n    siteUrl: ${JSON.stringify(
    config.seo?.siteUrl ?? "https://example.com"
  )},\n  },`;

  const sections = [
    `  brand: {\n${brandProps}\n  },`,
    locationSection,
    themeSection,
    navSection,
    socialsSection,
    seoSection,
  ].filter(Boolean);

  return `import { defineSiteConfig } from "model-ui";

export const siteConfig = defineSiteConfig({
${sections.join("\n")}
});
`;
}

/**
 * Serializes custom projects and posts arrays into a TypeScript data module.
 */
export function generateContentTs(
  projects: Project[],
  posts: Post[]
): string {
  return `import type { Project, Post } from "model-ui";

export const projects: Project[] = ${JSON.stringify(projects, null, 2)};

export const posts: Post[] = ${JSON.stringify(posts, null, 2)};
`;
}
