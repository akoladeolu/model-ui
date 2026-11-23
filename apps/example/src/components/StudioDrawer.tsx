"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  ACCENT_PRESETS,
  PRESET_NAMES,
  isValidIanaZone,
  resolveAccent,
  type PresetName,
} from "model-ui";
import { useTheme } from "model-ui/client";
import { useStudio } from "@/studio/StudioContext";
import { generateContentTs, generateSiteConfigTs } from "@/studio/code-gen";

const CITY_PRESETS = [
  { city: "LONDON", tz: "Europe/London" },
  { city: "SAN FRANCISCO", tz: "America/Los_Angeles" },
  { city: "TOKYO", tz: "Asia/Tokyo" },
  { city: "NEW YORK", tz: "America/New_York" },
  { city: "BERLIN", tz: "Europe/Berlin" },
];

export function StudioDrawer() {
  const {
    studioEnabled,
    activePersona,
    isCustomized,
    drawerOpen,
    setDrawerOpen,
    activeTab,
    setActiveTab,
    draftBrand,
    draftLocation,
    draftTheme,
    draftSocials,
    hero,
    projects,
    posts,
    validConfig,
    fieldErrors,
    loadPersona,
    updateDraftBrand,
    updateDraftLocation,
    updateDraftTheme,
    updateHero,
    updateProject,
    updatePost,
    resetToPersona,
  } = useStudio();

  const { mode, toggleMode } = useTheme();
  const [exportView, setExportView] = useState<"config" | "content">("config");
  const [copyNotice, setCopyNotice] = useState<string | null>(null);

  // Content tab sub-selection
  const [selectedProjectSlug, setSelectedProjectSlug] = useState(
    projects[0]?.slug ?? "helix"
  );
  const [selectedPostSlug, setSelectedPostSlug] = useState(
    posts[0]?.slug ?? "thinking-like-a-systems-builder"
  );

  const drawerRef = useRef<HTMLDivElement | null>(null);
  const titleId = useId();

  // Close on Escape key
  useEffect(() => {
    if (!drawerOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [drawerOpen, setDrawerOpen]);

  const activeProject = useMemo(
    () =>
      projects.find((p) => p.slug === selectedProjectSlug) ?? projects[0],
    [projects, selectedProjectSlug]
  );

  const activePost = useMemo(
    () => posts.find((p) => p.slug === selectedPostSlug) ?? posts[0],
    [posts, selectedPostSlug]
  );

  const generatedConfigCode = useMemo(
    () => generateSiteConfigTs(validConfig),
    [validConfig]
  );

  const generatedContentCode = useMemo(
    () => generateContentTs(projects, posts),
    [projects, posts]
  );

  const wordmarkCharCount = useMemo(
    () => [...draftBrand.wordmark].length,
    [draftBrand.wordmark]
  );

  const accentInfo = useMemo(() => {
    const acc =
      draftTheme.accentMode === "custom"
        ? { hex: draftTheme.customHex }
        : draftTheme.preset;
    return resolveAccent(acc);
  }, [draftTheme]);

  if (!studioEnabled) return null;

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard?.writeText(text);
      setCopyNotice(`Copied ${label}!`);
      setTimeout(() => setCopyNotice(null), 2500);
    } catch {
      setCopyNotice("Select and copy below");
    }
  };

  return (
    <>
      {/* 1. COLLAPSED FLOATING DOCK BAR */}
      <aside
        aria-label="Model UI Studio Controller"
        style={{
          position: "fixed",
          bottom: "1rem",
          right: "1rem",
          zIndex: 60,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.4rem 0.65rem",
          borderRadius: "9999px",
          background: "var(--t-surface-raised)",
          border: "1px solid var(--t-ink-15)",
          boxShadow: "var(--t-shadow-pop)",
          fontSize: "0.75rem",
        }}
      >
        <span
          style={{
            fontWeight: 700,
            letterSpacing: "-0.01em",
            color: "var(--t-ink-80)",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
          }}
        >
          <span className="t-status-dot" aria-hidden="true" />
          <span>Studio</span>
        </span>

        {/* Quick Personas */}
        <div style={{ display: "inline-flex", gap: "3px" }}>
          {(["apex", "elena", "kuro"] as const).map((p) => {
            const isSelected = activePersona === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => loadPersona(p)}
                style={{
                  padding: "0.2rem 0.5rem",
                  borderRadius: "9999px",
                  border: 0,
                  cursor: "pointer",
                  background: isSelected
                    ? "var(--t-inverse-bg)"
                    : "var(--t-chip)",
                  color: isSelected ? "var(--t-inverse-fg)" : "var(--t-fg)",
                  fontWeight: isSelected ? 600 : 400,
                  fontSize: "0.75rem",
                }}
              >
                {p}
              </button>
            );
          })}
          {isCustomized && (
            <span
              style={{
                fontSize: "0.65rem",
                padding: "0.2rem 0.45rem",
                borderRadius: "9999px",
                background: "var(--t-ink-10)",
                color: "var(--t-ink-70)",
                fontWeight: 600,
                alignSelf: "center",
              }}
            >
              edited
            </span>
          )}
        </div>

        <span style={{ color: "var(--t-ink-20)" }}>|</span>

        {/* Quick Accent Dots */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          {PRESET_NAMES.map((name) => {
            const p = ACCENT_PRESETS[name];
            const isCurrent =
              draftTheme.accentMode === "preset" &&
              draftTheme.preset === name;
            return (
              <button
                key={name}
                type="button"
                title={`Accent: ${p.label}`}
                aria-label={`Accent ${name}`}
                onClick={() =>
                  updateDraftTheme({
                    accentMode: "preset",
                    preset: name,
                  })
                }
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  background: p.hex,
                  border: isCurrent
                    ? "2px solid var(--t-fg)"
                    : "1px solid var(--t-ink-30)",
                  cursor: "pointer",
                  padding: 0,
                }}
              />
            );
          })}
        </div>

        {/* Light/Dark Toggle */}
        <button
          type="button"
          onClick={toggleMode}
          title="Toggle Light / Dark Mode"
          style={{
            padding: "0.2rem 0.5rem",
            borderRadius: "9999px",
            border: 0,
            background: "var(--t-chip)",
            color: "var(--t-fg)",
            cursor: "pointer",
            fontSize: "0.75rem",
          }}
        >
          {mode === "dark" ? "☀" : "☾"}
        </button>

        {/* Open Customizer Drawer */}
        <button
          type="button"
          data-testid="studio-open-btn"
          onClick={() => setDrawerOpen(true)}
          style={{
            padding: "0.25rem 0.75rem",
            borderRadius: "9999px",
            border: 0,
            background: "var(--t-inverse-bg)",
            color: "var(--t-inverse-fg)",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "0.75rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.3rem",
          }}
        >
          <span>Customize ✦</span>
        </button>

        <button
          type="button"
          data-testid="studio-export-btn"
          onClick={() => {
            setActiveTab("export");
            setDrawerOpen(true);
          }}
          style={{
            padding: "0.25rem 0.55rem",
            borderRadius: "9999px",
            border: "1px solid var(--t-ink-20)",
            background: "transparent",
            color: "var(--t-fg)",
            cursor: "pointer",
            fontSize: "0.75rem",
          }}
        >
          Export
        </button>
      </aside>

      {/* 2. SLIDE-OVER DRAWER (Desktop) / BOTTOM SHEET (Mobile) */}
      {drawerOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 70,
            background: "var(--t-overlay)",
            backdropFilter: "blur(2px)",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-end",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setDrawerOpen(false);
          }}
        >
          <div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            style={{
              background: "var(--t-surface-raised)",
              color: "var(--t-fg)",
              width: "100%",
              maxWidth: "460px",
              height: "100%",
              maxHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "var(--t-shadow-modal)",
              borderLeft: "1px solid var(--t-ink-15)",
              overflow: "hidden",
            }}
          >
            {/* Drawer Header */}
            <header
              style={{
                padding: "1rem 1.25rem",
                borderBottom: "1px solid var(--t-ink-10)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
              }}
            >
              <div>
                <h2
                  id={titleId}
                  style={{
                    margin: 0,
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Model UI Studio
                </h2>
                <p
                  style={{
                    margin: "0.15rem 0 0",
                    fontSize: "0.75rem",
                    color: "var(--t-ink-60)",
                  }}
                >
                  Live visual test &amp; config exporter
                </p>
              </div>
              <button
                type="button"
                aria-label="Close Studio"
                onClick={() => setDrawerOpen(false)}
                style={{
                  border: 0,
                  background: "transparent",
                  color: "var(--t-ink-50)",
                  fontSize: "1.2rem",
                  cursor: "pointer",
                  padding: "0.25rem",
                }}
              >
                ✕
              </button>
            </header>

            {/* Tab Bar */}
            <nav
              aria-label="Studio sections"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                padding: "0.5rem 1rem",
                gap: "0.35rem",
                borderBottom: "1px solid var(--t-ink-10)",
                background: "var(--t-well)",
                flexShrink: 0,
                fontSize: "0.75rem",
              }}
            >
              {(
                [
                  { id: "brand", label: "Brand" },
                  { id: "location", label: "Clock" },
                  { id: "content", label: "Content" },
                  { id: "export", label: "Export" },
                ] as const
              ).map((tab) => {
                const isCurrent = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    data-testid={`studio-tab-${tab.id}`}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      padding: "0.4rem 0.2rem",
                      borderRadius: "0.4rem",
                      border: 0,
                      cursor: "pointer",
                      background: isCurrent
                        ? "var(--t-surface-raised)"
                        : "transparent",
                      color: isCurrent
                        ? "var(--t-fg)"
                        : "var(--t-ink-60)",
                      fontWeight: isCurrent ? 600 : 400,
                      boxShadow: isCurrent
                        ? "0 1px 3px rgb(0 0 0 / 0.08)"
                        : "none",
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </nav>

            {/* Drawer Body */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "1.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              {/* TAB 1: BRAND & THEME */}
              {activeTab === "brand" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                    <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>
                      Brand Name
                    </label>
                    <input
                      className="t-input"
                      type="text"
                      value={draftBrand.name}
                      onChange={(e) => updateDraftBrand({ name: e.target.value })}
                      placeholder="e.g. Studio Apex"
                    />
                    {fieldErrors["brand.name"] && (
                      <span style={{ fontSize: "0.7rem", color: "var(--t-danger)" }}>
                        {fieldErrors["brand.name"]}
                      </span>
                    )}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                      <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>
                        Nav Logo Mark
                      </label>
                      <input
                        className="t-input"
                        type="text"
                        value={draftBrand.logo}
                        onChange={(e) => updateDraftBrand({ logo: e.target.value })}
                        placeholder="e.g. apex."
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>
                          Monogram
                        </label>
                        <span style={{ fontSize: "0.7rem", color: "var(--t-ink-40)" }}>
                          {draftBrand.monogram.length}/3
                        </span>
                      </div>
                      <input
                        className="t-input"
                        type="text"
                        maxLength={3}
                        value={draftBrand.monogram}
                        onChange={(e) =>
                          updateDraftBrand({ monogram: e.target.value.toUpperCase() })
                        }
                        placeholder="e.g. SA"
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>
                        Giant Footer Wordmark
                      </label>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          color:
                            wordmarkCharCount > 12
                              ? "var(--t-danger)"
                              : "var(--t-ink-40)",
                          fontWeight: wordmarkCharCount > 12 ? 700 : 400,
                        }}
                      >
                        {wordmarkCharCount}/12 chars
                      </span>
                    </div>
                    <input
                      className="t-input"
                      type="text"
                      value={draftBrand.wordmark}
                      onChange={(e) =>
                        updateDraftBrand({ wordmark: e.target.value.toLowerCase() })
                      }
                      placeholder="e.g. studioapex"
                    />
                    {fieldErrors["brand.wordmark"] ? (
                      <span style={{ fontSize: "0.7rem", color: "var(--t-danger)" }}>
                        {fieldErrors["brand.wordmark"]}
                      </span>
                    ) : (
                      <span style={{ fontSize: "0.7rem", color: "var(--t-ink-50)" }}>
                        Auto-scales via container queries with bottom baseline bleed.
                      </span>
                    )}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                    <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>
                      Tagline / Bio
                    </label>
                    <textarea
                      className="t-textarea"
                      rows={2}
                      value={draftBrand.tagline}
                      onChange={(e) =>
                        updateDraftBrand({ tagline: e.target.value })
                      }
                    />
                  </div>

                  {/* Accent Presets & Custom Hex */}
                  <div
                    style={{
                      paddingTop: "0.75rem",
                      borderTop: "1px solid var(--t-ink-10)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.65rem",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>
                        Accent Palette (Strictly Restrained)
                      </label>
                      <span style={{ fontSize: "0.7rem", color: "var(--t-ink-50)" }}>
                        wordmark α: {accentInfo.wordmarkAlpha}
                      </span>
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                      {PRESET_NAMES.map((name) => {
                        const isSelected =
                          draftTheme.accentMode === "preset" &&
                          draftTheme.preset === name;
                        const p = ACCENT_PRESETS[name];
                        return (
                          <button
                            key={name}
                            type="button"
                            onClick={() =>
                              updateDraftTheme({
                                accentMode: "preset",
                                preset: name,
                              })
                            }
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.35rem",
                              padding: "0.3rem 0.6rem",
                              borderRadius: "9999px",
                              border: isSelected
                                ? "1.5px solid var(--t-fg)"
                                : "1px solid var(--t-ink-20)",
                              background: isSelected
                                ? "var(--t-surface)"
                                : "transparent",
                              cursor: "pointer",
                              fontSize: "0.75rem",
                            }}
                          >
                            <span
                              style={{
                                width: "10px",
                                height: "10px",
                                borderRadius: "50%",
                                background: p.hex,
                              }}
                            />
                            <span>{p.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Custom Hex Color */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginTop: "0.25rem",
                      }}
                    >
                      <input
                        type="color"
                        value={
                          draftTheme.customHex.startsWith("#")
                            ? draftTheme.customHex
                            : "#22d3ee"
                        }
                        onChange={(e) =>
                          updateDraftTheme({
                            accentMode: "custom",
                            customHex: e.target.value,
                          })
                        }
                        style={{
                          width: "32px",
                          height: "32px",
                          border: "1px solid var(--t-ink-20)",
                          borderRadius: "6px",
                          cursor: "pointer",
                          padding: "2px",
                        }}
                      />
                      <input
                        className="t-input"
                        type="text"
                        value={draftTheme.customHex}
                        onChange={(e) =>
                          updateDraftTheme({
                            accentMode: "custom",
                            customHex: e.target.value,
                          })
                        }
                        placeholder="#22d3ee"
                        style={{ maxWidth: "120px" }}
                      />
                      <span style={{ fontSize: "0.7rem", color: "var(--t-ink-50)" }}>
                        Custom brand hex (auto-luminance α)
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CLOCK & LOCATION */}
              {activeTab === "location" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={draftLocation.enabled}
                      onChange={(e) =>
                        updateDraftLocation({ enabled: e.target.checked })
                      }
                    />
                    <span>Enable Live Monospace Timezone Clock in Footer</span>
                  </label>

                  {draftLocation.enabled && (
                    <>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                        <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>
                          Quick City Presets
                        </span>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                          {CITY_PRESETS.map((item) => (
                            <button
                              key={item.city}
                              type="button"
                              onClick={() =>
                                updateDraftLocation({
                                  city: item.city,
                                  timeZone: item.tz,
                                })
                              }
                              style={{
                                padding: "0.3rem 0.6rem",
                                borderRadius: "9999px",
                                border: "1px solid var(--t-ink-20)",
                                background:
                                  draftLocation.city === item.city
                                    ? "var(--t-inverse-bg)"
                                    : "var(--t-chip)",
                                color:
                                  draftLocation.city === item.city
                                    ? "var(--t-inverse-fg)"
                                    : "var(--t-fg)",
                                fontSize: "0.75rem",
                                cursor: "pointer",
                              }}
                            >
                              {item.city}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                        <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>
                          City Name
                        </label>
                        <input
                          className="t-input"
                          type="text"
                          value={draftLocation.city}
                          onChange={(e) =>
                            updateDraftLocation({
                              city: e.target.value.toUpperCase(),
                            })
                          }
                          placeholder="e.g. BERLIN"
                        />
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>
                            IANA Timezone
                          </label>
                          <span
                            style={{
                              fontSize: "0.7rem",
                              color: isValidIanaZone(draftLocation.timeZone)
                                ? "var(--t-fg-muted)"
                                : "var(--t-danger)",
                            }}
                          >
                            {isValidIanaZone(draftLocation.timeZone)
                              ? "✓ Valid IANA zone"
                              : "Invalid timezone"}
                          </span>
                        </div>
                        <input
                          className="t-input"
                          type="text"
                          value={draftLocation.timeZone}
                          onChange={(e) =>
                            updateDraftLocation({ timeZone: e.target.value })
                          }
                          placeholder="e.g. Europe/Berlin"
                        />
                        {fieldErrors["location.timeZone"] && (
                          <span style={{ fontSize: "0.7rem", color: "var(--t-danger)" }}>
                            {fieldErrors["location.timeZone"]}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* TAB 3: SWAP CONTENT */}
              {activeTab === "content" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  {/* Hero Headline & Bio */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <h3 style={{ margin: 0, fontSize: "0.85rem", fontWeight: 700 }}>
                      Hero &amp; Handwriting Statement
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                      <input
                        className="t-input"
                        type="text"
                        value={hero.headlineLead}
                        onChange={(e) => updateHero({ headlineLead: e.target.value })}
                        placeholder="lead"
                      />
                      <input
                        className="t-input"
                        type="text"
                        value={hero.headlineMuted}
                        onChange={(e) => updateHero({ headlineMuted: e.target.value })}
                        placeholder="muted action word"
                      />
                    </div>
                    <textarea
                      className="t-textarea"
                      rows={2}
                      value={hero.statementText}
                      onChange={(e) => updateHero({ statementText: e.target.value })}
                      placeholder="Handwritten cursive statement..."
                    />
                  </div>

                  {/* Project Selector & Editor */}
                  <div
                    style={{
                      paddingTop: "0.75rem",
                      borderTop: "1px solid var(--t-ink-10)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.6rem",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <h3 style={{ margin: 0, fontSize: "0.85rem", fontWeight: 700 }}>
                        Project &amp; Case Study
                      </h3>
                      <select
                        value={activeProject.slug}
                        onChange={(e) => setSelectedProjectSlug(e.target.value)}
                        style={{
                          fontSize: "0.75rem",
                          padding: "0.2rem 0.4rem",
                          borderRadius: "4px",
                          border: "1px solid var(--t-ink-20)",
                          background: "var(--t-surface-raised)",
                          color: "var(--t-fg)",
                        }}
                      >
                        {projects.map((p) => (
                          <option key={p.slug} value={p.slug}>
                            {p.title} ({p.year})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "0.5rem" }}>
                      <input
                        className="t-input"
                        type="text"
                        value={activeProject.title}
                        onChange={(e) =>
                          updateProject(activeProject.slug, { title: e.target.value })
                        }
                        placeholder="Title"
                      />
                      <input
                        className="t-input"
                        type="text"
                        value={activeProject.year}
                        onChange={(e) =>
                          updateProject(activeProject.slug, { year: e.target.value })
                        }
                        placeholder="Year"
                      />
                    </div>

                    <input
                      className="t-input"
                      type="text"
                      value={activeProject.subtitle}
                      onChange={(e) =>
                        updateProject(activeProject.slug, { subtitle: e.target.value })
                      }
                      placeholder="Subtitle kicker"
                    />

                    <input
                      className="t-input"
                      type="text"
                      value={activeProject.tags.join(", ")}
                      onChange={(e) =>
                        updateProject(activeProject.slug, {
                          tags: e.target.value
                            .split(",")
                            .map((t) => t.trim())
                            .filter(Boolean),
                        })
                      }
                      placeholder="Tags (comma-separated)"
                    />

                    <textarea
                      className="t-textarea"
                      rows={2}
                      value={activeProject.challenge}
                      onChange={(e) =>
                        updateProject(activeProject.slug, {
                          challenge: e.target.value,
                        })
                      }
                      placeholder="The Challenge..."
                    />

                    <textarea
                      className="t-textarea"
                      rows={2}
                      value={activeProject.solution}
                      onChange={(e) =>
                        updateProject(activeProject.slug, {
                          solution: e.target.value,
                        })
                      }
                      placeholder="The Solution..."
                    />

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                      <label style={{ fontSize: "0.7rem", color: "var(--t-ink-60)" }}>
                        Impact Bullets (1 per line)
                      </label>
                      <textarea
                        className="t-textarea"
                        rows={3}
                        value={activeProject.impact.join("\n")}
                        onChange={(e) =>
                          updateProject(activeProject.slug, {
                            impact: e.target.value
                              .split("\n")
                              .filter((line) => line.trim().length > 0),
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Blog Post Selector & Editor */}
                  <div
                    style={{
                      paddingTop: "0.75rem",
                      borderTop: "1px solid var(--t-ink-10)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.6rem",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <h3 style={{ margin: 0, fontSize: "0.85rem", fontWeight: 700 }}>
                        Blog Post &amp; Article Body
                      </h3>
                      <select
                        value={activePost.slug}
                        onChange={(e) => setSelectedPostSlug(e.target.value)}
                        style={{
                          fontSize: "0.75rem",
                          padding: "0.2rem 0.4rem",
                          borderRadius: "4px",
                          border: "1px solid var(--t-ink-20)",
                          background: "var(--t-surface-raised)",
                          color: "var(--t-fg)",
                        }}
                      >
                        {posts.map((p) => (
                          <option key={p.slug} value={p.slug}>
                            {p.title.slice(0, 24)}...
                          </option>
                        ))}
                      </select>
                    </div>

                    <input
                      className="t-input"
                      type="text"
                      value={activePost.title}
                      onChange={(e) =>
                        updatePost(activePost.slug, { title: e.target.value })
                      }
                      placeholder="Post title"
                    />

                    <textarea
                      className="t-textarea"
                      rows={2}
                      value={activePost.description}
                      onChange={(e) =>
                        updatePost(activePost.slug, {
                          description: e.target.value,
                        })
                      }
                      placeholder="Post excerpt"
                    />

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                      <label style={{ fontSize: "0.7rem", color: "var(--t-ink-60)" }}>
                        Article Body Paragraphs (1 per line)
                      </label>
                      <textarea
                        className="t-textarea"
                        rows={3}
                        value={activePost.bodyParagraphs.join("\n")}
                        onChange={(e) =>
                          updatePost(activePost.slug, {
                            bodyParagraphs: e.target.value
                              .split("\n")
                              .filter((line) => line.trim().length > 0),
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: EXPORT CODE */}
              {activeTab === "export" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "inline-flex", gap: "4px" }}>
                      <button
                        type="button"
                        onClick={() => setExportView("config")}
                        style={{
                          padding: "0.3rem 0.6rem",
                          borderRadius: "0.4rem",
                          border: 0,
                          cursor: "pointer",
                          background:
                            exportView === "config"
                              ? "var(--t-inverse-bg)"
                              : "var(--t-chip)",
                          color:
                            exportView === "config"
                              ? "var(--t-inverse-fg)"
                              : "var(--t-fg)",
                          fontSize: "0.75rem",
                          fontWeight: exportView === "config" ? 600 : 400,
                        }}
                      >
                        site.config.ts
                      </button>
                      <button
                        type="button"
                        onClick={() => setExportView("content")}
                        style={{
                          padding: "0.3rem 0.6rem",
                          borderRadius: "0.4rem",
                          border: 0,
                          cursor: "pointer",
                          background:
                            exportView === "content"
                              ? "var(--t-inverse-bg)"
                              : "var(--t-chip)",
                          color:
                            exportView === "content"
                              ? "var(--t-inverse-fg)"
                              : "var(--t-fg)",
                          fontSize: "0.75rem",
                          fontWeight: exportView === "content" ? 600 : 400,
                        }}
                      >
                        content.ts
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          exportView === "config"
                            ? generatedConfigCode
                            : generatedContentCode,
                          exportView === "config"
                            ? "site.config.ts"
                            : "content.ts"
                        )
                      }
                      style={{
                        padding: "0.3rem 0.75rem",
                        borderRadius: "9999px",
                        border: 0,
                        background: "var(--t-inverse-bg)",
                        color: "var(--t-inverse-fg)",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        cursor: "pointer",
                      }}
                    >
                      {copyNotice ?? "Copy Code"}
                    </button>
                  </div>

                  <pre
                    style={{
                      margin: 0,
                      padding: "1rem",
                      borderRadius: "0.6rem",
                      background: "var(--t-ink-5)",
                      border: "1px solid var(--t-ink-15)",
                      fontSize: "0.72rem",
                      fontFamily: "var(--t-font-mono)",
                      lineHeight: 1.5,
                      overflowX: "auto",
                      maxHeight: "380px",
                    }}
                  >
                    <code data-testid="studio-config-code">
                      {exportView === "config"
                        ? generatedConfigCode
                        : generatedContentCode}
                    </code>
                  </pre>

                  <div
                    style={{
                      paddingTop: "0.75rem",
                      borderTop: "1px solid var(--t-ink-10)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => resetToPersona("apex")}
                      style={{
                        padding: "0.3rem 0.65rem",
                        borderRadius: "0.4rem",
                        border: "1px solid var(--t-ink-20)",
                        background: "transparent",
                        color: "var(--t-danger)",
                        cursor: "pointer",
                        fontSize: "0.75rem",
                      }}
                    >
                      Reset all edits
                    </button>
                    <span style={{ fontSize: "0.7rem", color: "var(--t-ink-50)" }}>
                      Saved automatically in localStorage
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
