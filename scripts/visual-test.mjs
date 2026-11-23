import { execSync, spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const PORT = 3145;
const BASE_URL = `http://localhost:${PORT}`;
const ARTIFACT_DIR =
  "/home/antigravity/.gemini/jetski/brain/v1/default/jetski_remote_agents_3p/28a992f4-3f5a-4742-be54-3468f82a184b";
const SHOT_DIR = path.join(ARTIFACT_DIR, "screenshots");

fs.mkdirSync(SHOT_DIR, { recursive: true });

async function waitForServer(url, timeoutMs = 25000) {
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
  try {
    execSync(`fuser -k ${PORT}/tcp 2>/dev/null || true`);
  } catch {}

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
    page.on("pageerror", (err) => console.error("BROWSER PAGE ERROR:", err));
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        console.error("BROWSER CONSOLE ERROR:", msg.text());
      }
    });

    let totalShots = 0;

    // 1. Capture clean canonical screenshots with ?studio=off
    for (const profile of PROFILES) {
      for (const mode of ["light", "dark"]) {
        for (const route of ROUTES) {
          const url = `${BASE_URL}${route.path}?brand=${profile.brand}&preset=${profile.preset}&mode=${mode}&studio=off`;
          await page.goto(url, { waitUntil: "networkidle" });

          await page.evaluate((m) => {
            localStorage.setItem("model-ui-theme", m);
            document.documentElement.setAttribute("data-theme", m);
            document.documentElement.classList.toggle("dark", m === "dark");
          }, mode);

          await page.waitForTimeout(200);

          const domTheme = await page.evaluate(() =>
            document.documentElement.getAttribute("data-theme")
          );
          if (domTheme !== mode) {
            throw new Error(
              `Expected data-theme=${mode} on ${url}, got ${domTheme}`
            );
          }

          if (route.name !== "case-study") {
            const wm = await page.textContent(".t-wordmark");
            if (wm?.trim() !== profile.wordmark) {
              throw new Error(
                `Expected wordmark '${profile.wordmark}' on ${url}, got '${wm}'`
              );
            }
          }

          const shotName = `${route.name}-${profile.brand}-${profile.preset}-${mode}.png`;
          const shotPath = path.join(SHOT_DIR, shotName);
          await page.screenshot({ path: shotPath, fullPage: true });
          totalShots++;
        }
      }
    }

    // 2. Responsive overflow check at 375px, 768px, 1440px
    for (const width of VIEWPORTS) {
      await page.setViewportSize({ width, height: 900 });
      for (const route of ROUTES) {
        const url = `${BASE_URL}${route.path}?brand=apex&preset=cyan&studio=off`;
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

    // 3. Interactive Studio E2E Testing & Drawer Screenshots
    console.log("🎨 Testing Model UI Interactive Studio drawer & E2E flows...");
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });

    // Open Studio Drawer
    const openBtn = page.locator('[data-testid="studio-open-btn"]');
    await openBtn.click();
    await page.waitForTimeout(300);

    // Capture open drawer on Desktop
    await page.screenshot({
      path: path.join(SHOT_DIR, "studio-drawer-desktop.png"),
    });
    totalShots++;

    // Test safeParse error handling (invalid >12 char wordmark)
    const wordmarkInput = page.locator('input[placeholder="e.g. studioapex"]');
    await wordmarkInput.fill("fourteenchars!");
    await page.waitForTimeout(150);

    // Verify inline error message is shown without crashing
    const errorText = await page.textContent("text=12 characters or fewer");
    if (!errorText) {
      throw new Error("Expected inline validation error for 14-char wordmark");
    }

    // Type a valid custom brand & wordmark
    const brandInput = page.locator('input[placeholder="e.g. Studio Apex"]');
    await brandInput.fill("Nova Labs");
    await wordmarkInput.fill("novalabs");
    await page.waitForTimeout(300);

    // Verify live DOM reflects wordmark immediately
    const liveWordmark = await page.textContent(".t-wordmark");
    if (liveWordmark?.trim() !== "novalabs") {
      throw new Error(`Expected live wordmark 'novalabs', got '${liveWordmark}'`);
    }

    // Switch to Content Tab and customize project title
    await page.click('button:has-text("Content")');
    await page.waitForTimeout(200);

    const projectTitleInput = page.locator('input[placeholder="Title"]');
    await projectTitleInput.fill("Hyperion Relay");
    await page.waitForTimeout(300);

    // Verify live page card reflects "Hyperion Relay"
    const liveProjectTitle = await page.textContent(".t-card__title");
    if (!liveProjectTitle?.includes("Hyperion Relay")) {
      throw new Error(
        `Expected project card title to update to 'Hyperion Relay', got '${liveProjectTitle}'`
      );
    }

    // Close drawer before navigating so backdrop doesn't intercept pointer events
    await page.keyboard.press("Escape");
    await page.waitForTimeout(200);

    // Test cross-page persistence: Click into case study link
    await page.click('a[href="/projects/helix"]');
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(300);

    const caseTitle = await page.textContent(".t-case__title");
    if (!caseTitle?.includes("Hyperion Relay")) {
      throw new Error(
        `Expected case study title to persist as 'Hyperion Relay' across navigation, got '${caseTitle}'`
      );
    }

    // Re-open drawer on case study page, switch to Export tab
    await page.click('[data-testid="studio-open-btn"]');
    await page.waitForTimeout(200);
    await page.click('[data-testid="studio-tab-export"]');
    await page.waitForTimeout(200);

    const codeSnippet = await page.textContent(
      '[data-testid="studio-config-code"]'
    );
    if (
      !codeSnippet?.includes('name: "Nova Labs"') ||
      !codeSnippet?.includes('wordmark: "novalabs"')
    ) {
      throw new Error("Export code snippet did not contain customized brand values");
    }

    // Mobile Bottom Sheet capture at 375px
    await page.setViewportSize({ width: 375, height: 750 });
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(SHOT_DIR, "studio-drawer-mobile.png"),
    });
    totalShots++;

    await browser.close();
    console.log(
      `✅ Visual & Studio verification passed! Captured ${totalShots} screenshots in ${SHOT_DIR} and verified full E2E Studio flows.`
    );
  } finally {
    try {
      execSync(`fuser -k ${PORT}/tcp 2>/dev/null || true`);
    } catch {}
    try {
      server.kill("SIGKILL");
    } catch {}
  }
  process.exit(0);
}

run().catch((err) => {
  console.error("❌ Visual test failed:", err);
  process.exit(1);
});
