"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import type { ComponentProps, ReactNode } from "react";
import { springSnappy } from "../../lib/motion";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-accent text-accent-ink border border-transparent hover:brightness-110",
  secondary:
    "bg-surface text-ink border border-line hover:border-line-strong shadow-card",
  ghost: "bg-transparent text-ink-2 border border-transparent hover:text-ink",
  danger: "bg-bad-wash text-bad border border-transparent hover:brightness-105",
};

/* Capsules, and never below a comfortable touch target. */
const SIZES: Record<Size, string> = {
  sm: "min-h-9 px-3.5 py-1.5 t-footnote rounded-full",
  md: "min-h-11 px-5 py-2.5 t-callout rounded-full",
  lg: "min-h-12 px-7 py-3 t-body rounded-full",
};

const base =
  "inline-flex items-center justify-center gap-2 font-medium select-none " +
  "transition-[background-color,border-color,color,filter] duration-150 " +
  "disabled:pointer-events-none disabled:opacity-40";

const buttonClass = (variant: Variant, size: Size, className: string) =>
  `${base} ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

/**
 * Feedback lives on the press, not the release. Motion's tap gesture fires on
 * pointer-down, so the scale lands the instant the finger does; waiting for
 * click would read as dead.
 */
const usePress = () => {
  const reduced = useReducedMotion();
  return {
    whileTap: reduced ? { opacity: 0.7 } : { scale: 0.97 },
    transition: springSnappy,
  };
};

type ButtonProps = ComponentProps<typeof motion.button> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
};

export function Button({
  variant = "secondary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const press = usePress();
  return (
    <motion.button
      type="button"
      {...press}
      {...props}
      className={buttonClass(variant, size, className)}
    >
      {children}
    </motion.button>
  );
}

const MotionLink = motion.create(Link);

type ButtonLinkProps = ComponentProps<typeof MotionLink> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
};

export function ButtonLink({
  variant = "secondary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonLinkProps) {
  const press = usePress();
  return (
    <MotionLink
      {...press}
      {...props}
      className={buttonClass(variant, size, className)}
    >
      {children}
    </MotionLink>
  );
}

/** A whole row or tile that behaves as one pressable target. */
export function Pressable({
  className = "",
  children,
  ...props
}: ComponentProps<typeof motion.button>) {
  const reduced = useReducedMotion();
  return (
    <motion.button
      type="button"
      whileTap={reduced ? { opacity: 0.85 } : { scale: 0.985 }}
      transition={springSnappy}
      {...props}
      className={`text-left ${className}`}
    >
      {children}
    </motion.button>
  );
}
