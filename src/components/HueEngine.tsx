import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface HueContextType {
  hue: number;
  speed: number;
  setSpeed: (speed: number) => void;
  isPaused: boolean;
  setIsPaused: (paused: boolean) => void;
  reducedMotion: boolean;
  particleCount: number;
  setParticleCount: (count: number) => void;
  auroraOpacity: number;
  setAuroraOpacity: (opacity: number) => void;
  activeAccentColor: string; // Dynamic hex/hsl computed state
}

const HueContext = createContext<HueContextType | undefined>(undefined);

export const useHue = () => {
  const context = useContext(HueContext);
  if (!context) {
    throw new Error('useHue must be used within a HueProvider');
  }
  return context;
};

export const HueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hue, setHue] = useState<number>(190); // Start at nice neon teal-blue
  const [speed, setSpeed] = useState<number>(0.15); // Degree shifting speed per frame
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [particleCount, setParticleCount] = useState<number>(45);
  const [auroraOpacity, setAuroraOpacity] = useState<number>(0.65);

  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);
  const hueRef = useRef<number>(190);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    setIsPaused(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
      setIsPaused(e.matches);
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // requestAnimationFrame Loop with delta timing
  useEffect(() => {
    const updateHue = (time: number) => {
      if (previousTimeRef.current !== null) {
        // Delta timing to ensure stable speeds regardless of frame-rate differences
        const deltaTime = Math.min(time - previousTimeRef.current, 100); // Caps delta
        
        if (!isPaused) {
          // Increment hue and bind within 0-359 circular boundary
          hueRef.current = (hueRef.current + speed * (deltaTime / 16.67)) % 360;
          setHue(Math.round(hueRef.current));
          
          // Inject value directly into :root as a CSS custom variable --live-hue
          // This allows standard CSS and Tailwind classes to sync instantly
          document.documentElement.style.setProperty('--live-hue', String(Math.round(hueRef.current)));
        }
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(updateHue);
    };

    requestRef.current = requestAnimationFrame(updateHue);

    // Visibility API support (Pauses canvas and loops in the background when tab is inactive)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
          requestRef.current = null;
        }
        previousTimeRef.current = null;
      } else {
        if (!requestRef.current) {
          requestRef.current = requestAnimationFrame(updateHue);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isPaused, speed]);

  const activeAccentColor = `hsl(${hue}, 85%, 60%)`;

  return (
    <HueContext.Provider
      value={{
        hue,
        speed,
        setSpeed,
        isPaused,
        setIsPaused,
        reducedMotion,
        particleCount,
        setParticleCount,
        auroraOpacity,
        setAuroraOpacity,
        activeAccentColor,
      }}
    >
      {children}
    </HueContext.Provider>
  );
};
