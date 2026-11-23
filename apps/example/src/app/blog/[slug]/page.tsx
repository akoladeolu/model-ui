import React from "react";
import { notFound } from "next/navigation";
import { ThemeStyle } from "model-ui";
import { resolveDemoConfig } from "@/site.config";
import { posts, sampleComments } from "@/content/data";
import { StudioBlogPostView } from "@/components/StudioPages";

export default async function BlogPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ brand?: string; preset?: string; mode?: string }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const config = resolveDemoConfig(query);
  const post = posts.find((p) => p.slug === slug) ?? posts[0];
  if (!post) notFound();

  const comments = sampleComments[post.slug] ?? [];

  return (
    <>
      <ThemeStyle config={config} />
      <StudioBlogPostView
        slug={slug}
        initialConfig={config}
        initialPost={post}
        comments={comments}
      />
    </>
  );
}
