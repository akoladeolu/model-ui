import React, { Suspense, type ReactNode } from "react";
import type { Metadata } from "next";
import { ThemeStyle } from "model-ui";
import { ThemeProvider } from "model-ui/client";
import "model-ui/styles.css";
import { siteConfig } from "@/site.config";
import { DemoSwitcherBar } from "@/components/DemoSwitcherBar";

export const metadata: Metadata = {
  title: `${siteConfig.brand.name} — Model UI Design System`,
  description: siteConfig.brand.tagline,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeStyle config={siteConfig} />
      </head>
      <body className="t-body t-root">
        <ThemeProvider defaultMode={siteConfig.theme.defaultMode}>
          {children}
          <Suspense fallback={null}>
            <DemoSwitcherBar />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
