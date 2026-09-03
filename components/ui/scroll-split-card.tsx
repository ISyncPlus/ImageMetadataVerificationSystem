"use client";

import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform, useMotionTemplate } from "motion/react";
import React, { useRef } from "react";
import { useMediaQuery } from "@/lib/useMediaQuery";

export interface ScrollSplitCardItem {
  title: string;
  description: string;
  bgColor: string;
  textColor: string;
  icon?: React.ReactNode;
}

export interface ScrollSplitCardProps {
  className?: string;
  imageSrc: string;
  cards: ScrollSplitCardItem[];
  eyebrow?: string;
  heading?: string;
  endingText?: string;
}

/**
 * ScrollSplitCard
 * 
 * True window-scroll-driven 3D card split and flip:
 * - Natural page scroll pins the container at viewport center.
 * - Stage 1 (0 -> 0.35): Monolithic image cleanly splits into 3 horizontal panels.
 * - Stage 2 (0.35 -> 0.75): 3 panels flip 180° in 3D to reveal verified telemetry cards.
 * - Stage 3 (0.75 -> 0.95): Cards lift up and ending conclusion text fades in.
 * - Stage 4 (0.95 -> 1.0): Pin seamlessly releases and normal page scroll continues.
 * - Scrolling up smoothly reverses the animation frame-by-frame.
 */
