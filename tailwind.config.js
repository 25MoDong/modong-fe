// import { Polygon } from "react-kakao-maps-sdk";
import tailwindScrollbarHide from 'tailwind-scrollbar-hide';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      sans: [
        'Pretendard Variable',
        'Pretendard',
        '-apple-system',
        'BlinkMacSystemFont',
        'system-ui',
        'sans-serif',
      ],
    },
    extend: {
      animation: {
        'char-wave': 'charWave 0.15s ease-out var(--delay) forwards',
        'char-wave-dol':
          'charWave 0.15s ease-out var(--delay) forwards, dolHighlight 0.5s ease-out 1.0s forwards',
        'char-wave-maeng':
          'charWave 0.15s ease-out var(--delay) forwards, maengHighlight 0.5s ease-out 1.5s forwards',
        'sentence-up': 'sentenceUp 0.65s ease-out 2.0s forwards',
        fadeIn: 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.3s ease-out',
        // 새로운 애니메이션들
        'drop-dot': 'dropDot 1.2s ease-in-out var(--drop-delay) forwards',
        'char-squash': 'charSquash 1.2s ease-in-out var(--char-delay) forwards',
        'stone-to-gem': 'stoneToGem 1.5s ease-in-out forwards',
      },
      keyframes: {
        charWave: {
          '0%': { transform: 'translateY(20px)', opacity: '1' },
          '100%': { transform: 'translateY(0px)', opacity: '1' },
        },
        // 회색 점이 떨어지는 애니메이션 (떨어지고 튀어오르는 효과)
        dropDot: {
          '0%': {
            transform: 'translateX(-50%) translateY(-20px)',
            opacity: '1',
          },
          '30%': {
            transform: 'translateX(-50%) translateY(-10px)',
            opacity: '1',
          },
          '45%': {
            transform: 'translateX(-50%) translateY(15px)',
            opacity: '1',
          },
          '50%': {
            transform: 'translateX(-50%) translateY(18px)',
            opacity: '1',
          },
          '60%': {
            transform: 'translateX(-50%) translateY(-3px)',
            opacity: '1',
          },
          '75%': {
            transform: 'translateX(-50%) translateY(8px)',
            opacity: '0.7',
          },
          '100%': {
            transform: 'translateX(-50%) translateY(-20px)',
            opacity: '0',
          },
        },
        // 글자가 눌려서 찌그러지고 복구되는 애니메이션
        charSquash: {
          '0%': {
            transform: 'scaleX(1) scaleY(1)',
          },
          '45%': {
            transform: 'scaleX(1.3) scaleY(0.7)',
          },
          '50%': {
            transform: 'scaleX(1.3) scaleY(0.7)',
          },
          '60%': {
            transform: 'scaleX(0.9) scaleY(1.1)',
          },
          '75%': {
            transform: 'scaleX(1.05) scaleY(0.95)',
          },
          '100%': {
            transform: 'scaleX(1) scaleY(1)',
          },
        },
        sentenceUp: {
          '0%': { transform: 'translateY(30px)', opacity: '1' },
          '100%': { transform: 'translateY(0px)', opacity: '1' },
        },
        dolHighlight: {
          '0%': { transform: 'scale(1)', color: '#869EFF' },
          '50%': { transform: 'scale(1.1)', color: '#E07A91' },
          '100%': { transform: 'scale(1)', color: '#E07A91' },
        },
        maengHighlight: {
          '0%': { transform: 'scale(1)', color: '#869EFF' },
          '50%': { transform: 'scale(1.1)', color: '#E07A91' },
          '100%': { transform: 'scale(1)', color: '#E07A91' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        stoneToGem: {
          '0%': {
            transform: 'rotate(0deg) scale(1)',
            background: 'linear-gradient(135deg, #9CA3AF, #6B7280)',
            borderRadius: '50%',
          },
          '30%': {
            transform: 'rotate(180deg) scale(1.1)',
            borderRadius: '30%',
          },
          '60%': {
            transform: 'rotate(315deg) scale(0.9)',
            borderRadius: '15%',
          },
          '100%': {
            transform: 'rotate(45deg) scale(1)',
            background: 'linear-gradient(135deg, #3B82F6, #1D4ED8, #1E40AF)',
            borderRadius: '10px',
            boxShadow: '0 10px 30px rgba(59, 130, 246, 0.4)',
          },
        },
      },
      screens: {
        xs: '475px',
      },
      colors: {
        primary: {
          50: '#e9eaec',
          100: '#babcc5',
          200: '#999ca9',
          300: '#6a6f82',
          400: '#4d5369',
          500: '#212844',
          600: '#1e243e',
          700: '#171c30',
          800: '#121625',
          900: '#0e111d',
        },
        secondary: {
          50: '#fffefd',
          100: '#fffdf8',
          200: '#fffcf5',
          300: '#FFFBF2',
          400: '#FFFAF0',
          500: '#FFF9ED',
          600: '#FFEFD0',
          700: '#F1CD87',
          800: '#8c8880',
          900: '#6b6862',
        },
        brand: {
          navy: '#3C4462', // 스탬프 카드 네이비
          cream: '#FFFAED', // 크림 배경
          accent: '#C3A56C', // 포인트 골드
        },
      },
      borderRadius: {
        card: '16px', // rounded-card
        stamp: '14px', // rounded-stamp
      },
      boxShadow: {
        soft: '0 4px 12px rgba(0,0,0,0.06)', // shadow-soft
        stamp: '0 10px 24px rgba(35,44,72,0.20)', // shadow-stamp
        card: '0 2px 8px rgba(0,0,0,0.04)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.12)',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
    },
  },
  plugins: [tailwindScrollbarHide],
};
