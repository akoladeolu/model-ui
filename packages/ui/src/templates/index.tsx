import React, { type CSSProperties, type ReactNode } from "react";
import {
  ArcGallery,
  ContributionHeatmap,
  Hero,
  Pagination,
  Polaroids,
  PostList,
  SiteShell,
  Statement,
} from "../blocks/index.js";
import {
  ArticleInteractiveShell,
  FilterableBlogFeed,
  FilterableProjectGrid,
} from "../client/index.js";
import type { SiteConfig } from "../config/index.js";
import type {
  ArcGalleryItem,
  CommentItem,
  PolaroidItem,
  Post,
  Project,
  ToolBadgeItem,
} from "../content/types.js";
import { HatchDivider, Prose, Sticker } from "../primitives/index.js";

const DEFAULT_STICKER_HEX =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23151515'/%3E%3Cpath d='M16 7l8 5v8l-8 5-8-5v-8z' fill='%23efefef'/%3E%3C/svg%3E";
const DEFAULT_STICKER_DOTS =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23222'/%3E%3Ccircle cx='12' cy='10' r='4' fill='%23f24e1e'/%3E%3Ccircle cx='20' cy='10' r='4' fill='%23ff7262'/%3E%3Ccircle cx='12' cy='17' r='4' fill='%23a259ff'/%3E%3Ccircle cx='20' cy='17' r='4' fill='%231abcfe'/%3E%3Ccircle cx='12' cy='24' r='4' fill='%230acf83'/%3E%3C/svg%3E";

export function HomeTemplate({
  config,
  projects,
  posts,
  heroHeadline,
  heroSubline,
  heroTrailingLine,
  heroLede,
  heroBadges,
  heroCtaLabel = "explore work",
  heroCtaHref = "#projects",
  heroSecondaryActions,
  statementContent,
  polaroids,
  arcItems,
  totalContributions = "2,534",
  caseStudyBasePath = "/projects",
  blogBasePath = "/blog",
  extraSections,
  withShell = true,
}: {
  config: SiteConfig;
  projects: Project[];
  posts: Post[];
  heroHeadline?: ReactNode;
  heroSubline?: ReactNode;
  heroTrailingLine?: ReactNode;
  heroLede?: ReactNode;
  heroBadges?: ToolBadgeItem[];
  heroCtaLabel?: string;
  heroCtaHref?: string;
  heroSecondaryActions?: ReactNode;
  statementContent?: ReactNode;
  polaroids?: PolaroidItem[];
  arcItems?: ArcGalleryItem[];
  totalContributions?: string | number;
  caseStudyBasePath?: string;
  blogBasePath?: string;
  extraSections?: ReactNode;
  withShell?: boolean;
}) {
  const body = (
    <main style={{ width: "100%" }}>
      <Hero
        config={config}
        headline={heroHeadline}
        subline={heroSubline}
        trailingLine={heroTrailingLine}
        lede={heroLede}
        badges={heroBadges}
        ctaLabel={heroCtaLabel}
        ctaHref={heroCtaHref}
        secondaryActions={heroSecondaryActions}
      />

      <div className="t-column" style={{ marginTop: "2rem" }}>
        <ArcGallery items={arcItems} />
      </div>

      <HatchDivider />

      <section
        className="t-column t-section--lg t-pad"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Statement>
          {statementContent ?? (
            <>
              lowercase, always. <Sticker src={DEFAULT_STICKER_HEX} /> ink fades
              instead of changing colour. the handwriting is where the
              personality lives, <Sticker src={DEFAULT_STICKER_DOTS} /> and
              things you can touch get a little tilt. the colour is hiding in
              the footer.
            </>
          )}
        </Statement>

        <Polaroids items={polaroids} />

        <div style={{ width: "100%", marginTop: "3.5rem" }}>
          <ContributionHeatmap totalContributions={totalContributions} />
        </div>
      </section>

      <HatchDivider />

      <section id="projects" className="t-column t-pad t-section">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: "1rem",
            marginBottom: "1.75rem",
          }}
        >
          <h2 className="t-statement t-reveal">selected work.</h2>
        </div>
        <FilterableProjectGrid
          projects={projects}
          caseStudyBasePath={caseStudyBasePath}
        />
      </section>

      {posts.length > 0 && (
        <>
          <HatchDivider />
          <section id="writing" className="t-column t-pad t-section">
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                marginBottom: "1.5rem",
              }}
            >
              <h2 className="t-statement t-reveal">recent thoughts.</h2>
              <a className="t-link-arrow" href={blogBasePath}>
                all posts{" "}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M7 17 17 7M8 7h9v9" />
                </svg>
              </a>
            </div>
            <PostList posts={posts} blogBasePath={blogBasePath} />
          </section>
        </>
      )}

      {extraSections}
    </main>
  );

  if (!withShell) return body;
  return (
    <SiteShell config={config} surface="paper" rails="narrow" activePath="/">
      {body}
    </SiteShell>
  );
}

