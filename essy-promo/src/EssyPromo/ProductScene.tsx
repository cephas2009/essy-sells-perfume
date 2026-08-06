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
import { Marquee } from "./Marquee";
import { COLORS, FONT_FAMILY, GRADIENT } from "./shared";

const EASE = Easing.bezier(0.16, 1, 0.3, 1);

type Product = {
  emoji: string;
  title: string;
  tag: string;
  chipGradient: string;
  badge: string;
  accent: string;
};

const PRODUCTS: Product[] = [
  {
    emoji: "🛍️",
    title: "Fashion & Accessories",
    tag: "Trending styles",
    chipGradient: "linear-gradient(135deg, #FF5CAD, #FF0080)",
    badge: "NEW",
    accent: "#FF0080",
  },
  {
    emoji: "👟",
    title: "Shoes",
    tag: "Sneakers & more",
    chipGradient: "linear-gradient(135deg, #6FB1FF, #3B6FD4)",
    badge: "HOT",
    accent: "#3B6FD4",
  },
  {
    emoji: "💄",
    title: "Beauty & Skincare",
    tag: "Glow & care",
    chipGradient: "linear-gradient(135deg, #FFB45C, #FF7A59)",
    badge: "FAV",
    accent: "#FF7A59",
  },
  {
    emoji: "🏡",
    title: "Home & Lifestyle",
    tag: "Cozy essentials",
    chipGradient: "linear-gradient(135deg, #54D98C, #1FAE6B)",
    badge: "PICK",
    accent: "#1FAE6B",
  },
];

const ProductCard: React.FC<{
  product: Product;
  index: number;
}> = ({ product, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const delay = 26 + index * 8;
  const springIn = spring({
    fps,
    frame: frame - delay,
    config: { damping: 200, stiffness: 120, mass: 1 },
  });
  const phase = index * 0.8;
  const float = Math.sin((frame - delay) / 22 + phase) * 10;
  const tilt = Math.sin((frame - delay) / 30 + phase) * 1.1;

  return (
    <div style={{ translate: `0px ${float}px`, rotate: `${tilt}deg` }}>
      <Interactive.Div
        name={`Card: ${product.title}`}
        style={{
          position: "relative",
          width: 424,
          height: 470,
          borderRadius: 36,
          backgroundColor: "rgba(255, 255, 255, 0.55)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border: "1.5px solid rgba(255, 255, 255, 0.85)",
          boxShadow:
            "0 24px 60px rgba(42, 10, 32, 0.12), inset 0 1px 0 rgba(255,255,255,0.9)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          overflow: "hidden",
          opacity: interpolate(frame, [delay, delay + 14], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: springIn,
          rotate: interpolate(frame, [delay, delay + 34], ["-9deg", "0deg"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EASE,
          }),
          translate: interpolate(
            frame,
            [delay, delay + 34],
            ["0px 70px", "0px 0px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: EASE,
            },
          ),
        }}
      >
        {/* Shine sweep across the card on entrance */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            width: "100%",
            background:
              "linear-gradient(105deg, transparent 42%, rgba(255,255,255,0.65) 50%, transparent 58%)",
            backgroundSize: "250% 100%",
            backgroundPosition: `${interpolate(
              frame,
              [delay + 16, delay + 46],
              [-100, 250],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: EASE,
              },
            )}% 0%`,
            opacity: interpolate(frame, [delay + 16, delay + 30, delay + 60], [0, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        />

        {/* Corner badge */}
        <div
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            fontFamily: FONT_FAMILY,
            fontWeight: 900,
            fontSize: 17,
            letterSpacing: "0.12em",
            color: COLORS.white,
            background: product.chipGradient,
            padding: "8px 16px",
            borderRadius: 999,
            boxShadow: "0 8px 20px rgba(42,10,32,0.18)",
            scale: spring({
              fps,
              frame: frame - delay - 18,
              config: { damping: 200 },
            }),
          }}
        >
          {product.badge}
        </div>

        {/* Gradient icon chip */}
        <div
          style={{
            width: 116,
            height: 116,
            borderRadius: 30,
            background: product.chipGradient,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 62,
            boxShadow: `0 16px 34px ${product.accent}4D`,
            rotate: `${Math.sin(frame / 26 + phase) * 4}deg`,
          }}
        >
          {product.emoji}
        </div>

        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: 800,
            fontSize: 29,
            color: COLORS.dark,
            textAlign: "center",
            padding: "0 20px",
            lineHeight: 1.2,
          }}
        >
          {product.title}
        </div>
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: 600,
            fontSize: 21,
            color: COLORS.muted,
          }}
        >
          {product.tag}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontFamily: FONT_FAMILY,
            fontWeight: 800,
            fontSize: 21,
            color: product.accent,
            marginTop: 8,
          }}
        >
          Shop now
          <span style={{ translate: `${Math.sin(frame / 14 + phase) * 4}px 0px` }}>
            →
          </span>
        </div>
      </Interactive.Div>
    </div>
  );
};

export const ProductScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <Background>
      <AbsoluteFill
        style={{
          alignItems: "center",
          flexDirection: "column",
          paddingTop: 130,
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
          SHOP THE COLLECTION
        </Interactive.Div>

        {/* Heading with gradient word */}
        <Interactive.Div
          name="Heading"
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: 900,
            fontSize: 80,
            textAlign: "center",
            marginTop: 28,
            opacity: interpolate(frame, [10, 34], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(frame, [10, 38], ["0px 50px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: EASE,
            }),
          }}
        >
          What&apos;s{" "}
          <span
            style={{
              backgroundImage: GRADIENT,
              backgroundSize: "220% 100%",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundPosition: `${interpolate(frame, [0, 195], [0, 100], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: EASE,
              })}% 50%`,
            }}
          >
            in store?
          </span>
        </Interactive.Div>

        {/* Subheading */}
        <Interactive.Div
          name="Subheading"
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: 600,
            fontSize: 32,
            color: COLORS.muted,
            marginTop: 14,
            opacity: interpolate(frame, [16, 42], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          Handpicked • Verified • Affordable
        </Interactive.Div>

        {/* Product cards — 2x2 glass grid */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 28,
            width: 880,
            marginTop: 62,
          }}
        >
          {PRODUCTS.map((product, index) => (
            <ProductCard key={product.title} product={product} index={index} />
          ))}
        </div>
      </AbsoluteFill>

      {/* Scrolling marquee */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          opacity: interpolate(frame, [80, 110], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <Marquee />
      </div>
    </Background>
  );
};
