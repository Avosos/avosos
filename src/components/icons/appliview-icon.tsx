"use client";

import React from "react";

/**
 * Appliview icon — clipboard with checkmarks, green-to-teal gradient.
 */
export default function AppliviewIcon({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 256 256"
      style={{ borderRadius: size * 0.19, flexShrink: 0 }}
    >
      <defs>
        <linearGradient id="av-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2dd4bf" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <rect width="256" height="256" rx="48" fill="url(#av-bg)" />
      <g
        transform="translate(128,128) scale(5)"
        stroke="white"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Clipboard body */}
        <rect x="-10" y="-12" width="20" height="24" rx="2" />
        {/* Clipboard top clip */}
        <rect x="-4" y="-15" width="8" height="5" rx="1" />
        {/* Check lines */}
        <line x1="-6" y1="-4" x2="-2" y2="-4" />
        <polyline points="-7,-4 -6,-4 -4,-2" strokeWidth="1.8" />
        <line x1="-1" y1="-4" x2="7" y2="-4" />
        <line x1="-6" y1="2" x2="-2" y2="2" />
        <polyline points="-7,2 -6,2 -4,4" strokeWidth="1.8" />
        <line x1="-1" y1="2" x2="7" y2="2" />
        <line x1="-6" y1="8" x2="7" y2="8" />
      </g>
    </svg>
  );
}
