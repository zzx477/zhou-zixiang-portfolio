"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";
import { Color, Mesh, Program, Renderer, Triangle } from "ogl";
import "./SpecularCard.css";

const PAD = 18;

const VERT = `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const FRAG = `#version 300 es
precision highp float;

uniform vec2 uCenter;
uniform vec2 uHalfSize;
uniform float uRadius;
uniform float uAngle;
uniform float uPx;
uniform vec3 uLineColor;
uniform vec3 uBaseColor;
uniform float uIntensity;
uniform float uThickness;
out vec4 fragColor;

float sdRoundedRect(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

float gaussian(float d, float width) {
  float x = d / (width + 0.0001);
  return exp(-1.45 * x * x);
}

void main() {
  vec2 p = gl_FragCoord.xy - uCenter;
  float d = sdRoundedRect(p, uHalfSize, uRadius);
  vec2 light = vec2(cos(uAngle), sin(uAngle));
  vec2 normal = normalize(p / (uHalfSize * uHalfSize) + 0.00001);
  float facing = pow(max(0.0, abs(dot(normal, light))), 5.0);
  float edge = gaussian(d, uThickness * uPx);
  float clampEdge = 1.0 - smoothstep(0.5 * uPx, 3.0 * uPx, abs(d));
  float base = edge * 0.24;
  float shine = edge * facing * clampEdge * uIntensity;
  vec3 color = uBaseColor * base + uLineColor * shine;
  fragColor = vec4(color, clamp(base + shine, 0.0, 1.0));
}
`;

type SpecularCardProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  radius?: number;
  lineColor?: string;
  baseColor?: string;
  intensity?: number;
  thickness?: number;
};

export function SpecularCard({
  children,
  className = "",
  as: Tag = "article",
  radius = 7,
  lineColor = "#ffffff",
  baseColor = "#87909a",
  intensity = 1.15,
  thickness = 1,
}: SpecularCardProps) {
  const cardRef = useRef<HTMLElement | null>(null);
  const fxRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const card = cardRef.current;
    const fx = fxRef.current;
    if (!card || !fx || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const renderer = new Renderer({ alpha: true, premultipliedAlpha: true, antialias: true, dpr });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) delete geometry.attributes.uv;
    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uCenter: { value: [1, 1] },
        uHalfSize: { value: [1, 1] },
        uRadius: { value: radius * dpr },
        uAngle: { value: 2.4 },
        uPx: { value: dpr },
        uLineColor: { value: [1, 1, 1] },
        uBaseColor: { value: [0.53, 0.56, 0.6] },
        uIntensity: { value: 0 },
        uThickness: { value: thickness },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });
    fx.appendChild(gl.canvas);

    const size = { width: 1, height: 1 };
    const resize = () => {
      const rect = card.getBoundingClientRect();
      size.width = rect.width;
      size.height = rect.height;
      renderer.setSize(rect.width + PAD * 2, rect.height + PAD * 2);
      program.uniforms.uCenter.value = [(PAD + rect.width / 2) * dpr, (PAD + rect.height / 2) * dpr];
      program.uniforms.uHalfSize.value = [(rect.width / 2) * dpr, (rect.height / 2) * dpr];
      program.uniforms.uRadius.value = Math.min(radius, Math.min(rect.width, rect.height) / 2) * dpr;
    };

    const observer = new ResizeObserver(resize);
    observer.observe(card);
    resize();

    const line = new Color(lineColor);
    const base = new Color(baseColor);
    let angle = 2.4;
    let targetAngle = 2.4;
    let brightness = 0;
    let hovering = false;
    let last = performance.now();
    let frame = 0;

    const wake = () => {
      if (!frame) frame = window.requestAnimationFrame(render);
    };

    const render = (now: number) => {
      frame = 0;
      const delta = Math.min((now - last) / 1000, 0.05);
      last = now;
      angle += (((targetAngle - angle + Math.PI * 3) % (Math.PI * 2)) - Math.PI) * (1 - Math.exp(-delta * 9));
      const targetBrightness = hovering ? 1 : 0;
      brightness += (targetBrightness - brightness) * (1 - Math.exp(-delta * 9));

      program.uniforms.uAngle.value = angle;
      program.uniforms.uLineColor.value = [line.r, line.g, line.b];
      program.uniforms.uBaseColor.value = [base.r, base.g, base.b];
      program.uniforms.uIntensity.value = intensity * brightness;
      renderer.render({ scene: mesh });

      if (hovering || brightness > 0.012) frame = window.requestAnimationFrame(render);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const y = ((rect.top + rect.height / 2) - event.clientY) / (rect.height / 2);
      targetAngle = Math.atan2(y + 0.08, x - 0.08);
      hovering = true;
      wake();
    };
    const onPointerLeave = () => {
      hovering = false;
      wake();
    };

    card.addEventListener("pointermove", onPointerMove, { passive: true });
    card.addEventListener("pointerleave", onPointerLeave, { passive: true });
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      observer.disconnect();
      card.removeEventListener("pointermove", onPointerMove);
      card.removeEventListener("pointerleave", onPointerLeave);
      if (gl.canvas.parentNode === fx) fx.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [baseColor, intensity, lineColor, radius, thickness]);

  return (
    <Tag
      ref={cardRef as never}
      className={`specular-card ${className}`.trim()}
      style={{ "--sc-radius": `${radius}px` } as CSSProperties}
    >
      {children}
      <span ref={fxRef} className="specular-card__fx" aria-hidden="true" />
    </Tag>
  );
}
