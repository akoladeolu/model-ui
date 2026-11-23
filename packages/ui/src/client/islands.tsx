"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { CommentItem } from "../content/types.js";

export type ColorMode = "light" | "dark";

interface ThemeContextValue {
  mode: ColorMode;
  setMode: (mode: ColorMode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function applyDomTheme(mode: ColorMode) {
  if (typeof document === "undefined") return;
  const html = document.documentElement;
  html.setAttribute("data-theme", mode);
  html.classList.toggle("dark", mode === "dark");
}

export function readDomTheme(fallback: ColorMode = "light"): ColorMode {
  if (typeof document === "undefined") return fallback;
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "dark" || document.documentElement.classList.contains("dark")) {
    return "dark";
  }
  if (attr === "light") return "light";
  if (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return fallback;
}

export function ThemeProvider({
  defaultMode = "system",
  storageKey = "model-ui-theme",
  children,
}: {
  defaultMode?: "light" | "dark" | "system";
  storageKey?: string;
  children: ReactNode;
}) {
  const [mode, setModeState] = useState<ColorMode>(() =>
    defaultMode === "dark" ? "dark" : "light"
  );

  useEffect(() => {
    let initial: ColorMode = "light";
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
    (next: ColorMode) => {
      setModeState(next);
      applyDomTheme(next);
      try {
        localStorage.setItem(storageKey, next);
      } catch {
        // ignore storage quota errors
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

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  const toggleFallback = useCallback(() => {
    const next: ColorMode = readDomTheme("light") === "dark" ? "light" : "dark";
    applyDomTheme(next);
    try {
      localStorage.setItem("model-ui-theme", next);
    } catch {
      // ignore
    }
  }, []);

  if (ctx) return ctx;
  return {
    mode: readDomTheme("light"),
    setMode: applyDomTheme,
    toggleMode: toggleFallback,
  };
}

export function ThemeToggle({
  className = "",
  label = "Toggle dark mode",
}: {
  className?: string;
  label?: string;
}) {
  const { toggleMode } = useTheme();
  return (
    <button
      className={`t-icon-btn t-theme-toggle ${className}`.trim()}
      type="button"
      aria-label={label}
      title={label}
      onClick={toggleMode}
      data-theme-toggle
    >
      <svg
        className="t-icon-moon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
      </svg>
      <svg
        className="t-icon-sun"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    </button>
  );
}

/**
 * Hydration-safe live timezone clock.
 * Renders a fixed-width placeholder (`CITY · --:--`) during SSR and
 * ticks with `Intl.DateTimeFormat` after mount.
 */
export function Clock({
  city,
  timeZone,
  locale = "en-US",
  showStatusDot = true,
  className = "",
}: {
  city: string;
  timeZone: string;
  locale?: string;
  showStatusDot?: boolean;
  className?: string;
}) {
  const [timeText, setTimeText] = useState<string | null>(null);

  useEffect(() => {
    const formatNow = () => {
      try {
        return new Intl.DateTimeFormat(locale, {
          timeZone,
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          weekday: "long",
        }).format(new Date());
      } catch {
        return "--:--";
      }
    };

    const tick = () => {
      if (typeof document !== "undefined" && document.hidden) return;
      setTimeText(formatNow());
    };

    tick();
    const id = window.setInterval(tick, 30_000);
    const onVis = () => {
      if (!document.hidden) tick();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [timeZone, locale]);

  return (
    <span
      className={`t-mono-meta ${className}`.trim()}
      style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem" }}
    >
      {showStatusDot && <span className="t-status-dot" aria-hidden="true" />}
      <span>{city.toUpperCase()}</span>
      <time data-testid="model-ui-clock">{timeText ?? "--:--"}</time>
    </span>
  );
}

export function SegmentedFilter({
  options,
  value,
  defaultValue,
  onChange,
  ariaLabel = "Filter items",
  className = "",
}: {
  options: Array<{ label: string; value: string }>;
  value?: string;
  defaultValue?: string;
  onChange?: (next: string) => void;
  ariaLabel?: string;
  className?: string;
}) {
  const [internal, setInternal] = useState<string>(
    defaultValue ?? options[0]?.value ?? "all"
  );
  const active = value ?? internal;

  const handleSelect = (val: string) => {
    if (value === undefined) setInternal(val);
    onChange?.(val);
  };

  return (
    <div
      className={`t-segmented ${className}`.trim()}
      role="group"
      aria-label={ariaLabel}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className="t-segmented__item"
          aria-pressed={active === opt.value}
          onClick={() => handleSelect(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function FilterPills({
  tags,
  value,
  defaultValue = "all",
  onChange,
  ariaLabel = "Filter posts by tag",
  className = "",
}: {
  tags: string[];
  value?: string;
  defaultValue?: string;
  onChange?: (tag: string) => void;
  ariaLabel?: string;
  className?: string;
}) {
  const [internal, setInternal] = useState<string>(defaultValue);
  const active = value ?? internal;

  const select = (tag: string) => {
    if (value === undefined) setInternal(tag);
    onChange?.(tag);
  };

  return (
    <div
      className={`t-filter-pills ${className}`.trim()}
      role="group"
      aria-label={ariaLabel}
    >
      <button
        type="button"
        className="t-filter-pill"
        aria-pressed={active === "all"}
        onClick={() => select("all")}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          type="button"
          className="t-filter-pill"
          aria-pressed={active === tag}
          onClick={() => select(tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}

export function ShareModal({
  open,
  onClose,
  url,
  title = "Share this post",
}: {
  open: boolean;
  onClose: () => void;
  url: string;
  title?: string;
}) {
  const [copied, setCopied] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) {
      setCopied(false);
      return;
    }
    closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
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
      // fallback no-op in non-secure / test context
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

  return (
    <div
      className="t-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="t-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="model-ui-share-title"
      >
        <div className="t-modal__head">
          <h3 className="t-modal__title" id="model-ui-share-title">
            Share this post
          </h3>
          <button
            ref={closeBtnRef}
            className="t-modal__close"
            type="button"
            aria-label="Close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div className="t-modal__url">{url}</div>
        <div className="t-modal__list">
          <button className="t-modal__item" type="button" onClick={copyLink}>
            <span className="t-modal__orb">⧉</span>
            <span>{copied ? "Copied!" : "Copy link"}</span>
          </button>
          <button className="t-modal__item" type="button" onClick={shareX}>
            <span className="t-modal__orb">𝕏</span>
            <span>Share on X</span>
          </button>
          <button
            className="t-modal__item"
            type="button"
            onClick={shareWhatsApp}
          >
            <span className="t-modal__orb">💬</span>
            <span>Share on WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function ActionOrbs({
  liked = false,
  bookmarked = false,
  onToggleLike,
  onToggleBookmark,
  onShare,
}: {
  liked?: boolean;
  bookmarked?: boolean;
  onToggleLike?: () => void;
  onToggleBookmark?: () => void;
  onShare?: () => void;
}) {
  return (
    <div className="t-article__actions">
      <button
        className="t-action-orb t-action-orb--like"
        type="button"
        aria-label="Like post"
        aria-pressed={liked}
        onClick={onToggleLike}
      >
        <svg
          viewBox="0 0 24 24"
          fill={liked ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.7"
        >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      </button>
      <button
        className="t-action-orb"
        type="button"
        aria-label="Bookmark post"
        aria-pressed={bookmarked}
        onClick={onToggleBookmark}
      >
        <svg
          viewBox="0 0 24 24"
          fill={bookmarked ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.7"
        >
          <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
        </svg>
      </button>
      <button
        className="t-action-orb"
        type="button"
        aria-label="Share post"
        onClick={onShare}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98" />
        </svg>
      </button>
    </div>
  );
}

export function EngageBar({
  liked,
  likeCount,
  commentCount,
  shareCount = 0,
  commentsOpen,
  onToggleLike,
  onToggleComments,
  onShare,
}: {
  liked: boolean;
  likeCount: number;
  commentCount: number;
  shareCount?: number;
  commentsOpen: boolean;
  onToggleLike: () => void;
  onToggleComments: () => void;
  onShare: () => void;
}) {
  return (
    <div className="t-engage-bar">
      <button
        className="t-engage-btn t-engage-btn--like"
        type="button"
        aria-pressed={liked}
        onClick={onToggleLike}
      >
        <svg
          viewBox="0 0 24 24"
          fill={liked ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.7"
        >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
        <span>{likeCount}</span>
      </button>
      <button
        className="t-engage-btn"
        type="button"
        aria-expanded={commentsOpen}
        onClick={onToggleComments}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span>{commentCount}</span>
      </button>
      <button className="t-engage-btn" type="button" onClick={onShare}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98" />
        </svg>
        <span>{shareCount}</span>
      </button>
    </div>
  );
}

export function CommentThread({
  comments: initialComments,
  onAddComment,
}: {
  comments: CommentItem[];
  onAddComment?: (author: string, body: string) => void;
}) {
  const [comments, setComments] = useState<CommentItem[]>(initialComments);
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    const nextAuthor = author.trim() || "Guest";
    const newComment: CommentItem = {
      id: `c-${Date.now()}`,
      author: nextAuthor,
      date: "Just now",
      body: body.trim(),
      likes: 0,
    };
    setComments((prev) => [newComment, ...prev]);
    onAddComment?.(nextAuthor, body.trim());
    setBody("");
  };

  return (
    <section className="t-comments">
      <h3 className="t-comments__title">
        {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
      </h3>
      <form className="t-comment-form" onSubmit={handleSubmit}>
        <input
          className="t-input"
          type="text"
          placeholder="Your name"
          aria-label="Your name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <textarea
          className="t-textarea"
          rows={3}
          placeholder="Share your thoughts..."
          aria-label="Share your thoughts"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <div className="t-comment-form__actions">
          <button className="t-btn-solid" type="submit">
            Post comment
          </button>
        </div>
      </form>

      <div className="t-comment-list">
        {comments.map((c) => (
          <div key={c.id} className="t-comment">
            <div className="t-comment__avatar">
              {c.author.slice(0, 1).toUpperCase()}
            </div>
            <div className="t-comment__main">
              <div className="t-comment__bubble">
                <p className="t-comment__author">{c.author}</p>
                <p className="t-comment__text">{c.body}</p>
              </div>
              <div className="t-comment__meta">
                <span>{c.date}</span>
                {typeof c.likes === "number" && (
                  <button
                    className="t-comment__action t-comment__action--like"
                    type="button"
                  >
                    ♥ {c.likes}
                  </button>
                )}
              </div>
              {c.replies && c.replies.length > 0 && (
                <div className="t-comment__replies">
                  {c.replies.map((r) => (
                    <div key={r.id} className="t-comment">
                      <div className="t-comment__avatar t-comment__avatar--sm">
                        {r.author.slice(0, 1).toUpperCase()}
                      </div>
                      <div className="t-comment__main">
                        <div className="t-comment__bubble t-comment__bubble--sm">
                          <p className="t-comment__author">{r.author}</p>
                          <p
                            className="t-comment__text"
                            style={{ fontSize: "0.75rem" }}
                          >
                            {r.body}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * Interactive wrapper for BlogPostTemplate's top action orbs, bottom engagement bar,
 * collapsible comment drawer, and share modal.
 */
export function ArticleInteractiveShell({
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
  children,
}: {
  author: string;
  readMinutes: number;
  date: string;
  reads?: number;
  initialLikes?: number;
  initialShares?: number;
  shareUrl: string;
  shareTitle: string;
  tags: string[];
  comments?: CommentItem[];
  onLike?: (liked: boolean) => void;
  onBookmark?: (bookmarked: boolean) => void;
  onComment?: (author: string, body: string) => void;
  children: ReactNode;
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

  return (
    <>
      <div className="t-article__bar t-reveal" style={{ "--d": 2 } as React.CSSProperties}>
        <div className="t-article__byline">
          <span className="t-article__author">{author}</span>
          <span>·</span>
          <span>{readMinutes} min read</span>
          <span>·</span>
          <span>{date}</span>
          {typeof reads === "number" && (
            <>
              <span>·</span>
              <span>{reads} reads</span>
            </>
          )}
        </div>
        <ActionOrbs
          liked={liked}
          bookmarked={bookmarked}
          onToggleLike={toggleLike}
          onToggleBookmark={toggleBookmark}
          onShare={() => setShareOpen(true)}
        />
      </div>

      {children}

      {tags.length > 0 && (
        <div className="t-article__tags">
          {tags.map((t) => (
            <span key={t} className="t-pill-tag">
              {t}
            </span>
          ))}
        </div>
      )}

      <EngageBar
        liked={liked}
        likeCount={likeCount}
        commentCount={comments.length}
        shareCount={initialShares}
        commentsOpen={commentsOpen}
        onToggleLike={toggleLike}
        onToggleComments={() => setCommentsOpen((o) => !o)}
        onShare={() => setShareOpen(true)}
      />

      {commentsOpen && (
        <CommentThread comments={comments} onAddComment={onComment} />
      )}

      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        url={shareUrl}
        title={shareTitle}
      />
    </>
  );
}
