// 성북구 중심의 더미 장소 데이터
export const dummyPlaces = [
  {
    id: 'place_001',
    name: '성북동 카페 온어',
    category: 'cafe',
    subcategory: 'specialty_coffee',
    coordinates: { lat: 37.6106, lng: 126.9977 },
    address: {
      full: '서울특별시 성북구 성북동 123-45',
      district: '성북구',
      roadAddress: '성북로 123'
    },
    contact: {
      phone: '02-1234-5678',
      instagram: '@cafe_onair'
    },
    hours: {
      isOpen: true,
      todayHours: '08:00 - 22:00'
    },
    rating: { average: 4.5, count: 127 },
    priceRange: '$$',
    tags: ['specialty_coffee', 'workspace', 'date_spot'],
    images: ['/images/cafe_onair_1.jpg'],
    description: '성북동 골목에 위치한 아늑한 스페셜티 커피 전문점',
    features: {
      hasParking: false,
      hasWifi: true,
      petFriendly: true,
      takeout: true
    },
    userInteraction: {
      liked: false,
      visited: true,
      saved: false
    }
  },
  {
    id: 'place_002',
    name: '한성대입구 돼지국밥',
    category: 'restaurant',
    subcategory: 'korean_food',
    coordinates: { lat: 37.6088, lng: 127.0030 },
    address: {
      full: '서울특별시 성북구 삼선동 456-78',
      district: '성북구',
      roadAddress: '한성대로 456'
    },
    contact: {
      phone: '02-2345-6789'
    },
    hours: {
      isOpen: true,
      todayHours: '24시간'
    },
    rating: { average: 4.2, count: 89 },
    priceRange: '$',
    tags: ['24hours', 'comfort_food', 'local_favorite'],
    images: ['/images/pork_soup_1.jpg'],
    description: '24시간 운영하는 전통 돼지국밥 맛집',
    features: {
      hasParking: true,
      hasWifi: false,
      petFriendly: false,
      takeout: true
    },
    userInteraction: {
      liked: true,
      visited: false,
      saved: true
    }
  },
  {
    id: 'place_003',
    name: '성신여대 베이글 브런치',
    category: 'cafe',
    subcategory: 'dessert_cafe',
    coordinates: { lat: 37.6025, lng: 127.0094 },
    address: {
      full: '서울특별시 성북구 정릉동 789-12',
      district: '성북구',
      roadAddress: '정릉로 789'
    },
    contact: {
      phone: '02-3456-7890',
      instagram: '@bagel_brunch'
    },
    hours: {
      isOpen: true,
      todayHours: '07:00 - 20:00'
    },
    rating: { average: 4.3, count: 156 },
    priceRange: '$$',
    tags: ['brunch', 'bagel', 'healthy'],
    images: ['/images/bagel_brunch_1.jpg'],
    description: '신선한 베이글과 건강한 브런치 메뉴',
    features: {
      hasParking: false,
      hasWifi: true,
      petFriendly: false,
      takeout: true
    },
    userInteraction: {
      liked: false,
      visited: false,
      saved: true
    }
  },
  {
    id: 'place_004',
    name: '길상사',
    category: 'attraction',
    subcategory: 'temple',
    coordinates: { lat: 37.6134, lng: 126.9981 },
    address: {
      full: '서울특별시 성북구 성북동 330-3',
      district: '성북구',
      roadAddress: '선잠로5길 68'
    },
    contact: {
      phone: '02-3672-5945'
    },
    hours: {
      isOpen: true,
      todayHours: '04:00 - 21:00'
    },
    rating: { average: 4.6, count: 234 },
    priceRange: 'Free',
    tags: ['temple', 'meditation', 'traditional', 'peaceful'],
    images: ['/images/gilsangsa_1.jpg'],
    description: '성북동에 위치한 아름다운 전통 사찰',
    features: {
      hasParking: true,
      hasWifi: false,
      petFriendly: false,
      takeout: false
    },
    userInteraction: {
      liked: true,
      visited: true,
      saved: true
    }
  },
  {
    id: 'place_005',
    name: '성북구립미술관',
    category: 'attraction',
    subcategory: 'museum',
    coordinates: { lat: 37.6140, lng: 126.9965 },
    address: {
      full: '서울특별시 성북구 성북로 134',
      district: '성북구',
      roadAddress: '성북로 134'
    },
    contact: {
      phone: '02-2241-2675',
      website: 'https://smuseum.seoul.kr'
    },
    hours: {
      isOpen: false,
      todayHours: '휴관일 (월요일)'
    },
    rating: { average: 4.4, count: 178 },
    priceRange: 'Free',
    tags: ['art', 'exhibition', 'culture', 'family'],
    images: ['/images/museum_1.jpg'],
    description: '다양한 현대미술 전시를 만나볼 수 있는 구립미술관',
    features: {
      hasParking: true,
      hasWifi: true,
      petFriendly: false,
      takeout: false
    },
    userInteraction: {
      liked: false,
      visited: false,
      saved: false
    }
  },
  {
    id: 'place_006',
    name: '정릉시장',
    category: 'shopping',
    subcategory: 'market',
    coordinates: { lat: 37.6035, lng: 127.0105 },
    address: {
      full: '서울특별시 성북구 정릉동 988-1',
      district: '성북구',
      roadAddress: '정릉로 288'
    },
    contact: {
      phone: '02-909-1234'
    },
    hours: {
      isOpen: true,
      todayHours: '06:00 - 20:00'
    },
    rating: { average: 4.1, count: 92 },
    priceRange: '$',
    tags: ['traditional_market', 'fresh_food', 'local'],
    images: ['/images/market_1.jpg'],
    description: '신선한 농산물과 다양한 먹거리가 있는 전통시장',
    features: {
      hasParking: false,
      hasWifi: false,
      petFriendly: false,
      takeout: false
    },
    userInteraction: {
      liked: false,
      visited: true,
      saved: false
    }
  },
  {
    id: 'place_007',
    name: '북악산 둘레길',
    category: 'attraction',
    subcategory: 'park',
    coordinates: { lat: 37.6180, lng: 126.9945 },
    address: {
      full: '서울특별시 성북구 성북동',
      district: '성북구',
      roadAddress: '북악산로'
    },
    contact: {
      phone: '02-120'
    },
    hours: {
      isOpen: true,
      todayHours: '24시간'
    },
    rating: { average: 4.7, count: 312 },
    priceRange: 'Free',
    tags: ['hiking', 'nature', 'exercise', 'scenic_view'],
    images: ['/images/bukaksan_1.jpg'],
    description: '서울 시내를 한눈에 볼 수 있는 아름다운 둘레길',
    features: {
      hasParking: false,
      hasWifi: false,
      petFriendly: true,
      takeout: false
    },
    userInteraction: {
      liked: true,
      visited: true,
      saved: true
    }
  },
  {
    id: 'place_008',
    name: '성북동 이탈리안 트라토리아',
    category: 'restaurant',
    subcategory: 'western_food',
    coordinates: { lat: 37.6120, lng: 126.9990 },
    address: {
      full: '서울특별시 성북구 성북동 111-22',
      district: '성북구',
      roadAddress: '성북로 111'
    },
    contact: {
      phone: '02-4567-8901',
      instagram: '@trattoria_seongbuk'
    },
    hours: {
      isOpen: true,
      todayHours: '11:30 - 22:00'
    },
    rating: { average: 4.4, count: 203 },
    priceRange: '$$$',
    tags: ['italian', 'pasta', 'wine', 'romantic'],
    images: ['/images/trattoria_1.jpg'],
    description: '정통 이탈리안 요리와 와인을 즐길 수 있는 트라토리아',
    features: {
      hasParking: false,
      hasWifi: true,
      petFriendly: false,
      takeout: false
    },
    userInteraction: {
      liked: false,
      visited: false,
      saved: false
    }
  },
  // 추가 장소들 (클러스터링 테스트용)
  {
    id: 'place_009',
    name: '성북동 도서관 카페',
    category: 'cafe',
    coordinates: { lat: 37.6108, lng: 126.9975 },
    address: { 
      full: '서울특별시 성북구 성북동', 
      district: '성북구',
      roadAddress: '성북로 201'
    },
    rating: { average: 4.3, count: 85 },
    priceRange: '$$',
    tags: ['study', 'quiet', 'books'],
    userInteraction: { liked: false, visited: false, saved: false }
  },
  {
    id: 'place_010',
    name: '성북동 베이커리',
    category: 'cafe',
    coordinates: { lat: 37.6110, lng: 126.9980 },
    address: { 
      full: '서울특별시 성북구 성북동', 
      district: '성북구',
      roadAddress: '성북로 205'
    },
    rating: { average: 4.1, count: 92 },
    priceRange: '$$',
    tags: ['bakery', 'fresh', 'morning'],
    userInteraction: { liked: false, visited: false, saved: false }
  },
  {
    id: 'place_011',
    name: '한성대 치킨집',
    category: 'restaurant',
    coordinates: { lat: 37.6090, lng: 127.0028 },
    address: { 
      full: '서울특별시 성북구 삼선동', 
      district: '성북구',
      roadAddress: '한성대로 301'
    },
    rating: { average: 4.0, count: 156 },
    priceRange: '$',
    tags: ['chicken', 'casual', 'students'],
    userInteraction: { liked: false, visited: false, saved: false }
  },
  {
    id: 'place_012',
    name: '한성대 분식집',
    category: 'restaurant',
    coordinates: { lat: 37.6085, lng: 127.0032 },
    address: { 
      full: '서울특별시 성북구 삼선동', 
      district: '성북구',
      roadAddress: '한성대로 305'
    },
    rating: { average: 3.9, count: 78 },
    priceRange: '$',
    tags: ['snacks', 'cheap', 'quick'],
    userInteraction: { liked: false, visited: false, saved: false }
  },
  {
    id: 'place_013',
    name: '정릉동 카페거리',
    category: 'cafe',
    coordinates: { lat: 37.6020, lng: 127.0090 },
    address: { 
      full: '서울특별시 성북구 정릉동', 
      district: '성북구',
      roadAddress: '정릉로 401'
    },
    rating: { average: 4.2, count: 134 },
    priceRange: '$$',
    tags: ['trendy', 'multiple', 'street'],
    userInteraction: { liked: false, visited: false, saved: false }
  },
  {
    id: 'place_014',
    name: '정릉동 피자집',
    category: 'restaurant',
    coordinates: { lat: 37.6028, lng: 127.0095 },
    address: { 
      full: '서울특별시 성북구 정릉동', 
      district: '성북구',
      roadAddress: '정릉로 405'
    },
    rating: { average: 4.4, count: 112 },
    priceRange: '$$',
    tags: ['pizza', 'family', 'casual'],
    userInteraction: { liked: false, visited: false, saved: false }
  },
  {
    id: 'place_015',
    name: '성북동 갤러리 카페',
    category: 'cafe',
    coordinates: { lat: 37.6115, lng: 126.9985 },
    address: { 
      full: '서울특별시 성북구 성북동', 
      district: '성북구',
      roadAddress: '성북로 209'
    },
    rating: { average: 4.6, count: 203 },
    priceRange: '$$$',
    tags: ['art', 'gallery', 'sophisticated'],
    userInteraction: { liked: false, visited: false, saved: false }
  },
  {
    id: 'place_016',
    name: '성북동 한옥 레스토랑',
    category: 'restaurant',
    coordinates: { lat: 37.6125, lng: 126.9988 },
    address: { 
      full: '서울특별시 성북구 성북동', 
      district: '성북구',
      roadAddress: '성북로 213'
    },
    rating: { average: 4.7, count: 89 },
    priceRange: '$$$',
    tags: ['traditional', 'hanok', 'fine_dining'],
    userInteraction: { liked: false, visited: false, saved: false }
  }
];

// 마커 클러스터링을 위한 지역별 그룹
export const placesByRegion = {
  seongbuk_dong: dummyPlaces.filter(place => place.address.roadAddress.includes('성북')),
  jeongneung_dong: dummyPlaces.filter(place => place.address.roadAddress.includes('정릉')),
  samseon_dong: dummyPlaces.filter(place => place.address.roadAddress.includes('한성대'))
};

// 카테고리별 필터링을 위한 헬퍼 함수
export const getPlacesByCategory = (category) => {
  return dummyPlaces.filter(place => place.category === category);
};

export const getPlacesBySubcategory = (subcategory) => {
  return dummyPlaces.filter(place => place.subcategory === subcategory);
};

// 평점별 필터링
export const getPlacesByRating = (minRating) => {
  return dummyPlaces.filter(place => place.rating.average >= minRating);
};

// 가격대별 필터링
export const getPlacesByPriceRange = (priceRanges) => {
  return dummyPlaces.filter(place => priceRanges.includes(place.priceRange));
};