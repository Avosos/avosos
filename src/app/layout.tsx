import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Avosos Launcher",
  description: "Universal application launcher — professional workflow orchestration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head />
      <body
        className="antialiased"
        style={{
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          overflow: "hidden",
          background: "var(--bg-primary)",
          color: "var(--text-primary)",
        }}
      >
        {children}
      </body>
    </html>
  );
}
