"use client";

import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";
import React, { useRef } from "react";

type TiltCardProps = {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glowColor?: string;
};

/**
 * Physical 3D Gyroscopic Tilt Card with Dynamic Specular Sheen
 * 
 * Tracks pointer coordinates and tilts along X/Y axes with 3D perspective.
 * Features a dynamic specular reflection that follows the pointer.
 * Settles with critically damped spring physics when released.
 */
export default function TiltCard({
  children,
  className = "",
  maxTilt = 6,
  glowColor = "rgba(224, 75, 40, 0.08)",
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Normalized pointer coordinates (-0.5 to 0.5)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Smooth critically damped springs
  const springConfig = { damping: 25, stiffness: 220, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [maxTilt, -maxTilt]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-maxTilt, maxTilt]), springConfig);

  /* Computed before any early return: hooks must run in the same order on
     every render, and the reduced-motion branch below returns early. */
  const sheen = useTransform(
    [rawX, rawY],
    ([x, y]) =>
      `radial-gradient(400px circle at ${x}px ${y}px, ${glowColor}, transparent 70%)`
  );

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    rawX.set(x);
    rawY.set(y);
    mouseX.set(x / rect.width - 0.5);
    mouseY.set(y / rect.height - 0.5);
  };

  const handlePointerLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      whileHover={{ scale: 1.012 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Dynamic Specular Sheen */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
        style={{ background: sheen }}
      />
      <div style={{ transform: "translateZ(12px)" }}>{children}</div>
    </motion.div>
  );
}
