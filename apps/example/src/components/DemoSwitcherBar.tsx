"use client";

import React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { ACCENT_PRESETS, type PresetName } from "model-ui";
import { useTheme } from "model-ui/client";

const BRANDS = [
  { id: "apex", label: "Studio Apex (London)" },
  { id: "elena", label: "Elena Vance (SF)" },
  { id: "kuro", label: "Kuro Atelier (Tokyo)" },
];

export function DemoSwitcherBar() {
  const pathname = usePathname() || "/";
  const searchParams = useSearchParams();
  const { mode, toggleMode } = useTheme();
  const activeBrand = searchParams.get("brand") || "apex";
  const activePreset = searchParams.get("preset") || "";

  const buildHref = (nextBrand: string, nextPreset: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextBrand) params.set("brand", nextBrand);
    else params.delete("brand");
    if (nextPreset) params.set("preset", nextPreset);
    else params.delete("preset");
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  return (
    <aside
      aria-label="Model UI Live Config Switcher"
      style={{
        position: "fixed",
        bottom: "1rem",
        right: "1rem",
        zIndex: 60,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.5rem 0.75rem",
        borderRadius: "9999px",
        background: "var(--t-surface-raised)",
        border: "1px solid var(--t-ink-15)",
        boxShadow: "var(--t-shadow-pop)",
        fontSize: "0.75rem",
      }}
    >
      <span style={{ fontWeight: 600, color: "var(--t-ink-60)" }}>
        Model UI:
      </span>
      {BRANDS.map((b) => (
        <a
          key={b.id}
          href={buildHref(b.id, activePreset)}
          style={{
            padding: "0.2rem 0.55rem",
            borderRadius: "9999px",
            background:
              activeBrand === b.id ? "var(--t-inverse-bg)" : "var(--t-chip)",
            color:
              activeBrand === b.id ? "var(--t-inverse-fg)" : "var(--t-fg)",
            fontWeight: 500,
          }}
        >
          {b.id}
        </a>
      ))}
      <span style={{ color: "var(--t-ink-30)" }}>|</span>
      {(Object.keys(ACCENT_PRESETS) as PresetName[]).map((p) => {
        const preset = ACCENT_PRESETS[p];
        const isCurrent = activePreset === p;
        return (
          <a
            key={p}
            href={buildHref(activeBrand, p)}
            title={`Accent: ${preset.label}`}
            aria-label={`Accent preset ${p}`}
            style={{
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              background: preset.hex,
              border: isCurrent
                ? "2px solid var(--t-fg)"
                : "1px solid var(--t-ink-30)",
              display: "inline-block",
            }}
          />
        );
      })}
      <button
        type="button"
        onClick={toggleMode}
        style={{
          marginLeft: "0.25rem",
          padding: "0.2rem 0.55rem",
          borderRadius: "9999px",
          border: 0,
          background: "var(--t-chip)",
          color: "var(--t-fg)",
          cursor: "pointer",
          font: "inherit",
        }}
      >
        {mode === "dark" ? "☀ light" : "☾ dark"}
      </button>
    </aside>
  );
}
