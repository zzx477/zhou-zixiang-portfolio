import type { Metadata } from "next";
import { HeroReference } from "./HeroReference";
import { SiteTextEffects } from "./SiteTextEffects";
import { SpecularCard } from "./SpecularCard";
import DeferredBallpit from "./DeferredBallpit";
import DeferredDomeGallery from "./DeferredDomeGallery";
import CategoryShowcase from "./CategoryShowcase";
import TargetCursor from "./TargetCursor";
import { ScrollSidebar } from "./ScrollSidebar";
import ShinyText from "./ShinyText";
import TextPressure from "./TextPressure";
import { ContactInstrument } from "./ContactInstrument";

export const metadata: Metadata = {
  title: "周子翔 / 剪辑师 / AI 设计师 / AI 漫剧",
  description: "周子翔个人作品集：视频剪辑、AI 视觉设计、AI 漫剧与内容创作。",
};

const projects = [
  { index: "01", title: "前男友竟空降成我老板", type: "AI COMIC DRAMA / EDIT", note: "短剧节奏 · 情绪推进 · 声画设计", visual: "office" },
  { index: "02", title: "大山的女孩", type: "SHORT DRAMA / STORY", note: "叙事剪辑 · 画面构图 · 氛围塑造", visual: "mountain" },
  { index: "03", title: "新倒霉大叔的婚礼", type: "COMEDY / POST", note: "喜剧节奏 · 音效设计 · 后期包装", visual: "wedding" },
];

const categories = [
  { no: "01", name: "AI漫剧", en: "AI COMIC DRAMA", note: "角色、世界观与情绪节奏", hasVideos: true },
  { no: "02", name: "短剧", en: "SHORT DRAMA", note: "叙事剪辑与人物关系" },
  { no: "03", name: "商业广告", en: "COMMERCIAL", note: "品牌影像与转化节奏", hasVideos: true },
  { no: "04", name: "娱乐视频", en: "ENTERTAINMENT", note: "热点内容与视觉包装", hasVideos: true },
];
const strengths = [
  { no: "01", title: "剪辑与叙事", text: "熟悉短剧剪辑逻辑，以节奏、情绪和信息密度推动故事，让观众愿意看到下一秒。", tags: "PR / 剪映 / 节奏把控" },
  { no: "02", title: "视觉与特效", text: "独立完成动态字幕、片头片尾和视觉特效，让画面包装始终服务于内容而非喧宾夺主。", tags: "AE / MOTION / VFX" },
  { no: "03", title: "调色与声音", text: "通过达芬奇调色、画质优化、配乐与音效剪辑，统一作品的视觉气质和听觉体验。", tags: "DAVINCI / COLOR / SOUND" },
  { no: "04", title: "AI 内容设计", text: "将 AI 视觉生成融入漫剧和短视频流程，从创意设定到成片交付，快速验证多种内容方向。", tags: "AI DESIGN / COMIC DRAMA" },
];

const experiences = [
  { date: "2026.03 — 2026.06", company: "郑州市好谷智能科技有限公司", role: "视频剪辑 / 策划 / 运营", detail: "企业宣传、视频拍摄、文本策划与后期剪辑" },
  { date: "2025.09 — 2026.03", company: "无锡格林豪泰酒店管理有限公司", role: "酒店管理", detail: "日常运营、服务、营收、后勤与安保管理" },
  { date: "2025.03 — 2025.09", company: "浙江奉天电子科技有限公司", role: "电子核心元件制作", detail: "生产流程执行与质量协作" },
  { date: "2024 — 2025", company: "郑州金麦源餐饮企业管理有限公司", role: "店铺运营与宣传", detail: "店铺宣发、视频策划与拍摄" },
];

function Arrow() {
  return <span aria-hidden="true">↗</span>
}

