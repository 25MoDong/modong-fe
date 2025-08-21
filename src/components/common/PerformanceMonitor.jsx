import { useState, useEffect, useRef } from 'react';

/**
 * Performance monitoring component for development
 * Shows FPS and drag performance metrics
 */
const PerformanceMonitor = ({ isDragging = false, showInProduction = false }) => {
  const [fps, setFps] = useState(0);
  const [dragLatency, setDragLatency] = useState(0);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const dragStartRef = useRef(0);
  const animationFrameRef = useRef(null);

  // Skip in production unless explicitly enabled
  const skip = import.meta.env.PROD && !showInProduction;

  useEffect(() => {
    const measureFPS = () => {
      frameCountRef.current++;
      const now = performance.now();
      const delta = now - lastTimeRef.current;

      if (delta >= 1000) {
        const currentFPS = Math.round((frameCountRef.current * 1000) / delta);
        setFps(currentFPS);
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }

      animationFrameRef.current = requestAnimationFrame(measureFPS);
    };

    if (skip) return undefined;

    animationFrameRef.current = requestAnimationFrame(measureFPS);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [skip]);

  // Track drag performance
  useEffect(() => {
    if (skip) return;

    if (isDragging && dragStartRef.current === 0) {
      dragStartRef.current = performance.now();
    } else if (!isDragging && dragStartRef.current !== 0) {
      const dragDuration = performance.now() - dragStartRef.current;
      setDragLatency(Math.round(dragDuration));
      dragStartRef.current = 0;
    }
  }, [isDragging, skip]);

  return (
    <div className="fixed top-4 left-4 bg-black/80 text-white p-2 rounded-lg text-xs font-mono z-[100]">
      <div>FPS: {fps}</div>
      {isDragging && (
        <div className="text-yellow-400">Dragging...</div>
      )}
      {dragLatency > 0 && (
        <div>Last drag: {dragLatency}ms</div>
      )}
    </div>
  );
};

export default PerformanceMonitor;
