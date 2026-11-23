import React from "react";
import { ThemeStyle } from "model-ui";
import { resolveDemoConfig } from "@/site.config";
import { posts } from "@/content/data";
import { StudioBlogIndexView } from "@/components/StudioPages";

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
      <StudioBlogIndexView initialConfig={config} initialPosts={posts} />
    </>
  );
}
