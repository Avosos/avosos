"use client";

import React from "react";

/**
 * BangerBot's Discord bot icon.
 * Discord-blurple gradient background with a robot head motif.
 */
export default function BangerbotIcon({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 256 256"
      style={{ borderRadius: size * 0.19, flexShrink: 0 }}
    >
      <defs>
        <linearGradient id="bb-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5865F2" />
          <stop offset="100%" stopColor="#3b44c4" />
        </linearGradient>
      </defs>
      <rect width="256" height="256" rx="48" fill="url(#bb-bg)" />
      {/* Antenna */}
      <line
        x1="128"
        y1="50"
        x2="128"
        y2="72"
        stroke="white"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle cx="128" cy="46" r="8" fill="white" opacity={0.9} />
      {/* Robot head */}
      <rect
        x="72"
        y="72"
        width="112"
        height="90"
        rx="24"
        fill="white"
        opacity={0.95}
      />
      {/* Eyes */}
      <circle cx="104" cy="112" r="14" fill="#5865F2" />
      <circle cx="152" cy="112" r="14" fill="#5865F2" />
      {/* Eye highlights */}
      <circle cx="108" cy="108" r="5" fill="white" opacity={0.8} />
      <circle cx="156" cy="108" r="5" fill="white" opacity={0.8} />
      {/* Mouth */}
      <rect
        x="100"
        y="138"
        width="56"
        height="10"
        rx="5"
        fill="#5865F2"
        opacity={0.7}
      />
      {/* Ear pads */}
      <rect
        x="56"
        y="98"
        width="16"
        height="32"
        rx="8"
        fill="white"
        opacity={0.7}
      />
      <rect
        x="184"
        y="98"
        width="16"
        height="32"
        rx="8"
        fill="white"
        opacity={0.7}
      />
      {/* Body hint */}
      <rect
        x="96"
        y="170"
        width="64"
        height="36"
        rx="12"
        fill="white"
        opacity={0.6}
      />
    </svg>
  );
}
