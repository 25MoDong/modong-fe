/**
 * 쿠폰 관련 로컬 스토리지 관리
 * 백엔드 API가 없으므로 클라이언트 사이드에서 쿠폰 데이터 관리
 */

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'modong_coupons';

// 더미 쿠폰 데이터
const DEFAULT_COUPONS = [
  {
    id: 'coupon001',
    title: '아메리카노',
    description: '음료 10% 할인 쿠폰',
    discountText: '음료 10% 할인',
    store: '카페 기웃기웃',
    validUntil: '2024-09-21',
    barcode: '8720-9821',
    isUsed: false,
    category: '카페'
  },
  {
    id: 'coupon002', 
    title: '베이글샌드위치',
    description: '베이커리 15% 할인 쿠폰',
    discountText: '베이커리 15% 할인',
    store: '브런치카페',
    validUntil: '2024-09-15',
    barcode: '1234-5678',
    isUsed: false,
    category: '베이커리'
  },
  {
    id: 'coupon003',
    title: '파스타세트',
    description: '식사 20% 할인 쿠폰',
    discountText: '식사 20% 할인', 
    store: '이탈리안레스토랑',
    validUntil: '2024-10-01',
    barcode: '9876-5432',
    isUsed: true,
    category: '레스토랑'
  }
];

// 쿠폰 데이터 로드
export const loadCoupons = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // 처음 실행 시 기본 쿠폰 설정
      saveCoupons(DEFAULT_COUPONS);
      return DEFAULT_COUPONS;
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load coupons:', error);
    return DEFAULT_COUPONS;
  }
};

// 쿠폰 데이터 저장
export const saveCoupons = (coupons) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(coupons));
    window.dispatchEvent(new CustomEvent('CouponsChanged', { detail: coupons }));
  } catch (error) {
    console.error('Failed to save coupons:', error);
  }
};

// 사용 가능한 쿠폰만 필터링
export const getAvailableCoupons = () => {
  return loadCoupons().filter(coupon => !coupon.isUsed);
};

// 쿠폰 사용 처리
export const useCoupon = (couponId) => {
  const coupons = loadCoupons();
  const updatedCoupons = coupons.map(coupon => 
    coupon.id === couponId ? { ...coupon, isUsed: true } : coupon
  );
  saveCoupons(updatedCoupons);
  return updatedCoupons;
};

// 쿠폰 추가
export const addCoupon = (coupon) => {
  const coupons = loadCoupons();
  const newCoupon = {
    id: `coupon${Date.now()}`,
    isUsed: false,
    ...coupon
  };
  const updatedCoupons = [...coupons, newCoupon];
  saveCoupons(updatedCoupons);
  return updatedCoupons;
};

// React Hook for coupons
export const useCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInitialCoupons = () => {
      setLoading(true);
      const couponsData = loadCoupons();
      setCoupons(couponsData);
      setLoading(false);
    };

    const handleCouponsChanged = (event) => {
      setCoupons(event.detail || loadCoupons());
    };

    loadInitialCoupons();
    window.addEventListener('CouponsChanged', handleCouponsChanged);
    
    return () => {
      window.removeEventListener('CouponsChanged', handleCouponsChanged);
    };
  }, []);

  return [coupons, loading];
};