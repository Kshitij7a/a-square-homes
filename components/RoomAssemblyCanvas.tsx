"use client";

import React, { useEffect, useRef, useState } from "react";
import { useScroll, useSpring, useTransform, motion } from "framer-motion";

interface RoomAssemblyCanvasProps {
  children?: React.ReactNode;
}

const TOTAL_FRAMES = 121; // frame_0.webp to frame_120.webp

export default function RoomAssemblyCanvas({ children }: RoomAssemblyCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Preload images
  useEffect(() => {
    let loaded = 0;
    const imgArray: HTMLImageElement[] = [];

    const loadImages = async () => {
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        const img = new Image();
        img.src = `/sequence/frame_${i}.webp`;
        await new Promise((resolve) => {
          img.onload = () => {
            loaded++;
            setLoadedCount(loaded);
            resolve(true);
          };
          img.onerror = () => {
            loaded++;
            setLoadedCount(loaded);
            resolve(true);
          };
        });
        imgArray.push(img);
      }
      setImages(imgArray);
      setTimeout(() => setIsLoaded(true), 500); // slight delay for smooth transition
    };

    loadImages();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Draw on canvas based on scroll progress
  useEffect(() => {
    if (!isLoaded || images.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      const progress = smoothProgress.get();
      let frameIndex = Math.floor(progress * TOTAL_FRAMES);
      
      // Safety bounds
      if (frameIndex >= TOTAL_FRAMES) frameIndex = TOTAL_FRAMES - 1;
      if (frameIndex < 0) frameIndex = 0;

      const img = images[frameIndex];
      if (img && img.complete) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Calculate aspect ratio to fit / cover
        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = img.width / img.height;

        let drawWidth, drawHeight, offsetX, offsetY;

        // "contain" logic (matching user instruction for mobile scaling)
        if (canvasRatio > imgRatio) {
          drawHeight = canvas.height;
          drawWidth = img.width * (canvas.height / img.height);
          offsetX = (canvas.width - drawWidth) / 2;
          offsetY = 0;
        } else {
          drawWidth = canvas.width;
          drawHeight = img.height * (canvas.width / img.width);
          offsetX = 0;
          offsetY = (canvas.height - drawHeight) / 2;
        }

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [isLoaded, images, smoothProgress]);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Init sizes

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const progressPercentage = Math.round((loadedCount / TOTAL_FRAMES) * 100);

  // "Scroll to Construct" indicator opacity
  const indicatorOpacity = useTransform(smoothProgress, [0, 0.1], [1, 0]);

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: "400vh" }}>
      {/* Loading Overlay */}
      {!isLoaded && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505]">
          <div className="w-64 max-w-[80vw]">
            <div className="h-[1px] w-full bg-white/10 overflow-hidden relative">
              <motion.div
                className="absolute top-0 left-0 h-full bg-white/60"
                initial={{ width: "0%" }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <div className="mt-4 text-center">
              <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-white/50">
                Constructing Space {progressPercentage}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Canvas Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#050505]">
        <canvas
          ref={canvasRef}
          className="block w-full h-full object-contain"
        />

        {/* Scroll Indicator */}
        <motion.div
          style={{ opacity: indicatorOpacity }}
          className="absolute top-10 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none"
        >
          <span className="font-sans text-[10px] tracking-widest uppercase text-white/50 mb-3">
            Scroll to Construct
          </span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-white/30 to-transparent" />
        </motion.div>

        {/* Scrollytelling Overlay Content */}
        {children}
      </div>
    </div>
  );
}
