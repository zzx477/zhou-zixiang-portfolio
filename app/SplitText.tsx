"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
} from "react";

type MotionVars = Record<string, string | number | boolean>;

type SplitTextProps = {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: "chars" | "words" | "lines" | "words, chars";
  from?: MotionVars;
  to?: MotionVars;
  threshold?: number;
  rootMargin?: string;
  textAlign?: CSSProperties["textAlign"];
  tag?: ElementType;
  onLetterAnimationComplete?: () => void;
};

export default function SplitText({
  text,
  className = "",
  delay = 50,
  duration = 1.25,
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  tag: Tag = "p",
  onLetterAnimationComplete,
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null);
  const callbackRef = useRef(onLetterAnimationComplete);
  const [visible, setVisible] = useState(false);
  const splitByWord = splitType === "words" || splitType === "lines";
  const units = useMemo(
    () => splitByWord ? text.split(/(\s+)/) : Array.from(text),
    [splitByWord, text],
  );

  useEffect(() => {
    callbackRef.current = onLetterAnimationComplete;
  }, [onLetterAnimationComplete]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const frame = window.requestAnimationFrame(() => {
        setVisible(true);
        callbackRef.current?.();
      });
      return () => window.cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setVisible(true);
      observer.disconnect();
      window.setTimeout(
        () => callbackRef.current?.(),
        duration * 1000 + Math.max(0, units.length - 1) * delay,
      );
    }, { threshold, rootMargin });
    observer.observe(element);
    return () => observer.disconnect();
  }, [delay, duration, rootMargin, threshold, units.length]);

  const style: CSSProperties = {
    textAlign,
    overflow: "hidden",
    display: "inline-block",
    whiteSpace: "normal",
    overflowWrap: "break-word",
  };

  return (
    <Tag ref={ref} style={style} className={`split-parent split-lite ${visible ? "is-visible" : ""} ${className}`}>
      <span className="split-lite__visual" aria-hidden="true">
        {units.map((unit, index) => unit.trim() ? (
          <span
            className={splitByWord ? "split-word" : "split-char"}
            key={`${unit}-${index}`}
            style={{
              "--split-delay": `${index * delay}ms`,
              "--split-duration": `${duration}s`,
              "--split-y": `${Number(from.y ?? 28)}px`,
              "--split-opacity": String(from.opacity ?? 0),
            } as CSSProperties}
          >
            {unit}
          </span>
        ) : <span key={`space-${index}`}>{unit}</span>)}
      </span>
      <span className="visually-hidden">{text}</span>
    </Tag>
  );
}
