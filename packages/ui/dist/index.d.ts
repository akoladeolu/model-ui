import { ImageRef, SiteConfig } from './config.js';
export { ACCENT_PRESETS, AccentPreset, CustomAccent, PRESET_NAMES, PresetName, ResolvedAccent, SiteConfigInput, customAccentSchema, defineSiteConfig, imageRefSchema, isValidIanaZone, parseHexToRgb, relativeLuminance, resolveAccent, siteConfigSchema, toCssVarStyleText, toCssVars } from './config.js';
import React, { ReactNode, CSSProperties } from 'react';
import 'zod';

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
interface PolaroidItem {
    id?: string;
    caption: string;
    image?: ImageRef;
    gradient?: [string, string];
    rotationDeg?: number;
}
interface ArcGalleryItem {
    id?: string;
    image?: ImageRef;
    gradient?: [string, string];
    alt?: string;
}
interface ToolBadgeItem {
    label: string;
    color?: string;
}

declare function cx(...classes: Array<string | false | null | undefined>): string;
/**
 * Server Component that injects the brand accent and font CSS custom properties
 * into a <style> tag and optionally includes a tiny zero-flash dark mode init script.
 */
declare function ThemeStyle({ config, storageKey, }: {
    config: SiteConfig;
    storageKey?: string;
}): React.JSX.Element;
declare function Page({ surface, rails, className, children, }: {
    surface?: "paper" | "reading";
    rails?: "narrow" | "wide" | "none";
    className?: string;
    children: ReactNode;
}): React.JSX.Element;
declare function Column({ pad, id, as: Tag, style, className, children, }: {
    pad?: boolean;
    id?: string;
    as?: "div" | "section" | "main" | "header";
    style?: CSSProperties;
    className?: string;
    children?: ReactNode;
}): React.JSX.Element;
declare function Rails({ variant, className, children, }: {
    variant?: "narrow" | "wide";
    className?: string;
    children: ReactNode;
}): React.JSX.Element;
declare function Section({ size, pad, column, id, style, className, children, }: {
    size?: "default" | "lg";
    pad?: boolean;
    column?: boolean;
    id?: string;
    style?: CSSProperties;
    className?: string;
    children?: ReactNode;
}): React.JSX.Element;
declare function HatchDivider({ className }: {
    className?: string;
}): React.JSX.Element;
declare function Button({ variant, size, href, onClick, type, disabled, orb, className, style, children, }: {
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
}): React.JSX.Element;
declare function Pill({ variant, className, children, }: {
    variant?: "pill-tag" | "tag" | "feed-tag";
    className?: string;
    children: ReactNode;
}): React.JSX.Element;
declare function Chip({ className, children, }: {
    className?: string;
    children: ReactNode;
}): React.JSX.Element;
declare function Badge({ className, children, }: {
    className?: string;
    children: ReactNode;
}): React.JSX.Element;
declare function Eyebrow({ className, children, }: {
    className?: string;
    children: ReactNode;
}): React.JSX.Element;
declare function Display({ as: Tag, className, children, }: {
    as?: "h1" | "h2" | "p";
    className?: string;
    children: ReactNode;
}): React.JSX.Element;
declare function ScriptHeading({ as: Tag, size, style, className, children, }: {
    as?: "h1" | "h2" | "h3" | "p";
    size?: "default" | "xl";
    style?: CSSProperties;
    className?: string;
    children: ReactNode;
}): React.JSX.Element;
declare function MonoMeta({ as: Tag, className, style, children, }: {
    as?: "span" | "time" | "div";
    className?: string;
    style?: CSSProperties;
    children: ReactNode;
}): React.JSX.Element;
declare function Prose({ className, children, }: {
    className?: string;
    children: ReactNode;
}): React.JSX.Element;
declare function Panel({ variant, style, className, children, }: {
    variant?: "default" | "card";
    style?: CSSProperties;
    className?: string;
    children: ReactNode;
}): React.JSX.Element;
declare function Sticker({ src, alt, className, }: {
    src: string;
    alt?: string;
    className?: string;
}): React.JSX.Element;
/**
 * Fit-to-width giant footer wordmark.
 * Uses CSS container queries and `--chars` grapheme count so any 1-12 char
 * wordmark scales cleanly without horizontal overflow or runtime JS.
 */
