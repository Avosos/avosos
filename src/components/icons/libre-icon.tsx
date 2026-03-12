"use client";

import React from "react";

/**
 * Libre's gamepad icon — gradient background with a stylised game controller.
 * Teal-to-violet gradient with white controller motif.
 */
export default function LibreIcon({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 256 256"
      style={{ borderRadius: size * 0.19, flexShrink: 0 }}
    >
      <defs>
        <linearGradient id="lb-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c5cfc" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      <rect width="256" height="256" rx="48" fill="url(#lb-bg)" />
      <g
        transform="translate(128,128) scale(5)"
        stroke="white"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Controller body */}
        <path d="M-14 -2 C-14 -8 -10 -12 -4 -12 L4 -12 C10 -12 14 -8 14 -2 L14 4 C14 10 10 14 6 14 L4 10 L-4 10 L-6 14 C-10 14 -14 10 -14 4 Z" />
        {/* D-pad */}
        <line x1="-8" y1="-1" x2="-8" y2="3" />
        <line x1="-10" y1="1" x2="-6" y2="1" />
        {/* Buttons */}
        <circle cx="7" cy="-2" r="1.2" />
        <circle cx="10" cy="1" r="1.2" />
      </g>
    </svg>
  );
}
