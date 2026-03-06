"use client";

import React from "react";

/**
 * NovelTea icon — tea cup with quill pen, lime-green accent.
 */
export default function NovelteaIcon({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 256 256"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="nt-bg" x1="0" y1="0" x2="256" y2="256" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1a2e0a" />
          <stop offset="1" stopColor="#0a1a05" />
        </linearGradient>
        <linearGradient id="nt-accent" x1="128" y1="80" x2="128" y2="200" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a3e635" />
          <stop offset="1" stopColor="#65a30d" />
        </linearGradient>
      </defs>
      <rect width="256" height="256" rx="48" fill="url(#nt-bg)" />
      {/* Tea cup body */}
      <path
        d="M60 105 h100 v8 q0 58-50 68 q-50-10-50-68 z"
        fill="url(#nt-accent)"
        opacity="0.9"
      />
      {/* Tea cup handle */}
      <path
        d="M160 115 q28 0 28 28 q0 28-28 28"
        fill="none"
        stroke="#a3e635"
        strokeWidth="7"
        strokeLinecap="round"
        opacity="0.85"
      />
      {/* Steam / quill wisps */}
      <path
        d="M90 95 q5-14 0-24 q-5-14 0-24"
        fill="none"
        stroke="#a3e635"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M110 90 q5-14 0-24 q-5-14 0-24"
        fill="none"
        stroke="#a3e635"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M130 95 q5-14 0-24 q-5-14 0-24"
        fill="none"
        stroke="#a3e635"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.5"
      />
      {/* Quill nib */}
      <path
        d="M172 48 l-42 52 l-5-5 l42-50 z"
        fill="#a3e635"
        opacity="0.8"
      />
      <line x1="127" y1="93" x2="172" y2="48" stroke="#65a30d" strokeWidth="1.5" />
      {/* NT branding */}
      <text
        x="128"
        y="226"
        textAnchor="middle"
        fontFamily="Arial Black, Arial, sans-serif"
        fontSize="34"
        fontWeight="900"
        fill="#a3e635"
        letterSpacing="3"
      >
        NT
      </text>
    </svg>
  );
}