export function ScrollSplitCard({
  className,
  imageSrc,
  cards,
  eyebrow = "Forensic Architecture",
  heading = "How Verification Unfolds",
  endingText = "Cryptographically audited evidence. Zero subjective guesswork.",
}: ScrollSplitCardProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  /* Below `sm` the deck splits the photograph into three horizontal bands
     stacked down the screen instead of three columns across it. Three columns
     inside a 350px viewport gives each card about 54px of usable width, which
     turns every heading into a one-word-per-line ribbon and clips the body
     copy mid-sentence. The choreography is unchanged — separate, flip, lift —
     it just runs along the other axis. */
  const narrow = useMediaQuery("(max-width: 639px)");

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Stage 1 to 2: Separation (0 to 0.4), then Stage 2 to 3: Overlap closer (0.4 to 0.8)
  const leftX = useTransform(scrollYProgress, [0, 0.4, 0.8], [0, -48, -24]);
  const rightX = useTransform(scrollYProgress, [0, 0.4, 0.8], [0, 48, 24]);
  const scale = useTransform(scrollYProgress, [0, 0.4], [1, 0.9]);

  // Stage 2 to 3: Flip (0.4 to 0.8)
  const rotateY = useTransform(scrollYProgress, [0.4, 0.8], [0, 180]);
  const rotateZLeft = useTransform(scrollYProgress, [0.4, 0.8], [0, 6]);
  const rotateZRight = useTransform(scrollYProgress, [0.4, 0.8], [0, -6]);

  // Dynamic borders and radii so it starts as ONE flat monolithic image
  const borderRadiusLeft = useTransform(
    scrollYProgress,
    [0, 0.2],
    [narrow ? "16px 16px 0px 0px" : "16px 0px 0px 16px", "16px 16px 16px 16px"]
  );
  const borderRadiusMiddle = useTransform(scrollYProgress, [0, 0.2], ["0px 0px 0px 0px", "16px 16px 16px 16px"]);
  const borderRadiusRight = useTransform(
    scrollYProgress,
    [0, 0.2],
    [narrow ? "0px 0px 16px 16px" : "0px 16px 16px 0px", "16px 16px 16px 16px"]
  );
  const borderOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 0.2]);
  const shadowOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 0.4]);
  const boxShadow = useMotionTemplate`inset 0 1px 1px rgba(255, 255, 255, ${borderOpacity}), inset 0 -24px 48px rgba(0, 0, 0, ${shadowOpacity}), 0 25px 50px -12px rgba(0, 0, 0, ${shadowOpacity})`;

  // Cards move up in the last stage
  const cardsY = useTransform(scrollYProgress, [0.8, 1], [0, -180]);

  // Text appearance at completion in the sticky viewport
  const textOpacity = useTransform(scrollYProgress, [0.8, 1], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.8, 1], [40, 0]);

  // Header prompt indicator at the start
  const startTextOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const startTextY = useTransform(scrollYProgress, [0, 0.15], [0, -15]);

  return (
    <div
      ref={sectionRef}
      className={cn("relative h-[300vh] w-full", className)}
    >
      {/* Sticky Viewport Stage — Pins while scrolling through this section */}
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden [perspective:1200px]">
        {/* Section Header */}
        <motion.div
          className="pointer-events-none absolute left-0 right-0 top-[5%] z-10 px-4 text-center sm:top-[14%]"
          style={{
            opacity: startTextOpacity,
            y: startTextY,
          }}
        >
          <span className="t-caption font-bold uppercase tracking-wider text-accent block">
            {eyebrow}
          </span>
          <h2 className="t-title-1 mt-1 text-ink font-bold">{heading}</h2>
          <p className="text-xs font-mono font-medium tracking-widest text-ink-3 uppercase mt-2">
            ↓ Scroll down to decompose evidence
          </p>
        </motion.div>

        {/* 3D Splitting & Flipping Deck */}
        <motion.div
          style={{ scale, y: cardsY, transformStyle: "preserve-3d" }}
          className="relative z-0 mt-14 flex h-[28rem] w-full max-w-4xl flex-col px-4 sm:mt-0 sm:h-[420px] sm:flex-row"
        >
          {cards.slice(0, 3).map((card, i) => (
            <motion.div
              key={i}
              className="relative h-full flex-1"
              style={{
                x: narrow ? 0 : i === 0 ? leftX : i === 2 ? rightX : 0,
                y: narrow ? (i === 0 ? leftX : i === 2 ? rightX : 0) : 0,
                rotateY,
                rotateZ: i === 0 ? rotateZLeft : i === 2 ? rotateZRight : 0,
                zIndex: i, // Ensures Left is under Middle, and Right is above Middle
                transformStyle: "preserve-3d",
              }}
            >
              {/* Front Face: Slice of original photograph */}
              <motion.div
                className="absolute inset-0 overflow-hidden [backface-visibility:hidden] border border-line"
                style={{
                  zIndex: 2,
                  borderRadius: i === 0 ? borderRadiusLeft : i === 2 ? borderRadiusRight : borderRadiusMiddle,
                  boxShadow,
                }}
              >
                <div
                  className={cn(
                    "absolute inset-0",
                    narrow ? "h-[300%] w-full" : "h-full w-[300%]"
                  )}
                  style={{
                    ...(narrow ? { top: `${-100 * i}%` } : { left: `${-100 * i}%` }),
                    backgroundImage: `url(${imageSrc})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              </motion.div>

              {/* Back Face: Telemetry verification card */}
              <motion.div
                className={cn(
                  "absolute inset-0 flex flex-col justify-between overflow-hidden p-5 sm:p-8 [backface-visibility:hidden] will-change-transform",
                  "border border-white/10 bg-gradient-to-br from-white/10 to-transparent",
                  "shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),inset_0_-24px_48px_rgba(0,0,0,0.2)]"
                )}
                style={{
                  backgroundColor: card.bgColor,
                  color: card.textColor,
                  transform: "rotateY(180deg)",
                  zIndex: 1,
                  borderRadius: i === 0 ? borderRadiusLeft : i === 2 ? borderRadiusRight : borderRadiusMiddle,
                  boxShadow,
                }}
              >
                {/* Subtle Grain Texture Overlay */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-15 mix-blend-overlay"
                  style={{
                    backgroundImage: `radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)`,
                    backgroundSize: "16px 16px",
                  }}
                />

                <div className="relative z-10 mb-auto">{card.icon}</div>
                <div className="relative z-10 mb-2">
                  <h3 className="text-lg font-bold leading-tight tracking-tight sm:text-2xl">
                    {card.title}
                  </h3>
                  <p className="mt-2.5 text-xs sm:text-sm opacity-85 leading-relaxed">
                    {card.description}
                  </p>
                </div>
                <div className="relative z-10 pt-3 border-t border-white/15 flex items-center justify-between text-[11px] font-mono">
                  <span className="opacity-80">AUDIT VERDICT</span>
                  <span className="font-bold flex items-center gap-1.5 text-good">
                    <span className="h-2 w-2 rounded-full bg-good-mark" />
                    VERIFIED PASS
                  </span>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Ending Text in Sticky Viewport */}
        <motion.div
          className="pointer-events-none absolute bottom-[15%] left-0 right-0 z-10 px-4 text-center sm:bottom-[16%]"
          style={{
            opacity: textOpacity,
            y: textY,
          }}
        >
          <p className="t-callout font-bold tracking-tight text-ink">
            {endingText}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
