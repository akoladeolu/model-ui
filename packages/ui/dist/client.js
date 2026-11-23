"use client";
"use client";

// src/client/islands.tsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var ThemeContext = createContext(null);
function applyDomTheme(mode) {
  if (typeof document === "undefined") return;
  const html = document.documentElement;
  html.setAttribute("data-theme", mode);
  html.classList.toggle("dark", mode === "dark");
}
function readDomTheme(fallback = "light") {
  if (typeof document === "undefined") return fallback;
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "dark" || document.documentElement.classList.contains("dark")) {
    return "dark";
  }
  if (attr === "light") return "light";
  if (typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return fallback;
}
function ThemeProvider({
  defaultMode = "system",
  storageKey = "model-ui-theme",
  children
}) {
  const [mode, setModeState] = useState(
    () => defaultMode === "dark" ? "dark" : "light"
  );
  useEffect(() => {
    let initial = "light";
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored === "dark" || stored === "light") {
        initial = stored;
      } else if (defaultMode === "dark" || defaultMode === "light") {
        initial = defaultMode;
      } else {
        initial = readDomTheme("light");
      }
    } catch {
      initial = readDomTheme(defaultMode === "dark" ? "dark" : "light");
    }
    setModeState(initial);
    applyDomTheme(initial);
  }, [defaultMode, storageKey]);
  const setMode = useCallback(
    (next) => {
      setModeState(next);
      applyDomTheme(next);
      try {
        localStorage.setItem(storageKey, next);
      } catch {
      }
    },
    [storageKey]
  );
  const toggleMode = useCallback(() => {
    const current = readDomTheme(mode);
    setMode(current === "dark" ? "light" : "dark");
  }, [mode, setMode]);
  const value = useMemo(
    () => ({ mode, setMode, toggleMode }),
    [mode, setMode, toggleMode]
  );
  return /* @__PURE__ */ jsx(ThemeContext.Provider, { value, children });
}
function useTheme() {
  const ctx = useContext(ThemeContext);
  const toggleFallback = useCallback(() => {
    const next = readDomTheme("light") === "dark" ? "light" : "dark";
    applyDomTheme(next);
    try {
      localStorage.setItem("model-ui-theme", next);
    } catch {
    }
  }, []);
  if (ctx) return ctx;
  return {
    mode: readDomTheme("light"),
    setMode: applyDomTheme,
    toggleMode: toggleFallback
  };
}
function ThemeToggle({
  className = "",
  label = "Toggle dark mode"
}) {
  const { toggleMode } = useTheme();
  return /* @__PURE__ */ jsxs(
    "button",
    {
      className: `t-icon-btn t-theme-toggle ${className}`.trim(),
      type: "button",
      "aria-label": label,
      title: label,
      onClick: toggleMode,
      "data-theme-toggle": true,
      children: [
        /* @__PURE__ */ jsx(
          "svg",
          {
            className: "t-icon-moon",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "1.8",
            children: /* @__PURE__ */ jsx("path", { d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" })
          }
        ),
        /* @__PURE__ */ jsxs(
          "svg",
          {
            className: "t-icon-sun",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "1.8",
            children: [
              /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "4" }),
              /* @__PURE__ */ jsx("path", { d: "M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" })
            ]
          }
        )
      ]
    }
  );
}
function Clock({
  city,
  timeZone,
  locale = "en-US",
  showStatusDot = true,
  className = ""
}) {
  const [timeText, setTimeText] = useState(null);
  useEffect(() => {
    const formatNow = () => {
      try {
        return new Intl.DateTimeFormat(locale, {
          timeZone,
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          weekday: "long"
        }).format(/* @__PURE__ */ new Date());
      } catch {
        return "--:--";
      }
    };
    const tick = () => {
      if (typeof document !== "undefined" && document.hidden) return;
      setTimeText(formatNow());
    };
    tick();
    const id = window.setInterval(tick, 3e4);
    const onVis = () => {
      if (!document.hidden) tick();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [timeZone, locale]);
  return /* @__PURE__ */ jsxs(
    "span",
    {
      className: `t-mono-meta ${className}`.trim(),
      style: { display: "inline-flex", alignItems: "center", gap: "0.45rem" },
      children: [
        showStatusDot && /* @__PURE__ */ jsx("span", { className: "t-status-dot", "aria-hidden": "true" }),
        /* @__PURE__ */ jsx("span", { children: city.toUpperCase() }),
        /* @__PURE__ */ jsx("time", { "data-testid": "model-ui-clock", children: timeText ?? "--:--" })
      ]
    }
  );
}
function SegmentedFilter({
  options,
  value,
  defaultValue,
  onChange,
  ariaLabel = "Filter items",
  className = ""
}) {
  const [internal, setInternal] = useState(
    defaultValue ?? options[0]?.value ?? "all"
  );
  const active = value ?? internal;
  const handleSelect = (val) => {
    if (value === void 0) setInternal(val);
    onChange?.(val);
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `t-segmented ${className}`.trim(),
      role: "group",
      "aria-label": ariaLabel,
      children: options.map((opt) => /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: "t-segmented__item",
          "aria-pressed": active === opt.value,
          onClick: () => handleSelect(opt.value),
          children: opt.label
        },
        opt.value
      ))
    }
  );
}
function FilterPills({
  tags,
  value,
  defaultValue = "all",
  onChange,
  ariaLabel = "Filter posts by tag",
  className = ""
}) {
  const [internal, setInternal] = useState(defaultValue);
  const active = value ?? internal;
  const select = (tag) => {
    if (value === void 0) setInternal(tag);
    onChange?.(tag);
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `t-filter-pills ${className}`.trim(),
      role: "group",
      "aria-label": ariaLabel,
      children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: "t-filter-pill",
            "aria-pressed": active === "all",
            onClick: () => select("all"),
            children: "All"
          }
        ),
        tags.map((tag) => /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: "t-filter-pill",
            "aria-pressed": active === tag,
            onClick: () => select(tag),
            children: tag
          },
          tag
        ))
      ]
    }
  );
}
function ShareModal({
  open,
  onClose,
  url,
  title = "Share this post"
}) {
  const [copied, setCopied] = useState(false);
  const closeBtnRef = useRef(null);
  useEffect(() => {
    if (!open) {
      setCopied(false);
      return;
    }
    closeBtnRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  const copyLink = async () => {
    setCopied(true);
    try {
      await navigator.clipboard?.writeText(url);
    } catch {
    }
  };
  const shareX = () => {
    const target = `https://x.com/intent/tweet?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(title)}`;
    window.open(target, "_blank", "noopener,noreferrer");
  };
  const shareWhatsApp = () => {
    const target = `https://wa.me/?text=${encodeURIComponent(
      `${title} ${url}`
    )}`;
    window.open(target, "_blank", "noopener,noreferrer");
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "t-modal-backdrop",
      onClick: (e) => {
        if (e.target === e.currentTarget) onClose();
      },
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: "t-modal",
          role: "dialog",
          "aria-modal": "true",
          "aria-labelledby": "model-ui-share-title",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "t-modal__head", children: [
              /* @__PURE__ */ jsx("h3", { className: "t-modal__title", id: "model-ui-share-title", children: "Share this post" }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  ref: closeBtnRef,
                  className: "t-modal__close",
                  type: "button",
                  "aria-label": "Close",
                  onClick: onClose,
                  children: "\u2715"
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "t-modal__url", children: url }),
            /* @__PURE__ */ jsxs("div", { className: "t-modal__list", children: [
              /* @__PURE__ */ jsxs("button", { className: "t-modal__item", type: "button", onClick: copyLink, children: [
                /* @__PURE__ */ jsx("span", { className: "t-modal__orb", children: "\u29C9" }),
                /* @__PURE__ */ jsx("span", { children: copied ? "Copied!" : "Copy link" })
              ] }),
              /* @__PURE__ */ jsxs("button", { className: "t-modal__item", type: "button", onClick: shareX, children: [
                /* @__PURE__ */ jsx("span", { className: "t-modal__orb", children: "\u{1D54F}" }),
                /* @__PURE__ */ jsx("span", { children: "Share on X" })
              ] }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  className: "t-modal__item",
                  type: "button",
                  onClick: shareWhatsApp,
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "t-modal__orb", children: "\u{1F4AC}" }),
                    /* @__PURE__ */ jsx("span", { children: "Share on WhatsApp" })
                  ]
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
function ActionOrbs({
  liked = false,
  bookmarked = false,
  onToggleLike,
  onToggleBookmark,
  onShare
}) {
  return /* @__PURE__ */ jsxs("div", { className: "t-article__actions", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        className: "t-action-orb t-action-orb--like",
        type: "button",
        "aria-label": "Like post",
        "aria-pressed": liked,
        onClick: onToggleLike,
        children: /* @__PURE__ */ jsx(
          "svg",
          {
            viewBox: "0 0 24 24",
            fill: liked ? "currentColor" : "none",
            stroke: "currentColor",
            strokeWidth: "1.7",
            children: /* @__PURE__ */ jsx("path", { d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" })
          }
        )
      }
    ),
    /* @__PURE__ */ jsx(
      "button",
      {
        className: "t-action-orb",
        type: "button",
        "aria-label": "Bookmark post",
        "aria-pressed": bookmarked,
        onClick: onToggleBookmark,
        children: /* @__PURE__ */ jsx(
          "svg",
          {
            viewBox: "0 0 24 24",
            fill: bookmarked ? "currentColor" : "none",
            stroke: "currentColor",
            strokeWidth: "1.7",
            children: /* @__PURE__ */ jsx("path", { d: "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" })
          }
        )
      }
    ),
    /* @__PURE__ */ jsx(
      "button",
      {
        className: "t-action-orb",
        type: "button",
        "aria-label": "Share post",
        onClick: onShare,
        children: /* @__PURE__ */ jsxs(
          "svg",
          {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "1.7",
            children: [
              /* @__PURE__ */ jsx("circle", { cx: "18", cy: "5", r: "3" }),
              /* @__PURE__ */ jsx("circle", { cx: "6", cy: "12", r: "3" }),
              /* @__PURE__ */ jsx("circle", { cx: "18", cy: "19", r: "3" }),
              /* @__PURE__ */ jsx("path", { d: "m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98" })
            ]
          }
        )
      }
    )
  ] });
}
function EngageBar({
  liked,
  likeCount,
  commentCount,
  shareCount = 0,
  commentsOpen,
  onToggleLike,
  onToggleComments,
  onShare
}) {
  return /* @__PURE__ */ jsxs("div", { className: "t-engage-bar", children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        className: "t-engage-btn t-engage-btn--like",
        type: "button",
        "aria-pressed": liked,
        onClick: onToggleLike,
        children: [
          /* @__PURE__ */ jsx(
            "svg",
            {
              viewBox: "0 0 24 24",
              fill: liked ? "currentColor" : "none",
              stroke: "currentColor",
              strokeWidth: "1.7",
              children: /* @__PURE__ */ jsx("path", { d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" })
            }
          ),
          /* @__PURE__ */ jsx("span", { children: likeCount })
        ]
      }
    ),
    /* @__PURE__ */ jsxs(
      "button",
      {
        className: "t-engage-btn",
        type: "button",
        "aria-expanded": commentsOpen,
        onClick: onToggleComments,
        children: [
          /* @__PURE__ */ jsx(
            "svg",
            {
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "1.7",
              children: /* @__PURE__ */ jsx("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" })
            }
          ),
          /* @__PURE__ */ jsx("span", { children: commentCount })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("button", { className: "t-engage-btn", type: "button", onClick: onShare, children: [
      /* @__PURE__ */ jsxs(
        "svg",
        {
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "1.7",
          children: [
            /* @__PURE__ */ jsx("circle", { cx: "18", cy: "5", r: "3" }),
            /* @__PURE__ */ jsx("circle", { cx: "6", cy: "12", r: "3" }),
            /* @__PURE__ */ jsx("circle", { cx: "18", cy: "19", r: "3" }),
            /* @__PURE__ */ jsx("path", { d: "m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98" })
          ]
        }
      ),
      /* @__PURE__ */ jsx("span", { children: shareCount })
    ] })
  ] });
}
function CommentThread({
  comments: initialComments,
  onAddComment
}) {
  const [comments, setComments] = useState(initialComments);
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!body.trim()) return;
    const nextAuthor = author.trim() || "Guest";
    const newComment = {
      id: `c-${Date.now()}`,
      author: nextAuthor,
      date: "Just now",
      body: body.trim(),
      likes: 0
    };
    setComments((prev) => [newComment, ...prev]);
    onAddComment?.(nextAuthor, body.trim());
    setBody("");
  };
  return /* @__PURE__ */ jsxs("section", { className: "t-comments", children: [
    /* @__PURE__ */ jsxs("h3", { className: "t-comments__title", children: [
      comments.length,
      " ",
      comments.length === 1 ? "Comment" : "Comments"
    ] }),
    /* @__PURE__ */ jsxs("form", { className: "t-comment-form", onSubmit: handleSubmit, children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          className: "t-input",
          type: "text",
          placeholder: "Your name",
          "aria-label": "Your name",
          value: author,
          onChange: (e) => setAuthor(e.target.value)
        }
      ),
      /* @__PURE__ */ jsx(
        "textarea",
        {
          className: "t-textarea",
          rows: 3,
          placeholder: "Share your thoughts...",
          "aria-label": "Share your thoughts",
          value: body,
          onChange: (e) => setBody(e.target.value)
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "t-comment-form__actions", children: /* @__PURE__ */ jsx("button", { className: "t-btn-solid", type: "submit", children: "Post comment" }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "t-comment-list", children: comments.map((c) => /* @__PURE__ */ jsxs("div", { className: "t-comment", children: [
      /* @__PURE__ */ jsx("div", { className: "t-comment__avatar", children: c.author.slice(0, 1).toUpperCase() }),
      /* @__PURE__ */ jsxs("div", { className: "t-comment__main", children: [
        /* @__PURE__ */ jsxs("div", { className: "t-comment__bubble", children: [
          /* @__PURE__ */ jsx("p", { className: "t-comment__author", children: c.author }),
          /* @__PURE__ */ jsx("p", { className: "t-comment__text", children: c.body })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "t-comment__meta", children: [
          /* @__PURE__ */ jsx("span", { children: c.date }),
          typeof c.likes === "number" && /* @__PURE__ */ jsxs(
            "button",
            {
              className: "t-comment__action t-comment__action--like",
              type: "button",
              children: [
                "\u2665 ",
                c.likes
              ]
            }
          )
        ] }),
        c.replies && c.replies.length > 0 && /* @__PURE__ */ jsx("div", { className: "t-comment__replies", children: c.replies.map((r) => /* @__PURE__ */ jsxs("div", { className: "t-comment", children: [
          /* @__PURE__ */ jsx("div", { className: "t-comment__avatar t-comment__avatar--sm", children: r.author.slice(0, 1).toUpperCase() }),
          /* @__PURE__ */ jsx("div", { className: "t-comment__main", children: /* @__PURE__ */ jsxs("div", { className: "t-comment__bubble t-comment__bubble--sm", children: [
            /* @__PURE__ */ jsx("p", { className: "t-comment__author", children: r.author }),
            /* @__PURE__ */ jsx(
              "p",
              {
                className: "t-comment__text",
                style: { fontSize: "0.75rem" },
                children: r.body
              }
            )
          ] }) })
        ] }, r.id)) })
      ] })
    ] }, c.id)) })
  ] });
}
function ArticleInteractiveShell({
  author,
  readMinutes,
  date,
  reads,
  initialLikes = 24,
  initialShares = 4,
  shareUrl,
  shareTitle,
  tags,
  comments = [],
  onLike,
  onBookmark,
  onComment,
  children
}) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [bookmarked, setBookmarked] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(true);
  const [shareOpen, setShareOpen] = useState(false);
  const toggleLike = () => {
    const next = !liked;
    setLiked(next);
    setLikeCount((c) => c + (next ? 1 : -1));
    onLike?.(next);
  };
  const toggleBookmark = () => {
    const next = !bookmarked;
    setBookmarked(next);
    onBookmark?.(next);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "t-article__bar t-reveal", style: { "--d": 2 }, children: [
      /* @__PURE__ */ jsxs("div", { className: "t-article__byline", children: [
        /* @__PURE__ */ jsx("span", { className: "t-article__author", children: author }),
        /* @__PURE__ */ jsx("span", { children: "\xB7" }),
        /* @__PURE__ */ jsxs("span", { children: [
          readMinutes,
          " min read"
        ] }),
        /* @__PURE__ */ jsx("span", { children: "\xB7" }),
        /* @__PURE__ */ jsx("span", { children: date }),
        typeof reads === "number" && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("span", { children: "\xB7" }),
          /* @__PURE__ */ jsxs("span", { children: [
            reads,
            " reads"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        ActionOrbs,
        {
          liked,
          bookmarked,
          onToggleLike: toggleLike,
          onToggleBookmark: toggleBookmark,
          onShare: () => setShareOpen(true)
        }
      )
    ] }),
    children,
    tags.length > 0 && /* @__PURE__ */ jsx("div", { className: "t-article__tags", children: tags.map((t) => /* @__PURE__ */ jsx("span", { className: "t-pill-tag", children: t }, t)) }),
    /* @__PURE__ */ jsx(
      EngageBar,
      {
        liked,
        likeCount,
        commentCount: comments.length,
        shareCount: initialShares,
        commentsOpen,
        onToggleLike: toggleLike,
        onToggleComments: () => setCommentsOpen((o) => !o),
        onShare: () => setShareOpen(true)
      }
    ),
    commentsOpen && /* @__PURE__ */ jsx(CommentThread, { comments, onAddComment: onComment }),
    /* @__PURE__ */ jsx(
      ShareModal,
      {
        open: shareOpen,
        onClose: () => setShareOpen(false),
        url: shareUrl,
        title: shareTitle
      }
    )
  ] });
}

// src/client/filterable.tsx
import { useMemo as useMemo2, useState as useState2 } from "react";
import { Fragment as Fragment2, jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
function FilterableProjectGrid({
  projects,
  caseStudyBasePath = "/projects"
}) {
  const categories = useMemo2(() => {
    const seen = /* @__PURE__ */ new Set();
    for (const p of projects) {
      if (p.category) seen.add(p.category);
    }
    return [
      { label: "all", value: "all" },
      ...Array.from(seen).map((c) => ({ label: c, value: c }))
    ];
  }, [projects]);
  const [category, setCategory] = useState2("all");
  const filtered = useMemo2(
    () => category === "all" ? projects : projects.filter((p) => p.category === category),
    [projects, category]
  );
  return /* @__PURE__ */ jsxs2("div", { children: [
    categories.length > 2 && /* @__PURE__ */ jsx2("div", { style: { marginBottom: "1.75rem" }, children: /* @__PURE__ */ jsx2(
      SegmentedFilter,
      {
        options: categories,
        value: category,
        onChange: setCategory,
        ariaLabel: "Filter projects by category"
      }
    ) }),
    /* @__PURE__ */ jsx2("div", { className: "t-grid", children: filtered.map((project, idx) => {
      const maxChips = 3;
      const visibleTags = project.tags.slice(0, maxChips);
      const extra = project.tags.length - visibleTags.length;
      const monogram = project.monogram ?? project.title.slice(0, 1).toLowerCase();
      const gradientStyle = project.gradient ? {
        background: `linear-gradient(135deg, ${project.gradient[0]}, ${project.gradient[1]})`
      } : void 0;
      return /* @__PURE__ */ jsxs2(
        "article",
        {
          className: "t-card t-reveal",
          style: { "--d": idx % 2 },
          children: [
            /* @__PURE__ */ jsx2("div", { className: "t-card__well", children: /* @__PURE__ */ jsx2("div", { className: "t-card__media", style: gradientStyle, children: project.cover ? /* @__PURE__ */ jsx2("img", { src: project.cover.src, alt: project.cover.alt }) : /* @__PURE__ */ jsx2("span", { className: "t-card__monogram", children: monogram }) }) }),
            /* @__PURE__ */ jsxs2("div", { className: "t-card__body", children: [
              /* @__PURE__ */ jsxs2("div", { className: "t-card__head", children: [
                /* @__PURE__ */ jsx2("h3", { className: "t-card__title", children: project.title }),
                /* @__PURE__ */ jsx2("span", { className: "t-badge", children: project.year })
              ] }),
              /* @__PURE__ */ jsx2("p", { className: "t-card__kicker", children: project.subtitle }),
              project.description && /* @__PURE__ */ jsx2("p", { className: "t-card__desc", children: project.description }),
              /* @__PURE__ */ jsxs2("div", { className: "t-card__chips", children: [
                visibleTags.map((t) => /* @__PURE__ */ jsx2("span", { className: "t-chip", children: t }, t)),
                extra > 0 && /* @__PURE__ */ jsxs2("span", { className: "t-chip", children: [
                  "+",
                  extra
                ] })
              ] }),
              /* @__PURE__ */ jsx2("div", { className: "t-card__actions", children: /* @__PURE__ */ jsxs2(
                "a",
                {
                  className: "t-link-arrow",
                  href: `${caseStudyBasePath}/${project.slug}`,
                  children: [
                    "read case study",
                    " ",
                    /* @__PURE__ */ jsx2(
                      "svg",
                      {
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "2",
                        children: /* @__PURE__ */ jsx2("path", { d: "M7 17 17 7M8 7h9v9" })
                      }
                    )
                  ]
                }
              ) })
            ] })
          ]
        },
        project.slug
      );
    }) })
  ] });
}
function FilterableBlogFeed({
  posts,
  blogBasePath = "/blog"
}) {
  const tags = useMemo2(() => {
    const seen = /* @__PURE__ */ new Set();
    for (const p of posts) {
      for (const t of p.tags) seen.add(t);
    }
    return Array.from(seen);
  }, [posts]);
  const [activeTag, setActiveTag] = useState2("all");
  const filtered = useMemo2(
    () => activeTag === "all" ? posts : posts.filter((p) => p.tags.includes(activeTag)),
    [posts, activeTag]
  );
  return /* @__PURE__ */ jsxs2(Fragment2, { children: [
    /* @__PURE__ */ jsx2(
      FilterPills,
      {
        tags,
        value: activeTag,
        onChange: setActiveTag,
        className: "t-reveal"
      }
    ),
    /* @__PURE__ */ jsx2("div", { className: "t-feed", children: filtered.map((post, idx) => /* @__PURE__ */ jsx2(
      "article",
      {
        className: "t-reveal",
        style: { "--d": idx + 2 },
        children: /* @__PURE__ */ jsx2("a", { className: "t-feed-item", href: `${blogBasePath}/${post.slug}`, children: /* @__PURE__ */ jsxs2("div", { className: "t-feed-item__row", children: [
          (post.cover || post.gradient) && /* @__PURE__ */ jsx2("div", { className: "t-feed-item__thumb", children: post.cover ? /* @__PURE__ */ jsx2("img", { src: post.cover.src, alt: post.cover.alt }) : /* @__PURE__ */ jsx2(
            "div",
            {
              style: {
                background: `linear-gradient(135deg, ${post.gradient?.[0] ?? "#2b3a4a"}, ${post.gradient?.[1] ?? "#141a21"})`
              }
            }
          ) }),
          /* @__PURE__ */ jsxs2("div", { className: "t-feed-item__body", children: [
            /* @__PURE__ */ jsx2("h2", { className: "t-feed-item__title", children: post.title }),
            /* @__PURE__ */ jsx2("p", { className: "t-feed-item__desc", children: post.description }),
            /* @__PURE__ */ jsxs2("div", { className: "t-feed-item__meta", children: [
              /* @__PURE__ */ jsxs2("div", { className: "t-feed-item__dates", children: [
                /* @__PURE__ */ jsx2("span", { children: post.date }),
                typeof post.reads === "number" && /* @__PURE__ */ jsxs2(Fragment2, { children: [
                  /* @__PURE__ */ jsx2("span", { children: "\xB7" }),
                  /* @__PURE__ */ jsxs2("span", { children: [
                    post.reads,
                    " reads"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs2("div", { className: "t-feed-item__counts", children: [
                typeof post.likes === "number" && /* @__PURE__ */ jsxs2("span", { children: [
                  /* @__PURE__ */ jsx2(
                    "svg",
                    {
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "1.6",
                      children: /* @__PURE__ */ jsx2("path", { d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" })
                    }
                  ),
                  post.likes
                ] }),
                typeof post.comments === "number" && /* @__PURE__ */ jsxs2("span", { children: [
                  /* @__PURE__ */ jsx2(
                    "svg",
                    {
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "1.6",
                      children: /* @__PURE__ */ jsx2("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" })
                    }
                  ),
                  post.comments
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx2("div", { className: "t-feed-item__tags", children: post.tags.map((t) => /* @__PURE__ */ jsx2("span", { className: "t-feed-item__tag", children: t }, t)) })
          ] })
        ] }) })
      },
      post.slug
    )) })
  ] });
}
export {
  ActionOrbs,
  ArticleInteractiveShell,
  Clock,
  CommentThread,
  EngageBar,
  FilterPills,
  FilterableBlogFeed,
  FilterableProjectGrid,
  SegmentedFilter,
  ShareModal,
  ThemeProvider,
  ThemeToggle,
  applyDomTheme,
  readDomTheme,
  useTheme
};
//# sourceMappingURL=client.js.map