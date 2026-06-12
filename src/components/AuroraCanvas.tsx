import React, { useEffect, useRef } from 'react';
import { useHue } from './HueEngine';

interface Blob {
  xRatio: number;
  yRatio: number;
  phaseX: number;
  phaseY: number;
  speedX: number;
  speedY: number;
  sizeRatio: number;
  hueOffset: number;
}

export const AuroraCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { hue, isPaused, auroraOpacity } = useHue();

  const blobsRef = useRef<Blob[]>([
    { xRatio: 0.25, yRatio: 0.35, phaseX: 0.0, phaseY: 1.5, speedX: 0.0005, speedY: 0.0007, sizeRatio: 0.35, hueOffset: 0 },
    { xRatio: 0.75, yRatio: 0.25, phaseX: 2.1, phaseY: 0.5, speedX: 0.0004, speedY: 0.0006, sizeRatio: 0.45, hueOffset: 45 },
    { xRatio: 0.50, yRatio: 0.65, phaseX: 1.1, phaseY: 3.2, speedX: 0.0006, speedY: 0.0004, sizeRatio: 0.40, hueOffset: -45 },
    { xRatio: 0.20, yRatio: 0.80, phaseX: 4.3, phaseY: 1.2, speedX: 0.0007, speedY: 0.0005, sizeRatio: 0.30, hueOffset: 90 },
    { xRatio: 0.85, yRatio: 0.75, phaseX: 3.0, phaseY: 2.4, speedX: 0.0005, speedY: 0.0008, sizeRatio: 0.38, hueOffset: -90 },
  ]);

  const animationIdRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  // Resize boundaries seamlessly using ResizeObserver
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        // Handle high DPI retina screens
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

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Animation draw loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!isPaused) {
        timeRef.current += 1.5;
      }

      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);

      // Set blend mode
      ctx.globalCompositeOperation = 'lighter';

      blobsRef.current.forEach((blob) => {
        // Calculate orbital drifting
        const dx = Math.sin(timeRef.current * blob.speedX + blob.phaseX) * (w * 0.15);
        const dy = Math.cos(timeRef.current * blob.speedY + blob.phaseY) * (h * 0.15);

        const x = blob.xRatio * w + dx;
        const y = blob.yRatio * h + dy;
        const radius = Math.min(w, h) * blob.sizeRatio;

        // Dynamic color shifting offset matching the main engine
        const blobHue = (hue + blob.hueOffset + 360) % 360;

        // Setup smooth radial gradient with fade-out
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, `hsla(${blobHue}, 80%, 55%, ${auroraOpacity * 0.16})`);
        gradient.addColorStop(0.4, `hsla(${blobHue}, 70%, 50%, ${auroraOpacity * 0.08})`);
        gradient.addColorStop(0.7, `hsla(${blobHue}, 60%, 45%, ${auroraOpacity * 0.02})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationIdRef.current = requestAnimationFrame(draw);
    };

    animationIdRef.current = requestAnimationFrame(draw);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [hue, isPaused, auroraOpacity]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 -z-20 overflow-hidden bg-slate-950 transition-colors duration-700"
      id="aurora-container"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 opacity-100 mix-blend-screen pointer-events-none"
        style={{ filter: 'blur(30px)' }} // Visual softener
        id="aurora-canvas"
      />
      {/* High-quality dark overlay grain or glass glaze */}
      <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_30%,rgba(2,6,23,0.78)] pointer-events-none" />
    </div>
  );
};
