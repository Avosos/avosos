"use client";

import React from "react";

/**
 * TrackEm icon — bookmark/book with a checkmark, teal-to-blue gradient.
 */
export default function TrackemIcon({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 256 256"
      style={{ borderRadius: size * 0.19, flexShrink: 0 }}
    >
      <defs>
        <linearGradient id="tk-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="100%" stopColor="#764ba2" />
        </linearGradient>
      </defs>
      <rect width="256" height="256" rx="48" fill="url(#tk-bg)" />
      <g
        transform="translate(128,128) scale(5)"
        stroke="white"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Bookmark shape */}
        <path d="M-10,-14 L-10,14 L0,7 L10,14 L10,-14 Z" />
        {/* Checkmark */}
        <polyline points="-5,0 -1,4 6,-4" />
      </g>
    </svg>
  );
}
