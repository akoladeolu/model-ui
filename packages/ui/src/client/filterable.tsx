"use client";

import React, { useMemo, useState } from "react";
import type { Post, Project } from "../content/types.js";
import { FilterPills, SegmentedFilter } from "./islands.js";

export function FilterableProjectGrid({
  projects,
  caseStudyBasePath = "/projects",
}: {
  projects: Project[];
  caseStudyBasePath?: string;
}) {
  const categories = useMemo(() => {
    const seen = new Set<string>();
    for (const p of projects) {
      if (p.category) seen.add(p.category);
    }
    return [
      { label: "all", value: "all" },
      ...Array.from(seen).map((c) => ({ label: c, value: c })),
    ];
  }, [projects]);

  const [category, setCategory] = useState("all");

  const filtered = useMemo(
    () =>
      category === "all"
        ? projects
        : projects.filter((p) => p.category === category),
    [projects, category]
  );

  return (
    <div>
      {categories.length > 2 && (
        <div style={{ marginBottom: "1.75rem" }}>
          <SegmentedFilter
            options={categories}
            value={category}
            onChange={setCategory}
            ariaLabel="Filter projects by category"
          />
        </div>
      )}
      <div className="t-grid">
        {filtered.map((project, idx) => {
          const maxChips = 3;
          const visibleTags = project.tags.slice(0, maxChips);
          const extra = project.tags.length - visibleTags.length;
          const monogram =
            project.monogram ?? project.title.slice(0, 1).toLowerCase();
          const gradientStyle = project.gradient
            ? {
                background: `linear-gradient(135deg, ${project.gradient[0]}, ${project.gradient[1]})`,
              }
            : undefined;

          return (
            <article
              key={project.slug}
              className="t-card t-reveal"
              style={{ "--d": idx % 2 } as React.CSSProperties}
            >
              <div className="t-card__well">
                <div className="t-card__media" style={gradientStyle}>
                  {project.cover ? (
                    <img src={project.cover.src} alt={project.cover.alt} />
                  ) : (
                    <span className="t-card__monogram">{monogram}</span>
                  )}
                </div>
              </div>
              <div className="t-card__body">
                <div className="t-card__head">
                  <h3 className="t-card__title">{project.title}</h3>
                  <span className="t-badge">{project.year}</span>
                </div>
                <p className="t-card__kicker">{project.subtitle}</p>
                {project.description && (
                  <p className="t-card__desc">{project.description}</p>
                )}
                <div className="t-card__chips">
                  {visibleTags.map((t) => (
                    <span key={t} className="t-chip">
                      {t}
                    </span>
                  ))}
                  {extra > 0 && <span className="t-chip">+{extra}</span>}
                </div>
                <div className="t-card__actions">
                  <a
                    className="t-link-arrow"
                    href={`${caseStudyBasePath}/${project.slug}`}
                  >
                    read case study{" "}
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
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export function FilterableBlogFeed({
  posts,
  blogBasePath = "/blog",
}: {
  posts: Post[];
  blogBasePath?: string;
}) {
  const tags = useMemo(() => {
    const seen = new Set<string>();
    for (const p of posts) {
      for (const t of p.tags) seen.add(t);
    }
    return Array.from(seen);
  }, [posts]);

  const [activeTag, setActiveTag] = useState("all");

  const filtered = useMemo(
    () =>
      activeTag === "all"
        ? posts
        : posts.filter((p) => p.tags.includes(activeTag)),
    [posts, activeTag]
  );

  return (
    <>
      <FilterPills
        tags={tags}
        value={activeTag}
        onChange={setActiveTag}
        className="t-reveal"
      />
      <div className="t-feed">
        {filtered.map((post, idx) => (
          <article
            key={post.slug}
            className="t-reveal"
            style={{ "--d": idx + 2 } as React.CSSProperties}
          >
            <a className="t-feed-item" href={`${blogBasePath}/${post.slug}`}>
              <div className="t-feed-item__row">
                {(post.cover || post.gradient) && (
                  <div className="t-feed-item__thumb">
                    {post.cover ? (
                      <img src={post.cover.src} alt={post.cover.alt} />
                    ) : (
                      <div
                        style={{
                          background: `linear-gradient(135deg, ${
                            post.gradient?.[0] ?? "#2b3a4a"
                          }, ${post.gradient?.[1] ?? "#141a21"})`,
                        }}
                      />
                    )}
                  </div>
                )}
                <div className="t-feed-item__body">
                  <h2 className="t-feed-item__title">{post.title}</h2>
                  <p className="t-feed-item__desc">{post.description}</p>
                  <div className="t-feed-item__meta">
                    <div className="t-feed-item__dates">
                      <span>{post.date}</span>
                      {typeof post.reads === "number" && (
                        <>
                          <span>·</span>
                          <span>{post.reads} reads</span>
                        </>
                      )}
                    </div>
                    <div className="t-feed-item__counts">
                      {typeof post.likes === "number" && (
                        <span>
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                          >
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                          </svg>
                          {post.likes}
                        </span>
                      )}
                      {typeof post.comments === "number" && (
                        <span>
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                          >
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                          </svg>
                          {post.comments}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="t-feed-item__tags">
                    {post.tags.map((t) => (
                      <span key={t} className="t-feed-item__tag">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </a>
          </article>
        ))}
      </div>
    </>
  );
}
