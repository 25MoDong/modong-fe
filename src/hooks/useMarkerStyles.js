import { useMemo } from 'react';

/**
 * 🎨 마커 스타일 훅
 * 
 * 카테고리나 데이터에 따른 마커 색상/스타일 관리
 */
const useMarkerStyles = () => {
  const markerStyleConfig = useMemo(() => ({
    default: {
      primary: '#4285F4',
      secondary: '#1a73e8',
      size: { width: 36, height: 46 }
    },
    restaurant: {
      primary: '#FF6B6B',
      secondary: '#E55B5B',
      size: { width: 36, height: 46 }
    },
    hotel: {
      primary: '#4ECDC4',
      secondary: '#45B7AF',
      size: { width: 36, height: 46 }
    },
    attraction: {
      primary: '#45B7D1',
      secondary: '#3A9BC1',
      size: { width: 36, height: 46 }
    },
    shopping: {
      primary: '#96CEB4',
      secondary: '#85C1A3',
      size: { width: 36, height: 46 }
    },
    transport: {
      primary: '#FFEAA7',
      secondary: '#FDCB6E',
      size: { width: 36, height: 46 }
    }
  }), []);

  const getMarkerStyle = (category = 'default') => {
    return markerStyleConfig[category] || markerStyleConfig.default;
  };

  const getMarkerColor = (category, property = 'primary') => {
    const style = getMarkerStyle(category);
    return style[property] || style.primary;
  };

  return {
    getMarkerStyle,
    getMarkerColor,
    markerStyleConfig
  };
};

export default useMarkerStyles;