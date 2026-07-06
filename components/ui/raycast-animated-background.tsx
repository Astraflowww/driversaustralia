'use client';

import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import Script from "next/script";

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    
    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

export const RaycastAnimatedBackground = () => {
  const { width, height } = useWindowSize();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const sceneRef = useRef<any>(null);

  useEffect(() => {
    if (!scriptLoaded || !containerRef.current) return;

    let active = true;
    let sceneInstance: any = null;

    const initScene = async () => {
      try {
        const UnicornStudio = (window as any).UnicornStudio;
        if (!UnicornStudio || !UnicornStudio.addScene) {
          console.warn("UnicornStudio SDK not loaded yet.");
          return;
        }

        // Generate a unique ID for the scene container
        if (!containerRef.current!.id) {
          containerRef.current!.id = `unicorn-scene-${Math.random().toString(36).substring(2, 9)}`;
        }

        // Clean up any existing scene to prevent duplicates/errors
        if (sceneRef.current) {
          sceneRef.current.destroy();
          sceneRef.current = null;
        }

        const scene = await UnicornStudio.addScene({
          elementId: containerRef.current!.id,
          projectId: "cbmTT38A0CcuYxeiyj5H",
          scale: 1,
          dpi: 1.5,
          fps: 60,
          lazyLoad: true,
          production: true
        });

        if (active) {
          sceneInstance = scene;
          sceneRef.current = scene;
        } else {
          scene.destroy();
        }
      } catch (err) {
        console.error("Failed to initialize Unicorn Studio scene:", err);
      }
    };

    initScene();

    return () => {
      active = false;
      if (sceneInstance) {
        sceneInstance.destroy();
        sceneRef.current = null;
      }
    };
  }, [scriptLoaded]);

  // Handle dynamic size updates
  useEffect(() => {
    if (sceneRef.current && sceneRef.current.resize) {
      sceneRef.current.resize();
    }
  }, [width, height]);

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.9/dist/unicornStudio.umd.js"
        onLoad={() => setScriptLoaded(true)}
        onError={(e) => console.error("Unicorn Studio script failed to load:", e)}
      />
      <div className={cn("flex flex-col items-center w-full h-full relative")}>
        <div 
          ref={containerRef}
          className="w-full h-full"
          style={{ 
            width: typeof width === 'number' ? `${width}px` : width,
            height: typeof height === 'number' ? `${height}px` : height,
            position: 'relative'
          }}
        />
      </div>
    </>
  );
};

