import type { ReactNode } from "react";
import type { ImageRef } from "../config/schema.js";

export interface ProjectFeature {
  title?: string;
  body: string;
}

export interface Project {
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

export interface Post {
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

export interface CommentItem {
  id: string;
  author: string;
  avatar?: ImageRef;
  date: string;
  body: string;
  likes?: number;
  replies?: CommentItem[];
}

export interface PolaroidItem {
  id?: string;
  caption: string;
  image?: ImageRef;
  gradient?: [string, string];
  rotationDeg?: number;
}

export interface ArcGalleryItem {
  id?: string;
  image?: ImageRef;
  gradient?: [string, string];
  alt?: string;
}

export interface ToolBadgeItem {
  label: string;
  color?: string;
}
