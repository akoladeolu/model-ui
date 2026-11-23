import React from "react";
import { HomeTemplate, ThemeStyle } from "model-ui";
import { resolveDemoConfig } from "@/site.config";
import { posts, projects } from "@/content/data";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ brand?: string; preset?: string; mode?: string }>;
}) {
  const params = await searchParams;
  const config = resolveDemoConfig(params);

  return (
    <>
      <ThemeStyle config={config} />
      <HomeTemplate
        config={config}
        projects={projects}
        posts={posts}
      />
    </>
  );
}
