import type { Transition } from "motion/react";

/**
 * Motion vocabulary for the app.
 *
 * Apple describes a spring with two designer-facing parameters — damping ratio
 * (how much it overshoots) and response (how quickly it reaches the target, in
 * seconds). Motion's `bounce` + `duration` map onto them directly:
 *
 *   bounce ≈ 1 − dampingRatio      duration ≈ response
 *
 * House style: critically damped (bounce 0) everywhere by default. Overshoot is
 * reserved for motion the user's own gesture put in flight — a flick, a throw,
 * a drag release. Bounce on a menu that merely appeared feels wrong.
 */

/** Move / reposition — damping 1.0, response 0.4. */
export const springMove: Transition = {
  type: "spring",
  bounce: 0,
  duration: 0.4,
};

/** Small state changes that should feel immediate — damping 1.0, response 0.3. */
export const springSnappy: Transition = {
  type: "spring",
  bounce: 0,
  duration: 0.3,
};

/** Drawer / sheet — damping 0.8, response 0.3. */
export const springSheet: Transition = {
  type: "spring",
  bounce: 0.2,
  duration: 0.3,
};

/** Non-gestural cross-fade, and the reduced-motion substitute for everything. */
export const fade: Transition = { duration: 0.2, ease: "easeOut" };

/**
 * Where a flick would come to rest, using the same exponential decay as scroll
 * deceleration. Snap to the target nearest *this* point rather than nearest the
 * release point — that is what makes a flick feel like it throws the element.
 */
export const project = (velocity: number, decelerationRate = 0.998): number =>
  ((velocity / 1000) * decelerationRate) / (1 - decelerationRate);

/**
 * Progressive resistance past a boundary. The further out, the less the element
 * follows the pointer — real things slow before they stop.
 */
export const rubberband = (
  overshoot: number,
  dimension: number,
  constant = 0.55
): number =>
  (overshoot * dimension * constant) /
  (dimension + constant * Math.abs(overshoot));

/** Cascade delay for a list entrance. Capped so long lists never crawl. */
export const stagger = (index: number, step = 0.045, max = 0.3): number =>
  Math.min(index * step, max);

/** Section-scale arrival: heavier, slower, with room for a focus pull. */
export const springArrive: Transition = {
  type: "spring",
  bounce: 0,
  duration: 0.7,
};

/**
 * CSS easing curves, mirrored from globals.css so a Motion transition and a
 * plain CSS transition on the same element cannot drift apart.
 */
export const easeOutExpo = [0.16, 1, 0.3, 1] as const;
export const easeOutQuint = [0.22, 1, 0.36, 1] as const;
export const easeSpring = [0.32, 0.72, 0, 1] as const;

/**
 * Parent/child pair for a coordinated cascade. Both must live in the same
 * client component tree for `staggerChildren` to reach the children at all.
 */
export const listParent = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.055, delayChildren: 0.04 } },
};

export const listChild = {
  hidden: { opacity: 0, y: 14 },
  shown: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", bounce: 0, duration: 0.55 },
  },
};