export function BlogIndexTemplate({
  config,
  posts,
  heroTitle = "thoughts.",
  heroSub = "thoughts on design, systems engineering, and everything in between.",
  currentPage = 1,
  totalPages = 1,
  prevHref,
  nextHref,
  blogBasePath = "/blog",
  withShell = true,
}: {
  config: SiteConfig;
  posts: Post[];
  heroTitle?: string;
  heroSub?: string;
  currentPage?: number;
  totalPages?: number;
  prevHref?: string;
  nextHref?: string;
  blogBasePath?: string;
  withShell?: boolean;
}) {
  const body = (
    <main className="t-blog-index">
      <header className="t-blog-hero t-reveal">
        <h1 className="t-blog-hero__title">{heroTitle}</h1>
        <p className="t-blog-hero__sub">{heroSub}</p>
      </header>

      <FilterableBlogFeed posts={posts} blogBasePath={blogBasePath} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        prevHref={prevHref}
        nextHref={nextHref}
      />
    </main>
  );

  if (!withShell) return body;
  return (
    <SiteShell
      config={config}
      surface="reading"
      rails="narrow"
      activePath={blogBasePath}
    >
      {body}
    </SiteShell>
  );
}

export function BlogPostTemplate({
  config,
  post,
  comments = [],
  backHref = "/blog",
  backLabel = "Back to Blog",
  onLike,
  onBookmark,
  onComment,
  withShell = true,
  children,
}: {
  config: SiteConfig;
  post: Post;
  comments?: CommentItem[];
  backHref?: string;
  backLabel?: string;
  onLike?: (liked: boolean) => void;
  onBookmark?: (bookmarked: boolean) => void;
  onComment?: (author: string, body: string) => void;
  withShell?: boolean;
  children?: ReactNode;
}) {
  const shareUrl = `${config.seo.siteUrl.replace(/\/$/, "")}/blog/${post.slug}`;

  const body = (
    <article className="t-article">
      <a className="t-back-link t-reveal" href={backHref}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M15 6 9 12l6 6" />
        </svg>
        <span>{backLabel}</span>
      </a>

      <h1 className="t-article__title t-reveal">{post.title}</h1>
      <p
        className="t-article__deck t-reveal"
        style={{ "--d": 1 } as CSSProperties}
      >
        {post.description}
      </p>

      <ArticleInteractiveShell
        author={config.brand.logo}
        readMinutes={post.readMinutes}
        date={post.date}
        reads={post.reads}
        initialLikes={post.likes ?? 24}
        initialShares={post.shares ?? 4}
        shareUrl={shareUrl}
        shareTitle={post.title}
        tags={post.tags}
        comments={comments}
        onLike={onLike}
        onBookmark={onBookmark}
        onComment={onComment}
      >
        {post.cover && (
          <div className="t-article__cover t-reveal">
            <img src={post.cover.src} alt={post.cover.alt} />
          </div>
        )}
        <Prose className="t-reveal">{children ?? post.content}</Prose>
      </ArticleInteractiveShell>
    </article>
  );

  if (!withShell) return body;
  return (
    <SiteShell
      config={config}
      surface="reading"
      rails="narrow"
      activePath="/blog"
    >
      {body}
    </SiteShell>
  );
}

