// Simple localStorage-backed coupons helper and React hook
const STORAGE_KEY = 'coupons';

const sampleCoupons = [
  {
    id: 'coupon-1',
    title: '아메리카노 1+1',
    description: '다음 방문 시 아메리카노 1잔을 무료로 드립니다.',
    code: 'MDNG-0001-AMP',
    validUntil: null,
  },
  {
    id: 'coupon-2',
    title: '디저트 20% 할인',
    description: '모든 디저트류 20% 할인 쿠폰입니다.',
    code: 'MDNG-0002-DIS',
    validUntil: null,
  },
];

export function loadCoupons() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // seed with sample coupons for first-time users
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleCoupons));
      return sampleCoupons;
    }
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function saveCoupons(arr) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  } catch (e) {}
}

// React hook to keep coupons in sync across tabs
import { useState, useEffect } from 'react';
export function useCoupons() {
  const [coupons, setCoupons] = useState(() => loadCoupons());

  useEffect(() => {
    try {
      saveCoupons(coupons);
    } catch (e) {}
  }, [coupons]);

  useEffect(() => {
    function onStorage(e) {
      if (e.key === STORAGE_KEY) {
        try {
          setCoupons(e.newValue ? JSON.parse(e.newValue) : []);
        } catch (err) {
          setCoupons([]);
        }
      }
    }

    function onFocus() {
      try {
        setCoupons(loadCoupons());
      } catch (err) {
        setCoupons([]);
      }
    }

    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', onFocus);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  return [coupons, setCoupons];
}

