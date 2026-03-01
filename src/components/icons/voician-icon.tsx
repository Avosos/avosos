"use client";

import React from "react";

/**
 * Voician's microphone-waveform icon.
 * Teal-to-blue gradient background with a microphone + sound wave motif.
 */
export default function VoicianIcon({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 256 256"
      style={{ borderRadius: size * 0.19, flexShrink: 0 }}
    >
      <defs>
        <linearGradient id="vc-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#508cff" />
          <stop offset="100%" stopColor="#3cd89c" />
        </linearGradient>
      </defs>
      <rect width="256" height="256" rx="48" fill="url(#vc-bg)" />
      <g transform="translate(128, 128)" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
        {/* Microphone body */}
        <rect x="-16" y="-52" width="32" height="56" rx="16" />
        {/* Microphone arc */}
        <path d="M -30 -10 Q -30 32, 0 32 Q 30 32, 30 -10" />
        {/* Stand */}
        <line x1="0" y1="32" x2="0" y2="52" />
        <line x1="-18" y1="52" x2="18" y2="52" />
        {/* Sound waves (right side) */}
        <path d="M 44 -30 Q 60 0, 44 30" strokeWidth="6" opacity="0.7" />
        <path d="M 58 -44 Q 80 0, 58 44" strokeWidth="6" opacity="0.5" />
      </g>
    </svg>
  );
}
