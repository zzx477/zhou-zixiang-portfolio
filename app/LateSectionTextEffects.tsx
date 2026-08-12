"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { SplitText as GSAPSplitText } from "gsap/SplitText";

gsap.registerPlugin(GSAPSplitText);

const selectorsByScope = {
  strengths: [
    ".eyebrow",
    ".section-head h2",
    ".strength-card > span",
    ".strength-card h3",
    ".strength-card p",
    ".strength-card > div",
    ".tool-reel span",
  ].join(","),
  contact: [
    ".contact-top span",
    ".contact-main p",
    ".contact-main h2",
    ".contact-main a",
    ".contact-bottom span",
    ".contact-bottom a",
    ".contact-bottom p",
  ].join(","),
} as const;

type Scope = keyof typeof selectorsByScope;

export function LateSectionTextEffects({ scope }: { scope: Scope }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let startTimer = 0;
    const splits: GSAPSplitText[] = [];
    const tweens: gsap.core.Tween[] = [];
    const observers: IntersectionObserver[] = [];

    const start = () => {
      if (cancelled) return;
      const root = document.getElementById(scope);
      if (!root) return;
      const elements = Array.from(root.querySelectorAll<HTMLElement>(selectorsByScope[scope])).filter(
        (element) => element.textContent?.trim(),
      );

      elements.forEach((element, index) => {
        const text = element.textContent?.trim() || "";
        const isHeading = /^H[1-3]$/.test(element.tagName);
        const isBody = text.length > 40 || element.matches(".strength-card p");
        const split = new GSAPSplitText(element, {
          type: isBody ? "words" : "words,chars",
          smartWrap: true,
          reduceWhiteSpace: false,
          linesClass: "split-line",
          wordsClass: "split-word",
          charsClass: "split-char",
        });
        const targets = isBody ? split.words : split.chars;
        if (!targets.length) {
          split.revert();
          return;
        }

        const fromVars = {
          opacity: 0,
          y: isHeading ? 48 : isBody ? 16 : 20,
          rotateX: isHeading ? -56 : 0,
          filter: isBody ? "blur(6px)" : "blur(0px)",
        };
        const tween = gsap.to(targets, {
          opacity: 1,
          y: 0,
          rotateX: 0,
          filter: "blur(0px)",
          duration: isHeading ? 1.04 : isBody ? 0.74 : 0.76,
          stagger: isBody ? 0.034 : isHeading ? 0.028 : 0.018,
          delay: Math.min(index * 0.015, 0.18),
          ease: "power3.out",
          force3D: true,
          paused: true,
          immediateRender: false,
        });
        tween.pause(0);
        gsap.set(targets, fromVars);

        const observer = new IntersectionObserver(
          (entries) => {
            if (!entries.some((entry) => entry.isIntersecting)) return;
            tween.restart();
            observer.unobserve(element);
          },
          { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.01 },
        );
        observer.observe(element);
        splits.push(split);
        tweens.push(tween);
        observers.push(observer);
      });
    };

    document.fonts.ready.then(() => {
      startTimer = window.setTimeout(start, 140);
    });

    return () => {
      cancelled = true;
      window.clearTimeout(startTimer);
      observers.forEach((observer) => observer.disconnect());
      tweens.forEach((tween) => tween.kill());
      splits.forEach((split) => split.revert());
    };
  }, [scope]);

  return null;
}
