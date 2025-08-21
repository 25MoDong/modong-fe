/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from 'react';
import { useSearchMode } from '../hooks/useSearchMode';

const SearchModeContext = createContext(null);

/**
 * Search Mode Provider - provides search state to entire app
 * Enables navigation hiding when search is active (Kakao Map UX pattern)
 */
export const SearchModeProvider = ({ children }) => {
  const searchModeState = useSearchMode();
  
  return (
    <SearchModeContext.Provider value={searchModeState}>
      {children}
    </SearchModeContext.Provider>
  );
};

/**
 * Hook to access search mode state anywhere in the app
 */
export const useSearchModeContext = () => {
  const context = useContext(SearchModeContext);
  if (!context) {
    throw new Error('useSearchModeContext must be used within a SearchModeProvider');
  }
  return context;
};
