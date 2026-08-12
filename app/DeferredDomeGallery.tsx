"use client";

import { useEffect, useRef, useState } from "react";
import type { DomeImage } from "./DomeGallery";

type GalleryComponent = typeof import("./DomeGallery")["DomeGallery"];

export default function DeferredDomeGallery() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [Gallery, setGallery] = useState<GalleryComponent | null>(null);
  const [images, setImages] = useState<DomeImage[]>([]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;

    const load = () => {
      void Promise.all([import("./DomeGallery"), import("./galleryPhotos")]).then(([galleryModule, photoModule]) => {
        if (cancelled) return;
        setImages(photoModule.galleryPhotos);
        setGallery(() => galleryModule.DomeGallery);
      });
    };

    if (!("IntersectionObserver" in window)) {
      load();
      return () => { cancelled = true; };
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      load();
    }, { rootMargin: "900px 0px" });
    observer.observe(host);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={hostRef} className="deferred-gallery">
      {Gallery && images.length ? <Gallery images={images} grayscale={false} /> : (
        <div className="deferred-gallery__loading" aria-hidden="true">
          <span>CURATED VISUAL ARCHIVE</span>
          <i />
        </div>
      )}
    </div>
  );
}
