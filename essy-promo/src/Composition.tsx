import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { z } from "zod";

export const essyPromoSchema = z.object({
  brandName: z.string(),
  tagline: z.string(),
  whatsappNumber: z.string(),
});

const SPRING_CONFIG = { damping: 12, stiffness: 100, mass: 0.8 };

const springIn = (frame: number, fps: number, delay = 0) =>
  spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: SPRING_CONFIG,
  });

const FONT = "'Inter', 'Helvetica Neue', system-ui, sans-serif";
const MAGENTA = "#ff2e9a";
const VIOLET = "#8b1bff";

// ---------------------------------------------------------------------------
// Intro Scene
// ---------------------------------------------------------------------------
const IntroScene: React.FC<{ brandName: string; tagline: string }> = ({
  brandName,
  tagline,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badgeSpring = springIn(frame, fps, 0);
  const titleSpring = springIn(frame, fps, 8);
  const taglineSpring = springIn(frame, fps, 24);
  const glow = interpolate(frame % 90, [0, 45, 90], [0.5, 0.85, 0.5]);

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 20%, #241226 0%, #0b0710 55%, #050308 100%)",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-12%",
          left: "-22%",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: MAGENTA,
          filter: "blur(170px)",
          opacity: glow,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-16%",
          right: "-16%",
          width: 620,
          height: 620,
          borderRadius: "50%",
          background: VIOLET,
          filter: "blur(170px)",
          opacity: glow * 0.7,
        }}
      />

      <div
        style={{
          opacity: badgeSpring,
          transform: `scale(${interpolate(badgeSpring, [0, 1], [0.85, 1])})`,
          padding: "12px 30px",
          borderRadius: 999,
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.18)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <span
          style={{
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 28,
            letterSpacing: 3,
            color: "#ff8fd4",
            textTransform: "uppercase",
          }}
        >
          All You Can Ever Need
        </span>
      </div>

      <h1
        style={{
          marginTop: 44,
          marginBottom: 0,
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 128,
          lineHeight: 1.05,
          color: "#ffffff",
          textAlign: "center",
          textShadow: `0 0 70px ${MAGENTA}99`,
          opacity: titleSpring,
          transform: `scale(${interpolate(
            titleSpring,
            [0, 1],
            [0.72, 1]
          )}) translateY(${interpolate(titleSpring, [0, 1], [46, 0])}px)`,
        }}
      >
        {brandName}
      </h1>

      <p
        style={{
          marginTop: 26,
          fontFamily: FONT,
          fontWeight: 500,
          fontSize: 42,
          color: "rgba(255,255,255,0.82)",
          textAlign: "center",
          opacity: taglineSpring,
          transform: `translateY(${interpolate(
            taglineSpring,
            [0, 1],
            [26, 0]
          )}px)`,
        }}
      >
        {tagline}
      </p>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Product Scene
// ---------------------------------------------------------------------------
const PRODUCTS: { label: string; color: string }[] = [
  { label: "Electronics", color: "#ff2e9a" },
  { label: "Fashion", color: "#8b5cf6" },
  { label: "Home & Living", color: "#22d3ee" },
  { label: "Groceries", color: "#facc15" },
];

const ProductScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerSpring = springIn(frame, fps, 0);

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, #0b0710 0%, #170a1e 55%, #05030a 100%)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-8%",
          left: "25%",
          width: 640,
          height: 640,
          borderRadius: "50%",
          background: MAGENTA,
          filter: "blur(190px)",
          opacity: 0.32,
        }}
      />

      <div
        style={{
          paddingTop: 150,
          display: "flex",
          justifyContent: "center",
          opacity: headerSpring,
          transform: `translateY(${interpolate(
            headerSpring,
            [0, 1],
            [-34, 0]
          )}px)`,
        }}
      >
        <h2
          style={{
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 62,
            color: "#ffffff",
            margin: 0,
            textAlign: "center",
          }}
        >
          Everything You Need
        </h2>
      </div>

      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 34,
          padding: "70px 66px 100px",
          alignContent: "center",
        }}
      >
        {PRODUCTS.map((product, i) => {
          const delay = 24 + i * 8;
          const s = springIn(frame, fps, delay);
          const rotateY = interpolate(s, [0, 1], [-95, 0]);
          const rotateX = interpolate(s, [0, 1], [18, 0]);
          const scale = interpolate(s, [0, 1], [0.7, 1]);

          return (
            <div
              key={product.label}
              style={{
                opacity: s,
                transformStyle: "preserve-3d",
                transform: `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(${scale})`,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.15)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                borderRadius: 28,
                padding: "34px 18px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 16,
                boxShadow: `0 24px 60px rgba(0,0,0,0.45), 0 0 40px ${product.color}33`,
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 20,
                  background: product.color,
                  boxShadow: `0 0 32px ${product.color}`,
                }}
              />
              <span
                style={{
                  fontFamily: FONT,
                  fontWeight: 700,
                  fontSize: 27,
                  color: "#ffffff",
                  textAlign: "center",
                }}
              >
                {product.label}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// CTA Scene
// ---------------------------------------------------------------------------
const CtaScene: React.FC<{
  brandName: string;
  tagline: string;
  whatsappNumber: string;
}> = ({ brandName, tagline, whatsappNumber }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const brandSpring = springIn(frame, fps, 0);
  const bannerSpring = springIn(frame, fps, 16);
  const pulse = interpolate(frame % 40, [0, 20, 40], [1, 1.055, 1]);

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 32%, #26001b 0%, #0a0510 60%, #050308 100%)",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 820,
          height: 820,
          borderRadius: "50%",
          background: MAGENTA,
          filter: "blur(210px)",
          opacity: 0.4,
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          opacity: brandSpring,
          transform: `translateY(${interpolate(
            brandSpring,
            [0, 1],
            [32, 0]
          )}px)`,
        }}
      >
        <span
          style={{
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 68,
            color: "#ffffff",
          }}
        >
          {brandName}
        </span>
        <span
          style={{
            fontFamily: FONT,
            fontWeight: 500,
            fontSize: 30,
            color: "rgba(255,255,255,0.78)",
          }}
        >
          {tagline}
        </span>
      </div>

      <div
        style={{
          marginTop: 64,
          opacity: bannerSpring,
          transform: `scale(${
            interpolate(bannerSpring, [0, 1], [0.8, 1]) * pulse
          })`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            background: "rgba(37, 211, 102, 0.15)",
            border: "1px solid rgba(37, 211, 102, 0.6)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderRadius: 24,
            padding: "26px 44px",
            boxShadow: "0 0 60px rgba(37,211,102,0.5)",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "#25D366",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.87.5 3.62 1.44 5.14L2 22l5.1-1.54a9.8 9.8 0 0 0 4.94 1.34h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.68 14.03c-.24.68-1.4 1.31-1.94 1.36-.5.05-1.1.29-3.66-.76-3.09-1.28-5.09-4.4-5.24-4.6-.15-.2-1.25-1.66-1.25-3.17 0-1.5.79-2.24 1.07-2.54.28-.3.62-.38.83-.38h.6c.2 0 .46-.03.7.54.25.6.85 2.08.92 2.23.07.15.12.32.02.52-.1.2-.15.32-.3.5-.15.17-.32.38-.45.5-.15.15-.31.31-.13.6.17.3.77 1.28 1.66 2.08 1.14 1.02 2.1 1.34 2.4 1.5.3.15.47.13.65-.08.18-.2.75-.87.95-1.17.2-.3.4-.25.68-.15.28.1 1.77.83 2.07.98.3.15.5.22.57.35.08.13.08.75-.16 1.43z" />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: 25,
                color: "#ffffff",
              }}
            >
              Chat With Us Now
            </span>
            <span
              style={{
                fontFamily: FONT,
                fontWeight: 600,
                fontSize: 21,
                color: "#8ff5b0",
              }}
            >
              {whatsappNumber}
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Root Composition
// ---------------------------------------------------------------------------
export const EssySellsPromo: React.FC<z.infer<typeof essyPromoSchema>> = ({
  brandName,
  tagline,
  whatsappNumber,
}) => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={175} name="Intro">
        <IntroScene brandName={brandName} tagline={tagline} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 20 })}
      />
      <TransitionSeries.Sequence durationInFrames={195} name="Products">
        <ProductScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 20 })}
      />
      <TransitionSeries.Sequence durationInFrames={120} name="CTA">
        <CtaScene
          brandName={brandName}
          tagline={tagline}
          whatsappNumber={whatsappNumber}
        />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
