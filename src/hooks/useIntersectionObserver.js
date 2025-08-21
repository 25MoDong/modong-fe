import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for tracking visible elements using Intersection Observer
 * Optimized for performance with throttling and proper cleanup
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Intersection threshold (0-1)
 * @param {string} options.rootMargin - Root margin for intersection calculation
 * @param {Function} options.onVisibilityChange - Callback when visibility changes
 * @param {number} options.throttleDelay - Throttle delay in milliseconds
 * @returns {Object} Observer utilities
 */
export const useIntersectionObserver = ({
  threshold = 0.6,
  rootMargin = '0px',
  onVisibilityChange,
  throttleDelay = 100
} = {}) => {
  const [visibleElements, setVisibleElements] = useState(new Set());
  const observerRef = useRef(null);
  const throttleTimeoutRef = useRef(null);
  const callbackRef = useRef(onVisibilityChange);
  
  // Keep callback ref up to date
  useEffect(() => {
    callbackRef.current = onVisibilityChange;
  }, [onVisibilityChange]);

  // Throttled intersection handler
  const handleIntersection = useCallback((entries) => {
    if (throttleTimeoutRef.current) {
      clearTimeout(throttleTimeoutRef.current);
    }
    
    throttleTimeoutRef.current = setTimeout(() => {
      const newVisibleElements = new Set();
      let mostVisibleElement = null;
      let maxVisibilityRatio = 0;
      
      entries.forEach((entry) => {
        const element = entry.target;
        const index = parseInt(element.dataset.index, 10);
        
        if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
          newVisibleElements.add(index);
          
          // Track the most visible element
          if (entry.intersectionRatio > maxVisibilityRatio) {
            maxVisibilityRatio = entry.intersectionRatio;
            mostVisibleElement = {
              index,
              element,
              ratio: entry.intersectionRatio
            };
          }
        }
      });
      
      setVisibleElements(newVisibleElements);
      
      // Call the visibility change callback with the most visible element
      if (callbackRef.current && mostVisibleElement) {
        callbackRef.current(mostVisibleElement);
      }
    }, throttleDelay);
  }, [threshold, throttleDelay]);

  // Initialize observer
  useEffect(() => {
    if (!window.IntersectionObserver) {
      console.warn('IntersectionObserver not supported');
      return;
    }

    observerRef.current = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin,
      threshold: Array.isArray(threshold) ? threshold : [0, threshold, 1]
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (throttleTimeoutRef.current) {
        clearTimeout(throttleTimeoutRef.current);
      }
    };
  }, [handleIntersection, rootMargin, threshold]);

  // Observe element function
  const observe = useCallback((element, index) => {
    if (!observerRef.current || !element) return;
    
    element.dataset.index = index.toString();
    observerRef.current.observe(element);
  }, []);

  // Unobserve element function
  const unobserve = useCallback((element) => {
    if (!observerRef.current || !element) return;
    
    observerRef.current.unobserve(element);
  }, []);

  // Clear all observations
  const disconnect = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    setVisibleElements(new Set());
  }, []);

  return {
    visibleElements,
    observe,
    unobserve,
    disconnect,
    isVisible: (index) => visibleElements.has(index)
  };
};

/**
 * Custom hook specifically for tracking search result items
 * Combines intersection observer with map tracking functionality
 * @param {Array} results - Array of search results
 * @param {Function} onVisibleItemChange - Callback when visible item changes
 * @returns {Object} Search result tracking utilities
 */
export const useSearchResultTracking = (results = [], onVisibleItemChange) => {
  const [currentVisibleIndex, setCurrentVisibleIndex] = useState(-1);
  const elementRefs = useRef(new Map());
  
  const handleVisibilityChange = useCallback((mostVisible) => {
    const { index } = mostVisible;
    
    if (index !== currentVisibleIndex && results[index]) {
      setCurrentVisibleIndex(index);
      onVisibleItemChange?.(results[index], index);
    }
  }, [currentVisibleIndex, results, onVisibleItemChange]);

  const { observe, unobserve, disconnect } = useIntersectionObserver({
    threshold: 0.6, // Element must be 60% visible
    rootMargin: '-20% 0px -20% 0px', // Focus on center area
    onVisibilityChange: handleVisibilityChange,
    throttleDelay: 150 // Smooth but not too frequent updates
  });

  // Register element ref
  const registerElement = useCallback((element, index) => {
    if (!element) return;
    
    // Clean up old element if exists
    const oldElement = elementRefs.current.get(index);
    if (oldElement && oldElement !== element) {
      unobserve(oldElement);
    }
    
    // Store and observe new element
    elementRefs.current.set(index, element);
    observe(element, index);
  }, [observe, unobserve]);

  // Cleanup when results change
  useEffect(() => {
    const refs = elementRefs.current;
    return () => {
      disconnect();
      if (refs && refs.clear) refs.clear();
    };
  }, [results, disconnect]);

  return {
    currentVisibleIndex,
    registerElement
  };
};
