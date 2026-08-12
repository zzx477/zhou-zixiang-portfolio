"use client";

import { useEffect, useRef, useState } from "react";
import SplitText from "./SplitText";
import TextType from "./TextType";
import { StickyHeader } from "./StickyHeader";
import Galaxy from "./Galaxy";
import CircularText from "./CircularText";
import { publicPath } from "./public-paths";

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function HeroArtwork() {
  return (
    <svg
      className="hero-artwork"
      viewBox="0 0 980 900"
      role="img"
      aria-label="AI 漫剧人物概念主视觉"
    >
      <defs>
        <radialGradient id="hero-skin" cx=".62" cy=".38" r=".52">
          <stop offset="0" stopColor="#d8c4b7" />
          <stop offset=".42" stopColor="#756963" />
          <stop offset="1" stopColor="#151719" />
        </radialGradient>
        <radialGradient id="hero-rim" cx=".76" cy=".42" r=".58">
          <stop offset="0" stopColor="#e6c49a" stopOpacity=".9" />
          <stop offset=".24" stopColor="#a77451" stopOpacity=".32" />
          <stop offset=".68" stopColor="#1b2932" stopOpacity=".2" />
          <stop offset="1" stopColor="#050607" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hero-cloth" x1=".1" y1=".1" x2=".9" y2=".9">
          <stop offset="0" stopColor="#171a1c" />
          <stop offset=".52" stopColor="#070809" />
          <stop offset="1" stopColor="#2a211e" />
        </linearGradient>
        <filter id="hero-soft"><feGaussianBlur stdDeviation="18" /></filter>
        <filter id="hero-glow"><feGaussianBlur stdDeviation="5" /></filter>
      </defs>
      <rect width="980" height="900" fill="#050607" />
      <ellipse cx="720" cy="390" rx="330" ry="370" fill="url(#hero-rim)" filter="url(#hero-soft)" />
      <path d="M360 80c190-130 484-56 552 174 51 174-25 284-98 365-72 79-87 167-58 281H286c-10-171 29-282 79-372 57-103 67-222-5-448Z" fill="#060708" />
      <path d="M560 156c117-83 289-12 298 139 6 96-50 193-149 254-61 38-126 42-172 15-67-40-87-149-52-249 18-51 41-111 75-159Z" fill="url(#hero-skin)" />
      <path d="M541 135c126-79 327-31 360 122-83-85-171-107-270-67-58 24-100 61-145 121-17-83 4-143 55-176Z" fill="#070809" />
      <path d="M430 213c85-90 202-125 333-94-119 25-203 91-257 199-34 68-43 154-27 258-83-103-105-243-49-363Z" fill="#08090a" />
      <path d="M566 553c91 48 166 33 226-44-10 89 43 143 133 202l18 189H325c3-134 48-248 137-342 34-36 68-44 104-5Z" fill="url(#hero-cloth)" />
      <path d="M707 327c27-18 59-15 91 9-31-5-60 2-86 21-12-8-14-18-5-30Z" fill="#131415" />
      <ellipse cx="753" cy="340" rx="14" ry="8" fill="#c6d1d0" />
      <ellipse cx="756" cy="340" rx="4" ry="7" fill="#15181a" />
      <path d="M807 407c-12 11-24 14-38 8 12 14 27 17 43 9" fill="none" stroke="#4a2e29" strokeWidth="3" strokeLinecap="round" />
      <g fill="none" stroke="#bd875a" strokeOpacity=".55" strokeWidth="2">
        <path d="M495 145C340 239 333 423 421 558" />
        <path d="M540 101C376 246 386 431 466 606" />
        <path d="M622 73C456 225 485 468 544 641" />
        <path d="M678 62C598 212 637 402 742 511" />
      </g>
      <g fill="#c79263" opacity=".7" filter="url(#hero-glow)">
        <circle cx="490" cy="160" r="3" /><circle cx="438" cy="248" r="2" />
        <circle cx="410" cy="354" r="3" /><circle cx="452" cy="496" r="2" />
        <circle cx="544" cy="116" r="2" /><circle cx="664" cy="84" r="3" />
        <circle cx="793" cy="181" r="2" /><circle cx="889" cy="305" r="3" />
      </g>
      <rect width="980" height="900" fill="url(#hero-rim)" opacity=".35" />
    </svg>
  );
}

