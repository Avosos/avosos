"use client";

import React from "react";

/**
 * ManwhaWham's manga-page + lightning bolt icon.
 * Rose-to-orange gradient background with manga panel pages and  "WHAM" action burst.
 */
export default function ManwhawhamIcon({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 256 256"
      style={{ borderRadius: size * 0.19, flexShrink: 0 }}
    >
      <defs>
        <linearGradient id="mw-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#fb923c" />
        </linearGradient>
      </defs>
      <rect width="256" height="256" rx="48" fill="url(#mw-bg)" />
      <g transform="translate(128,128)">
        {/* Back page (shadow) */}
        <rect
          x="-38"
          y="-50"
          width="60"
          height="80"
          rx="4"
          fill="white"
          fillOpacity={0.35}
        />
        {/* Front page */}
        <rect
          x="-30"
          y="-56"
          width="60"
          height="80"
          rx="4"
          fill="white"
          fillOpacity={0.9}
        />
        {/* Panel grid on front page */}
        <rect
          x="-24"
          y="-50"
          width="48"
          height="34"
          rx="2"
          stroke="rgba(0,0,0,0.25)"
          strokeWidth="3"
          fill="none"
        />
        <rect
          x="-24"
          y="-12"
          width="22"
          height="30"
          rx="2"
          stroke="rgba(0,0,0,0.25)"
          strokeWidth="3"
          fill="none"
        />
        <rect
          x="2"
          y="-12"
          width="22"
          height="30"
          rx="2"
          stroke="rgba(0,0,0,0.25)"
          strokeWidth="3"
          fill="none"
        />
        {/* Lightning / action burst */}
        <path
          d="M 30 -10 L 50 -30 L 42 -8 L 58 -12 L 34 20 L 40 0 Z"
          fill="white"
          opacity={0.95}
        />
        {/* WHAM text */}
        <text
          x="-2"
          y="56"
          textAnchor="middle"
          fontFamily="Arial Black, Impact, sans-serif"
          fontWeight={900}
          fontSize={26}
          fill="white"
          letterSpacing="2"
        >
          WHAM
        </text>
      </g>
    </svg>
  );
}
