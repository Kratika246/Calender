"use client";

import { useRef, useCallback, ReactNode } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  radius: number;
}

interface ClickSparkProps {
  children: ReactNode;
  sparkColors: string[];
  className?: string;
}

export function ClickSpark({ children, sparkColors, className = "" }: ClickSparkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);

  const runAnimation = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesRef.current = particlesRef.current.filter((p) => p.life > 0);

    for (const p of particlesRef.current) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.12;
      p.vx *= 0.98;
      p.life -= 1;

      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.1, p.radius * alpha + 0.4), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    if (particlesRef.current.length > 0) {
      animFrameRef.current = requestAnimationFrame(runAnimation);
    }
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;

      const count = 16;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        const speed = 2.5 + Math.random() * 4;
        const color = sparkColors[Math.floor(Math.random() * sparkColors.length)];
        particlesRef.current.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.8,
          life: 38 + Math.floor(Math.random() * 22),
          maxLife: 60,
          color,
          radius: 2.5 + Math.random() * 2.5,
        });
      }

      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = requestAnimationFrame(runAnimation);
    },
    [sparkColors, runAnimation]
  );

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onClick={handleClick}
    >
      {children}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-30"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
