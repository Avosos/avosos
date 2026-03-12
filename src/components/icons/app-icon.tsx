"use client";

import React from "react";
import CuttamaranIcon from "./cuttamaran-icon";
import VoicianIcon from "./voician-icon";
import StreampadIcon from "./streampad-icon";
import ManwhawhamIcon from "./manwhawham-icon";
import NovelteaIcon from "./noveltea-icon";
import BangerbotIcon from "./bangerbot-icon";
import TrackemIcon from "./trackem-icon";
import AppliviewIcon from "./appliview-icon";
import EurobarIcon from "./eurobar-icon";
import LibreIcon from "./libre-icon";
import InterchatIcon from "./interchat-icon";
import { Box } from "lucide-react";

const ICON_MAP: Record<string, React.FC<{ size?: number }>> = {
  cuttamaran: CuttamaranIcon,
  voician: VoicianIcon,
  streampad: StreampadIcon,
  manwhawham: ManwhawhamIcon,
  noveltea: NovelteaIcon,
  bangerbot: BangerbotIcon,
  trackem: TrackemIcon,
  appliview: AppliviewIcon,
  eurobar: EurobarIcon,
  libre: LibreIcon,
  interchat: InterchatIcon,
};

/**
 * Resolves an app's icon string to the correct SVG component.
 * Falls back to a generic box icon if no match.
 */
export default function AppIcon({
  icon,
  size = 40,
}: {
  icon: string;
  size?: number;
}) {
  const IconComponent = ICON_MAP[icon];

  if (IconComponent) {
    return <IconComponent size={size} />;
  }

  // Fallback generic icon
  return (
    <div
      className="flex items-center justify-center rounded-xl"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
        flexShrink: 0,
      }}
    >
      <Box size={size * 0.5} className="text-white" />
    </div>
  );
}
