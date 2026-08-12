import type { AiComicVideo } from "./aiComicVideos";

const baseUrl =
  "https://zuopinji-1449420565.cos.ap-guangzhou.myqcloud.com/%E5%A8%B1%E4%B9%90%E8%A7%86%E9%A2%91";

export const entertainmentVideos: AiComicVideo[] = [
  {
    title: "你的名字 · 动漫混剪",
    url: `${baseUrl}/%E4%BD%A0%E7%9A%84%E5%90%8D%E5%AD%97%E6%BC%AB%E5%89%AA.mp4`,
    poster: "/entertainment-posters/01.jpg",
    description: "以情绪递进和音乐节拍串联经典画面，在光影与转场之间保留青春叙事的余韵。",
  },
  {
    title: "回到你梦开始的地方",
    url: `${baseUrl}/%E2%80%9C%E5%9B%9E%E5%88%B0%E4%BD%A0%E6%A2%A6%E5%BC%80%E5%A7%8B%E7%9A%84%E5%9C%B0%E6%96%B9%E2%80%9D.mp4`,
    poster: "/entertainment-posters/02.jpg",
    description: "用具有回忆感的镜头编排和节奏变化，呈现关于出发、成长与重逢的情绪短片。",
  },
  {
    title: "音乐卡点",
    url: `${baseUrl}/%E9%9F%B3%E4%B9%90%E5%8D%A1%E7%82%B9.mp4`,
    poster: "/entertainment-posters/03.jpg",
    description: "围绕鼓点、重拍和旋律转折组织画面，让动作、转场与音乐形成清晰的视觉律动。",
  },
  {
    title: "动漫剪辑 04",
    url: `${baseUrl}/%E5%8A%A8%E6%BC%AB%E5%89%AA%E8%BE%914.mp4`,
    poster: "/entertainment-posters/04.jpg",
    description: "通过角色高光、动作节奏与氛围镜头的组合，强化动漫内容的情绪张力。",
  },
  {
    title: "卡点漫剪",
    url: `${baseUrl}/%E5%8D%A1%E7%82%B9%E6%BC%AB%E5%89%AA.mp4`,
    poster: "/entertainment-posters/05.jpg",
    description: "以高密度卡点和利落转场推动观看节奏，突出角色动作与画面冲击力。",
  },
  {
    title: "卡点漫剪 01",
    url: `${baseUrl}/%E5%8D%A1%E7%82%B9%E6%BC%AB%E5%89%AA1.mp4`,
    poster: "/entertainment-posters/06.jpg",
    description: "在音乐结构中重组动画素材，用节拍同步和镜头对位形成连贯的视听体验。",
  },
  {
    title: "动漫情绪混剪",
    url: `${baseUrl}/%E6%BC%AB%E5%89%AA.mp4`,
    poster: "/entertainment-posters/07.jpg",
    description: "从人物情绪与故事氛围出发重新编排素材，让短时长内容保持完整的起承转合。",
  },
  {
    title: "风景剪辑 · 第一章",
    url: `${baseUrl}/%E9%A3%8E%E6%99%AF%E5%89%AA%E8%BE%91.mp4`,
    poster: "/entertainment-posters/08.jpg",
    description: "以自然景观、空间层次和舒缓节奏构建沉浸感，呈现安静克制的旅行氛围。",
  },
  {
    title: "风景剪辑 · 第二章",
    url: `${baseUrl}/%E9%A3%8E%E6%99%AF%E5%89%AA%E8%BE%912.mp4`,
    poster: "/entertainment-posters/09.jpg",
    description: "利用景别变化与色彩衔接组织风景素材，让画面在流动中保持统一气质。",
  },
  {
    title: "风景剪辑 · 第三章",
    url: `${baseUrl}/%E9%A3%8E%E6%99%AF%E5%89%AA%E8%BE%913.mp4`,
    poster: "/entertainment-posters/10.jpg",
    description: "通过留白、慢节奏与环境氛围塑造视觉呼吸感，完成一段具有电影感的风景记录。",
  },
];
