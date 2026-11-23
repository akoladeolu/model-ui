import {
  ACCENT_PRESETS,
  PRESET_NAMES,
  customAccentSchema,
  defineSiteConfig,
  imageRefSchema,
  isValidIanaZone,
  parseHexToRgb,
  relativeLuminance,
  resolveAccent,
  siteConfigSchema,
  toCssVarStyleText,
  toCssVars
} from "./chunk-MTXR4F6S.js";

// src/primitives/index.tsx
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}
function ThemeStyle({
  config,
  storageKey = "model-ui-theme"
}) {
  const cssText = toCssVarStyleText(config);
  const defaultMode = config.theme.defaultMode ?? "system";
  const initScript = `(function(){try{var k=${JSON.stringify(
    storageKey
  )},d=${JSON.stringify(
    defaultMode
  )},s=localStorage.getItem(k)||d,m=s==="system"?(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):s;document.documentElement.setAttribute("data-theme",m);document.documentElement.classList.toggle("dark",m==="dark");}catch(e){}})();`;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "style",
      {
        id: "model-ui-theme-vars",
        dangerouslySetInnerHTML: { __html: cssText }
      }
    ),
    /* @__PURE__ */ jsx(
      "script",
      {
        id: "model-ui-theme-init",
        dangerouslySetInnerHTML: { __html: initScript }
      }
    )
  ] });
}
function Page({
  surface = "paper",
  rails = "narrow",
  className,
  children
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cx(
        "t-page",
        surface === "reading" && "t-page--reading",
        rails !== "none" && "t-rails",
        rails === "wide" && "t-rails--wide",
        className
      ),
      children
    }
  );
}
function Column({
  pad = false,
  id,
  as: Tag = "div",
  style,
  className,
  children
}) {
  return /* @__PURE__ */ jsx(Tag, { id, style, className: cx("t-column", pad && "t-pad", className), children });
}
function Rails({
  variant = "narrow",
  className,
  children
}) {
  return /* @__PURE__ */ jsx("div", { className: cx("t-rails", variant === "wide" && "t-rails--wide", className), children });
}
function Section({
  size = "default",
  pad = false,
  column = false,
  id,
  style,
  className,
  children
}) {
  return /* @__PURE__ */ jsx(
    "section",
    {
      id,
      style,
      className: cx(
        size === "lg" ? "t-section--lg" : "t-section",
        column && "t-column",
        pad && "t-pad",
        className
      ),
      children
    }
  );
}
function HatchDivider({ className }) {
  return /* @__PURE__ */ jsx("div", { className: cx("t-divider", className), "aria-hidden": "true" });
}
function Button({
  variant = "cta",
  size = "default",
  href,
  onClick,
  type = "button",
  disabled,
  orb,
  className,
  style,
  children
}) {
  const variantClass = variant === "cta" ? "t-btn" : variant === "light" ? "t-btn t-btn--light" : variant === "surface" ? "t-btn t-btn--surface" : variant === "solid" ? cx("t-btn-solid", size === "lg" && "t-btn-solid--lg") : "t-btn-ghost";
  const content = /* @__PURE__ */ jsxs(Fragment, { children: [
    children,
    orb !== void 0 && /* @__PURE__ */ jsx("span", { className: "t-btn__orb", children: orb })
  ] });
  if (href) {
    return /* @__PURE__ */ jsx("a", { href, style, className: cx(variantClass, className), children: content });
  }
  return /* @__PURE__ */ jsx(
    "button",
    {
      type,
      disabled,
      onClick,
      style,
      className: cx(variantClass, className),
      children: content
    }
  );
}
function Pill({
  variant = "pill-tag",
  className,
  children
}) {
  const cls = variant === "tag" ? "t-tag" : variant === "feed-tag" ? "t-feed-item__tag" : "t-pill-tag";
  return /* @__PURE__ */ jsx("span", { className: cx(cls, className), children });
}
function Chip({
  className,
  children
}) {
  return /* @__PURE__ */ jsx("span", { className: cx("t-chip", className), children });
}
function Badge({
  className,
  children
}) {
  return /* @__PURE__ */ jsx("span", { className: cx("t-badge", className), children });
}
function Eyebrow({
  className,
  children
}) {
  return /* @__PURE__ */ jsx("p", { className: cx("t-eyebrow", className), children });
}
function Display({
  as: Tag = "h1",
  className,
  children
}) {
  return /* @__PURE__ */ jsx(Tag, { className: cx("t-display", className), children });
}
function ScriptHeading({
  as: Tag = "h3",
  size = "default",
  style,
  className,
  children
}) {
  return /* @__PURE__ */ jsx(
    Tag,
    {
      style,
      className: cx(
        "t-script-heading",
        size === "xl" && "t-script-heading--xl",
        className
      ),
      children
    }
  );
}
function MonoMeta({
  as: Tag = "span",
  className,
  style,
  children
}) {
  return /* @__PURE__ */ jsx(Tag, { style, className: cx("t-mono-meta", className), children });
}
function Prose({
  className,
  children
}) {
  return /* @__PURE__ */ jsx("div", { className: cx("t-prose model-prose", className), children });
}
function Panel({
  variant = "default",
  style,
  className,
  children
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      style,
      className: cx("t-panel", variant === "card" && "t-panel--card", className),
      children
    }
  );
}
function Sticker({
  src,
  alt = "",
  className
}) {
  return /* @__PURE__ */ jsx("img", { className: cx("t-sticker", className), src, alt });
}
function Wordmark({
  text,
  className
}) {
  const charCount = Math.max(1, [...text].length);
  return /* @__PURE__ */ jsx("div", { className: "t-wordmark-wrap", "aria-hidden": "true", children: /* @__PURE__ */ jsx(
    "p",
    {
      className: cx("t-wordmark", className),
      style: { "--chars": charCount },
      children: text
    }
  ) });
}

