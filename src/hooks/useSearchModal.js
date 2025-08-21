import { useState, useCallback, useRef } from 'react';

/**
 * Hook for managing SearchModal state with proper user intent tracking
 * Solves the persistent popup issue by distinguishing between:
 * - System dismissal (map interactions)  
 * - User dismissal (explicit close button)
 */
export const useSearchModal = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  
  // Track if user explicitly dismissed the modal
  const userDismissedRef = useRef(false);
  
  // Track current search session to handle new searches properly
  const currentSearchIdRef = useRef(null);

  /**
   * Show modal with search results
   * Resets user dismissal state for new searches
   */
  const showModal = useCallback((results, searchId = Date.now()) => {
    setSearchResults(results);
    setIsVisible(true);
    // Reset dismissal state for new search
    userDismissedRef.current = false;
    currentSearchIdRef.current = searchId;
  }, []);

  /**
   * Hide modal due to system interactions (map drag/zoom)
   * Only hides if user hasn't explicitly dismissed
   */
  const hideModalBySystem = useCallback(() => {
    if (!userDismissedRef.current) {
      setIsVisible(false);
    }
    // Note: We keep searchResults intact for potential re-showing
  }, []);

  /**
   * Hide modal due to user action (clicking X button)
   * Marks as user-dismissed to prevent auto re-showing
   */
  const hideModalByUser = useCallback(() => {
    setIsVisible(false);
    userDismissedRef.current = true;
    // Keep search results but prevent re-showing until new search
  }, []);

  /**
   * Hide modal due to place selection from list
   * Completely clears the modal state to prevent re-showing
   */
  const hideModalBySelection = useCallback(() => {
    setSearchResults([]);
    setIsVisible(false);
    userDismissedRef.current = true;
    currentSearchIdRef.current = null;
  }, []);

  /**
   * Clear all modal state completely
   * Use when navigating away or starting fresh
   */
  const clearModal = useCallback(() => {
    setSearchResults([]);
    setIsVisible(false);
    userDismissedRef.current = false;
    currentSearchIdRef.current = null;
  }, []);

  /**
   * Check if modal should be shown for given search results
   * Considers user dismissal state and search session
   */
  const shouldShowModal = useCallback((results, searchId) => {
    return (
      results && 
      results.length > 0 && 
      (!userDismissedRef.current || currentSearchIdRef.current !== searchId)
    );
  }, []);

  return {
    // State
    searchResults,
    isVisible,
    isUserDismissed: userDismissedRef.current,
    
    // Actions
    showModal,
    hideModalBySystem,
    hideModalByUser,
    hideModalBySelection,
    clearModal,
    shouldShowModal,
    
    // Internal state access for debugging
    getCurrentSearchId: () => currentSearchIdRef.current
  };
};

export default useSearchModal;
