"use client";

import React from "react";

/**
 * StreamPad's grid-pad icon.
 * Orange-to-red gradient background with a 3×3 pad grid motif.
 */
export default function StreampadIcon({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 256 256"
      style={{ borderRadius: size * 0.19, flexShrink: 0 }}
    >
      <defs>
        <linearGradient id="sp-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>
      <rect width="256" height="256" rx="48" fill="url(#sp-bg)" />
      {/* 3×3 pad grid */}
      <g>
        {[0, 1, 2].map((row) =>
          [0, 1, 2].map((col) => (
            <rect
              key={`${row}-${col}`}
              x={56 + col * 52}
              y={56 + row * 52}
              width={40}
              height={40}
              rx={8}
              fill="white"
              opacity={
                row === 0 && col === 0
                  ? 1
                  : row === 0 && col === 2
                    ? 0.85
                    : row === 1 && col === 1
                      ? 0.9
                      : row === 2 && col === 0
                        ? 0.8
                        : row === 2 && col === 2
                          ? 0.75
                          : 0.55
              }
            />
          ))
        )}
      </g>
    </svg>
  );
}