declare function Wordmark({ text, className, }: {
    text: string;
    className?: string;
}): React.JSX.Element;

declare function DockNav({ config, activePath, staticPosition, className, }: {
    config: SiteConfig;
    activePath?: string;
    staticPosition?: boolean;
    className?: string;
}): React.JSX.Element;
declare function Hero({ config, headline, subline, trailingLine, lede, badges, ctaLabel, ctaHref, secondaryActions, illustration, }: {
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
}): React.JSX.Element;
declare function ArcGallery({ items, height, className, }: {
    items?: ArcGalleryItem[];
    height?: number | string;
    className?: string;
}): React.JSX.Element;
declare function Statement({ children, className, }: {
    children: ReactNode;
    className?: string;
}): React.JSX.Element;
declare function Polaroids({ items, heading, }: {
    items?: PolaroidItem[];
    heading?: string;
}): React.JSX.Element;
/**
 * Deterministic contribution heatmap (no Math.random hydration mismatch).
 */
declare function ContributionHeatmap({ totalContributions, subtitle, weeks, values, className, }: {
    totalContributions?: string | number;
    subtitle?: string;
    weeks?: number;
    values?: number[];
    className?: string;
}): React.JSX.Element;
declare function PostList({ posts, blogBasePath, }: {
    posts: Post[];
    blogBasePath?: string;
}): React.JSX.Element;
declare function Footer({ config, year, className, }: {
    config: SiteConfig;
    year?: number;
    className?: string;
}): React.JSX.Element;
declare function SiteShell({ config, surface, rails, activePath, hideFooter, children, }: {
    config: SiteConfig;
    surface?: "paper" | "reading";
    rails?: "narrow" | "wide" | "none";
    activePath?: string;
    hideFooter?: boolean;
    children: ReactNode;
}): React.JSX.Element;
declare function Pagination({ currentPage, totalPages, prevHref, nextHref, }: {
    currentPage?: number;
    totalPages?: number;
    prevHref?: string;
    nextHref?: string;
}): React.JSX.Element;

declare function HomeTemplate({ config, projects, posts, heroHeadline, heroSubline, heroTrailingLine, heroLede, heroBadges, heroCtaLabel, heroCtaHref, heroSecondaryActions, statementContent, polaroids, arcItems, totalContributions, caseStudyBasePath, blogBasePath, extraSections, withShell, }: {
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
}): React.JSX.Element;
declare function BlogIndexTemplate({ config, posts, heroTitle, heroSub, currentPage, totalPages, prevHref, nextHref, blogBasePath, withShell, }: {
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
}): React.JSX.Element;
declare function BlogPostTemplate({ config, post, comments, backHref, backLabel, onLike, onBookmark, onComment, withShell, children, }: {
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
}): React.JSX.Element;
declare function CaseStudyTemplate({ config, project, backHref, backLabel, ctaTitle, ctaSub, ctaLabel, ctaHref, withShell, }: {
    config: SiteConfig;
    project: Project;
    backHref?: string;
    backLabel?: string;
    ctaTitle?: string;
    ctaSub?: string;
    ctaLabel?: string;
    ctaHref?: string;
    withShell?: boolean;
}): React.JSX.Element;

export { ArcGallery, type ArcGalleryItem, Badge, BlogIndexTemplate, BlogPostTemplate, Button, CaseStudyTemplate, Chip, Column, type CommentItem, ContributionHeatmap, Display, DockNav, Eyebrow, Footer, HatchDivider, Hero, HomeTemplate, ImageRef, MonoMeta, Page, Pagination, Panel, Pill, type PolaroidItem, Polaroids, type Post, PostList, type Project, type ProjectFeature, Prose, Rails, ScriptHeading, Section, SiteConfig, SiteShell, Statement, Sticker, ThemeStyle, type ToolBadgeItem, Wordmark, cx };
