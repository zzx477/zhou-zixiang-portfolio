"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const navigation = [
  ["HOME", "#top"],
  ["WORKS", "#work"],
  ["ABOUT", "#about"],
  ["SKILLS", "#strengths"],
  ["CONTACT", "#contact"],
] as const;

export function StickyHeader() {
  const [isFloating, setIsFloating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    let frame = 0;

    const update = () => {
      frame = 0;
      const viewportHeight = window.visualViewport?.height || window.innerHeight;
      const shouldFloat = window.scrollY >= Math.max(120, viewportHeight * 0.8);
      setIsFloating((current) => current === shouldFloat ? current : shouldFloat);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const header = (
    <header
      className={"reference-header" + (isFloating ? " is-floating" : "")}
      data-split-ignore
      data-floating={isFloating ? "true" : "false"}
    >
      <a className="reference-brand" href="#top" aria-label="返回首页">
        <strong>ZX</strong>
        <span>AI COMIC &amp; EDITING<br />PORTFOLIO</span>
      </a>
      <nav aria-label="主导航">
        {navigation.map(([label, href], index) => (
          <a className={index === 0 ? "active" : undefined} href={href} key={href}>
            {label}
          </a>
        ))}
      </nav>
    </header>
  );

  if (isMounted && isFloating) {
    return (
      <>
        <div className="reference-header-spacer" aria-hidden="true" />
        {createPortal(header, document.body)}
      </>
    );
  }

  return header;
}