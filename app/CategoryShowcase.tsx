"use client";

import { useEffect, useRef, useState } from "react";
import BorderGlow from "./BorderGlow";
import { publicPath } from "./public-paths";

type VideoItem = {
  title: string;
  url: string;
  poster: string;
  description: string;
};

type Category = {
  no: string;
  name: string;
  en: string;
  note: string;
  videoSource?: string;
};

async function loadCategoryVideos(videoSource?: string): Promise<VideoItem[]> {
  if (videoSource === "ai-comic") return (await import("./aiComicVideos")).aiComicVideos;
  if (videoSource === "commercial") return (await import("./commercialVideos")).commercialVideos;
  if (videoSource === "entertainment") return (await import("./entertainmentVideos")).entertainmentVideos;
  return [];
}

function PortfolioVideo({ video }: { video: VideoItem }) {
  const [failed, setFailed] = useState(false);
  const [activated, setActivated] = useState(false);
  const playerRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="category-video-player">
      {activated ? (
        <video
          ref={playerRef}
          poster={publicPath(video.poster)}
          controls
          playsInline
          autoPlay
          preload="none"
          controlsList="nodownload"
          onCanPlay={() => setFailed(false)}
          onError={() => setFailed(true)}
        >
          <source src={video.url} type="video/mp4" />
        </video>
      ) : (
        <button
          className="category-video-poster"
          type="button"
          aria-label={`播放${video.title}`}
          onClick={() => setActivated(true)}
        >
          <img src={publicPath(video.poster)} alt={`${video.title}视频封面`} loading="lazy" decoding="async" />
          <span aria-hidden="true">▶</span>
        </button>
      )}
      {failed && (
        <div className="category-video-error" role="status">
          <strong>当前设备暂时无法播放</strong>
          <span>请使用新版浏览器重试；该视频也可能需要转换为 H.264 网页版。</span>
          <button type="button" onClick={() => { setFailed(false); setActivated(false); }}>重新加载</button>
        </div>
      )}
    </div>
  );
}

export default function CategoryShowcase({ categories }: { categories: Category[] }) {
  const [active, setActive] = useState<Category | null>(null);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const openCategory = async (category: Category) => {
    setActive(category);
    setVideos([]);
    if (!category.videoSource) return;
    setIsLoading(true);
    try {
      setVideos(await loadCategoryVideos(category.videoSource));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!active) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [active]);

  return (
    <>
      <div className="category-grid" aria-label="作品分类">
        {categories.map((category, index) => (
          <BorderGlow
            className="category-card-glow"
            key={category.no}
            edgeSensitivity={34}
            glowColor="210 92 78"
            backgroundColor="#0b1720"
            borderRadius={12}
            glowRadius={28}
            glowIntensity={0.78}
            coneSpread={23}
            animated={index === 0}
            colors={["#7dd3fc", "#a78bfa", "#f0a6ca"]}
          >
            <button
              className="category-card cursor-target"
              type="button"
              onClick={() => void openCategory(category)}
              aria-label={"打开" + category.name + "分类"}
            >
              <span className="category-card__index">{category.no}</span>
              <span className="category-card__name">{category.name}</span>
              <span className="category-card__en">{category.en}</span>
              <span className="category-card__note">{category.note}</span>
              <span className="category-card__arrow" aria-hidden="true">↗</span>
            </button>
          </BorderGlow>
        ))}
      </div>

      {active && (
        <div
          className="category-modal"
          role="dialog"
          aria-modal="true"
          aria-label={active.name + "视频展示"}
          onClick={() => setActive(null)}
        >
          <div className="category-modal__panel" onClick={(event) => event.stopPropagation()}>
            <button
              className="category-modal__close"
              type="button"
              onClick={() => setActive(null)}
              aria-label="关闭视频面板"
            >
              CLOSE ×
            </button>
            <div className="category-modal__meta">
              <span>{active.no} / {active.en}</span>
              <span>SELECTED CATEGORY</span>
            </div>
            <div className="category-modal__heading">
              <p>CURATED VIDEO SPACE</p>
              <h3>{active.name}</h3>
              <span>{active.note}</span>
            </div>
            <div className={"category-video-frame" + (videos.length ? " category-video-frame--collection" : "")}>
              {videos.length ? (
                <div className="category-video-list">
                  {videos.map((video, index) => (
                    <article className="category-video-item" key={video.url}>
                      <div className="category-video-item__media">
                        <PortfolioVideo video={video} />
                        <span className="category-video-item__index">{String(index + 1).padStart(2, "0")}</span>
                      </div>
                      <div className="category-video-item__copy">
                        <div className="category-video-item__title">{video.title}</div>
                        <p>{video.description}</p>
                      </div>
                    </article>
                  ))}
                </div>
              ) : isLoading ? (
                <div className="category-video-placeholder" role="status">
                  <span className="category-video-placeholder__orb" />
                  <strong>LOADING ARCHIVE</strong>
                  <small>正在载入视频作品…</small>
                </div>
              ) : (
                <div className="category-video-placeholder">
                  <span className="category-video-placeholder__orb" />
                  <strong>VIDEO SPACE READY</strong>
                  <small>视频链接待添加</small>
                </div>
              )}
            </div>
            <div className="category-modal__footer">
              <span>ZHOU ZIXIANG / ARCHIVE</span>
              <span>ESC TO CLOSE</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
