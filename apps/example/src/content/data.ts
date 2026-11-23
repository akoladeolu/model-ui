import type { CommentItem, Post, Project } from "model-ui";

export const projects: Project[] = [
  {
    slug: "helix",
    title: "Helix",
    subtitle: "Self-Hosted Localhost Tunneling Tool",
    description:
      "An ngrok alternative that exposes localhost on persistent, path-based public URLs instead of disposable subdomains. CLI-first, self-hosted relay.",
    year: "2025",
    tags: ["Node.js", "TypeScript", "CLI", "Self-Hosted", "Networking"],
    category: "developer tools",
    liveUrl: "https://apex.example.com/helix",
    codeUrl: "https://github.com/example/helix",
    monogram: "H",
    challenge:
      "Existing tunneling tools hand out disposable subdomains on every restart, offer no self-hosting story, and charge for basics like persistent URLs. Developers demoing work-in-progress need a stable, shareable link without standing up their own infrastructure from scratch — but they also don't want to hand traffic to a third party they don't control.",
    solution:
      "Built Helix around path-based routing instead of subdomains — every tunnel lives at a persistent /tunnel/{name}/ path, claimed once and reused. The relay is self-hostable, so traffic stays on infrastructure the user controls. Auth is passwordless (email one-time code), shared across web and CLI.",
    impact: [
      "Delivered a working tunneling alternative with zero ongoing hosting cost via free-tier cloud relays",
      "Solved the relative-URL breakage problem inherent to path-based (non-subdomain) tunneling",
      "Shipped passwordless auth shared cleanly across CLI and web dashboard",
      "Took the product from idea to full build in 4–5 days",
    ],
    features: [
      {
        body: "Path-based persistent tunnels (/tunnel/{name}/) instead of disposable subdomains",
      },
      {
        body: "Self-hosted relay — traffic stays on infrastructure you control",
      },
      {
        body: "Passwordless email-code authentication, shared across CLI and web",
      },
      {
        body: "Live request history dashboard & password-protected tunnels",
      },
    ],
    stack: [
      "Node.js relay server + CLI client, TypeScript throughout",
      "Appwrite for auth & data (cloud free tier)",
      "GitHub OAuth for CLI authentication",
      "Cloud container hosting with automated uptime pinging",
    ],
    lessons: [
      "Path-based routing is viable but requires rewriting relative asset URLs server-side — a subdomain-based tool doesn't have this problem",
      "Free-tier hosting is workable for a real product if you actively manage idle spin-down",
      "Shipping a full product (not just an MVP) in 4–5 days is possible with tight scope discipline",
    ],
  },
  {
    slug: "kroma",
    title: "Kroma",
    subtitle: "MCP Server for AI Design Intelligence",
    description:
      "Gives AI coding agents live access to real design tokens, component contracts, and motion rules so agents stop shipping generic layouts.",
    year: "2026",
    tags: ["MCP", "TypeScript", "Design Systems", "AST", "Playwright"],
    category: "ai & design",
    liveUrl: "https://apex.example.com/kroma",
    codeUrl: "https://github.com/example/kroma",
    monogram: "K",
    gradient: ["#c9d6e8", "#7d8ea8"],
    challenge:
      "AI coding assistants default to generic multi-colored SaaS boilerplates because they lack structured, enforceable aesthetic constraints and token hierarchies.",
    solution:
      "Created an MCP server and schema compiler that exposes curated paper-and-ink design systems, opacity ramps, and layout rails directly to coding agents.",
    impact: [
      "Cut UI review iterations by 70% across 12 internal Next.js applications",
      "Enforced strict monochrome ink opacity ramps and zero-flash dark mode automatically",
    ],
    features: [
      { body: "Typed Zod site configuration with luminance-balanced accent presets" },
      { body: "Server-first React primitives with zero layout shift" },
      { body: "Automated brand-leak and visual regression checks" },
      { body: "Drop-in Next.js App Router templates for home, blog, and case studies" },
    ],
    stack: [
      "TypeScript + Zod schema validation",
      "React 19 Server Components + Next.js App Router",
      "CSS Custom Properties with 11-step ink opacity ramp",
      "Playwright visual verification suite",
    ],
    lessons: [
      "Constraining accent colors to 4 micro-moments preserves visual calm across any brand palette",
      "Passing config via props + server-injected CSS variables beats React Context for RSC performance",
    ],
  },
];

export const posts: Post[] = [
  {
    slug: "thinking-like-a-systems-builder",
    title: "moving from isolated components to end-to-end systems.",
    description:
      "why stopping at the interface layer limits how good a product can feel — and how owning the schema, latency, and 300ms hover curve changes everything.",
    date: "Sep 30, 2026",
    readMinutes: 4,
    reads: 318,
    likes: 24,
    comments: 2,
    shares: 4,
    tags: ["systems", "engineering"],
    gradient: ["#2b3a4a", "#141a21"],
  },
  {
    slug: "why-monochrome-interfaces-feel-calmer",
    title: "why monochrome interfaces feel calmer than colour palettes.",
    description:
      "when every component fights for attention with a different accent hue, nothing feels tactile. stripping a system down to one ink and an opacity ramp forces spacing and motion to do the real work.",
    date: "Oct 14, 2026",
    readMinutes: 5,
    reads: 512,
    likes: 58,
    comments: 3,
    shares: 9,
    tags: ["design", "engineering"],
  },
];

export const sampleComments: Record<string, CommentItem[]> = {
  "thinking-like-a-systems-builder": [
    {
      id: "c1",
      author: "Sammie",
      date: "Oct 2",
      body: "To be honest this is really nice — no titles, just pure building.",
      likes: 2,
      replies: [
        {
          id: "c1-r1",
          author: "apex.",
          date: "Oct 2",
          body: "Appreciate that — caring about the whole loop makes all the difference.",
        },
      ],
    },
  ],
  "why-monochrome-interfaces-feel-calmer": [
    {
      id: "c2",
      author: "Marcus",
      date: "Oct 15",
      body: "The 11-step ink opacity ramp is such a clean mental model compared to juggling 40 grey hex codes.",
      likes: 5,
    },
  ],
};
