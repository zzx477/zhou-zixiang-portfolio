"use client";

import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(GSAPSplitText, useGSAP);

const TEXT_TARGETS = [
  ".reference-header a",
  ".reference-role",
  ".reference-signature em",
  ".reference-intro",
  ".reference-cta",
  ".reference-service strong",
  ".reference-service small",
  ".reel-card strong",
  ".reel-card small",
  ".reference-socials span",
  ".reference-socials a",
  ".eyebrow",
  ".section-head h2",
  ".lead",
  ".body-copy",
  ".profile-contact > *",
  ".stats-grid strong",
  ".stats-grid span",
  ".timeline-index",
  ".timeline-row time",
  ".timeline-row h3",
  ".timeline-row p",
  ".work-intro",
  ".project-index",
  ".project-view",
  ".project-meta p",
  ".project-meta h3",
  ".strength-card > span",
  ".strength-card h3",
  ".strength-card p",
  ".strength-card > div",
  ".tool-reel span",
  ".contact-top span",
  ".contact-main p",
  ".contact-main h2",
  ".contact-main a",
  ".contact-bottom span",
  ".contact-bottom a",
  ".contact-bottom p",
].join(",");

export function SiteTextEffects() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    document.fonts.ready.then(() => {
      if (active) setFontsLoaded(true);
    });
    return () => {
      active = false;
    };
  }, []);

  useGSAP(
    () => {
      if (!fontsLoaded || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const elements = Array.from(document.querySelectorAll<HTMLElement>(TEXT_TARGETS)).filter(
        (element) =>
          !element.closest("[data-split-ignore]") &&
          !element.closest("svg") &&
          !element.closest(".split-parent") &&
          !element.querySelector(".split-parent") &&
          element.textContent?.trim(),
      );

      const splits: GSAPSplitText[] = [];
      const tweens: gsap.core.Tween[] = [];
      const observers: IntersectionObserver[] = [];

      elements.forEach((element, index) => {
        const text = element.textContent?.trim() || "";
        const isHeading = /^H[1-3]$/.test(element.tagName) || element.matches(".lead, .reference-signature em");
        const isBody = text.length > 40 || element.matches(".body-copy, .work-intro, .timeline-detail, .strength-card p");
        const splitType = isBody ? "words" : "words,chars";
        const split = new GSAPSplitText(element, {
          type: splitType,
          smartWrap: true,
          autoSplit: false,
          linesClass: "split-line",
          wordsClass: "split-word",
          charsClass: "split-char",
          reduceWhiteSpace: false,
        });
        const targets = isBody ? split.words : split.chars;
        if (!targets.length) {
          split.revert();
          return;
        }
        const fromVars = {
          opacity: 0,
          y: isHeading ? 52 : isBody ? 14 : 22,
          rotateX: isHeading ? -58 : 0,
          filter: isBody ? "blur(6px)" : "blur(0px)",
        };
        const tween = gsap.to(targets, {
          opacity: 1,
          y: 0,
          rotateX: 0,
          filter: "blur(0px)",
          duration: isHeading ? 1.05 : isBody ? 0.72 : 0.78,
          ease: "power3.out",
          stagger: isBody ? 0.035 : isHeading ? 0.026 : 0.018,
          force3D: true,
          delay: Math.min(index * 0.002, 0.08),
          paused: true,
          immediateRender: false,
        });
        tween.pause(0);
        gsap.set(targets, fromVars);

        const observer = new IntersectionObserver(
          (entries) => {
            if (!entries.some((entry) => entry.isIntersecting)) return;
            tween.play();
            observer.unobserve(element);
          },
          { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
        );
        observer.observe(element);
        splits.push(split);
        tweens.push(tween);
        observers.push(observer);
      });

      return () => {
        observers.forEach((observer) => observer.disconnect());
        tweens.forEach((tween) => tween.kill());
        splits.forEach((split) => split.revert());
      };
    },
    { dependencies: [fontsLoaded] },
  );

  return null;
}