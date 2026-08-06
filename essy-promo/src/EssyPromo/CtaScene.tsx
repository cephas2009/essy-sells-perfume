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
import { COLORS, FONT_FAMILY, FONT_FAMILY_SERIF, GRADIENT } from "./shared";

const EASE = Easing.bezier(0.16, 1, 0.3, 1);

const WhatsAppIcon: React.FC = () => {
  return (
    <svg viewBox="0 0 24 24" width={44} height={44} fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
};

export const CtaScene: React.FC<{
  brandName: string;
  tagline: string;
  whatsappNumber: string;
}> = ({ brandName, tagline, whatsappNumber }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const buttonIn = spring({
    fps,
    frame: frame - 28,
    config: { damping: 200, stiffness: 140, mass: 0.9 },
  });

  // Continuous pulsing halo behind the button (gated by the button entrance)
  const haloScale = 1 + Math.abs(Math.sin((frame + 10) / 14)) * 0.09;
  const haloOpacity =
    (0.12 + 0.3 * Math.abs(Math.sin((frame + 10) / 14))) * buttonIn;

  return (
    <Background>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 30,
        }}
      >
        {/* Kicker */}
        <Interactive.Div
          name="Kicker"
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: 800,
            fontSize: 22,
            letterSpacing: "0.18em",
            color: COLORS.magenta,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            border: "1.5px solid rgba(255, 0, 128, 0.3)",
            padding: "12px 26px",
            borderRadius: 999,
            opacity: interpolate(frame, [4, 20], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            scale: spring({
              fps,
              frame: frame - 4,
              config: { damping: 200 },
            }),
          }}
        >
          READY WHEN YOU ARE
        </Interactive.Div>

        {/* Heading with gradient accent */}
        <Interactive.Div
          name="Heading"
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: 900,
            fontSize: 86,
            textAlign: "center",
            color: COLORS.dark,
            scale: spring({
              fps,
              frame: frame - 8,
              config: { damping: 200, stiffness: 140 },
            }),
            opacity: interpolate(frame, [8, 30], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          Shop on{" "}
          <span
            style={{
              backgroundImage: GRADIENT,
              backgroundSize: "220% 100%",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundPosition: `${interpolate(frame, [0, 120], [0, 100], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: EASE,
              })}% 50%`,
            }}
          >
            WhatsApp
          </span>
        </Interactive.Div>

        {/* Subheading */}
        <Interactive.Div
          name="Subheading"
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: 600,
            fontSize: 36,
            color: COLORS.muted,
            opacity: interpolate(frame, [16, 42], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(frame, [16, 46], ["0px 30px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: EASE,
            }),
          }}
        >
          Fast replies. Easy orders. Great deals.
        </Interactive.Div>

        {/* Chat bubble popping in above the button */}
        <div
          style={{
            position: "relative",
            marginTop: 26,
            translate: `0px ${Math.sin(frame / 20) * 5}px`,
          }}
        >
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontWeight: 600,
              fontSize: 26,
              color: COLORS.dark,
              backgroundColor: "rgba(255, 255, 255, 0.92)",
              border: "1.5px solid rgba(255, 0, 128, 0.18)",
              borderRadius: 22,
              padding: "14px 24px",
              boxShadow: "0 14px 34px rgba(42,10,32,0.10)",
              scale: spring({
                fps,
                frame: frame - 22,
                config: { damping: 16, stiffness: 140 },
              }),
              translate: interpolate(
                frame,
                [22, 48],
                ["0px 40px", "0px 0px"],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: EASE,
                },
              ),
            }}
          >
            Order in seconds — let&apos;s chat! 👋
          </div>
          {/* Bubble tail */}
          <div
            style={{
              position: "absolute",
              bottom: -10,
              left: 48,
              width: 20,
              height: 20,
              backgroundColor: "rgba(255, 255, 255, 0.92)",
              borderRight: "1.5px solid rgba(255, 0, 128, 0.18)",
              borderBottom: "1.5px solid rgba(255, 0, 128, 0.18)",
              rotate: "45deg",
            }}
          />
        </div>

        {/* WhatsApp button with rotating gradient border + shimmer */}
        <div
          style={{
            position: "relative",
            marginTop: 22,
            display: "flex",
            justifyContent: "center",
          }}
        >
          {/* Pulsing halo */}
          <div
            style={{
              position: "absolute",
              top: -8,
              left: -8,
              width: 654,
              height: 166,
              borderRadius: 999,
              border: "3px solid rgba(37, 211, 102, 0.5)",
              scale: haloScale,
              opacity: haloOpacity,
            }}
          />
          {/* Rotating gradient border — the conic angle animates without rotating the pill */}
          <div
            style={{
              padding: 4,
              borderRadius: 999,
              background: `conic-gradient(from ${frame * 1.2}deg, ${COLORS.white}, ${COLORS.magentaLight}, ${COLORS.white}, ${COLORS.magenta}, ${COLORS.white})`,
              boxShadow: "0 20px 44px rgba(37, 211, 102, 0.35)",
              scale: buttonIn,
              translate: interpolate(
                frame,
                [28, 58],
                ["0px 90px", "0px 0px"],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: EASE,
                },
              ),
            }}
          >
            {/* Button */}
            <Interactive.Div
              name="WhatsApp button"
              style={{
                position: "relative",
                width: 630,
                height: 142,
                borderRadius: 999,
                backgroundColor: COLORS.whatsapp,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 18,
                overflow: "hidden",
              }}
            >
            {/* Shimmer sweep */}
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                width: "100%",
                background:
                  "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.5) 50%, transparent 60%)",
                backgroundSize: "250% 100%",
                backgroundPosition: `${interpolate(
                  frame,
                  [36, 78],
                  [-100, 250],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: EASE,
                  },
                )}% 0%`,
              }}
            />
            <WhatsAppIcon />
            <div
              style={{
                fontFamily: FONT_FAMILY,
                fontWeight: 700,
                fontSize: 33,
                color: COLORS.white,
                letterSpacing: "0.01em",
              }}
            >
              Chat with us on WhatsApp
            </div>
            </Interactive.Div>
          </div>
        </div>

        {/* Phone number with pulsing dot */}
        <Interactive.Div
          name="Phone number"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontFamily: FONT_FAMILY,
            fontWeight: 700,
            fontSize: 38,
            color: COLORS.whatsappDark,
            opacity: interpolate(frame, [46, 70], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: COLORS.whatsapp,
              scale: 0.8 + 0.2 * Math.abs(Math.sin(frame / 10)),
              boxShadow: `0 0 12px 2px ${COLORS.whatsapp}80`,
            }}
          />
          {whatsappNumber}
        </Interactive.Div>
      </AbsoluteFill>

      {/* Footer brand */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 128,
        }}
      >
        <Interactive.Div
          name="Footer brand"
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: 900,
            fontSize: 42,
            color: COLORS.dark,
            opacity: interpolate(frame, [58, 84], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {brandName}
        </Interactive.Div>
        <Interactive.Div
          name="Footer tagline"
          style={{
            fontFamily: FONT_FAMILY_SERIF,
            fontStyle: "italic",
            fontWeight: 600,
            fontSize: 30,
            color: COLORS.magenta,
            marginTop: 8,
            opacity: interpolate(frame, [66, 92], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {tagline}
        </Interactive.Div>
      </AbsoluteFill>
    </Background>
  );
};
