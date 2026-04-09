"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ParticleType } from "@/lib/themes";

const PARTICLE_SETS: Record<ParticleType, string[]> = {
  snowflake: ["❄", "❅", "❆", "✦", "⁕", "·"],
  petal:     ["🌸", "✿", "❀", "🌺", "˖", "·"],
  leaf:      ["🍂", "🍁", "🍃", "◌", "·"],
  sparkle:   ["✦", "⭐", "✶", "⊛", "✷", "·"],
  raindrop:  ["|", "⋮", "⠇", "⠂", "│", "⁚"],
  firefly:   ["◉", "○", "⊙", "·", "✦", "✶"],
  star:      ["★", "✦", "✶", "✷", "·", "⭐"],
};

interface Particle {
  id: number;
  char: string;
  left: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
  rotateDelta: number;
  driftX: number;
  translateZ: number;
  startY: number;
  endY: number;
}

function makeParticle(id: number, chars: string[]): Particle {
  return {
    id,
    char: chars[Math.floor(Math.random() * chars.length)],
    left: Math.random() * 100,
    delay: Math.random() * 7,
    duration: 6 + Math.random() * 10,
    size: 0.5 + Math.random() * 1.0,
    opacity: 0.2 + Math.random() * 0.65,
    rotateDelta: (Math.random() - 0.5) * 400,
    driftX: (Math.random() - 0.5) * 70,
    translateZ: Math.random() * 100 - 50,
    startY: -(10 + Math.random() * 20),
    endY: 115 + Math.random() * 10,
  };
}

interface SeasonalParticlesProps {
  particleType: ParticleType;
  accent: string;
  count?: number;
}

export function SeasonalParticles({
  particleType,
  accent,
  count = 24,
}: SeasonalParticlesProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const chars = PARTICLE_SETS[particleType] ?? PARTICLE_SETS.sparkle;

  // Re-generate when particleType changes
  const particles = useMemo(
    () => Array.from({ length: count }, (_, i) => makeParticle(i, chars)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [particleType, count]
  );

  if (!mounted) return null;

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ perspective: "700px", perspectiveOrigin: "50% 30%" }}
      aria-hidden="true"
    >
      {particles.map((p) => (
        <motion.div
          key={`${particleType}-${p.id}`}
          className="absolute select-none will-change-transform"
          style={{
            left: `${p.left}%`,
            top: 0,
            fontSize: `${p.size}rem`,
            color: accent,
            opacity: p.opacity,
            translateZ: p.translateZ,
          }}
          initial={{ y: `${p.startY}vh`, x: 0, rotate: 0 }}
          animate={{
            y: `${p.endY}vh`,
            x: [0, p.driftX * 0.4, p.driftX, p.driftX * 0.6, 0],
            rotate: p.rotateDelta,
          }}
          transition={{
            y:      { duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" },
            x:      { duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" },
          }}
        >
          {p.char}
        </motion.div>
      ))}
    </div>
  );
}
