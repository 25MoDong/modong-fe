import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * High-performance drag hook optimized for smooth dragging using RAF and throttling
 * @param {Object} options - Configuration options
 * @param {number} options.initialValue - Initial value for the dragged property
 * @param {number} options.minValue - Minimum allowed value
 * @param {number} options.maxValue - Maximum allowed value
 * @param {Function} options.onDragStart - Callback when drag starts
 * @param {Function} options.onDragEnd - Callback when drag ends
 * @param {Function} options.transform - Transform function for converting delta to value
 * @returns {Object} Drag state and handlers
 */
export const useDrag = ({
  initialValue = 0,
  minValue = 0,
  maxValue = 100,
  onDragStart,
  onDragEnd,
  onValueChange,
  snapToPresets = [],
  snapThreshold = 5,
  preventCloseOnShortDrag = true,
  transform = (delta, startValue) => startValue + delta
}) => {
  const [value, setValue] = useState(initialValue);
  const [isDragging, setIsDragging] = useState(false);
  
  // Refs for tracking drag state without causing re-renders
  const dragStateRef = useRef({
    isDragging: false,
    startY: 0,
    startValue: initialValue,
    lastUpdateTime: 0,
    animationId: null,
    totalDragDistance: 0
  });
  
  const latestValueRef = useRef(initialValue);
  
  // Update refs when value changes
  useEffect(() => {
    latestValueRef.current = value;
  }, [value]);

  // Find closest preset for snapping
  const findClosestPreset = useCallback((currentValue, dragDistance = 0) => {
    if (snapToPresets.length === 0) return currentValue;
    
    // Prevent snapping to very low values if drag was minimal (prevent accidental close)
    // But allow snapping to defined presets (like COLLAPSED at 20%)
    if (preventCloseOnShortDrag && dragDistance < 50 && currentValue < 15) {
      // Only prevent snapping to extremely low values (below 15%)
      // Allow snapping to preset values like COLLAPSED (20%)
      const validPresets = snapToPresets.filter(preset => preset >= 15);
      if (validPresets.length > 0) {
        let closest = validPresets[0];
        let minDistance = Math.abs(currentValue - closest);
        
        validPresets.forEach(preset => {
          const distance = Math.abs(currentValue - preset);
          if (distance < minDistance) {
            minDistance = distance;
            closest = preset;
          }
        });
        return closest;
      }
    }
    
    let closest = currentValue;
    let minDistance = Infinity;
    
    snapToPresets.forEach(preset => {
      const distance = Math.abs(currentValue - preset);
      if (distance < minDistance) {
        minDistance = distance;
        closest = preset;
      }
    });
    
    // Only snap if within threshold OR if we're very close to any preset
    if (minDistance <= snapThreshold || minDistance <= 10) {
      return closest;
    }
    
    return closest;
  }, [snapToPresets, snapThreshold, preventCloseOnShortDrag]);

  // RAF-based smooth update function
  const updateValue = useCallback((newValue, shouldSnap = false) => {
    // Cancel any pending animation frame
    if (dragStateRef.current.animationId) {
      cancelAnimationFrame(dragStateRef.current.animationId);
    }
    
    dragStateRef.current.animationId = requestAnimationFrame(() => {
      // Apply constraints
      let clampedValue = Math.max(minValue, Math.min(maxValue, newValue));
      
      // Apply snapping if requested
      if (shouldSnap) {
        clampedValue = findClosestPreset(clampedValue);
      }
      
      setValue(clampedValue);
      latestValueRef.current = clampedValue;
      dragStateRef.current.animationId = null;
      
      // Notify about value changes
      onValueChange?.(clampedValue);
    });
  }, [minValue, maxValue, findClosestPreset, onValueChange]);

  // Throttled drag move handler for optimal performance
  const handleDragMove = useCallback((clientY) => {
    if (!dragStateRef.current.isDragging) return;
    
    const now = performance.now();
    // Throttle updates to ~60fps for smooth performance
    if (now - dragStateRef.current.lastUpdateTime < 16) return;
    
    dragStateRef.current.lastUpdateTime = now;
    
    const deltaY = dragStateRef.current.startY - clientY;
    const newValue = transform(deltaY, dragStateRef.current.startValue);
    
    // Track total drag distance
    dragStateRef.current.totalDragDistance = Math.abs(deltaY);
    
    updateValue(newValue);
  }, [transform, updateValue]);

  // Optimized event handlers
  const handleStart = useCallback((e) => {
    e.preventDefault();
    
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    dragStateRef.current = {
      isDragging: true,
      startY: clientY,
      startValue: latestValueRef.current,
      lastUpdateTime: performance.now(),
      animationId: null,
      totalDragDistance: 0
    };
    
    setIsDragging(true);
    onDragStart?.(latestValueRef.current);
  }, [onDragStart]);

  const handleMove = useCallback((e) => {
    if (!dragStateRef.current.isDragging) return;
    
    e.preventDefault();
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    handleDragMove(clientY);
  }, [handleDragMove]);

  const handleEnd = useCallback(() => {
    if (!dragStateRef.current.isDragging) return;
    
    // Cancel any pending animation frame
    if (dragStateRef.current.animationId) {
      cancelAnimationFrame(dragStateRef.current.animationId);
      dragStateRef.current.animationId = null;
    }
    
    dragStateRef.current.isDragging = false;
    setIsDragging(false);
    
    // Apply snapping after drag ends
    const currentValue = latestValueRef.current;
    const dragDistance = dragStateRef.current.totalDragDistance;
    const snappedValue = findClosestPreset(currentValue, dragDistance);
    
    if (Math.abs(currentValue - snappedValue) > 0.1) {
      // Smooth animation to snapped position
      updateValue(snappedValue, true);
    }
    
    onDragEnd?.(snappedValue);
  }, [onDragEnd, findClosestPreset, updateValue]);

  // Global event listeners for smooth dragging
  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e) => handleMove(e);
      const handleTouchMove = (e) => handleMove(e);
      const handleMouseUp = () => handleEnd();
      const handleTouchEnd = () => handleEnd();
      
      // Use passive: false to allow preventDefault
      const eventOptions = { passive: false };
      
      document.addEventListener('mousemove', handleMouseMove, eventOptions);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, eventOptions);
      document.addEventListener('touchend', handleTouchEnd);
      
      // Prevent text selection during drag
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove, eventOptions);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove, eventOptions);
        document.removeEventListener('touchend', handleTouchEnd);
        
        // Restore text selection
        document.body.style.userSelect = '';
        document.body.style.webkitUserSelect = '';
      };
    }
  }, [isDragging, handleMove, handleEnd]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (dragStateRef.current.animationId) {
        cancelAnimationFrame(dragStateRef.current.animationId);
      }
    };
  }, []);

  return {
    value,
    isDragging,
    dragHandlers: {
      onMouseDown: handleStart,
      onTouchStart: handleStart
    },
    setValue: updateValue
  };
};