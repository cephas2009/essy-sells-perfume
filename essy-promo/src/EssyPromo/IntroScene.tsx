import React from "react";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Background } from "./Background";
import { Sparkle } from "./Sparkle";
import { COLORS, FONT_FAMILY, FONT_FAMILY_SERIF, GRADIENT } from "./shared";

const EASE = Easing.bezier(0.16, 1, 0.3, 1);

export const IntroScene: React.FC<{
  brandName: string;
  tagline: string;
}> = ({ brandName, tagline }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = brandName.split(" ");
  const firstWord = words[0] ?? "";
  const accentWord = words.slice(1).join(" ");

  const taglineWords = tagline.split(" ");

  // Animated gradient position — creates a sheen sweep across the brand
  const sheen = interpolate(frame, [0, 175], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });

  const gradientText = {
    backgroundImage: GRADIENT,
    backgroundSize: "200% 100%",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
  } as React.CSSProperties;

  return (
    <Background>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        {/* Badge with shimmering border */}
        <Interactive.Div
          name="Badge"
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: 800,
            fontSize: 24,
            letterSpacing: "0.18em",
            color: COLORS.magenta,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            border: "1.5px solid rgba(255, 0, 128, 0.35)",
            padding: "14px 32px",
            borderRadius: 999,
            boxShadow: "0 10px 30px rgba(255, 0, 128, 0.12)",
            opacity: interpolate(frame, [6, 24], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            scale: spring({
              fps,
              frame: frame - 6,
              config: { damping: 200 },
            }),
            translate: interpolate(frame, [6, 34], ["0px -26px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: EASE,
            }),
          }}
        >
          ✦ ONE-STOP ONLINE STORE
        </Interactive.Div>

        {/* Brand name — gradient second word, staggered spring letters */}
        <Interactive.Div
          name="Brand name"
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: 900,
            fontSize: 128,
            lineHeight: 1.05,
            letterSpacing: "0.01em",
            display: "flex",
            marginTop: 44,
          }}
        >
          <span style={{ display: "inline-flex" }}>
            {firstWord.split("").map((char, i) => {
              const delay = 14 + i * 4;
              const progress = spring({
                fps,
                frame: frame - delay,
                config: { damping: 200, stiffness: 170, mass: 0.6 },
              });
              const lift = interpolate(
                frame,
                [delay, delay + 26],
                ["0px 90px", "0px 0px"],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: EASE,
                },
              );
              return (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    color: COLORS.dark,
                    scale: progress,
                    translate: lift,
                    opacity: interpolate(frame, [delay, delay + 12], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    }),
                  }}
                >
                  {char}
                </span>
              );
            })}
          </span>
          <span style={{ display: "inline-flex", marginLeft: 26 }}>
            {accentWord.split("").map((char, i) => {
              const delay = 14 + (firstWord.length + 1) * 4 + i * 4;
              const progress = spring({
                fps,
                frame: frame - delay,
                config: { damping: 200, stiffness: 170, mass: 0.6 },
              });
              const lift = interpolate(
                frame,
                [delay, delay + 26],
                ["0px 90px", "0px 0px"],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: EASE,
                },
              );
              return (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    ...gradientText,
                    // Offset each letter so the gradient flows continuously across the word
                    backgroundPosition: `${sheen - i * 16}% 50%`,
                    scale: progress,
                    translate: lift,
                    opacity: interpolate(frame, [delay, delay + 12], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    }),
                  }}
                >
                  {char}
                </span>
              );
            })}
          </span>
        </Interactive.Div>

        {/* Sparkles around the brand */}
        <div
          style={{
            position: "absolute",
            top: 720,
            left: 220,
            width: 26,
            height: 26,
            color: COLORS.magenta,
            opacity: 0.3 + 0.7 * Math.abs(Math.sin((frame + 10) / 14)),
            scale: 0.6 + 0.4 * Math.abs(Math.sin((frame + 10) / 14)),
          }}
        >
          <Sparkle />
        </div>
        <div
          style={{
            position: "absolute",
            top: 800,
            right: 210,
            width: 20,
            height: 20,
            color: COLORS.magentaLight,
            opacity: 0.3 + 0.7 * Math.abs(Math.sin((frame + 40) / 14)),
            scale: 0.6 + 0.4 * Math.abs(Math.sin((frame + 40) / 14)),
          }}
        >
          <Sparkle />
        </div>

        {/* Tagline — serif italic, blur-in */}
        <Interactive.Div
          name="Tagline"
          style={{
            fontFamily: FONT_FAMILY_SERIF,
            fontStyle: "italic",
            fontWeight: 600,
            fontSize: 58,
            color: COLORS.magentaDark,
            display: "flex",
            marginTop: 56,
            gap: 14,
          }}
        >
          {taglineWords.map((word, i) => {
            const delay = 58 + i * 6;
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  opacity: interpolate(frame, [delay, delay + 18], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                  translate: interpolate(
                    frame,
                    [delay, delay + 30],
                    ["0px 40px", "0px 0px"],
                    {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                      easing: EASE,
                    },
                  ),
                  filter: `blur(${interpolate(frame, [delay, delay + 26], [12, 0], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: EASE,
                  })}px)`,
                }}
              >
                {word}
              </span>
            );
          })}
        </Interactive.Div>

        {/* Underline with traveling glow tip */}
        <div
          style={{
            position: "relative",
            width: 260,
            height: 10,
            marginTop: 40,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: 10,
              borderRadius: 5,
              background: GRADIENT,
              backgroundSize: "220% 100%",
              backgroundPosition: `${interpolate(frame, [0, 175], [0, 100], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: EASE,
              })}% 50%`,
              width: interpolate(frame, [84, 128], [0, 260], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: EASE,
              }),
              opacity: interpolate(frame, [84, 110], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 1,
              left: interpolate(frame, [84, 128], [0, 254], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: EASE,
              }),
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: COLORS.white,
              boxShadow: `0 0 14px 3px ${COLORS.magentaLight}`,
              opacity: interpolate(frame, [84, 110], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          />
        </div>
      </AbsoluteFill>

      {/* Bottom hint — gently bobbing */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 132,
        }}
      >
        <Interactive.Div
          name="Bottom hint"
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: 600,
            fontSize: 28,
            color: COLORS.muted,
            opacity: interpolate(frame, [92, 120], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: `0px ${Math.sin(frame / 18) * 6}px`,
          }}
        >
          Fresh drops • Daily deals • Easy ordering
        </Interactive.Div>
      </AbsoluteFill>
    </Background>
  );
};
