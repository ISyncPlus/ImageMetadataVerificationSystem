"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Lenis Smooth Scroll Provider
 *
 * Wraps the application with Lenis for buttery-smooth momentum scrolling
 * matching the feel of devrajchatribin.com. Uses an exponential ease-out
 * interpolation so the page decelerates gently into rest without abrupt stops.
 *
 * The scroll-to buttons in ScrollControls work independently of Lenis:
 * they use the same easing curve via their own rAF loop so clicks respond
 * immediately, while normal wheel/touch scrolling gets the smooth treatment.
 */
export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<InstanceType<typeof import("lenis").default> | null>(null);

  useEffect(() => {
    let destroyed = false;

    const init = async () => {
      try {
        const Lenis = (await import("lenis")).default;

        if (destroyed) return;

        const lenis = new Lenis({
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          touchMultiplier: 2,
          autoRaf: true,
        });

        lenisRef.current = lenis;
      } catch {
        // Lenis unavailable; native scroll is fine
      }
    };

    void init();

    return () => {
      destroyed = true;
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
