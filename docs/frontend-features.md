# Frontend 기능 요약 (발표용)

간단한 발표자료로 사용할 수 있도록 주요 기능과 구현 요약을 정리했습니다. 각 항목에 핵심 문제, 구현 방식, 관련 파일 경로를 포함합니다.

## 1. 지도와 마커 (Map & Markers)
- 문제: 많은 마커를 화면에 표시하면서 성능과 가독성 유지 필요.
- 구현: 거리 기반 클러스터링 및 커스텀 마커 렌더링 사용.
- 관련 파일: `src/components/map/AdvancedMarkerClusterer.jsx`, `src/components/map/PlaceMarker.jsx`
- 효과: 많은 마커를 효율적으로 관리하고, 카테고리별 아이콘/색상 적용으로 가독성 향상.

## 2. 인포윈도우 (InfoWindow)
- 문제: 마커에서 상세 페이지로 이동 시 어떤 마커에서 왔는지, 즉시 보여줄 데이터가 필요.
- 구현: 마커 클릭 시 정규화된 `placeData`를 생성하여 `navigate('/place/:id', { state: { place, from: 'map' } })`로 전달.
- 관련 파일: `src/components/map/InfoWindow.jsx`, `src/pages/Map.jsx`
- 효과: 상세 페이지에서 내비게이션 상태로 받은 데이터를 우선 사용해 빠르게 렌더링 가능.

## 3. 상세 페이지 (PlaceDetail)
- 문제: 네트워크 응답 지연으로 상세 정보가 늦게 뜨는 문제.
- 구현: `location.state.place`(네비게이션 상태) 우선 사용, 없으면 캐시(`loadPlace`) 확인 후 백엔드 호출(`backend.getPlaceById`)으로 폴백.
- 관련 파일: `src/pages/PlaceDetail.jsx`, `src/lib/favoritesStorage.js` (캐시 저장/불러오기)
- 효과: 네비게이션으로 전달된 데이터가 있으면 즉시 표시하여 UX 개선; 네트워크 실패에도 캐시로 보완.

## 4. 낙관적 선택 및 상세 정보 병합
- 문제: 지오코딩 마커 데이터와 백엔드의 상세 응답 구조가 다를 수 있음.
- 구현: 마커 클릭 시 우선 경량 데이터로 선택(낙관적 렌더링), 백엔드 상세를 가져오면 좌표 등 필수 필드를 병합하여 업데이트.
- 관련 파일: `src/pages/Map.jsx` (핸들러: `handleMarkerClick`)

## 5. 트래킹 / 자동 포커스 일시 정지
- 문제: 사용자가 마커를 수동 선택했을 때 자동 추적/팝업으로 방해받음.
- 구현: 사용자가 상호작용(클릭/줌/선택)하면 `isTrackingPaused`를 true로 두고, 타임아웃 후 재개.
- 관련 파일: `src/pages/Map.jsx`

## 6. 검색 모달 연동
- 문제: 검색 결과에서 선택했을 때 모달과 맵의 상태 동기화 필요.
- 구현: `SearchModal`이 보여지는 동안 `search mode`를 유지하고, 선택 시 `animateToMarker` + `selectPlace`로 포커스.
- 관련 파일: `src/components/map/SearchModal.jsx`, `src/pages/Map.jsx`

## 7. 즐겨찾기(보석함) 관리
- 문제: 사용자가 장소를 컬렉션에 담고 관리할 수 있어야 함.
- 구현: 로컬 스토리지 기반 `favoritesStorage` 유틸 제공 (`loadCollections`, `togglePlaceInCollection` 등)과 바텀시트/모달 UI.
- 관련 파일: `src/lib/favoritesStorage.js`, `src/components/favorites/FavoritesPickerSheet.jsx`, `src/pages/PlaceDetail.jsx`

## 8. 거리 계산 및 리뷰 집계
- 문제: 장소와 사용자 간 거리를 표시하고, 리뷰 수를 가져와야 함.
- 구현: 클라이언트 측 거리 계산 유틸 (`calculateDistance`, `formatDistance`)와 `getStoreReviews` API 호출로 리뷰 개수 로드.
- 관련 파일: `src/lib/mapUtils.js`, `src/lib/reviewApi.js`, `src/components/map/InfoWindow.jsx`, `src/pages/PlaceDetail.jsx`

## 9. 성능/UX 소소한 개선들
- 이미지 로드 실패 대체 처리(이미지 onError), 스켈레톤/플레이스홀더 UI, 스크롤-휠을 가로 스크롤로 변환 등.
- 관련 파일: `src/components/place/MenuSkeleton.jsx`, 각 컴포넌트의 `onError` 핸들러들.

## 데모 시나리오 (간단)
1. 지도에서 마커 클릭 → InfoWindow 표시 → "이 장소 자세히 보기" 클릭
   - 기대: 상세 페이지가 네비게이션 state로 받은 정보를 즉시 표시함.
2. 검색에서 결과 선택 → 모달이 닫히고 맵이 선택된 장소로 포커스
3. 상세 페이지에서 즐겨찾기(보석함) 추가 → 로컬 스토리지에 반영

## 참고: 주요 파일 리스트
- `src/pages/Map.jsx`
- `src/components/map/InfoWindow.jsx`
- `src/components/map/AdvancedMarkerClusterer.jsx`
- `src/pages/PlaceDetail.jsx`
- `src/lib/mapUtils.js`, `src/lib/reviewApi.js`, `src/lib/favoritesStorage.js`

---
원하시면 이 문서를 발표용 슬라이드(예: Markdown → Google Slides 또는 PowerPoint 변환)에 맞게 더 간단한 포인트들로 축약해 드리겠습니다.

