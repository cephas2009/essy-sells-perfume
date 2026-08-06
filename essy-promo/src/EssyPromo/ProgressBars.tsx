import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS } from "./shared";

// Scene ranges on the global timeline (matches Composition.tsx transitions)
const SCENES = [
  { name: "Intro", start: 0, end: 175 },
  { name: "Products", start: 155, end: 350 },
  { name: "CTA", start: 330, end: 450 },
];

export const ProgressBars: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: "absolute",
        top: 54,
        left: 54,
        right: 54,
        display: "flex",
        gap: 10,
        zIndex: 20,
      }}
    >
      {SCENES.map((scene) => {
        const progress = (frame - scene.start) / (scene.end - scene.start);
        const fill = Math.max(0, Math.min(1, progress));
        const active = frame >= scene.start && frame < scene.end;
        const done = frame >= scene.end;
        return (
          <div
            key={scene.name}
            style={{
              flex: 1,
              height: 7,
              borderRadius: 4,
              backgroundColor: "rgba(42, 10, 32, 0.16)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${fill * 100}%`,
                height: "100%",
                borderRadius: 4,
                backgroundColor: done ? COLORS.magentaDark : active ? COLORS.magenta : "rgba(42,10,32,0.22)",
                boxShadow: active ? `0 0 10px ${COLORS.magenta}80` : undefined,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
