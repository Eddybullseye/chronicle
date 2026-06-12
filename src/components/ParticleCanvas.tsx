import React, { useEffect, useRef } from 'react';
import { useHue } from './HueEngine';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  hueOffset: number;
  opacity: number;
  pulseSpeed: number;
  pulsePhase: number;
}

export const ParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { hue, isPaused, particleCount } = useHue();

  const particlesRef = useRef<Particle[]>([]);
  const animationIdRef = useRef<number | null>(null);

  // Initialize and scale particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);

    const particles: Particle[] = [];
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 1.8 + 0.6,
        speedX: (Math.random() - 0.5) * 0.15,
        speedY: -(Math.random() * 0.25 + 0.08), // Rising upwards
        hueOffset: (Math.random() - 0.5) * 45, // Color variations
        opacity: Math.random() * 0.5 + 0.1,
        pulseSpeed: Math.random() * 0.015 + 0.005,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }
    particlesRef.current = particles;
  }, []);

  // Resize boundaries
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.scale(dpr, dpr);
        }
      }
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  // Frame Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);

      // Render only the selected count from context
      const activeParticles = particlesRef.current.slice(0, particleCount);

      activeParticles.forEach((p) => {
        // Physical position updating
        if (!isPaused) {
          p.y += p.speedY;
          p.x += p.speedX;
          p.pulsePhase += p.pulseSpeed;

          // Recycle bottom-to-top
          if (p.y < -10) {
            p.y = h + 10;
            p.x = Math.random() * w;
          }
          // Wrap left-to-right boundaries
          if (p.x < -10) p.x = w + 10;
          if (p.x > w + 10) p.x = -10;
        }

        // Sine opacity pulsing
        const displayOpacity = Math.max(0.05, Math.min(0.7, p.opacity + Math.sin(p.pulsePhase) * 0.15));
        const pColor = `hsla(${(hue + p.hueOffset + 360) % 360}, 85%, 65%, ${displayOpacity})`;

        ctx.fillStyle = pColor;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Soft shimmer halo for larger stellar dust specs
        if (p.size > 1.8) {
          ctx.fillStyle = `hsla(${(hue + p.hueOffset + 360) % 360}, 85%, 65%, ${displayOpacity * 0.25})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationIdRef.current = requestAnimationFrame(drawParticles);
    };

    animationIdRef.current = requestAnimationFrame(drawParticles);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [hue, isPaused, particleCount]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 -z-15 pointer-events-none overflow-hidden"
      id="particle-container"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 opacity-80 pointer-events-none mix-blend-screen"
        id="particle-canvas"
      />
    </div>
  );
};
