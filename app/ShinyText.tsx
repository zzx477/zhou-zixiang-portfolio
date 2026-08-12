"use client";

import "./ShinyText.css";

type ShinyTextProps = {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
  color?: string;
  shineColor?: string;
  spread?: number;
  yoyo?: boolean;
  pauseOnHover?: boolean;
  direction?: "left" | "right";
  delay?: number;
};

export default function ShinyText({
  text,
  disabled = false,
  speed = 2,
  className = "",
  color = "#b5b5b5",
  shineColor = "#ffffff",
  spread = 120,
  yoyo = false,
  pauseOnHover = false,
  direction = "left",
  delay = 0,
}: ShinyTextProps) {
  const style = {
    "--shiny-base": color,
    "--shiny-gradient": "linear-gradient(" + spread + "deg, " + color + " 0%, " + color + " 35%, " + shineColor + " 50%, " + color + " 65%, " + color + " 100%)",
    "--shiny-duration": speed + "s",
    "--shiny-delay": delay + "s",
    "--shiny-direction": direction === "left" ? "normal" : "reverse",
  } as React.CSSProperties;

  const mode = disabled ? " shiny-text--disabled" : yoyo ? " shiny-text--yoyo" : "";
  const hoverMode = pauseOnHover ? " shiny-text--pause-hover" : "";

  return (
    <span
      className={"shiny-text" + mode + hoverMode + (className ? " " + className : "")}
      style={style}
      aria-label={text}
    >
      {text}
    </span>
  );
}