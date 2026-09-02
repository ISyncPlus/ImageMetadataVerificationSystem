"use client";

import { motion, useMotionValue, useTransform, useReducedMotion } from "motion/react";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { Alert, Check } from "./icons";

type SpecimenSliderProps = {
  authenticImage: string;
  tamperedImage: string;
  className?: string;
};

/**
 * Forensic Specimen Split-Loupe Comparison Slider
 * 
 * Interactive 1:1 draggable optical wipe with live before/after EXIF telemetry layers.
 */
export default function SpecimenSlider({
  authenticImage,
  tamperedImage,
  className = "",
}: SpecimenSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPos, setSliderPos] = useState(50); // percentage (0 - 100)
  const [isDragging, setIsDragging] = useState(false);
  const reduced = useReducedMotion();

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    updatePosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const updatePosition = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.round((x / rect.width) * 100);
    setSliderPos(percent);
  };

  if (reduced) {
    return (
      <div className={`grid grid-cols-2 gap-4 ${className}`}>
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-line">
          <Image src={authenticImage} alt="Authentic Specimen" fill className="object-cover" />
          <div className="absolute top-2 left-2 px-2 py-1 rounded bg-emerald-950/80 text-emerald-400 text-xs font-mono flex items-center gap-1">
            <Check size={12} /> Authentic RAW
          </div>
        </div>
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-line">
          <Image src={tamperedImage} alt="Tampered Specimen" fill className="object-cover" />
          <div className="absolute top-2 left-2 px-2 py-1 rounded bg-amber-950/80 text-amber-400 text-xs font-mono flex items-center gap-1">
            <Alert size={12} /> Stripped / Tampered
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className={`relative aspect-[16/10] select-none overflow-hidden rounded-2xl border border-line bg-well cursor-ew-resize touch-none ${className}`}
    >
      {/* Background Layer: Tampered / Stripped */}
      <div className="absolute inset-0">
        <Image
          src={tamperedImage}
          alt="Stripped / Tampered Specimen Layer"
          fill
          className="object-cover"
        />
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-card/90 px-2.5 py-1 text-xs font-mono font-medium text-amber-500 backdrop-blur-md shadow-sm">
          <Alert size={14} />
          Stripped / Transcoded
        </div>
      </div>

      {/* Foreground Layer: Authentic (Clipped via sliderPos %) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
      >
        <Image
          src={authenticImage}
          alt="Authentic Telemetry Specimen Layer"
          fill
          className="object-cover"
        />
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-card/90 px-2.5 py-1 text-xs font-mono font-medium text-emerald-500 backdrop-blur-md shadow-sm">
          <Check size={14} />
          Verified Camera RAW
        </div>
      </div>

      {/* Loupe Divider Bar & Handle */}
      <div
        className="absolute top-0 bottom-0 z-20 w-[2px] bg-white shadow-[0_0_12px_rgba(0,0,0,0.5)]"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border border-line bg-card text-ink shadow-lg transition-transform hover:scale-110 active:scale-95">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="8 4 4 12 8 20" />
            <polyline points="16 4 20 12 16 20" />
          </svg>
        </div>
      </div>
    </div>
  );
}
