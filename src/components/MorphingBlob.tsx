import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useHue } from './HueEngine';

export const MorphingBlob: React.FC = () => {
  const { hue, isPaused } = useHue();
  const [shapeIndex, setShapeIndex] = useState<number>(0);

  // 4 beautifully crafted, Organic closed-bezier curves
  const shapes = [
    // Shape 1: Tall, fluid egg blob
    "M45.5,-61.2C58,-52.1,66.4,-37.2,71.2,-21.2C75.9,-5.1,76.9,12,71.7,27C66.5,42.1,55.1,55.1,40.9,63.1C26.6,71.1,9.5,74,-5.9,71.6C-21.4,69.2,-35.1,61.4,-46.8,51.3C-58.5,41.2,-68.2,28.8,-71.4,14.6C-74.6,0.3,-71.3,-15.8,-63.9,-29.3C-56.5,-42.8,-45,-53.8,-32.1,-62.7C-19.2,-71.6,-5,-78.4,5,-73.4C14.9,-68.4,29.9,-71.5,45.5,-61.2Z",
    // Shape 2: Flat wide pool blob
    "M51.9,-64.5C66.1,-55.8,75.4,-38.7,78,-20.9C80.6,-3.2,76.5,15.1,68.2,30.3C59.8,45.6,47.1,57.7,31.9,65.3C16.8,72.9,-0.8,76,-18.2,72.8C-35.6,69.6,-52.7,60.2,-64.1,46.1C-75.5,32,-81.1,13.2,-79.8,-5.3C-78.5,-23.7,-70.2,-41.8,-57.1,-50.8C-44,-59.8,-26.1,-59.7,-7.1,-63.4C11.8,-67,37.7,-73.2,51.9,-64.5Z",
    // Shape 3: Indented organic heart blob
    "M48.2,-67.2C59.5,-59.1,63.8,-40,68,-22C72.1,-4.1,76.2,12.7,71.8,27.9C67.3,43.2,54.3,56.8,38.8,64.2C23.3,71.6,5.3,72.7,-12.9,69.6C-31.1,66.6,-49.5,59.3,-61.7,46.7C-73.8,34.1,-79.7,16.2,-78.7,-1C-77.8,-18.2,-70,-34.7,-59.2,-43.3C-48.4,-51.9,-34.7,-52.7,-21.8,-60.1C-9,-67.5,3.1,-81.6,18.1,-80.7C33.1,-79.7,37,-65.2,48.2,-67.2Z",
    // Shape 4: Round starburst blob
    "M41.7,-57.8C53.7,-50.5,62.8,-37.2,68,-22C73.1,-6.9,74.3,10.2,68.3,24.1C62.4,38.1,49.2,48.8,34.9,56.3C20.5,63.8,5,68.1,-11.2,67.3C-27.4,66.6,-44.4,60.8,-56.3,50C-68.2,39.1,-75,23.3,-76.3,7C-77.6,-9.3,-73.4,-26.1,-64.3,-38.7C-55.2,-51.4,-41.1,-59.9,-27,-65.6C-12.8,-71.4,1.4,-74.4,15.6,-72.1C29.8,-69.8,29.7,-65,41.7,-57.8Z"
  ];

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setShapeIndex((prev) => (prev + 1) % shapes.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused, shapes.length]);

  return (
    <div className="relative w-full h-full max-w-[340px] max-h-[340px] aspect-square flex items-center justify-center pointer-events-none select-none">
      {/* Shimmering backdrop bloom */}
      <div 
        className="absolute inset-0 rounded-full blur-[45px] transition-all duration-[2000px]"
        style={{
          background: `radial-gradient(circle, hsla(${hue}, 85%, 60%, 0.18) 0%, rgba(0,0,0,0) 70%)`
        }}
      />
      
      <svg
        viewBox="-100 -100 200 200"
        className="w-full h-full drop-shadow-[0_10px_35px_rgba(var(--live-hue),0.3)] select-none pointer-events-none"
      >
        <defs>
          <linearGradient id="blob-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop 
              offset="0%" 
              stopColor={`hsl(${hue}, 85%, 65%)`} 
            />
            <stop 
              offset="100%" 
              stopColor={`hsl(${(hue + 55) % 360}, 75%, 45%)`} 
            />
          </linearGradient>
          
          <filter id="soft-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <motion.path
          d={shapes[shapeIndex]}
          fill="url(#blob-grad)"
          filter="url(#soft-glow)"
          opacity={0.88}
          animate={{ d: shapes[shapeIndex] }}
          transition={{
            duration: 4.2,
            ease: 'easeInOut',
            repeat: 0,
          }}
          className="cursor-pointer pointer-events-auto"
          whileHover={{
            scale: 1.05,
            rotate: 2,
            transition: { duration: 0.5 }
          }}
          id="morphing-svg-blob-path"
        />
      </svg>
    </div>
  );
};
