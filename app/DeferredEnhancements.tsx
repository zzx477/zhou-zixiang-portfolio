"use client";

import { useEffect, useState } from "react";

type TextEffectsComponent = typeof import("./SiteTextEffects")["SiteTextEffects"];
type CursorComponent = typeof import("./TargetCursor")["default"];

export default function DeferredEnhancements() {
  const [TextEffects, setTextEffects] = useState<TextEffectsComponent | null>(null);
  const [Cursor, setCursor] = useState<CursorComponent | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      void Promise.all([import("./SiteTextEffects"), import("./TargetCursor")]).then(([effects, cursor]) => {
        if (cancelled) return;
        setTextEffects(() => effects.SiteTextEffects);
        setCursor(() => cursor.default);
      });
    };

    const idleId = "requestIdleCallback" in window
      ? window.requestIdleCallback(load, { timeout: 1800 })
      : window.setTimeout(load, 900);

    return () => {
      cancelled = true;
      if ("cancelIdleCallback" in window) window.cancelIdleCallback(idleId);
      else window.clearTimeout(idleId);
    };
  }, []);

  return (
    <>
      {TextEffects ? <TextEffects /> : null}
      {Cursor ? (
        <Cursor
          targetSelector=".cursor-target"
          spinDuration={6}
          cursorColor="#c7a5ff"
          cursorColorOnTarget="#e7c4ff"
        />
      ) : null}
    </>
  );
}
