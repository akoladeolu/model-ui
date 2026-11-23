export type PresetName = "lime" | "cyan" | "amber" | "violet" | "mono";

export interface AccentPreset {
  name: PresetName;
  label: string;
  hex: string;
  rgb: [number, number, number];
  /** Alpha for giant footer wordmark on dark #0d0e0e background */
  wordmarkAlpha: number;
  /** Alpha for focus-visible rings and status glow */
  ringAlpha: number;
  /** Alpha for text selection highlight */
  selectionAlpha: number;
}

export const ACCENT_PRESETS: Record<PresetName, AccentPreset> = {
  lime: {
    name: "lime",
    label: "Signature Lime",
    hex: "#bef264",
    rgb: [190, 242, 100],
    wordmarkAlpha: 0.30,
    ringAlpha: 0.55,
    selectionAlpha: 0.25,
  },
  cyan: {
    name: "cyan",
    label: "Electric Cyan",
    hex: "#22d3ee",
    rgb: [34, 211, 238],
    wordmarkAlpha: 0.26,
    ringAlpha: 0.50,
    selectionAlpha: 0.22,
  },
  amber: {
    name: "amber",
    label: "Sunset Amber",
    hex: "#fbbf24",
    rgb: [251, 191, 36],
    wordmarkAlpha: 0.26,
    ringAlpha: 0.55,
    selectionAlpha: 0.24,
  },
  violet: {
    name: "violet",
    label: "Neo Violet",
    hex: "#a78bfa",
    rgb: [167, 139, 250],
    wordmarkAlpha: 0.34,
    ringAlpha: 0.50,
    selectionAlpha: 0.24,
  },
  mono: {
    name: "mono",
    label: "Studio Monochrome",
    hex: "#ffffff",
    rgb: [255, 255, 255],
    wordmarkAlpha: 0.14,
    ringAlpha: 0.35,
    selectionAlpha: 0.16,
  },
};

export const PRESET_NAMES = Object.keys(ACCENT_PRESETS) as [
  PresetName,
  ...PresetName[]
];

export function parseHexToRgb(hex: string): [number, number, number] {
  const clean = hex.trim().replace(/^#/, "");
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return [r, g, b];
  }
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return [r, g, b];
}

/**
 * Relative luminance (WCAG) used to compute balanced wordmark alpha
 * when a custom hex accent is provided without explicit alphas.
 */
export function relativeLuminance([r, g, b]: [number, number, number]): number {
  const toLinear = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}
