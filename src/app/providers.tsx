"use client";

import { useEffect } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useScroll } from "framer-motion";

import { cn } from "@/lib/utils";

function ScrollIndicator() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed left-0 top-0 z-[60] h-[2px] w-full origin-left bg-gradient-to-r from-neon-blue via-accent to-neon-blue/70"
      style={{ scaleX: scrollYProgress }}
    />
  );
}

function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 45, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 45, mass: 0.4 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      x.set(e.clientX - 10);
      y.set(e.clientY - 10);
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, [x, y]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[70] hidden h-5 w-5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md md:block"
      style={{ translateX: sx, translateY: sy }}
    />
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let lenis: any;
    let raf = 0;
    let cancelled = false;

    (async () => {
      const { default: Lenis } = await import("lenis");
      if (cancelled) return;
      lenis = new Lenis({
        duration: 1.1,
        smoothWheel: true,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
      });

      const loop = (time: number) => {
        lenis.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      lenis?.destroy?.();
    };
  }, []);

  return (
    <>
      <ScrollIndicator />
      <CustomCursor />
      <div className={cn("bg-premium min-h-dvh")}>{children}</div>
      <AnimatePresence />
    </>
  );
}

