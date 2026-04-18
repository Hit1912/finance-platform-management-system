import { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * ParticleField — Renders a field of static and slowly floating particles
 * to create a premium bokeh/starry effect in the background.
 */
export function ParticleField() {
  const particles = useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 2,
      opacity: Math.random() * 0.3 + 0.1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
      isPurple: i % 3 === 0
    }));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-transparent">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className={cn(
            "absolute rounded-full blur-[1px]",
            p.isPurple ? "bg-accent-purple" : "bg-accent"
          )}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, Math.random() * 50 - 25],
            opacity: [p.opacity, p.opacity * 2.5, p.opacity],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}

      {/* Adding some subtle small static dots as well */}
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={`static-${i}`}
          className={cn(
            "absolute rounded-full",
             i % 4 === 0 ? "bg-accent-purple/40" : "bg-accent/40"
          )}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: 1.5,
            height: 1.5,
          }}
        />
      ))}
    </div>
  );
}