function ProjectVisual({ kind }: { kind: string }) {
  if (kind === "mountain") {
    return (
      <svg viewBox="0 0 1200 720" role="img" aria-label="山野叙事概念画面">
        <defs>
          <linearGradient id="mountain-sky" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#161c24" /><stop offset=".55" stopColor="#55604f" /><stop offset="1" stopColor="#aa7f57" />
          </linearGradient>
          <filter id="mountain-blur"><feGaussianBlur stdDeviation="16" /></filter>
        </defs>
        <rect width="1200" height="720" fill="url(#mountain-sky)" />
        <circle cx="920" cy="160" r="90" fill="#f0d4a2" opacity=".7" filter="url(#mountain-blur)" />
        <path d="M0 620 260 310 450 510 650 250 1200 650V720H0Z" fill="#151a18" />
        <path d="M0 670 320 430 520 590 820 340 1200 620V720H0Z" fill="#090b0a" opacity=".88" />
        <path d="M550 720c18-118 49-195 93-236 27 35 46 114 58 236Z" fill="#030303" /><circle cx="642" cy="461" r="24" fill="#090909" />
      </svg>
    );
  }
  if (kind === "wedding") {
    return (
      <svg viewBox="0 0 1200 720" role="img" aria-label="婚礼喜剧概念画面">
        <defs>
          <radialGradient id="wedding-bg" cx=".45" cy=".4" r=".8">
            <stop offset="0" stopColor="#672a2d" /><stop offset=".5" stopColor="#231619" /><stop offset="1" stopColor="#070707" />
          </radialGradient>
          <filter id="soft-glow"><feGaussianBlur stdDeviation="24" /></filter>
        </defs>
        <rect width="1200" height="720" fill="url(#wedding-bg)" />
        <circle cx="220" cy="160" r="80" fill="#ffb1a1" opacity=".2" filter="url(#soft-glow)" />
        <circle cx="980" cy="220" r="110" fill="#ff754f" opacity=".18" filter="url(#soft-glow)" />
        <path d="M500 720c22-172 66-285 134-340 76 75 119 188 132 340Z" fill="#090909" /><circle cx="635" cy="340" r="59" fill="#0a0a0a" />
        <path d="m630 420-78 132h158Z" fill="#f0e6dc" opacity=".9" /><path d="m630 420 72 130-35 170h-70l-30-170Z" fill="#141414" />
        <path d="M0 630c170-85 345-92 525-22 190-63 415-56 675 20v92H0Z" fill="#050505" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 1200 720" role="img" aria-label="都市办公室短剧概念画面">
      <defs>
        <linearGradient id="office-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#071520" /><stop offset=".48" stopColor="#1c3644" /><stop offset="1" stopColor="#9a5f44" />
        </linearGradient>
        <filter id="office-glow"><feGaussianBlur stdDeviation="30" /></filter>
      </defs>
      <rect width="1200" height="720" fill="url(#office-bg)" /><circle cx="910" cy="200" r="150" fill="#ff7b4d" opacity=".26" filter="url(#office-glow)" />
      <path d="M0 160h410v560H0zM460 80h310v640H460zM820 250h380v470H820z" fill="#050607" opacity=".74" />
      <g stroke="#91a6ad" strokeOpacity=".24"><path d="M70 160v560M150 160v560M230 160v560M310 160v560M390 160v560" /><path d="M520 80v640M600 80v640M680 80v640M860 250v470M960 250v470M1060 250v470M1160 250v470" /></g>
      <path d="M490 720c11-144 47-250 111-320 74 68 113 175 118 320Z" fill="#050505" /><circle cx="603" cy="365" r="48" fill="#070707" />
    </svg>
  );
}

export default function Home() {
  return (
    <main>
      <SiteTextEffects />
      <TargetCursor targetSelector=".cursor-target" spinDuration={6} cursorColor="#c7a5ff" cursorColorOnTarget="#e7c4ff" />
      <HeroReference />
      <ScrollSidebar />

      <section className="about section container" id="about">
        <div className="section-head section-head--works">
          <p className="eyebrow">01 / SELECTED WORKS</p>
          <h2 className="works-title">
            <ShinyText
              text="我的作品"
              speed={3.8}
              delay={0.4}
              color="#e8edf6"
              shineColor="#c7a5ff"
              spread={115}
              direction="left"
              className="works-title__shiny"
            />
          </h2>
          <p className="works-title__sub">在镜头之间，找到故事真正的重心。</p>
        </div>
        <div className="category-stage">
          <div className="category-stage__backdrop"><DeferredBallpit /></div>
          <div className="category-stage__wash" aria-hidden="true" />
          <div className="category-stage__topline"><span>SELECT BY FORM</span><span>04 CATEGORIES / 2026</span></div>
          <CategoryShowcase categories={categories} />
          <div className="category-stage__hint"><span>MOVE CURSOR TO DISTURB THE FIELD</span><span>SCROLL TO EXPLORE WORKS ↓</span></div>
        </div>        <div className="profile-grid">
          <div className="portrait-panel">
            <div className="portrait-noise" />
            <svg viewBox="0 0 720 900" role="img" aria-label="周子翔抽象人物肖像占位图">
              <defs><radialGradient id="portrait-light" cx=".58" cy=".28" r=".7"><stop offset="0" stopColor="#e08059" stopOpacity=".8" /><stop offset=".42" stopColor="#3b4c54" stopOpacity=".5" /><stop offset="1" stopColor="#060707" stopOpacity="0" /></radialGradient><filter id="portrait-blur"><feGaussianBlur stdDeviation="18" /></filter></defs>
              <rect width="720" height="900" fill="#090b0c" /><rect width="720" height="900" fill="url(#portrait-light)" /><circle cx="410" cy="315" r="130" fill="#111416" /><path d="M190 900c20-264 98-420 234-470 151 65 231 222 244 470Z" fill="#0b0d0e" /><path d="M338 235c63-84 173-64 198 38-18-48-54-75-109-82-44 1-74 16-89 44Z" fill="#050505" /><rect x="60" y="680" width="250" height="90" fill="#d86844" opacity=".22" filter="url(#portrait-blur)" />
            </svg>
            <div className="portrait-caption"><span>SELF PORTRAIT / PLACEHOLDER</span><span>2026</span></div>
          </div>
          <div className="profile-copy">
            <p className="profile-name">周子翔</p>
            <p className="lead">一名以叙事为核心的年轻剪辑师，也在探索 AI 设计与 AI 漫剧的全新表达。</p>
            <p className="body-copy">熟悉短视频与短剧的后期流程，能够独立完成从文案理解、素材组织、节奏搭建，到特效、调色和声音设计的完整制作。做事踏实，抗压高效，重视作品最终传递出的情绪与价值。</p>
            <div className="profile-contact"><a href="mailto:yqqkhb258@qq.com">yqqkhb258@qq.com <Arrow /></a><a href="tel:+8618003813801">+86 180 0381 3801 <Arrow /></a><span>现居：中国 · 郑州</span></div>
          </div>
        </div>
      </section>

      <section className="experience section container" aria-labelledby="experience-title">
        <div className="section-head compact"><p className="eyebrow">02 / EXPERIENCE</p><h2 id="experience-title">经历不是履历<br />是创作判断力的来源。</h2></div>
        <div className="timeline">{experiences.map((item, index) => <article className="timeline-row" key={item.company}><span className="timeline-index">0{index + 1}</span><time>{item.date}</time><div><h3>{item.company}</h3><p>{item.role}</p></div><p className="timeline-detail">{item.detail}</p></article>)}</div>
      </section>

            <section className="work work--gallery section" id="work">
        <div className="container">
          <div className="section-head work-head"><p className="eyebrow">03 / SELECTED WORK</p><h2>AI资产展示</h2><p className="work-intro">A rotating visual archive for selected frames. Drag to explore, click to focus.</p></div>
          <div className="gallery-shell">
            <DeferredDomeGallery />
            <div className="gallery-shell__caption"><span>PHOTO ARCHIVE / 2026</span><span>18 SELECTED FRAMES</span></div>
          </div>
        </div>
      </section>
<section className="strengths section container" id="strengths">
        <div className="section-head strengths-head"><p className="eyebrow">04 / CAPABILITIES</p><h2>从素材到成片<br />让每一个环节都有理由。</h2></div>
        <div className="strength-grid">{strengths.map((item) => <SpecularCard as="article" key={item.no} className="strength-card cursor-target" radius={6} baseColor="#6d7680" intensity={0.88}><span>{item.no}</span><h3>{item.title}</h3><p>{item.text}</p><div>{item.tags}</div></SpecularCard>)}</div>
        <div className="tool-reel" aria-label="使用工具"><span>PREMIERE PRO</span><span>AFTER EFFECTS</span><span>DAVINCI RESOLVE</span><span>剪映</span><span>AI WORKFLOW</span></div>
      </section>

      <footer className="contact" id="contact">
        <div className="contact-glow" aria-hidden="true" />
        <div className="container contact-inner">
          <div className="eyebrow contact-top"><span>05 / LET&apos;S CREATE</span><span>AVAILABLE FOR WORK</span></div>
          <div className="contact-main"><p>有一个值得被看见的故事。</p><ContactInstrument /><h2 className="contact-pressure-title" aria-label="一起把它 剪成现实" data-split-ignore><TextPressure text="一起把它" minFontSize={72} textColor="#f5f7ff" className="contact-pressure-line" /><TextPressure text="剪成现实" minFontSize={72} textColor="#d6c1ff" className="contact-pressure-line contact-pressure-line--accent" /></h2><a href="mailto:yqqkhb258@qq.com">START A PROJECT <Arrow /></a></div>
          <div className="contact-bottom"><div><span>EMAIL</span><a href="mailto:yqqkhb258@qq.com">yqqkhb258@qq.com</a></div><div><span>PHONE</span><a href="tel:+8618003813801">+86 180 0381 3801</a></div><p>© 2026 ZHOU ZIXIANG<br />ALL RIGHTS RESERVED</p></div>
        </div>
      </footer>
    </main>
  );
}

