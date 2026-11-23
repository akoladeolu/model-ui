import React from "react";
import { BlogIndexTemplate, ThemeStyle } from "model-ui";
import { resolveDemoConfig } from "@/site.config";
import { posts } from "@/content/data";

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ brand?: string; preset?: string; mode?: string }>;
}) {
  const params = await searchParams;
  const config = resolveDemoConfig(params);

  return (
    <>
      <ThemeStyle config={config} />
      <BlogIndexTemplate
        config={config}
        posts={posts}
        currentPage={1}
        totalPages={2}
        nextHref="/blog"
      />
    </>
  );
}