// src/blocks/index.tsx
import React from "react";
import { Clock, ThemeToggle } from "./client.js";
import { Fragment as Fragment2, jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
function DockNav({
  config,
  activePath,
  staticPosition = false,
  className
}) {
  return /* @__PURE__ */ jsx2(
    "nav",
    {
      className: cx(
        "t-nav t-nav-drop",
        staticPosition && "t-nav--static",
        className
      ),
      "aria-label": "Primary",
      children: /* @__PURE__ */ jsxs2("div", { className: "t-nav__bar", children: [
        /* @__PURE__ */ jsx2("a", { href: "/", "aria-label": `${config.brand.name} home`, children: config.brand.avatar ? /* @__PURE__ */ jsx2(
          "img",
          {
            className: "t-nav__avatar",
            src: config.brand.avatar.src,
            alt: config.brand.avatar.alt || config.brand.name
          }
        ) : /* @__PURE__ */ jsx2(
          "span",
          {
            className: "t-nav__avatar",
            style: {
              display: "grid",
              placeItems: "center",
              background: "var(--t-paper)",
              color: "var(--t-ink)",
              fontWeight: 700,
              fontSize: ".75rem"
            },
            children: config.brand.logo
          }
        ) }),
        /* @__PURE__ */ jsx2("div", { className: "t-nav__links", children: config.nav.map((item) => {
          const isActive = activePath && (activePath === item.href || item.href !== "/" && activePath.startsWith(item.href));
          return /* @__PURE__ */ jsx2(
            "a",
            {
              className: "t-nav__link",
              href: item.href,
              "aria-current": isActive ? "page" : void 0,
              children: item.label
            },
            item.href
          );
        }) }),
        /* @__PURE__ */ jsxs2("div", { className: "t-nav__actions", children: [
          /* @__PURE__ */ jsx2(ThemeToggle, {}),
          config.socials.x && /* @__PURE__ */ jsx2(
            "a",
            {
              className: "t-icon-btn",
              href: config.socials.x,
              "aria-label": "X",
              target: "_blank",
              rel: "noopener noreferrer",
              children: /* @__PURE__ */ jsx2("svg", { viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx2("path", { d: "M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.77L17.75 3Zm-1.08 16.2h1.7L7.4 4.73H5.58L16.67 19.2Z" }) })
            }
          ),
          config.socials.github && /* @__PURE__ */ jsx2(
            "a",
            {
              className: "t-icon-btn",
              href: config.socials.github,
              "aria-label": "GitHub",
              target: "_blank",
              rel: "noopener noreferrer",
              children: /* @__PURE__ */ jsx2("svg", { viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx2("path", { d: "M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" }) })
            }
          )
        ] })
      ] })
    }
  );
}
function Hero({
  config,
  headline,
  subline,
  trailingLine,
  lede,
  badges = [
    { label: "TS", color: "#3178c6" },
    { label: "\u2726" },
    { label: "\u25D0" }
  ],
  ctaLabel = "explore work",
  ctaHref = "#projects",
  secondaryActions,
  illustration
}) {
  return /* @__PURE__ */ jsx2(
    "section",
    {
      id: "top",
      className: "t-column",
      style: { overflow: "hidden" },
      children: /* @__PURE__ */ jsxs2(
        "div",
        {
          className: "t-pad",
          style: {
            paddingTop: "5rem",
            display: "flex",
            flexDirection: "column"
          },
          children: [
            illustration ?? /* @__PURE__ */ jsx2(
              "div",
              {
                role: "img",
                "aria-label": `${config.brand.name} banner`,
                style: {
                  aspectRatio: "3.9 / 1",
                  width: "100%",
                  borderRadius: "var(--t-radius-xs)",
                  background: "radial-gradient(120% 90% at 20% 120%, #2b4fd8 0 22%, transparent 23%), radial-gradient(60% 60% at 10% 110%, #6b8cff 0 30%, transparent 31%), radial-gradient(140% 70% at 70% 100%, #5f9c2f 0 45%, transparent 46%), radial-gradient(160% 80% at 40% 115%, #9ccf4a 0 50%, transparent 51%), linear-gradient(#bcd8f0, #e8f1f6 60%)"
                }
              }
            ),
            /* @__PURE__ */ jsxs2(
              "div",
              {
                style: {
                  marginTop: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start"
                },
                children: [
                  /* @__PURE__ */ jsx2("h1", { className: "t-display t-reveal", children: headline ?? /* @__PURE__ */ jsxs2(Fragment2, { children: [
                    config.brand.name.toLowerCase(),
                    "...",
                    " ",
                    /* @__PURE__ */ jsx2("span", { className: "t-muted", children: "builds" }),
                    " systems."
                  ] }) }),
                  /* @__PURE__ */ jsxs2(
                    "h2",
                    {
                      className: "t-subline t-reveal",
                      style: { "--d": 1 },
                      children: [
                        /* @__PURE__ */ jsx2("span", { children: subline ?? /* @__PURE__ */ jsxs2(Fragment2, { children: [
                          /* @__PURE__ */ jsx2("span", { className: "t-muted", children: "&" }),
                          " ",
                          /* @__PURE__ */ jsx2("span", { className: "t-ink", children: "interfaces" })
                        ] }) }),
                        badges.length > 0 && /* @__PURE__ */ jsx2("span", { className: "t-badges", "aria-hidden": "true", children: badges.map((b, i) => /* @__PURE__ */ jsx2(
                          "span",
                          {
                            style: b.color ? { color: b.color } : void 0,
                            children: b.label
                          },
                          i
                        )) })
                      ]
                    }
                  ),
                  trailingLine !== null && /* @__PURE__ */ jsx2(
                    "p",
                    {
                      className: "t-subline t-subline--trail t-reveal",
                      style: { "--d": 2 },
                      children: trailingLine ?? config.brand.tagline.toLowerCase()
                    }
                  ),
                  lede !== null && /* @__PURE__ */ jsx2(
                    "p",
                    {
                      className: "t-lede t-reveal",
                      style: { "--d": 3 },
                      children: lede ?? config.brand.tagline
                    }
                  ),
                  /* @__PURE__ */ jsxs2(
                    "div",
                    {
                      className: "t-reveal",
                      style: {
                        "--d": 4,
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                        marginTop: "1.5rem"
                      },
                      children: [
                        /* @__PURE__ */ jsx2(Button, { variant: "cta", href: ctaHref, children: ctaLabel }),
                        secondaryActions
                      ]
                    }
                  )
                ]
              }
            )
          ]
        }
      )
    }
  );
}
var DEFAULT_ARC_GRADIENTS = [
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
  ["#d6e6e2", "#4f7d73"]
];
function ArcGallery({
  items,
  height,
  className
}) {
  const resolved = items && items.length > 0 ? items : DEFAULT_ARC_GRADIENTS.map((g, i) => ({
    id: `arc-${i}`,
    gradient: g
  }));
  return /* @__PURE__ */ jsx2(
    "div",
    {
      className: cx("t-arc", className),
      style: height ? { height } : void 0,
      "aria-hidden": "true",
      children: /* @__PURE__ */ jsx2(
        "div",
        {
          className: "t-arc__track",
          style: { "--n": resolved.length },
          children: resolved.map((item, i) => {
            const [c1, c2] = item.gradient ?? ["#d9d4cc", "#a89f92"];
            return /* @__PURE__ */ jsx2(
              "div",
              {
                className: "t-arc__item",
                style: {
                  "--i": i,
                  background: `linear-gradient(135deg, ${c1}, ${c2})`
                },
                children: item.image && /* @__PURE__ */ jsx2("img", { src: item.image.src, alt: item.image.alt || "" })
              },
              item.id ?? i
            );
          })
        }
      )
    }
  );
}
function Statement({
  children,
  className
}) {
  return /* @__PURE__ */ jsx2("p", { className: cx("t-script-paragraph t-reveal", className), children });
}
var DEFAULT_POLAROIDS = [
  { caption: "ink #151515", gradient: ["#f0e2c8", "#b98c56"], rotationDeg: -10 },
  { caption: "paper #efefef", gradient: ["#1b1f2c", "#0b0c10"], rotationDeg: -6 },
  { caption: "reading #fbfbfb", gradient: ["#fafafa", "#cfcfcf"], rotationDeg: -1 },
  { caption: "night #0d0e0e", gradient: ["#e43c2f", "#7a130c"], rotationDeg: 4 },
  { caption: "stage below.", gradient: ["#f2a640", "#6b3410"], rotationDeg: 8 }
];
function Polaroids({
  items = DEFAULT_POLAROIDS,
  heading = "off screen."
}) {
  const defaultAngles = [-10, -6, -1, 4, 8];
  return /* @__PURE__ */ jsxs2("div", { style: { width: "100%", marginTop: "4rem" }, children: [
    heading && /* @__PURE__ */ jsx2(
      "h3",
      {
        className: "t-script-heading",
        style: { margin: "0 0 2rem 2rem" },
        children: heading
      }
    ),
    /* @__PURE__ */ jsx2("div", { className: "t-polaroids", role: "list", children: items.map((item, idx) => {
      const rot = item.rotationDeg ?? defaultAngles[idx % defaultAngles.length];
      const [c1, c2] = item.gradient ?? ["#d9d4cc", "#a89f92"];
      const words = item.caption.split(/\s+/);
      return /* @__PURE__ */ jsxs2(
        "div",
        {
          className: "t-polaroid",
          role: "listitem",
          tabIndex: 0,
          style: {
            "--r": `${rot}deg`,
            zIndex: idx
          },
          children: [
            /* @__PURE__ */ jsx2(
              "div",
              {
                className: "t-polaroid__img",
                style: {
                  background: `linear-gradient(135deg, ${c1}, ${c2})`
                },
                children: item.image && /* @__PURE__ */ jsx2("img", { src: item.image.src, alt: item.image.alt })
              }
            ),
            /* @__PURE__ */ jsx2("span", { className: "t-polaroid__caption", children: words.map((w, wi) => /* @__PURE__ */ jsxs2(React.Fragment, { children: [
              /* @__PURE__ */ jsx2("span", { style: { "--i": wi }, children: w }),
              wi < words.length - 1 ? " " : ""
            ] }, wi)) })
          ]
        },
        item.id ?? idx
      );
    }) })
  ] });
}
function ContributionHeatmap({
  totalContributions = "2,534",
  subtitle = "select a day to explore",
  weeks = 38,
  values,
  className
}) {
  const levels = [0.06, 0.06, 0.2, 0.45, 0.7, 1];
  const cellCount = weeks * 7;
  const cells = values && values.length > 0 ? values : Array.from({ length: cellCount }, (_, i) => {
    const hash = (i * 2654435761 >>> 0) % 17;
    if (hash < 7) return 0.06;
    if (hash < 11) return 0.2;
    if (hash < 14) return 0.45;
    if (hash < 16) return 0.7;
    return 1;
  });
  return /* @__PURE__ */ jsxs2("div", { className: cx("t-panel", className), children: [
    /* @__PURE__ */ jsxs2("div", { className: "t-panel__head", children: [
      /* @__PURE__ */ jsxs2("span", { children: [
        /* @__PURE__ */ jsx2("strong", { children: totalContributions }),
        " contributions in the last year"
      ] }),
      /* @__PURE__ */ jsx2("span", { children: subtitle })
    ] }),
    /* @__PURE__ */ jsx2("div", { className: "t-heatmap", "aria-hidden": "true", children: cells.map((alpha, i) => /* @__PURE__ */ jsx2(
      "i",
      {
        style: {
          "--a": levels.includes(alpha) ? alpha : alpha
        }
      },
      i
    )) }),
    /* @__PURE__ */ jsxs2("div", { className: "t-heatmap-legend", children: [
      "less",
      " ",
      [0.06, 0.2, 0.45, 0.7, 1].map((a) => /* @__PURE__ */ jsx2("i", { style: { "--a": a } }, a)),
      " ",
      "more"
    ] })
  ] });
}
function PostList({
  posts,
  blogBasePath = "/blog"
}) {
  return /* @__PURE__ */ jsx2("div", { className: "t-list", children: posts.map((post) => /* @__PURE__ */ jsx2(
    "a",
    {
      className: "t-post",
      href: `${blogBasePath}/${post.slug}`,
      children: /* @__PURE__ */ jsxs2("div", { className: "t-post__main", children: [
        /* @__PURE__ */ jsxs2("div", { children: [
          /* @__PURE__ */ jsx2("h3", { className: "t-post__title", children: post.title }),
          /* @__PURE__ */ jsx2("p", { className: "t-post__excerpt", children: post.description })
        ] }),
        /* @__PURE__ */ jsx2("div", { className: "t-post__tags", children: post.tags.map((t) => /* @__PURE__ */ jsx2("span", { className: "t-tag", children: t }, t)) }),
        /* @__PURE__ */ jsxs2("div", { className: "t-post__stats", children: [
          /* @__PURE__ */ jsx2("span", { children: post.date }),
          typeof post.reads === "number" && /* @__PURE__ */ jsxs2(Fragment2, { children: [
            /* @__PURE__ */ jsx2("span", { children: "\xB7" }),
            /* @__PURE__ */ jsxs2("span", { children: [
              post.reads,
              " reads"
            ] })
          ] }),
          typeof post.likes === "number" && /* @__PURE__ */ jsxs2(Fragment2, { children: [
            /* @__PURE__ */ jsx2("span", { children: "\xB7" }),
            /* @__PURE__ */ jsxs2("span", { children: [
              "\u2665 ",
              post.likes
            ] })
          ] })
        ] })
      ] })
    },
    post.slug
  )) });
}
function Footer({
  config,
  year = 2026,
  className
}) {
  const contactHref = config.socials.email ? `mailto:${config.socials.email}` : "#contact";
  return /* @__PURE__ */ jsxs2("footer", { className: cx("t-footer", className), id: "contact", children: [
    /* @__PURE__ */ jsx2("div", { className: "t-footer__dots" }),
    /* @__PURE__ */ jsxs2("div", { className: "t-footer__inner", children: [
      /* @__PURE__ */ jsx2(
        "span",
        {
          className: "t-nav__avatar",
          style: {
            display: "grid",
            placeItems: "center",
            background: "#fff",
            color: "#151515",
            fontWeight: 700,
            fontSize: ".75rem",
            borderRadius: ".6rem"
          },
          children: config.brand.logo
        }
      ),
      /* @__PURE__ */ jsx2("h2", { className: "t-footer__title", children: config.brand.footerHeadline }),
      /* @__PURE__ */ jsx2(
        Button,
        {
          variant: "light",
          href: contactHref,
          style: { marginTop: "1.25rem", width: "fit-content" },
          orb: /* @__PURE__ */ jsx2(
            "svg",
            {
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              children: /* @__PURE__ */ jsx2("path", { d: "M5 12h14M13 6l6 6-6 6" })
            }
          ),
          children: config.brand.footerCtaLabel
        }
      ),
      /* @__PURE__ */ jsxs2("div", { className: "t-footer__bar", children: [
        /* @__PURE__ */ jsxs2("div", { className: "t-footer__group", children: [
          /* @__PURE__ */ jsxs2("span", { children: [
            "\xA9 ",
            year,
            " ",
            config.brand.name
          ] }),
          config.location && /* @__PURE__ */ jsx2(
            Clock,
            {
              city: config.location.city,
              timeZone: config.location.timeZone,
              locale: config.location.locale
            }
          )
        ] }),
        /* @__PURE__ */ jsxs2("div", { className: "t-footer__group", children: [
          config.socials.x && /* @__PURE__ */ jsx2(
            "a",
            {
              className: "t-social",
              href: config.socials.x,
              "aria-label": "X",
              target: "_blank",
              rel: "noopener noreferrer",
              children: /* @__PURE__ */ jsx2("svg", { viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx2("path", { d: "M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.77L17.75 3Zm-1.08 16.2h1.7L7.4 4.73H5.58L16.67 19.2Z" }) })
            }
          ),
          config.socials.github && /* @__PURE__ */ jsx2(
            "a",
            {
              className: "t-social",
              href: config.socials.github,
              "aria-label": "GitHub",
              target: "_blank",
              rel: "noopener noreferrer",
              children: /* @__PURE__ */ jsx2("svg", { viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx2("path", { d: "M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" }) })
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs2("div", { className: "t-footer__stage", children: [
      /* @__PURE__ */ jsx2(
        "div",
        {
          className: "t-footer__scene",
          style: {
            background: "linear-gradient(135deg, #2b4fd8 0%, #5f9c2f 55%, #9ccf4a 100%)"
          }
        }
      ),
      /* @__PURE__ */ jsx2(Wordmark, { text: config.brand.wordmark })
    ] })
  ] });
}
function SiteShell({
  config,
  surface = "paper",
  rails = "narrow",
  activePath,
  hideFooter = false,
  children
}) {
  return /* @__PURE__ */ jsxs2(Page, { surface, rails, children: [
    /* @__PURE__ */ jsx2(DockNav, { config, activePath }),
    children,
    !hideFooter && /* @__PURE__ */ jsx2(Footer, { config })
  ] });
}
function Pagination({
  currentPage = 1,
  totalPages = 1,
  prevHref,
  nextHref
}) {
  return /* @__PURE__ */ jsxs2("nav", { className: "t-pagination", "aria-label": "Pagination", children: [
    prevHref && currentPage > 1 ? /* @__PURE__ */ jsx2("a", { className: "t-page-btn", href: prevHref, children: "Previous" }) : /* @__PURE__ */ jsx2("button", { className: "t-page-btn", type: "button", disabled: true, children: "Previous" }),
    /* @__PURE__ */ jsxs2("span", { className: "t-page-status", children: [
      "Page ",
      currentPage,
      " of ",
      totalPages
    ] }),
    nextHref && currentPage < totalPages ? /* @__PURE__ */ jsx2("a", { className: "t-page-btn", href: nextHref, children: "Next" }) : /* @__PURE__ */ jsx2(
      "button",
      {
        className: "t-page-btn",
        type: "button",
        disabled: currentPage >= totalPages,
        children: "Next"
      }
    )
  ] });
}

// src/templates/index.tsx
import {
  ArticleInteractiveShell,
  FilterableBlogFeed,
  FilterableProjectGrid
} from "./client.js";
import { Fragment as Fragment3, jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
var DEFAULT_STICKER_HEX = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23151515'/%3E%3Cpath d='M16 7l8 5v8l-8 5-8-5v-8z' fill='%23efefef'/%3E%3C/svg%3E";
var DEFAULT_STICKER_DOTS = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23222'/%3E%3Ccircle cx='12' cy='10' r='4' fill='%23f24e1e'/%3E%3Ccircle cx='20' cy='10' r='4' fill='%23ff7262'/%3E%3Ccircle cx='12' cy='17' r='4' fill='%23a259ff'/%3E%3Ccircle cx='20' cy='17' r='4' fill='%231abcfe'/%3E%3Ccircle cx='12' cy='24' r='4' fill='%230acf83'/%3E%3C/svg%3E";
function HomeTemplate({
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
  withShell = true
}) {
  const body = /* @__PURE__ */ jsxs3("main", { style: { width: "100%" }, children: [
    /* @__PURE__ */ jsx3(
      Hero,
      {
        config,
        headline: heroHeadline,
        subline: heroSubline,
        trailingLine: heroTrailingLine,
        lede: heroLede,
        badges: heroBadges,
        ctaLabel: heroCtaLabel,
        ctaHref: heroCtaHref,
        secondaryActions: heroSecondaryActions
      }
    ),
    /* @__PURE__ */ jsx3("div", { className: "t-column", style: { marginTop: "2rem" }, children: /* @__PURE__ */ jsx3(ArcGallery, { items: arcItems }) }),
    /* @__PURE__ */ jsx3(HatchDivider, {}),
    /* @__PURE__ */ jsxs3(
      "section",
      {
        className: "t-column t-section--lg t-pad",
        style: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        },
        children: [
          /* @__PURE__ */ jsx3(Statement, { children: statementContent ?? /* @__PURE__ */ jsxs3(Fragment3, { children: [
            "lowercase, always. ",
            /* @__PURE__ */ jsx3(Sticker, { src: DEFAULT_STICKER_HEX }),
            " ink fades instead of changing colour. the handwriting is where the personality lives, ",
            /* @__PURE__ */ jsx3(Sticker, { src: DEFAULT_STICKER_DOTS }),
            " and things you can touch get a little tilt. the colour is hiding in the footer."
          ] }) }),
          /* @__PURE__ */ jsx3(Polaroids, { items: polaroids }),
          /* @__PURE__ */ jsx3("div", { style: { width: "100%", marginTop: "3.5rem" }, children: /* @__PURE__ */ jsx3(ContributionHeatmap, { totalContributions }) })
        ]
      }
    ),
    /* @__PURE__ */ jsx3(HatchDivider, {}),
    /* @__PURE__ */ jsxs3("section", { id: "projects", className: "t-column t-pad t-section", children: [
      /* @__PURE__ */ jsx3(
        "div",
        {
          style: {
            display: "flex",
            flexWrap: "wrap",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: "1rem",
            marginBottom: "1.75rem"
          },
          children: /* @__PURE__ */ jsx3("h2", { className: "t-statement t-reveal", children: "selected work." })
        }
      ),
      /* @__PURE__ */ jsx3(
        FilterableProjectGrid,
        {
          projects,
          caseStudyBasePath
        }
      )
    ] }),
    posts.length > 0 && /* @__PURE__ */ jsxs3(Fragment3, { children: [
      /* @__PURE__ */ jsx3(HatchDivider, {}),
      /* @__PURE__ */ jsxs3("section", { id: "writing", className: "t-column t-pad t-section", children: [
        /* @__PURE__ */ jsxs3(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginBottom: "1.5rem"
            },
            children: [
              /* @__PURE__ */ jsx3("h2", { className: "t-statement t-reveal", children: "recent thoughts." }),
              /* @__PURE__ */ jsxs3("a", { className: "t-link-arrow", href: blogBasePath, children: [
                "all posts",
                " ",
                /* @__PURE__ */ jsx3(
                  "svg",
                  {
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                    children: /* @__PURE__ */ jsx3("path", { d: "M7 17 17 7M8 7h9v9" })
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsx3(PostList, { posts, blogBasePath })
      ] })
    ] }),
    extraSections
  ] });
  if (!withShell) return body;
  return /* @__PURE__ */ jsx3(SiteShell, { config, surface: "paper", rails: "narrow", activePath: "/", children: body });
}
function BlogIndexTemplate({
  config,
  posts,
  heroTitle = "thoughts.",
  heroSub = "thoughts on design, systems engineering, and everything in between.",
  currentPage = 1,
  totalPages = 1,
  prevHref,
  nextHref,
  blogBasePath = "/blog",
  withShell = true
}) {
  const body = /* @__PURE__ */ jsxs3("main", { className: "t-blog-index", children: [
    /* @__PURE__ */ jsxs3("header", { className: "t-blog-hero t-reveal", children: [
      /* @__PURE__ */ jsx3("h1", { className: "t-blog-hero__title", children: heroTitle }),
      /* @__PURE__ */ jsx3("p", { className: "t-blog-hero__sub", children: heroSub })
    ] }),
    /* @__PURE__ */ jsx3(FilterableBlogFeed, { posts, blogBasePath }),
    /* @__PURE__ */ jsx3(
      Pagination,
      {
        currentPage,
        totalPages,
        prevHref,
        nextHref
      }
    )
  ] });
  if (!withShell) return body;
  return /* @__PURE__ */ jsx3(
    SiteShell,
    {
      config,
      surface: "reading",
      rails: "narrow",
      activePath: blogBasePath,
      children: body
    }
  );
}
function BlogPostTemplate({
  config,
  post,
  comments = [],
  backHref = "/blog",
  backLabel = "Back to Blog",
  onLike,
  onBookmark,
  onComment,
  withShell = true,
  children
}) {
  const shareUrl = `${config.seo.siteUrl.replace(/\/$/, "")}/blog/${post.slug}`;
  const body = /* @__PURE__ */ jsxs3("article", { className: "t-article", children: [
    /* @__PURE__ */ jsxs3("a", { className: "t-back-link t-reveal", href: backHref, children: [
      /* @__PURE__ */ jsx3(
        "svg",
        {
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "1.8",
          children: /* @__PURE__ */ jsx3("path", { d: "M15 6 9 12l6 6" })
        }
      ),
      /* @__PURE__ */ jsx3("span", { children: backLabel })
    ] }),
    /* @__PURE__ */ jsx3("h1", { className: "t-article__title t-reveal", children: post.title }),
    /* @__PURE__ */ jsx3(
      "p",
      {
        className: "t-article__deck t-reveal",
        style: { "--d": 1 },
        children: post.description
      }
    ),
    /* @__PURE__ */ jsxs3(
      ArticleInteractiveShell,
      {
        author: config.brand.logo,
        readMinutes: post.readMinutes,
        date: post.date,
        reads: post.reads,
        initialLikes: post.likes ?? 24,
        initialShares: post.shares ?? 4,
        shareUrl,
        shareTitle: post.title,
        tags: post.tags,
        comments,
        onLike,
        onBookmark,
        onComment,
        children: [
          post.cover && /* @__PURE__ */ jsx3("div", { className: "t-article__cover t-reveal", children: /* @__PURE__ */ jsx3("img", { src: post.cover.src, alt: post.cover.alt }) }),
          /* @__PURE__ */ jsx3(Prose, { className: "t-reveal", children: children ?? post.content })
        ]
      }
    )
  ] });
  if (!withShell) return body;
  return /* @__PURE__ */ jsx3(
    SiteShell,
    {
      config,
      surface: "reading",
      rails: "narrow",
      activePath: "/blog",
      children: body
    }
  );
}
function CaseStudyTemplate({
  config,
  project,
  backHref = "/#projects",
  backLabel = "Back to Projects",
  ctaTitle = "Interested in working together?",
  ctaSub = "Let's build something amazing.",
  ctaLabel = "Get in Touch",
  ctaHref,
  withShell = true
}) {
  const resolvedCtaHref = ctaHref ?? (config.socials.email ? `mailto:${config.socials.email}` : "/#contact");
  const monogram = project.monogram ?? project.title.slice(0, 1).toUpperCase();
  const body = /* @__PURE__ */ jsxs3("main", { className: "t-case", children: [
    /* @__PURE__ */ jsxs3("a", { className: "t-back-link t-reveal", href: backHref, children: [
      /* @__PURE__ */ jsx3(
        "svg",
        {
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "1.8",
          children: /* @__PURE__ */ jsx3("path", { d: "M15 6 9 12l6 6" })
        }
      ),
      /* @__PURE__ */ jsx3("span", { children: backLabel })
    ] }),
    /* @__PURE__ */ jsxs3(
      "header",
      {
        className: "t-case__header t-reveal",
        style: { "--d": 1 },
        children: [
          /* @__PURE__ */ jsxs3("div", { className: "t-case__title-row", children: [
            /* @__PURE__ */ jsx3("h1", { className: "t-case__title", children: project.title }),
            /* @__PURE__ */ jsx3("span", { className: "t-case__year", children: project.year })
          ] }),
          /* @__PURE__ */ jsx3("p", { className: "t-case__subtitle", children: project.subtitle }),
          /* @__PURE__ */ jsxs3("div", { className: "t-case__actions", children: [
            project.liveUrl && /* @__PURE__ */ jsxs3("a", { className: "t-btn-solid", href: project.liveUrl, children: [
              /* @__PURE__ */ jsxs3(
                "svg",
                {
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "1.8",
                  children: [
                    /* @__PURE__ */ jsx3("path", { d: "M11 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6" }),
                    /* @__PURE__ */ jsx3("path", { d: "M15 3h6v6M10 14 21 3" })
                  ]
                }
              ),
              /* @__PURE__ */ jsx3("span", { children: "View Live" })
            ] }),
            project.codeUrl && /* @__PURE__ */ jsxs3("a", { className: "t-btn-ghost", href: project.codeUrl, children: [
              /* @__PURE__ */ jsx3("svg", { viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx3("path", { d: "M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" }) }),
              /* @__PURE__ */ jsx3("span", { children: "View Code" })
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsx3(
      "div",
      {
        className: "t-case__hero t-reveal",
        style: { "--d": 2 },
        children: project.cover ? /* @__PURE__ */ jsx3("img", { src: project.cover.src, alt: project.cover.alt }) : /* @__PURE__ */ jsx3("span", { className: "t-case__monogram", children: monogram })
      }
    ),
    /* @__PURE__ */ jsx3(
      "div",
      {
        className: "t-case__tags t-reveal",
        style: { "--d": 3 },
        children: project.tags.map((tag) => /* @__PURE__ */ jsx3("span", { className: "t-pill-tag", children: tag }, tag))
      }
    ),
    /* @__PURE__ */ jsxs3("div", { className: "t-case__body", children: [
      /* @__PURE__ */ jsxs3("section", { className: "t-reveal", children: [
        /* @__PURE__ */ jsx3("h2", { className: "t-case__h2", children: "The Challenge" }),
        /* @__PURE__ */ jsx3("p", { className: "t-case__p", children: project.challenge })
      ] }),
      /* @__PURE__ */ jsxs3("section", { className: "t-reveal", children: [
        /* @__PURE__ */ jsx3("h2", { className: "t-case__h2", children: "The Solution" }),
        /* @__PURE__ */ jsx3("p", { className: "t-case__p", children: project.solution })
      ] }),
      project.impact.length > 0 && /* @__PURE__ */ jsxs3("section", { className: "t-reveal", children: [
        /* @__PURE__ */ jsx3("h2", { className: "t-case__h2 t-case__h2--spaced", children: "Impact" }),
        /* @__PURE__ */ jsx3("ul", { className: "t-case__list", children: project.impact.map((item, i) => /* @__PURE__ */ jsxs3("li", { children: [
          /* @__PURE__ */ jsx3("span", { className: "t-case__marker", children: "\u2022" }),
          /* @__PURE__ */ jsx3("span", { children: item })
        ] }, i)) })
      ] }),
      project.features.length > 0 && /* @__PURE__ */ jsxs3("section", { className: "t-reveal", children: [
        /* @__PURE__ */ jsx3("h2", { className: "t-case__h2 t-case__h2--spaced", children: "Key Features" }),
        /* @__PURE__ */ jsx3("div", { className: "t-feature-grid", children: project.features.map((feat, i) => /* @__PURE__ */ jsx3("div", { className: "t-feature-card", children: /* @__PURE__ */ jsx3("p", { children: feat.title ? `${feat.title} \u2014 ${feat.body}` : feat.body }) }, i)) })
      ] }),
      project.stack.length > 0 && /* @__PURE__ */ jsxs3("section", { className: "t-reveal", children: [
        /* @__PURE__ */ jsx3("h2", { className: "t-case__h2 t-case__h2--spaced", children: "Tech Stack" }),
        /* @__PURE__ */ jsx3("div", { className: "t-stack-grid", children: project.stack.map((item, i) => /* @__PURE__ */ jsxs3("div", { className: "t-stack-item", children: [
          /* @__PURE__ */ jsx3("span", { className: "t-stack-dot" }),
          /* @__PURE__ */ jsx3("span", { children: item })
        ] }, i)) })
      ] }),
      project.lessons.length > 0 && /* @__PURE__ */ jsxs3("section", { className: "t-reveal", children: [
        /* @__PURE__ */ jsx3("h2", { className: "t-case__h2 t-case__h2--spaced", children: "Lessons Learned" }),
        /* @__PURE__ */ jsx3("ul", { className: "t-case__list", children: project.lessons.map((item, i) => /* @__PURE__ */ jsxs3("li", { children: [
          /* @__PURE__ */ jsx3("span", { className: "t-case__marker", children: "\u2192" }),
          /* @__PURE__ */ jsx3("span", { children: item })
        ] }, i)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs3("div", { className: "t-case__cta t-reveal", children: [
      /* @__PURE__ */ jsx3("h3", { className: "t-case__cta-title", children: ctaTitle }),
      /* @__PURE__ */ jsx3("p", { className: "t-case__cta-sub", children: ctaSub }),
      /* @__PURE__ */ jsx3("a", { className: "t-btn-solid t-btn-solid--lg", href: resolvedCtaHref, children: ctaLabel })
    ] })
  ] });
  if (!withShell) return body;
  return /* @__PURE__ */ jsx3(
    SiteShell,
    {
      config,
      surface: "paper",
      rails: "wide",
      hideFooter: true,
      activePath: "/#projects",
      children: body
    }
  );
}
export {
  ACCENT_PRESETS,
  ArcGallery,
  Badge,
  BlogIndexTemplate,
  BlogPostTemplate,
  Button,
  CaseStudyTemplate,
  Chip,
  Column,
  ContributionHeatmap,
  Display,
  DockNav,
  Eyebrow,
  Footer,
  HatchDivider,
  Hero,
  HomeTemplate,
  MonoMeta,
  PRESET_NAMES,
  Page,
  Pagination,
  Panel,
  Pill,
  Polaroids,
  PostList,
  Prose,
  Rails,
  ScriptHeading,
  Section,
  SiteShell,
  Statement,
  Sticker,
  ThemeStyle,
  Wordmark,
  customAccentSchema,
  cx,
  defineSiteConfig,
  imageRefSchema,
  isValidIanaZone,
  parseHexToRgb,
  relativeLuminance,
  resolveAccent,
  siteConfigSchema,
  toCssVarStyleText,
  toCssVars
};
//# sourceMappingURL=index.js.map