"use client";

import React from "react";

/**
 * Cuttamaran's scissors icon — matches the SVG from the cuttamaran project.
 * Purple-to-pink gradient background with white scissors motif.
 */
export default function CuttamaranIcon({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 256 256"
      style={{ borderRadius: size * 0.19, flexShrink: 0 }}
    >
      <defs>
        <linearGradient id="ct-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c5cfc" />
          <stop offset="100%" stopColor="#e879f9" />
        </linearGradient>
      </defs>
      <rect width="256" height="256" rx="48" fill="url(#ct-bg)" />
      <g
        transform="translate(128,128) scale(5)"
        stroke="white"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="-8" cy="-8" r="3" />
        <circle cx="-8" cy="8" r="3" />
        <line x1="-5.5" y1="-5.5" x2="8" y2="8" />
        <line x1="-5.5" y1="5.5" x2="8" y2="-8" />
      </g>
    </svg>
  );
}
