import {
  ACCENT_PRESETS,
  parseHexToRgb,
  relativeLuminance,
  type PresetName,
} from "./presets.js";
import type { CustomAccent, ResolvedAccent, SiteConfig } from "./schema.js";

export function resolveAccent(
  accent: PresetName | CustomAccent
): ResolvedAccent {
  if (typeof accent === "string") {
    const preset = ACCENT_PRESETS[accent];
    return {
      preset: preset.name,
      hex: preset.hex,
      rgb: preset.rgb,
      wordmarkAlpha: preset.wordmarkAlpha,
      ringAlpha: preset.ringAlpha,
      selectionAlpha: preset.selectionAlpha,
    };
  }

  const rgb = parseHexToRgb(accent.hex);
  const lum = relativeLuminance(rgb);
  // Brighter hues need lower alpha on #0d0e0e so they don't overpower the stage;
  // darker hues get higher alpha so they remain legible.
  const autoWordmarkAlpha =
    lum > 0.85 ? 0.16 : lum > 0.55 ? 0.26 : lum > 0.25 ? 0.34 : 0.44;
  const autoRingAlpha = lum > 0.85 ? 0.38 : 0.52;
  const autoSelectionAlpha = lum > 0.85 ? 0.18 : 0.24;

  return {
    hex: accent.hex,
    rgb,
    wordmarkAlpha: accent.wordmarkAlpha ?? autoWordmarkAlpha,
    ringAlpha: accent.ringAlpha ?? autoRingAlpha,
    selectionAlpha: accent.selectionAlpha ?? autoSelectionAlpha,
  };
}

export function toCssVars(config: SiteConfig): Record<string, string> {
  const resolved = resolveAccent(config.theme.accent);
  const [r, g, b] = resolved.rgb;
  const vars: Record<string, string> = {
    "--t-brand-accent": resolved.hex,
    "--t-brand-accent-rgb": `${r} ${g} ${b}`,
    "--t-brand-accent-wordmark": `rgb(${r} ${g} ${b} / ${resolved.wordmarkAlpha})`,
    "--t-brand-accent-ring": `rgb(${r} ${g} ${b} / ${resolved.ringAlpha})`,
    "--t-brand-accent-selection": `rgb(${r} ${g} ${b} / ${resolved.selectionAlpha})`,
    "--t-accent": `rgb(${r} ${g} ${b} / ${resolved.wordmarkAlpha})`,
  };

  const fonts = config.theme.fonts;
  if (fonts?.sans) vars["--t-font-sans"] = fonts.sans;
  if (fonts?.hand) vars["--t-font-hand"] = fonts.hand;
  if (fonts?.prose) vars["--t-font-prose"] = fonts.prose;
  if (fonts?.mono) vars["--t-font-mono"] = fonts.mono;

  return vars;
}

export function toCssVarStyleText(config: SiteConfig): string {
  const vars = toCssVars(config);
  const entries = Object.entries(vars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join("\n");
  return `:root {\n${entries}\n}`;
}
