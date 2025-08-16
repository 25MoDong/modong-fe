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
        'circle-shrink':
          'circleShrink 1s cubic-bezier(0.3, 0.2, 1, 0.55) forwards',
        'stone-bounce': 'stoneBounce 0.8s ease-out 1s forwards',
        'char-wave': 'charWave 0.15s ease-out var(--delay) forwards',
        'char-wave-dol':
          'charWave 0.15s ease-out var(--delay) forwards, dolHighlight 0.5s ease-out 3.85s forwards',
        'char-wave-maeng':
          'charWave 0.15s ease-out var(--delay) forwards, maengHighlight 0.5s ease-out 4.35s forwards',
        'sentence-up': 'sentenceUp 0.65s ease-out 3.2s forwards',
        blinkd: 'blink 3s infinite ease-in-out',
      },
      keyframes: {
        circleShrink: {
          '0%': { clipPath: 'circle(80% at center)' },
          '100%': { clipPath: 'circle(0% at center)' },
        },
        stoneBounce: {
          '0%': { transform: 'scale(0) rotate(0deg)', opacity: '0' },
          '50%': { transform: 'scale(1.2) rotate(180deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(360deg)', opacity: '1' },
        },
        charWave: {
          '0%': { transform: 'translateY(20px)', opacity: '1' },
          '100%': { transform: 'translateY(0px)', opacity: '1' },
        },
        sentenceUp: {
          '0%': { transform: 'translateY(30px)', opacity: '1' },
          '100%': { transform: 'translateY(0px)', opacity: '1' },
        },
        dolHighlight: {
          '0%': { transform: 'scale(1)', color: '#869EFF' },
          '50%': { transform: 'scale(1.1)', color: '#5C7CFF' },
          '100%': { transform: 'scale(1)', color: '#5C7CFF' },
        },
        maengHighlight: {
          '0%': { transform: 'scale(1)', color: '#869EFF' },
          '50%': { transform: 'scale(1.1)', color: '#5C7CFF' },
          '100%': { transform: 'scale(1)', color: '#5C7CFF' },
        },
        blink: {
          '0%, 90%, 100%': { opacity: '0' },
          '95%': { opacity: '1' },
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
      },
    },
  },
  plugins: [tailwindScrollbarHide],
};
