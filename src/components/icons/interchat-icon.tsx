"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

/**
 * InterChat icon — Chat bubble icon with cyan gradient background.
 */
export default function InterchatIcon({ size = 40 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.19,
        background: "linear-gradient(135deg, #06b6d4, #0891b2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <MessageCircle size={size * 0.5} color="#fff" />
    </div>
  );
}
