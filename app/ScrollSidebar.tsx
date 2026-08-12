"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import LineSidebar from "./LineSidebar";

const sections = [
  { id: "top", index: 0 },
  { id: "about", index: 1 },
  { id: "work", index: 2 },
  { id: "strengths", index: 3 },
  { id: "contact", index: 4 },
];
const pageNumbers = ["01", "02", "03", "04", "05"];

export function ScrollSidebar() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let frame = 0;
    const updateActiveSection = () => {
      frame = 0;
      const threshold = window.innerHeight * 0.38;
      let nextIndex = 0;
      sections.forEach(({ id, index }) => {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= threshold) nextIndex = index;
      });
      setActiveIndex((current) => current === nextIndex ? current : nextIndex);
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateActiveSection);
    };
    updateActiveSection();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <aside className="line-sidebar-wrap" aria-label="页面导航">
      <LineSidebar
        items={pageNumbers}
        accentColor="#d99a78"
        textColor="rgba(201, 214, 217, .72)"
        markerColor="rgba(143, 163, 168, .42)"
        showIndex={false}
        showMarker
        proximityRadius={128}
        maxShift={12}
        markerLength={28}
        itemGap={24}
        fontSize={0.68}
        smoothing={120}
        defaultActive={0}
        activeIndex={activeIndex}
        onItemClick={(index) => document.getElementById(sections.find((section) => section.index === index)?.id || "top")?.scrollIntoView({ behavior: "smooth" })}
      />
    </aside>,
    document.body,
  );
}

export default ScrollSidebar;