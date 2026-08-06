import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { Sparkle } from "./Sparkle";
import { COLORS } from "./shared";

// Soft radial blob that drifts slowly (parallax feel)
const Blob: React.FC<{
  size: number;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  color: string;
  driftY: number;
  driftX: number;
  duration: number;
  opacity?: number;
}> = ({ size, top, bottom, left, right, color, driftY, driftX, duration, opacity = 0.55 }) => {
  const frame = useCurrentFrame();
  const p = (frame % duration) / duration;
  return (
    <div
      style={{
        position: "absolute",
        top,
        bottom,
        left,
        right,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle at 35% 35%, ${color} 0%, rgba(255,255,255,0) 70%)`,
        opacity,
        translate: `${driftX * Math.sin(p * Math.PI * 2)}px ${driftY * Math.sin(p * Math.PI * 2 + 1.2)}px`,
        scale: 1 + Math.sin(p * Math.PI * 2) * 0.06,
      }}
    />
  );
};

// Twinkling sparkle
const Twinkle: React.FC<{
  size: number;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  phase: number;
  color: string;
}> = ({ size, top, bottom, left, right, phase, color }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [0, 60],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  return (
    <div
      style={{
        position: "absolute",
        top,
        bottom,
        left,
        right,
        width: size,
        height: size,
        color,
        opacity: opacity * (0.35 + 0.65 * Math.abs(Math.sin((frame + phase) / 16))),
        scale: 0.6 + 0.4 * Math.abs(Math.sin((frame + phase) / 16)),
      }}
    >
      <Sparkle />
    </div>
  );
};

// Rotating gradient ring (visible because of the arc stroke)
const OrbitRing: React.FC<{
  size: number;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  direction?: number;
  color: string;
}> = ({ size, top, bottom, left, right, direction = 1, color }) => {
  const frame = useCurrentFrame();
  const circumference = Math.PI * size;
  const arc = circumference * 0.3;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{
        position: "absolute",
        top,
        bottom,
        left,
        right,
        rotate: `${direction * (frame * 0.35)}deg`,
        opacity: 0.5,
      }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={size / 2 - 2}
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={`${arc} ${circumference}`}
      />
    </svg>
  );
};

export const Background: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${COLORS.white} 0%, ${COLORS.pinkSoft} 55%, ${COLORS.pinkTint} 100%)`,
        overflow: "hidden",
      }}
    >
      {/* Mesh of drifting gradient blobs */}
      <Blob
        size={760}
        top={-220}
        right={-260}
        color={COLORS.magentaLight}
        driftY={80}
        driftX={30}
        duration={200}
        opacity={0.28}
      />
      <Blob
        size={860}
        bottom={-280}
        left={-280}
        color={COLORS.lavender}
        driftY={-90}
        driftX={-40}
        duration={240}
        opacity={0.6}
      />
      <Blob
        size={560}
        top={700}
        left={-200}
        color={COLORS.magenta}
        driftY={60}
        driftX={70}
        duration={180}
        opacity={0.12}
      />
      <Blob
        size={500}
        bottom={240}
        right={-160}
        color={COLORS.magentaLight}
        driftY={-50}
        driftX={40}
        duration={220}
        opacity={0.2}
      />

      {/* Rotating gradient arcs */}
      <OrbitRing size={420} top={140} left={-140} color={COLORS.magenta} direction={1} />
      <OrbitRing size={520} bottom={120} right={-200} color={COLORS.magentaLight} direction={-1} />

      {/* Twinkling sparkles */}
      <Twinkle size={26} top={360} left={120} phase={0} color={COLORS.magenta} />
      <Twinkle size={18} top={520} right={130} phase={40} color={COLORS.magentaLight} />
      <Twinkle size={22} top={1080} left={110} phase={80} color={COLORS.magenta} />
      <Twinkle size={16} bottom={360} right={140} phase={120} color={COLORS.magentaLight} />

      {/* Soft vignette for depth */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(255,255,255,0) 55%, rgba(42,10,32,0.07) 100%)",
        }}
      />

      {children}
    </AbsoluteFill>
  );
};
