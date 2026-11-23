import React from "react";
import { notFound } from "next/navigation";
import { ThemeStyle } from "model-ui";
import { resolveDemoConfig } from "@/site.config";
import { projects } from "@/content/data";
import { StudioCaseStudyView } from "@/components/StudioPages";

export default async function ProjectCaseStudyPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ brand?: string; preset?: string; mode?: string }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const config = resolveDemoConfig(query);
  const project = projects.find((p) => p.slug === slug) ?? projects[0];
  if (!project) notFound();

  return (
    <>
      <ThemeStyle config={config} />
      <StudioCaseStudyView
        slug={slug}
        initialConfig={config}
        initialProject={project}
      />
    </>
  );
}
