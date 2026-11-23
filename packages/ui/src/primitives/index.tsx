import React, { type CSSProperties, type ReactNode } from "react";
import { toCssVarStyleText, type SiteConfig } from "../config/index.js";

export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Server Component that injects the brand accent and font CSS custom properties
 * into a <style> tag and optionally includes a tiny zero-flash dark mode init script.
 */
export function ThemeStyle({
  config,
  storageKey = "model-ui-theme",
}: {
  config: SiteConfig;
  storageKey?: string;
}) {
  const cssText = toCssVarStyleText(config);
  const defaultMode = config.theme.defaultMode ?? "system";
  const initScript = `(function(){try{var k=${JSON.stringify(
    storageKey
  )},d=${JSON.stringify(
    defaultMode
  )},s=localStorage.getItem(k)||d,m=s==="system"?(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):s;document.documentElement.setAttribute("data-theme",m);document.documentElement.classList.toggle("dark",m==="dark");}catch(e){}})();`;

  return (
    <>
      <style
        id="model-ui-theme-vars"
        dangerouslySetInnerHTML={{ __html: cssText }}
      />
      <script
        id="model-ui-theme-init"
        dangerouslySetInnerHTML={{ __html: initScript }}
      />
    </>
  );
}

export function Page({
  surface = "paper",
  rails = "narrow",
  className,
  children,
}: {
  surface?: "paper" | "reading";
  rails?: "narrow" | "wide" | "none";
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cx(
        "t-page",
        surface === "reading" && "t-page--reading",
        rails !== "none" && "t-rails",
        rails === "wide" && "t-rails--wide",
        className
      )}
    >
      {children}
    </div>
  );
}

export function Column({
  pad = false,
  id,
  as: Tag = "div",
  style,
  className,
  children,
}: {
  pad?: boolean;
  id?: string;
  as?: "div" | "section" | "main" | "header";
  style?: CSSProperties;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <Tag id={id} style={style} className={cx("t-column", pad && "t-pad", className)}>
      {children}
    </Tag>
  );
}

export function Rails({
  variant = "narrow",
  className,
  children,
}: {
  variant?: "narrow" | "wide";
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cx("t-rails", variant === "wide" && "t-rails--wide", className)}>
      {children}
    </div>
  );
}

export function Section({
  size = "default",
  pad = false,
  column = false,
  id,
  style,
  className,
  children,
}: {
  size?: "default" | "lg";
  pad?: boolean;
  column?: boolean;
  id?: string;
  style?: CSSProperties;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <section
      id={id}
      style={style}
      className={cx(
        size === "lg" ? "t-section--lg" : "t-section",
        column && "t-column",
        pad && "t-pad",
        className
      )}
    >
      {children}
    </section>
  );
}

export function HatchDivider({ className }: { className?: string }) {
  return <div className={cx("t-divider", className)} aria-hidden="true" />;
}

export function Button({
  variant = "cta",
  size = "default",
  href,
  onClick,
  type = "button",
  disabled,
  orb,
  className,
  style,
  children,
}: {
  variant?: "cta" | "light" | "surface" | "solid" | "ghost";
  size?: "default" | "lg";
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  orb?: ReactNode;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const variantClass =
    variant === "cta"
      ? "t-btn"
      : variant === "light"
      ? "t-btn t-btn--light"
      : variant === "surface"
      ? "t-btn t-btn--surface"
      : variant === "solid"
      ? cx("t-btn-solid", size === "lg" && "t-btn-solid--lg")
      : "t-btn-ghost";

  const content = (
    <>
      {children}
      {orb !== undefined && <span className="t-btn__orb">{orb}</span>}
    </>
  );

  if (href) {
    return (
      <a href={href} style={style} className={cx(variantClass, className)}>
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={style}
      className={cx(variantClass, className)}
    >
      {content}
    </button>
  );
}

export function Pill({
  variant = "pill-tag",
  className,
  children,
}: {
  variant?: "pill-tag" | "tag" | "feed-tag";
  className?: string;
  children: ReactNode;
}) {
  const cls =
    variant === "tag"
      ? "t-tag"
      : variant === "feed-tag"
      ? "t-feed-item__tag"
      : "t-pill-tag";
  return <span className={cx(cls, className)}>{children}</span>;
}

export function Chip({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <span className={cx("t-chip", className)}>{children}</span>;
}

export function Badge({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <span className={cx("t-badge", className)}>{children}</span>;
}

export function Eyebrow({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <p className={cx("t-eyebrow", className)}>{children}</p>;
}

export function Display({
  as: Tag = "h1",
  className,
  children,
}: {
  as?: "h1" | "h2" | "p";
  className?: string;
  children: ReactNode;
}) {
  return <Tag className={cx("t-display", className)}>{children}</Tag>;
}

export function ScriptHeading({
  as: Tag = "h3",
  size = "default",
  style,
  className,
  children,
}: {
  as?: "h1" | "h2" | "h3" | "p";
  size?: "default" | "xl";
  style?: CSSProperties;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      style={style}
      className={cx(
        "t-script-heading",
        size === "xl" && "t-script-heading--xl",
        className
      )}
    >
      {children}
    </Tag>
  );
}

export function MonoMeta({
  as: Tag = "span",
  className,
  style,
  children,
}: {
  as?: "span" | "time" | "div";
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <Tag style={style} className={cx("t-mono-meta", className)}>
      {children}
    </Tag>
  );
}

export function Prose({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cx("t-prose model-prose", className)}>{children}</div>;
}

export function Panel({
  variant = "default",
  style,
  className,
  children,
}: {
  variant?: "default" | "card";
  style?: CSSProperties;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      style={style}
      className={cx("t-panel", variant === "card" && "t-panel--card", className)}
    >
      {children}
    </div>
  );
}

export function Sticker({
  src,
  alt = "",
  className,
}: {
  src: string;
  alt?: string;
  className?: string;
}) {
  return <img className={cx("t-sticker", className)} src={src} alt={alt} />;
}

/**
 * Fit-to-width giant footer wordmark.
 * Uses CSS container queries and `--chars` grapheme count so any 1-12 char
 * wordmark scales cleanly without horizontal overflow or runtime JS.
 */
export function Wordmark({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const charCount = Math.max(1, [...text].length);
  return (
    <div className="t-wordmark-wrap" aria-hidden="true">
      <p
        className={cx("t-wordmark", className)}
        style={{ "--chars": charCount } as CSSProperties}
      >
        {text}
      </p>
    </div>
  );
}
