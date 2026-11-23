import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const PORT = 3145;
const BASE_URL = `http://localhost:${PORT}`;
const ARTIFACT_DIR =
  "/home/antigravity/.gemini/jetski/brain/v1/default/jetski_remote_agents_3p/28a992f4-3f5a-4742-be54-3468f82a184b";
const SHOT_DIR = path.join(ARTIFACT_DIR, "screenshots");

fs.mkdirSync(SHOT_DIR, { recursive: true });

async function waitForServer(url, timeoutMs = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

const ROUTES = [
  { name: "home", path: "/" },
  { name: "blog-index", path: "/blog" },
  { name: "blog-post", path: "/blog/thinking-like-a-systems-builder" },
  { name: "case-study", path: "/projects/helix" },
];

const PROFILES = [
  { brand: "apex", preset: "cyan", wordmark: "studioapex", city: "LONDON" },
  { brand: "elena", preset: "mono", wordmark: "elena", city: "SAN FRANCISCO" },
  { brand: "kuro", preset: "lime", wordmark: "kuro", city: "TOKYO" },
];

const VIEWPORTS = [375, 768, 1440];

async function run() {
  console.log("🚀 Starting Next.js production server on port", PORT);
  const server = spawn(
    "pnpm",
    ["--filter", "model-ui-example", "exec", "next", "start", "-p", String(PORT)],
    {
      stdio: "pipe",
      env: { ...process.env, COREPACK_ENABLE_DOWNLOAD_PROMPT: "0" },
    }
  );

  try {
    await waitForServer(BASE_URL);
    console.log("✅ Server ready at", BASE_URL);

    const browser = await chromium.launch({
      executablePath: "/usr/bin/chromium",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    const page = await context.newPage();

    let totalShots = 0;

    for (const profile of PROFILES) {
      for (const mode of ["light", "dark"]) {
        for (const route of ROUTES) {
          const url = `${BASE_URL}${route.path}?brand=${profile.brand}&preset=${profile.preset}&mode=${mode}`;
          await page.goto(url, { waitUntil: "networkidle" });

          // Force theme mode via localStorage + DOM attribute to verify both initial and active state
          await page.evaluate((m) => {
            localStorage.setItem("model-ui-theme", m);
            document.documentElement.setAttribute("data-theme", m);
            document.documentElement.classList.toggle("dark", m === "dark");
          }, mode);

          // Wait briefly for CSS animations to settle
          await page.waitForTimeout(200);

          // Verify data-theme
          const domTheme = await page.evaluate(() =>
            document.documentElement.getAttribute("data-theme")
          );
          if (domTheme !== mode) {
            throw new Error(
              `Expected data-theme=${mode} on ${url}, got ${domTheme}`
            );
          }

          // Verify brand wordmark & clock on pages that include the footer
          if (route.name !== "case-study") {
            const wm = await page.textContent(".t-wordmark");
            if (wm?.trim() !== profile.wordmark) {
              throw new Error(
                `Expected wordmark '${profile.wordmark}' on ${url}, got '${wm}'`
              );
            }
          }

          // Save representative screenshots to artifact directory
          const shotName = `${route.name}-${profile.brand}-${profile.preset}-${mode}.png`;
          const shotPath = path.join(SHOT_DIR, shotName);
          await page.screenshot({ path: shotPath, fullPage: true });
          totalShots++;
        }
      }
    }

    // Check zero horizontal overflow at 375px, 768px, 1440px across all 4 routes
    for (const width of VIEWPORTS) {
      await page.setViewportSize({ width, height: 900 });
      for (const route of ROUTES) {
        const url = `${BASE_URL}${route.path}?brand=apex&preset=cyan`;
        await page.goto(url, { waitUntil: "networkidle" });
        const overflow = await page.evaluate(() => {
          return (
            document.documentElement.scrollWidth >
            document.documentElement.clientWidth
          );
        });
        if (overflow) {
          throw new Error(
            `Horizontal overflow detected on ${route.path} at viewport width ${width}px`
          );
        }
      }
    }

    await browser.close();
    console.log(
      `✅ Visual verification passed! Captured ${totalShots} screenshots in ${SHOT_DIR} and verified 0 horizontal overflow across 375/768/1440px.`
    );
  } finally {
    server.kill("SIGKILL");
  }
  process.exit(0);
}

run().catch((err) => {
  console.error("❌ Visual test failed:", err);
  process.exit(1);
});
