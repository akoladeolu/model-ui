import React from "react";
import { notFound } from "next/navigation";
import { BlogPostTemplate, ThemeStyle } from "model-ui";
import { resolveDemoConfig } from "@/site.config";
import { posts, sampleComments } from "@/content/data";

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
      <BlogPostTemplate config={config} post={post} comments={comments}>
        <p>
          okay, before anybody starts fighting me, i still love interface work.
        </p>
        <p>
          i love clean interfaces, stupidly good spacing, typography that
          actually feels intentional, smooth motion, tiny hover states nobody
          asked for, and spending 45 minutes moving something <code>4px</code>{" "}
          to the left because <em>“something feels off.”</em>
        </p>
        <p>
          <strong>
            moving from isolated components to end-to-end systems is where the
            craft compounds.
          </strong>{" "}
          not because UI is boring — it&apos;s because the interface is only one
          half of the loop.
        </p>
        <hr />
        <h2>why monochrome paper &amp; ink scales across products</h2>
        <p>
          when every component fights for attention with a different accent hue,
          nothing feels tactile. stripping a system down to one ink and an
          11-step opacity ramp forces spacing, elevation, and motion to do the
          real work.
        </p>
        <blockquote>
          “you stop seeing a product as a tree of components, and start seeing
          it as a loop between an idea, a system, and a person trying to get
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
          that&apos;s the shift: caring about the whole thing from the database
          schema to the <code>300ms</code> hover curve.
        </p>
      </BlogPostTemplate>
    </>
  );
}
