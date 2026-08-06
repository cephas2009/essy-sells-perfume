import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONT_FAMILY } from "./shared";

// Seamlessly scrolling marquee strip. Duplicated content is translated in a loop.
const ITEMS = [
  "Fast delivery",
  "Best prices",
  "Authentic products",
  "Easy payments",
  "New drops weekly",
];

export const Marquee: React.FC<{
  speed?: number;
}> = ({ speed = 0.9 }) => {
  const frame = useCurrentFrame();
  // Shift from 0 to -50% of the track width, then loop
  const shift = -((frame * speed) % 100);

  const run = (key: string) => (
    <div
      key={key}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 48,
        paddingRight: 48,
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      {ITEMS.map((item, i) => (
        <React.Fragment key={`${key}-${i}`}>
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontWeight: 800,
              fontSize: 27,
              letterSpacing: "0.06em",
              color: COLORS.white,
            }}
          >
            {item.toUpperCase()}
          </span>
          <span style={{ color: COLORS.white, fontSize: 18, opacity: 0.85 }}>
            ✦
          </span>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        overflow: "hidden",
        backgroundImage: `linear-gradient(90deg, ${COLORS.magenta}, ${COLORS.magentaLight})`,
        padding: "22px 0",
        boxShadow: "0 -10px 40px rgba(255, 0, 128, 0.18)",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "max-content",
          translate: `${shift}% 0px`,
        }}
      >
        {run("a")}
        {run("b")}
      </div>
    </div>
  );
};
