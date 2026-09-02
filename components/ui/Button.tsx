"use client";

import Link from "next/link";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import type { ComponentProps, PointerEvent, ReactNode } from "react";
import { ArrowRight } from "./icons";
import { springSnappy } from "../../lib/motion";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "quiet";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  /* Every variant addresses colour through tokens, so a button dropped onto an
     ink or accent field re-reads its palette from the band and stays correct
     without a single variant override. */
  primary:
    "bg-accent text-accent-ink border border-transparent shadow-accent hover:brightness-[1.08]",
  secondary:
    "bg-surface text-ink border border-line shadow-card hover:border-line-strong",
  ghost: "bg-transparent text-ink-2 border border-transparent hover:text-ink",
  quiet: "bg-well text-ink border border-transparent hover:bg-surface-2",
  danger: "bg-bad-wash text-bad border border-bad/25 hover:brightness-105",
};

/* Capsules, and never below a comfortable touch target. Padding is asymmetric
   when an arrow is present: the nested well sits flush inside the right edge. */
const SIZES: Record<Size, string> = {
  sm: "min-h-9 px-3.5 py-1.5 t-footnote rounded-full",
  md: "min-h-11 px-5 py-2.5 t-callout rounded-full",
  lg: "min-h-12 px-7 py-3 t-body rounded-full",
};

const ARROW_SIZES: Record<Size, string> = {
  sm: "min-h-9 py-1 pl-3.5 pr-1 t-footnote rounded-full",
  md: "min-h-11 py-1.5 pl-5 pr-1.5 t-callout rounded-full",
  lg: "min-h-12 py-2 pl-7 pr-2 t-body rounded-full",
};

const WELL_SIZES: Record<Size, string> = {
  sm: "h-7 w-7",
  md: "h-8 w-8",
  lg: "h-9 w-9",
};

const base =
  "group relative inline-flex items-center justify-center gap-2 font-medium select-none " +
  "transition-[background-color,border-color,color,filter,box-shadow] duration-200 " +
  "disabled:pointer-events-none disabled:opacity-40";

const buttonClass = (
  variant: Variant,
  size: Size,
  arrow: boolean,
  className: string
) =>
  `${base} ${VARIANTS[variant]} ${(arrow ? ARROW_SIZES : SIZES)[size]} ${className}`;

/**
 * The trailing arrow never sits naked beside the label. It gets its own well,
 * flush with the button's inner padding, and drifts diagonally on hover — the
 * label stays still while the arrow leans toward where it is taking you.
 */
function ArrowWell({ size }: { size: Size }) {
  return (
    <span
      aria-hidden
      className={`ml-1 flex shrink-0 items-center justify-center rounded-full bg-current/15 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105 ${WELL_SIZES[size]}`}
    >
      <ArrowRight size={size === "lg" ? 16 : 14} strokeWidth={2.2} />
    </span>
  );
}

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

/**
 * Pull toward the cursor.
 *
 * Written entirely with motion values: the pointer never touches React state,
 * because a `useState` here would re-render the subtree on every mousemove and
 * collapse frame rate on anything but a desktop. The element is measured from
 * `event.currentTarget`, so the hook needs no ref of its own — which also
 * keeps it out of the render path entirely.
 *
 * Touch and pen are excluded: there is no cursor to be magnetic toward, and
 * the drift would fight the tap.
 */
const useMagnetic = (strength: number, enabled: boolean) => {
  const x = useSpring(useMotionValue(0), { stiffness: 260, damping: 22, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 260, damping: 22, mass: 0.4 });

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (!enabled || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const onPointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return { style: enabled ? { x, y } : undefined, onPointerMove, onPointerLeave };
};

type Shared = {
  variant?: Variant;
  size?: Size;
  /** Renders the nested trailing arrow well. */
  arrow?: boolean;
  /** Drift toward the pointer. Reserve it for a page's single main action. */
  magnetic?: boolean;
  children: ReactNode;
};

type ButtonProps = ComponentProps<typeof motion.button> & Shared;

export function Button({
  variant = "secondary",
  size = "md",
  arrow = false,
  magnetic = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const press = usePress();
  const reduced = useReducedMotion();
  const pull = useMagnetic(0.18, magnetic && !reduced);

  return (
    <motion.button
      type="button"
      onPointerMove={pull.onPointerMove}
      onPointerLeave={pull.onPointerLeave}
      {...press}
      {...props}
      style={{ ...pull.style, ...(props.style ?? {}) }}
      className={buttonClass(variant, size, arrow, className)}
    >
      {children}
      {arrow ? <ArrowWell size={size} /> : null}
    </motion.button>
  );
}

const MotionLink = motion.create(Link);

type ButtonLinkProps = ComponentProps<typeof MotionLink> & Shared;

export function ButtonLink({
  variant = "secondary",
  size = "md",
  arrow = false,
  magnetic = false,
  className = "",
  children,
  ...props
}: ButtonLinkProps) {
  const press = usePress();
  const reduced = useReducedMotion();
  const pull = useMagnetic(0.18, magnetic && !reduced);

  return (
    <MotionLink
      onPointerMove={pull.onPointerMove}
      onPointerLeave={pull.onPointerLeave}
      {...press}
      {...props}
      style={{ ...pull.style, ...(props.style ?? {}) }}
      className={buttonClass(variant, size, arrow, className)}
    >
      {children}
      {arrow ? <ArrowWell size={size} /> : null}
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
