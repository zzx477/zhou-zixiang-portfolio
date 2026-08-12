import type { Metadata } from "next";
import "./globals.css";
import "./hero-reference.css";
import "./section-polish.css";

export const metadata: Metadata = {
  title: {
    default: "周子翔 — 剪辑师 / AI 设计师 / AI 漫剧",
    template: "%s — 周子翔",
  },
  description: "周子翔个人作品集：视频剪辑、AI 视觉设计、AI 漫剧与内容创作。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