const services = [
  ["AI 漫剧创作", "AI COMIC CREATION"],
  ["视频剪辑", "VIDEO EDITING"],
  ["视觉特效", "VISUAL EFFECTS"],
  ["故事与分镜", "STORYBOARD"],
];

const reel = [
  { title: "封九幽", category: "AI 漫剧", visual: "office", poster: "/feng-jiuyou-poster.png", year: "2026", description: "以暗红末世场景和角色张力推进情绪，完成 AI 漫剧视觉与节奏剪辑。", tags: ["AI 漫剧", "角色视觉", "节奏剪辑"], link: "https://zuopinji-1449420565.cos.ap-guangzhou.myqcloud.com/%E5%B0%81%E4%B9%9D%E5%B9%BD.mp4" },
  { title: "奇幻AI展示视频", category: "AI 漫剧", visual: "portrait", poster: "/second-video-cover.jpg", year: "2026", link: "https://zuopinji-1449420565.cos.ap-guangzhou.myqcloud.com/a7dc07ae39460f8cc83141893a2b7109.mp4", description: "围绕人物关系搭建悬念感，用镜头呼吸和音效留白推进叙事。", tags: ["剧情剪辑", "情绪叙事", "声音设计"] },
  { title: "零食信息流广告", category: "商业广告", visual: "city", poster: "/third-video-cover.jpg", year: "2026", link: "https://zuopinji-1449420565.cos.ap-guangzhou.myqcloud.com/3%E6%9C%8815%E6%97%A5-%E9%85%B1%E6%9D%BF%E9%B8%AD-1.mp4", description: "用短促节奏和食欲色彩构建品牌记忆，让每个镜头都服务于转化。", tags: ["信息流广告", "产品视觉", "节奏剪辑"] },
  { title: "真人风格AIGC", category: "AIGC 影像", visual: "light", poster: "/fourth-video-cover.jpg", year: "2026", link: "https://zuopinji-1449420565.cos.ap-guangzhou.myqcloud.com/%E7%9C%9F%E4%BA%BA%E9%A3%8E%E6%A0%BC%E5%B1%95%E7%A4%BA.mp4", description: "将真实人物质感、自然光影与 AIGC 生成融合，探索品牌内容更具临场感的表达。", tags: ["真人风格", "AIGC 视觉", "品牌内容"] },
  { title: "动漫混剪", category: "混剪作品", visual: "rain", poster: "/fifth-video-cover.jpg", year: "2026", link: "https://zuopinji-1449420565.cos.ap-guangzhou.myqcloud.com/%E5%8A%A8%E6%BC%AB%E6%B7%B7%E5%89%AA.mp4", description: "以高密度画面节奏串联角色与情绪，让动漫片段在音乐和转场中形成新的叙事张力。", tags: ["动漫混剪", "节奏剪辑", "情绪叙事"] },
];

