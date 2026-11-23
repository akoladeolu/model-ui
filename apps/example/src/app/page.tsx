import React from "react";
import { ThemeStyle } from "model-ui";
import { resolveDemoConfig } from "@/site.config";
import { posts, projects } from "@/content/data";
import { StudioHomeView } from "@/components/StudioPages";

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
      <StudioHomeView
        initialConfig={config}
        initialProjects={projects}
        initialPosts={posts}
      />
    </>
  );
}