export function CaseStudyTemplate({
  config,
  project,
  backHref = "/#projects",
  backLabel = "Back to Projects",
  ctaTitle = "Interested in working together?",
  ctaSub = "Let's build something amazing.",
  ctaLabel = "Get in Touch",
  ctaHref,
  withShell = true,
}: {
  config: SiteConfig;
  project: Project;
  backHref?: string;
  backLabel?: string;
  ctaTitle?: string;
  ctaSub?: string;
  ctaLabel?: string;
  ctaHref?: string;
  withShell?: boolean;
}) {
  const resolvedCtaHref =
    ctaHref ??
    (config.socials.email ? `mailto:${config.socials.email}` : "/#contact");
  const monogram =
    project.monogram ?? project.title.slice(0, 1).toUpperCase();

  const body = (
    <main className="t-case">
      <a className="t-back-link t-reveal" href={backHref}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M15 6 9 12l6 6" />
        </svg>
        <span>{backLabel}</span>
      </a>

      <header
        className="t-case__header t-reveal"
        style={{ "--d": 1 } as CSSProperties}
      >
        <div className="t-case__title-row">
          <h1 className="t-case__title">{project.title}</h1>
          <span className="t-case__year">{project.year}</span>
        </div>
        <p className="t-case__subtitle">{project.subtitle}</p>
        <div className="t-case__actions">
          {project.liveUrl && (
            <a className="t-btn-solid" href={project.liveUrl}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M11 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6" />
                <path d="M15 3h6v6M10 14 21 3" />
              </svg>
              <span>View Live</span>
            </a>
          )}
          {project.codeUrl && (
            <a className="t-btn-ghost" href={project.codeUrl}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
              </svg>
              <span>View Code</span>
            </a>
          )}
        </div>
      </header>

      <div
        className="t-case__hero t-reveal"
        style={{ "--d": 2 } as CSSProperties}
      >
        {project.cover ? (
          <img src={project.cover.src} alt={project.cover.alt} />
        ) : (
          <span className="t-case__monogram">{monogram}</span>
        )}
      </div>

      <div
        className="t-case__tags t-reveal"
        style={{ "--d": 3 } as CSSProperties}
      >
        {project.tags.map((tag) => (
          <span key={tag} className="t-pill-tag">
            {tag}
          </span>
        ))}
      </div>

      <div className="t-case__body">
        <section className="t-reveal">
          <h2 className="t-case__h2">The Challenge</h2>
          <p className="t-case__p">{project.challenge}</p>
        </section>

        <section className="t-reveal">
          <h2 className="t-case__h2">The Solution</h2>
          <p className="t-case__p">{project.solution}</p>
        </section>

        {project.impact.length > 0 && (
          <section className="t-reveal">
            <h2 className="t-case__h2 t-case__h2--spaced">Impact</h2>
            <ul className="t-case__list">
              {project.impact.map((item, i) => (
                <li key={i}>
                  <span className="t-case__marker">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {project.features.length > 0 && (
          <section className="t-reveal">
            <h2 className="t-case__h2 t-case__h2--spaced">Key Features</h2>
            <div className="t-feature-grid">
              {project.features.map((feat, i) => (
                <div key={i} className="t-feature-card">
                  <p>{feat.title ? `${feat.title} — ${feat.body}` : feat.body}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {project.stack.length > 0 && (
          <section className="t-reveal">
            <h2 className="t-case__h2 t-case__h2--spaced">Tech Stack</h2>
            <div className="t-stack-grid">
              {project.stack.map((item, i) => (
                <div key={i} className="t-stack-item">
                  <span className="t-stack-dot" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {project.lessons.length > 0 && (
          <section className="t-reveal">
            <h2 className="t-case__h2 t-case__h2--spaced">Lessons Learned</h2>
            <ul className="t-case__list">
              {project.lessons.map((item, i) => (
                <li key={i}>
                  <span className="t-case__marker">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <div className="t-case__cta t-reveal">
        <h3 className="t-case__cta-title">{ctaTitle}</h3>
        <p className="t-case__cta-sub">{ctaSub}</p>
        <a className="t-btn-solid t-btn-solid--lg" href={resolvedCtaHref}>
          {ctaLabel}
        </a>
      </div>
    </main>
  );

  if (!withShell) return body;
  return (
    <SiteShell
      config={config}
      surface="paper"
      rails="wide"
      hideFooter={true}
      activePath="/#projects"
    >
      {body}
    </SiteShell>
  );
}
