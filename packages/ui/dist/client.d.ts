import React, { ReactNode } from 'react';
import { z } from 'zod';

declare const imageRefSchema: z.ZodObject<{
    src: z.ZodString;
    alt: z.ZodDefault<z.ZodString>;
    width: z.ZodOptional<z.ZodNumber>;
    height: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    src: string;
    alt: string;
    width?: number | undefined;
    height?: number | undefined;
}, {
    src: string;
    alt?: string | undefined;
    width?: number | undefined;
    height?: number | undefined;
}>;
type ImageRef = z.infer<typeof imageRefSchema>;

interface ProjectFeature {
    title?: string;
    body: string;
}
interface Project {
    slug: string;
    title: string;
    subtitle: string;
    description?: string;
    year: string;
    tags: string[];
    category: string;
    liveUrl?: string;
    codeUrl?: string;
    cover?: ImageRef;
    /** Optional CSS gradient placeholder when cover is omitted */
    gradient?: [string, string];
    /** 1-3 character monogram fallback inside card & case study hero */
    monogram?: string;
    challenge: string;
    solution: string;
    impact: string[];
    features: ProjectFeature[];
    stack: string[];
    lessons: string[];
}
interface Post {
    slug: string;
    title: string;
    description: string;
    date: string;
    readMinutes: number;
    reads?: number;
    likes?: number;
    comments?: number;
    shares?: number;
    tags: string[];
    cover?: ImageRef;
    /** Optional CSS gradient placeholder when cover is omitted */
    gradient?: [string, string];
    /** Optional article body content */
    content?: ReactNode;
}
interface CommentItem {
    id: string;
    author: string;
    avatar?: ImageRef;
    date: string;
    body: string;
    likes?: number;
    replies?: CommentItem[];
}

type ColorMode = "light" | "dark";
interface ThemeContextValue {
    mode: ColorMode;
    setMode: (mode: ColorMode) => void;
    toggleMode: () => void;
}
declare function applyDomTheme(mode: ColorMode): void;
declare function readDomTheme(fallback?: ColorMode): ColorMode;
declare function ThemeProvider({ defaultMode, storageKey, children, }: {
    defaultMode?: "light" | "dark" | "system";
    storageKey?: string;
    children: ReactNode;
}): React.JSX.Element;
declare function useTheme(): ThemeContextValue;
declare function ThemeToggle({ className, label, }: {
    className?: string;
    label?: string;
}): React.JSX.Element;
/**
 * Hydration-safe live timezone clock.
 * Renders a fixed-width placeholder (`CITY · --:--`) during SSR and
 * ticks with `Intl.DateTimeFormat` after mount.
 */
declare function Clock({ city, timeZone, locale, showStatusDot, className, }: {
    city: string;
    timeZone: string;
    locale?: string;
    showStatusDot?: boolean;
    className?: string;
}): React.JSX.Element;
declare function SegmentedFilter({ options, value, defaultValue, onChange, ariaLabel, className, }: {
    options: Array<{
        label: string;
        value: string;
    }>;
    value?: string;
    defaultValue?: string;
    onChange?: (next: string) => void;
    ariaLabel?: string;
    className?: string;
}): React.JSX.Element;
declare function FilterPills({ tags, value, defaultValue, onChange, ariaLabel, className, }: {
    tags: string[];
    value?: string;
    defaultValue?: string;
    onChange?: (tag: string) => void;
    ariaLabel?: string;
    className?: string;
}): React.JSX.Element;
declare function ShareModal({ open, onClose, url, title, }: {
    open: boolean;
    onClose: () => void;
    url: string;
    title?: string;
}): React.JSX.Element | null;
declare function ActionOrbs({ liked, bookmarked, onToggleLike, onToggleBookmark, onShare, }: {
    liked?: boolean;
    bookmarked?: boolean;
    onToggleLike?: () => void;
    onToggleBookmark?: () => void;
    onShare?: () => void;
}): React.JSX.Element;
declare function EngageBar({ liked, likeCount, commentCount, shareCount, commentsOpen, onToggleLike, onToggleComments, onShare, }: {
    liked: boolean;
    likeCount: number;
    commentCount: number;
    shareCount?: number;
    commentsOpen: boolean;
    onToggleLike: () => void;
    onToggleComments: () => void;
    onShare: () => void;
}): React.JSX.Element;
declare function CommentThread({ comments: initialComments, onAddComment, }: {
    comments: CommentItem[];
    onAddComment?: (author: string, body: string) => void;
}): React.JSX.Element;
/**
 * Interactive wrapper for BlogPostTemplate's top action orbs, bottom engagement bar,
 * collapsible comment drawer, and share modal.
 */
declare function ArticleInteractiveShell({ author, readMinutes, date, reads, initialLikes, initialShares, shareUrl, shareTitle, tags, comments, onLike, onBookmark, onComment, children, }: {
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
}): React.JSX.Element;

declare function FilterableProjectGrid({ projects, caseStudyBasePath, }: {
    projects: Project[];
    caseStudyBasePath?: string;
}): React.JSX.Element;
declare function FilterableBlogFeed({ posts, blogBasePath, }: {
    posts: Post[];
    blogBasePath?: string;
}): React.JSX.Element;

export { ActionOrbs, ArticleInteractiveShell, Clock, type ColorMode, CommentThread, EngageBar, FilterPills, FilterableBlogFeed, FilterableProjectGrid, SegmentedFilter, ShareModal, ThemeProvider, ThemeToggle, applyDomTheme, readDomTheme, useTheme };
