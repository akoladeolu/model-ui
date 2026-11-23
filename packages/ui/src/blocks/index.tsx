import React, { type CSSProperties, type ReactNode } from "react";
import { Clock, ThemeToggle } from "../client/index.js";
import type { SiteConfig } from "../config/index.js";
import type {
  ArcGalleryItem,
  PolaroidItem,
  Post,
  Project,
  ToolBadgeItem,
} from "../content/types.js";
import { Button, Page, Wordmark, cx } from "../primitives/index.js";

export function DockNav({
  config,
  activePath,
  staticPosition = false,
  className,
}: {
  config: SiteConfig;
  activePath?: string;
  staticPosition?: boolean;
  className?: string;
}) {
  return (
    <nav
      className={cx(
        "t-nav t-nav-drop",
        staticPosition && "t-nav--static",
        className
      )}
      aria-label="Primary"
    >
      <div className="t-nav__bar">
        <a href="/" aria-label={`${config.brand.name} home`}>
          {config.brand.avatar ? (
            <img
              className="t-nav__avatar"
              src={config.brand.avatar.src}
              alt={config.brand.avatar.alt || config.brand.name}
            />
          ) : (
            <span
              className="t-nav__avatar"
              style={{
                display: "grid",
                placeItems: "center",
                background: "var(--t-paper)",
                color: "var(--t-ink)",
                fontWeight: 700,
                fontSize: ".75rem",
              }}
            >
              {config.brand.logo}
            </span>
          )}
        </a>

        <div className="t-nav__links">
          {config.nav.map((item) => {
            const isActive =
              activePath &&
              (activePath === item.href ||
                (item.href !== "/" && activePath.startsWith(item.href)));
            return (
              <a
                key={item.href}
                className="t-nav__link"
                href={item.href}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </a>
            );
          })}
        </div>

        <div className="t-nav__actions">
          <ThemeToggle />
          {config.socials.x && (
            <a
              className="t-icon-btn"
              href={config.socials.x}
              aria-label="X"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.77L17.75 3Zm-1.08 16.2h1.7L7.4 4.73H5.58L16.67 19.2Z" />
              </svg>
            </a>
          )}
          {config.socials.github && (
            <a
              className="t-icon-btn"
              href={config.socials.github}
              aria-label="GitHub"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}

export function Hero({
  config,
  headline,
  subline,
  trailingLine,
  lede,
  badges = [
    { label: "TS", color: "#3178c6" },
    { label: "✦" },
    { label: "◐" },
  ],
  ctaLabel = "explore work",
  ctaHref = "#projects",
  secondaryActions,
  illustration,
}: {
  config: SiteConfig;
  headline?: ReactNode;
  subline?: ReactNode;
  trailingLine?: ReactNode;
  lede?: ReactNode;
  badges?: ToolBadgeItem[];
  ctaLabel?: string;
  ctaHref?: string;
  secondaryActions?: ReactNode;
  illustration?: ReactNode;
}) {
  return (
    <section
      id="top"
      className="t-column"
      style={{ overflow: "hidden" }}
    >
      <div
        className="t-pad"
        style={{
          paddingTop: "5rem",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {illustration ?? (
          <div
            role="img"
            aria-label={`${config.brand.name} banner`}
            style={{
              aspectRatio: "3.9 / 1",
              width: "100%",
              borderRadius: "var(--t-radius-xs)",
              background:
                "radial-gradient(120% 90% at 20% 120%, #2b4fd8 0 22%, transparent 23%), radial-gradient(60% 60% at 10% 110%, #6b8cff 0 30%, transparent 31%), radial-gradient(140% 70% at 70% 100%, #5f9c2f 0 45%, transparent 46%), radial-gradient(160% 80% at 40% 115%, #9ccf4a 0 50%, transparent 51%), linear-gradient(#bcd8f0, #e8f1f6 60%)",
            }}
          />
        )}
        <div
          style={{
            marginTop: "1.5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <h1 className="t-display t-reveal">
            {headline ?? (
              <>
                {config.brand.name.toLowerCase()}...{" "}
                <span className="t-muted">builds</span> systems.
              </>
            )}
          </h1>
          <h2
            className="t-subline t-reveal"
            style={{ "--d": 1 } as CSSProperties}
          >
            <span>
              {subline ?? (
                <>
                  <span className="t-muted">&amp;</span>{" "}
                  <span className="t-ink">interfaces</span>
                </>
              )}
            </span>
            {badges.length > 0 && (
              <span className="t-badges" aria-hidden="true">
                {badges.map((b, i) => (
                  <span
                    key={i}
                    style={b.color ? { color: b.color } : undefined}
                  >
                    {b.label}
                  </span>
                ))}
              </span>
            )}
          </h2>
          {trailingLine !== null && (
            <p
              className="t-subline t-subline--trail t-reveal"
              style={{ "--d": 2 } as CSSProperties}
            >
              {trailingLine ?? config.brand.tagline.toLowerCase()}
            </p>
          )}
          {lede !== null && (
            <p
              className="t-lede t-reveal"
              style={{ "--d": 3 } as CSSProperties}
            >
              {lede ?? config.brand.tagline}
            </p>
          )}
          <div
            className="t-reveal"
            style={
              {
                "--d": 4,
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
                marginTop: "1.5rem",
              } as CSSProperties
            }
          >
            <Button variant="cta" href={ctaHref}>
              {ctaLabel}
            </Button>
            {secondaryActions}
          </div>
        </div>
      </div>
    </section>
  );
}

const DEFAULT_ARC_GRADIENTS: Array<[string, string]> = [
  ["#e9e2d6", "#6b4a32"],
  ["#f1dede", "#b98b8b"],
  ["#2c2540", "#0e0b18"],
  ["#d8d3c4", "#8e8572"],
  ["#efe7da", "#51382a"],
  ["#cfe0f2", "#4b6b91"],
  ["#e3eccf", "#6f8a3a"],
  ["#f2e4cc", "#a46b27"],
  ["#dcdcdc", "#777777"],
  ["#f4d3c4", "#9b4f33"],
  ["#1e2a22", "#0b100c"],
  ["#ece4f4", "#8a76a8"],
  ["#f6efe2", "#c9a46a"],
  ["#d6e6e2", "#4f7d73"],
];

export function ArcGallery({
  items,
  height,
  className,
}: {
  items?: ArcGalleryItem[];
  height?: number | string;
  className?: string;
}) {
  const resolved: ArcGalleryItem[] =
    items && items.length > 0
      ? items
      : DEFAULT_ARC_GRADIENTS.map((g, i) => ({
          id: `arc-${i}`,
          gradient: g,
        }));

  return (
    <div
      className={cx("t-arc", className)}
      style={height ? { height } : undefined}
      aria-hidden="true"
    >
      <div
        className="t-arc__track"
        style={{ "--n": resolved.length } as CSSProperties}
      >
        {resolved.map((item, i) => {
          const [c1, c2] = item.gradient ?? ["#d9d4cc", "#a89f92"];
          return (
            <div
              key={item.id ?? i}
              className="t-arc__item"
              style={
                {
                  "--i": i,
                  background: `linear-gradient(135deg, ${c1}, ${c2})`,
                } as CSSProperties
              }
            >
              {item.image && (
                <img src={item.image.src} alt={item.image.alt || ""} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Statement({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cx("t-script-paragraph t-reveal", className)}>{children}</p>
  );
}

const DEFAULT_POLAROIDS: PolaroidItem[] = [
  { caption: "ink #151515", gradient: ["#f0e2c8", "#b98c56"], rotationDeg: -10 },
  { caption: "paper #efefef", gradient: ["#1b1f2c", "#0b0c10"], rotationDeg: -6 },
  { caption: "reading #fbfbfb", gradient: ["#fafafa", "#cfcfcf"], rotationDeg: -1 },
  { caption: "night #0d0e0e", gradient: ["#e43c2f", "#7a130c"], rotationDeg: 4 },
  { caption: "stage below.", gradient: ["#f2a640", "#6b3410"], rotationDeg: 8 },
];

export function Polaroids({
  items = DEFAULT_POLAROIDS,
  heading = "off screen.",
}: {
  items?: PolaroidItem[];
  heading?: string;
}) {
  const defaultAngles = [-10, -6, -1, 4, 8];
  return (
    <div style={{ width: "100%", marginTop: "4rem" }}>
      {heading && (
        <h3
          className="t-script-heading"
          style={{ margin: "0 0 2rem 2rem" }}
        >
          {heading}
        </h3>
      )}
      <div className="t-polaroids" role="list">
        {items.map((item, idx) => {
          const rot =
            item.rotationDeg ?? defaultAngles[idx % defaultAngles.length];
          const [c1, c2] = item.gradient ?? ["#d9d4cc", "#a89f92"];
          const words = item.caption.split(/\s+/);
          return (
            <div
              key={item.id ?? idx}
              className="t-polaroid"
              role="listitem"
              tabIndex={0}
              style={
                {
                  "--r": `${rot}deg`,
                  zIndex: idx,
                } as CSSProperties
              }
            >
              <div
                className="t-polaroid__img"
                style={{
                  background: `linear-gradient(135deg, ${c1}, ${c2})`,
                }}
              >
                {item.image && (
                  <img src={item.image.src} alt={item.image.alt} />
                )}
              </div>
              <span className="t-polaroid__caption">
                {words.map((w, wi) => (
                  <React.Fragment key={wi}>
                    <span style={{ "--i": wi } as CSSProperties}>{w}</span>
                    {wi < words.length - 1 ? " " : ""}
                  </React.Fragment>
                ))}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Deterministic contribution heatmap (no Math.random hydration mismatch).
 */
export function ContributionHeatmap({
  totalContributions = "2,534",
  subtitle = "select a day to explore",
  weeks = 38,
  values,
  className,
}: {
  totalContributions?: string | number;
  subtitle?: string;
  weeks?: number;
  values?: number[];
  className?: string;
}) {
  const levels = [0.06, 0.06, 0.2, 0.45, 0.7, 1];
  const cellCount = weeks * 7;
  const cells =
    values && values.length > 0
      ? values
      : Array.from({ length: cellCount }, (_, i) => {
          const hash = ((i * 2654435761) >>> 0) % 17;
          if (hash < 7) return 0.06;
          if (hash < 11) return 0.2;
          if (hash < 14) return 0.45;
          if (hash < 16) return 0.7;
          return 1;
        });

  return (
    <div className={cx("t-panel", className)}>
      <div className="t-panel__head">
        <span>
          <strong>{totalContributions}</strong> contributions in the last year
        </span>
        <span>{subtitle}</span>
      </div>
      <div className="t-heatmap" aria-hidden="true">
        {cells.map((alpha, i) => (
          <i
            key={i}
            style={
              {
                "--a": levels.includes(alpha) ? alpha : alpha,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <div className="t-heatmap-legend">
        less{" "}
        {[0.06, 0.2, 0.45, 0.7, 1].map((a) => (
          <i key={a} style={{ "--a": a } as CSSProperties} />
        ))}{" "}
        more
      </div>
    </div>
  );
}

export function PostList({
  posts,
  blogBasePath = "/blog",
}: {
  posts: Post[];
  blogBasePath?: string;
}) {
  return (
    <div className="t-list">
      {posts.map((post) => (
        <a
          key={post.slug}
          className="t-post"
          href={`${blogBasePath}/${post.slug}`}
        >
          <div className="t-post__main">
            <div>
              <h3 className="t-post__title">{post.title}</h3>
              <p className="t-post__excerpt">{post.description}</p>
            </div>
            <div className="t-post__tags">
              {post.tags.map((t) => (
                <span key={t} className="t-tag">
                  {t}
                </span>
              ))}
            </div>
            <div className="t-post__stats">
              <span>{post.date}</span>
              {typeof post.reads === "number" && (
                <>
                  <span>·</span>
                  <span>{post.reads} reads</span>
                </>
              )}
              {typeof post.likes === "number" && (
                <>
                  <span>·</span>
                  <span>♥ {post.likes}</span>
                </>
              )}
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}

export function Footer({
  config,
  year = 2026,
  className,
}: {
  config: SiteConfig;
  year?: number;
  className?: string;
}) {
  const contactHref = config.socials.email
    ? `mailto:${config.socials.email}`
    : "#contact";

  return (
    <footer className={cx("t-footer", className)} id="contact">
      <div className="t-footer__dots" />
      <div className="t-footer__inner">
        <span
          className="t-nav__avatar"
          style={{
            display: "grid",
            placeItems: "center",
            background: "#fff",
            color: "#151515",
            fontWeight: 700,
            fontSize: ".75rem",
            borderRadius: ".6rem",
          }}
        >
          {config.brand.logo}
        </span>
        <h2 className="t-footer__title">{config.brand.footerHeadline}</h2>
        <Button
          variant="light"
          href={contactHref}
          style={{ marginTop: "1.25rem", width: "fit-content" }}
          orb={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          }
        >
          {config.brand.footerCtaLabel}
        </Button>

        <div className="t-footer__bar">
          <div className="t-footer__group">
            <span>
              © {year} {config.brand.name}
            </span>
            {config.location && (
              <Clock
                city={config.location.city}
                timeZone={config.location.timeZone}
                locale={config.location.locale}
              />
            )}
          </div>
          <div className="t-footer__group">
            {config.socials.x && (
              <a
                className="t-social"
                href={config.socials.x}
                aria-label="X"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.77L17.75 3Zm-1.08 16.2h1.7L7.4 4.73H5.58L16.67 19.2Z" />
                </svg>
              </a>
            )}
            {config.socials.github && (
              <a
                className="t-social"
                href={config.socials.github}
                aria-label="GitHub"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="t-footer__stage">
        <div
          className="t-footer__scene"
          style={{
            background:
              "linear-gradient(135deg, #2b4fd8 0%, #5f9c2f 55%, #9ccf4a 100%)",
          }}
        />
        <Wordmark text={config.brand.wordmark} />
      </div>
    </footer>
  );
}

export function SiteShell({
  config,
  surface = "paper",
  rails = "narrow",
  activePath,
  hideFooter = false,
  children,
}: {
  config: SiteConfig;
  surface?: "paper" | "reading";
  rails?: "narrow" | "wide" | "none";
  activePath?: string;
  hideFooter?: boolean;
  children: ReactNode;
}) {
  return (
    <Page surface={surface} rails={rails}>
      <DockNav config={config} activePath={activePath} />
      {children}
      {!hideFooter && <Footer config={config} />}
    </Page>
  );
}

export function Pagination({
  currentPage = 1,
  totalPages = 1,
  prevHref,
  nextHref,
}: {
  currentPage?: number;
  totalPages?: number;
  prevHref?: string;
  nextHref?: string;
}) {
  return (
    <nav className="t-pagination" aria-label="Pagination">
      {prevHref && currentPage > 1 ? (
        <a className="t-page-btn" href={prevHref}>
          Previous
        </a>
      ) : (
        <button className="t-page-btn" type="button" disabled>
          Previous
        </button>
      )}
      <span className="t-page-status">
        Page {currentPage} of {totalPages}
      </span>
      {nextHref && currentPage < totalPages ? (
        <a className="t-page-btn" href={nextHref}>
          Next
        </a>
      ) : (
        <button
          className="t-page-btn"
          type="button"
          disabled={currentPage >= totalPages}
        >
          Next
        </button>
      )}
    </nav>
  );
}
