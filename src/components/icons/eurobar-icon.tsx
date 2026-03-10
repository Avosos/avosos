"use client";

import React from "react";

/**
 * Eurobar icon — barcode scanner with a magnifying lens, orange-to-amber gradient.
 */
export default function EurobarIcon({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 256 256"
      style={{ borderRadius: size * 0.19, flexShrink: 0 }}
    >
      <defs>
        <linearGradient id="eb-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#eab308" />
        </linearGradient>
      </defs>
      <rect width="256" height="256" rx="48" fill="url(#eb-bg)" />
      <g
        transform="translate(128,124) scale(5)"
        stroke="white"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Barcode lines */}
        <line x1="-11" y1="-8" x2="-11" y2="6" strokeWidth="2.4" />
        <line x1="-7" y1="-8" x2="-7" y2="6" strokeWidth="1.2" />
        <line x1="-4" y1="-8" x2="-4" y2="6" strokeWidth="2.4" />
        <line x1="-1" y1="-8" x2="-1" y2="6" strokeWidth="1" />
        <line x1="2" y1="-8" x2="2" y2="6" strokeWidth="2" />
        <line x1="5" y1="-8" x2="5" y2="6" strokeWidth="1.2" />
        <line x1="8" y1="-8" x2="8" y2="6" strokeWidth="2.4" />
        <line x1="11" y1="-8" x2="11" y2="6" strokeWidth="1" />
        {/* Scanner line */}
        <line x1="-13" y1="10" x2="13" y2="10" strokeWidth="2" stroke="#fff" opacity="0.7" />
      </g>
    </svg>
  );
}
