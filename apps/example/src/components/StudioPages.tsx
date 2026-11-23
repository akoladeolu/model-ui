"use client";

import React, { useMemo, type ReactNode } from "react";
import {
  BlogIndexTemplate,
  BlogPostTemplate,
  CaseStudyTemplate,
  HomeTemplate,
  type CommentItem,
  type Post,
  type Project,
  type SiteConfig,
} from "model-ui";
import { useStudio } from "@/studio/StudioContext";

export function StudioHomeView({
  initialConfig,
  initialProjects,
  initialPosts,
}: {
  initialConfig: SiteConfig;
  initialProjects: Project[];
  initialPosts: Post[];
}) {
  const { validConfig, hero, projects, posts, isHydrated } = useStudio();
  const cfg = isHydrated ? validConfig : initialConfig;
  const projectList = isHydrated ? projects : initialProjects;
  const postList = isHydrated ? posts : initialPosts;

  const heroHeadline = (
    <>
      {hero.headlineLead}
      <span className="t-muted">{hero.headlineMuted}</span>
      {hero.headlineTail}
    </>
  );

  const heroSubline = (
    <>
      <span className="t-muted">{hero.sublineMuted}</span>
      <span className="t-ink">{hero.sublineInk}</span>
    </>
  );

  return (
    <HomeTemplate
      config={cfg}
      projects={projectList}
      posts={postList}
      heroHeadline={heroHeadline}
      heroSubline={heroSubline}
      heroTrailingLine={cfg.brand.tagline.toLowerCase()}
      heroLede={cfg.brand.tagline}
      statementContent={<>{hero.statementText}</>}
      heroCtaLabel="explore work"
      heroCtaHref="#projects"
    />
  );
}

export function StudioBlogIndexView({
  initialConfig,
  initialPosts,
}: {
  initialConfig: SiteConfig;
  initialPosts: Post[];
}) {
  const { validConfig, posts, isHydrated } = useStudio();
  const cfg = isHydrated ? validConfig : initialConfig;
  const postList = isHydrated ? posts : initialPosts;

  return (
    <BlogIndexTemplate
      config={cfg}
      posts={postList}
      currentPage={1}
      totalPages={2}
      nextHref="/blog"
    />
  );
}

export function StudioBlogPostView({
  slug,
  initialConfig,
  initialPost,
  comments = [],
}: {
  slug: string;
  initialConfig: SiteConfig;
  initialPost: Post;
  comments?: CommentItem[];
}) {
  const { validConfig, posts, isHydrated } = useStudio();
  const cfg = isHydrated ? validConfig : initialConfig;
  const activePost = useMemo(() => {
    if (!isHydrated) return initialPost;
    return posts.find((p) => p.slug === slug) ?? initialPost;
  }, [isHydrated, posts, slug, initialPost]);

  const bodyParagraphs =
    "bodyParagraphs" in activePost &&
    Array.isArray((activePost as { bodyParagraphs?: string[] }).bodyParagraphs)
      ? (activePost as { bodyParagraphs: string[] }).bodyParagraphs
      : [activePost.description];

  return (
    <BlogPostTemplate config={cfg} post={activePost} comments={comments}>
      {bodyParagraphs.map((para, i) => (
        <p key={i}>{para}</p>
      ))}
      <hr />
      <h2>why monochrome paper &amp; ink scales across products</h2>
      <p>
        when every component fights for attention with a different accent hue,
        nothing feels tactile. stripping a system down to one ink and an
        11-step opacity ramp forces spacing, elevation, and motion to do the
        real work.
      </p>
      <blockquote>
        “you stop seeing a product as a tree of components, and start seeing it
        as a loop between an idea, a system, and a person trying to get
        something done.”
      </blockquote>
      <pre>
        <code>{`// product engineering loop
const ship = async (idea) => {
  const system = await designAndArchitect(idea);
  return iterateWithRealUsers(system);
};`}</code>
      </pre>
      <p>
        that&apos;s the shift: caring about the whole loop from the database
        schema to the <code>300ms</code> hover curve.
      </p>
    </BlogPostTemplate>
  );
}

export function StudioCaseStudyView({
  slug,
  initialConfig,
  initialProject,
}: {
  slug: string;
  initialConfig: SiteConfig;
  initialProject: Project;
}) {
  const { validConfig, projects, isHydrated } = useStudio();
  const cfg = isHydrated ? validConfig : initialConfig;
  const activeProject = useMemo(() => {
    if (!isHydrated) return initialProject;
    return projects.find((p) => p.slug === slug) ?? initialProject;
  }, [isHydrated, projects, slug, initialProject]);

  return <CaseStudyTemplate config={cfg} project={activeProject} />;
}
