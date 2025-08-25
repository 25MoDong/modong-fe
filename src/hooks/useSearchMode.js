import { useState, useCallback } from 'react';

/**
 * Search mode states matching Kakao Map UX patterns
 */
export const SEARCH_MODES = {
  INACTIVE: 'inactive',    // No search active - show navigation
  ACTIVE: 'active',       // Search results active - hide navigation
  FOCUSED: 'focused'      // Full focus on results - hide navigation + limit map interaction
};

/**
 * Search modal height presets based on Kakao Map UX
 */
export const HEIGHT_PRESETS = {
  COLLAPSED: 16,  // Minimized view - map focused (15-17%)
  DEFAULT: 50,    // Balanced view - optimal for tracking  
  EXPANDED: 80    // List focused - detailed exploration
};

/**
 * Custom hook for managing search mode and modal states
 * Provides Kakao Map-like UX with navigation hiding and height presets
 */
export const useSearchMode = () => {
  const [searchMode, setSearchMode] = useState(SEARCH_MODES.INACTIVE);
  const [modalHeight, setModalHeight] = useState(HEIGHT_PRESETS.DEFAULT);
  const [hasSearchResults, setHasSearchResults] = useState(false);

  // Enter search mode with results
  const enterSearchMode = useCallback((results = []) => {
    if (results.length > 0) {
      setHasSearchResults(true);
      setSearchMode(SEARCH_MODES.ACTIVE);
      setModalHeight(HEIGHT_PRESETS.DEFAULT); // Start with balanced view
    }
  }, []);

  // Exit search mode - return to normal map view
  const exitSearchMode = useCallback(() => {
    setSearchMode(SEARCH_MODES.INACTIVE);
    setHasSearchResults(false);
    setModalHeight(HEIGHT_PRESETS.DEFAULT);
  }, []);

  // Focus on search results - minimize map interaction
  const focusOnResults = useCallback(() => {
    if (hasSearchResults) {
      setSearchMode(SEARCH_MODES.FOCUSED);
      setModalHeight(HEIGHT_PRESETS.EXPANDED);
    }
  }, [hasSearchResults]);

  // Return to active search mode from focused
  const unfocusResults = useCallback(() => {
    if (hasSearchResults) {
      setSearchMode(SEARCH_MODES.ACTIVE);
      setModalHeight(HEIGHT_PRESETS.DEFAULT);
    }
  }, [hasSearchResults]);

  // Set specific height preset
  const setHeightPreset = useCallback((preset) => {
    if (Object.values(HEIGHT_PRESETS).includes(preset)) {
      setModalHeight(preset);
      
      // Auto-adjust search mode based on height
      if (preset === HEIGHT_PRESETS.EXPANDED) {
        setSearchMode(SEARCH_MODES.FOCUSED);
      } else if (hasSearchResults) {
        setSearchMode(SEARCH_MODES.ACTIVE);
      }
    }
  }, [hasSearchResults]);

  // Set custom height (from drag interactions)
  const setCustomHeight = useCallback((height) => {
    const clampedHeight = Math.max(15, Math.min(85, height));
    setModalHeight(clampedHeight);
    
    // Auto-adjust search mode based on height thresholds
    if (clampedHeight >= HEIGHT_PRESETS.EXPANDED - 10) {
      setSearchMode(SEARCH_MODES.FOCUSED);
    } else if (hasSearchResults) {
      setSearchMode(SEARCH_MODES.ACTIVE);
    }
  }, [hasSearchResults]);

  // Get current configuration
  const getSearchConfig = useCallback(() => {
    return {
      mode: searchMode,
      height: modalHeight,
      showNavigation: searchMode === SEARCH_MODES.INACTIVE,
      allowMapInteraction: searchMode !== SEARCH_MODES.FOCUSED,
      isSearchActive: searchMode !== SEARCH_MODES.INACTIVE,
      hasResults: hasSearchResults
    };
  }, [searchMode, modalHeight, hasSearchResults]);

  return {
    // State
    searchMode,
    modalHeight,
    hasSearchResults,
    
    // Actions
    enterSearchMode,
    exitSearchMode,
    focusOnResults,
    unfocusResults,
    setHeightPreset,
    setCustomHeight,
    
    // Computed
    config: getSearchConfig(),
    
    // Constants
    MODES: SEARCH_MODES,
    HEIGHTS: HEIGHT_PRESETS
  };
};