export function HeroReference() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const activeVideoItem = reel.find((item) => item.link === activeVideo);

  useEffect(() => {
    if (!activeVideo) return undefined;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") { setActiveVideo(null); setIsVideoPlaying(false); } };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [activeVideo]);

  return (
    <section className="reference-hero" id="top">
      <StickyHeader />

      <div className="hero-ambient" aria-hidden="true">
        <span className="hero-ambient__orb hero-ambient__orb--blue" />
        <span className="hero-ambient__orb hero-ambient__orb--ember" />
        <span className="hero-ambient__ring hero-ambient__ring--outer" />
        <span className="hero-ambient__ring hero-ambient__ring--inner" />
        <span className="hero-ambient__grain" />
        <div className="hero-galaxy"><Galaxy focal={[0.62, 0.46]} rotation={[0.98, 0.04]} starSpeed={0.32} density={0.86} hueShift={190} speed={0.7} glowIntensity={0.72} saturation={0.24} twinkleIntensity={0.52} rotationSpeed={0.035} repulsionStrength={1.35} transparent /></div>
      </div>
      <div className="reference-art" aria-hidden="true">
        <img
          className="hero-character-image"
          src={publicPath("/hero-character-clean.png")}
          alt=""
        />
      </div>

      <div className="reference-main">
        <div className="reference-copy">
          <SplitText
            tag="p"
            text="AI 漫剧 / 剪辑师"
            className="reference-role"
            delay={24}
            duration={0.72}
            from={{ opacity: 0, y: 18 }}
            to={{ opacity: 1, y: 0 }}
            rootMargin="0px"
            textAlign="left"
          />
          <div className="hero-title-lockup">
            <h1 aria-label="AI COMIC & EDITOR">
                            <TextType
                as="span"
                text="AI COMIC"
                className="reference-title-line reference-title-type"
                typingSpeed={78}
                initialDelay={180}
                loop={false}
                showCursor={false}
              />
                            <TextType
                as="span"
                text="& EDITOR"
                className="reference-title-line reference-title-type"
                typingSpeed={78}
                initialDelay={900}
                pauseDuration={2400}
                loop={false}
                cursorCharacter="▌"
                cursorClassName="reference-title-type-cursor"
              />
            </h1>              <div className="hero-orbit-system" aria-hidden="true">
                <span className="hero-orbit-entry hero-orbit-entry--outer">
                  <CircularText text="AI COMIC · EDITOR · FRAME · STORY ·" spinDuration={42} className="hero-orbit hero-orbit--outer" />
                </span>
                <span className="hero-orbit-entry hero-orbit-entry--inner">
                  <CircularText text="FRAME · STORY · AI DESIGN ·" spinDuration={58} className="hero-orbit hero-orbit--inner" />
                </span>
                <span className="hero-orbit-entry hero-orbit-entry--ellipse">
                  <span className="hero-orbit-ellipse"><span className="hero-orbit-ellipse__label">FRAME · STORY · AI DESIGN</span></span>
                </span>
              </div>
          </div>
          <div className="reference-signature">
            <span />
            <em>Frame by Frame<br />Story comes alive.</em>
          </div>
          <p className="reference-intro">用 AI 赋能创意<br />让每一帧都讲述故事</p>
        </div>

        <aside className="reference-services" aria-label="服务能力">
          {services.map(([title, subtitle], index) => (
            <div className="reference-service" key={title}>
              <span>0{index + 1}</span>
              <div><strong>{title}</strong><small>{subtitle}</small></div>
            </div>
          ))}
        </aside>
      </div><div className="reference-reel" aria-label="作品预览">
        {reel.map((item, index) => (
          <a className={`reel-card reel-${item.visual} cursor-target`} href={item.link || "#work"} onClick={(event) => { if (item.link) { event.preventDefault(); setActiveVideo(item.link); setIsVideoPlaying(false); } }} key={item.title}>
            <div className="reel-media">
              {item.poster && <img className="reel-poster-image" src={publicPath(item.poster)} alt={`${item.title}视频封面`} />}
              <span className="reel-category">{item.category}</span>
'              <span className="reel-play">▶</span>'
            </div>
            <div className="reel-details">
              <div className="reel-heading"><strong>{item.title}</strong><time>{item.year}</time></div>
              <p>{item.description}</p>
              <div className="reel-tags">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              <b>0{index + 1}</b>
            </div>
          </a>
        ))}
      </div>

      {activeVideo && (
        <div className="video-player-modal" role="dialog" aria-modal="true" aria-label="AI漫剧视频播放器" onClick={() => { setActiveVideo(null); setIsVideoPlaying(false); }}>
          <div className="video-player-frame" onClick={(event) => event.stopPropagation()}>
            <button className="video-player-close" type="button" aria-label="关闭视频" onClick={() => { setActiveVideo(null); setIsVideoPlaying(false); }}>CLOSE ×</button>
            <video ref={videoRef} src={activeVideo} poster={publicPath(activeVideoItem?.poster || "/feng-jiuyou-poster.png")} controls playsInline preload="metadata" controlsList="nodownload" disablePictureInPicture onEnded={() => setIsVideoPlaying(false)} onContextMenu={(event) => event.preventDefault()} />
            {!isVideoPlaying && (
              <button className={`video-player-cover video-player-cover--${activeVideoItem?.visual || "office"}`} type="button" aria-label="播放封九幽" onClick={() => { setIsVideoPlaying(true); requestAnimationFrame(() => { void videoRef.current?.play(); }); }}>
                <img src={publicPath(activeVideoItem?.poster || "/feng-jiuyou-poster.png")} alt={`${activeVideoItem?.title || "AI漫剧"}视频封面`} />
                <span><i>▶</i> PLAY AI COMIC</span>
              </button>
            )}
          </div>
        </div>
      )}

      <div className="reference-socials">
        <span>ZHOU ZIXIANG © 2026</span>
        <div>
          <a href="mailto:yqqkhb258@qq.com">EMAIL</a><i>/</i>
          <a href="#contact">WECHAT</a><i>/</i>
          <a href="#work">PORTFOLIO</a>
        </div>
      </div>
    </section>
  );
}
