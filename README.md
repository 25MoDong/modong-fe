# 돌맹돌맹 (Front-end)

이 저장소는 서울 성북구 주변 상권의 발전을 돕기 위해 개발되는 프론트엔드 애플리케이션입니다. 지역 상권(로컬 상점, 카페, 음식점 등)의 발견과 소비를 촉진하는 UX를 제공하며, AI 추천, 지도 기반 탐색, 찜(컬렉션) 기능 등을 포함합니다.

이 프로젝트는 사용자 친화적인 모바일 우선 UI를 목표로 하며, 성북구 지역상권 활성화를 위해 현지 점주와 소비자를 연결하는 기능들을 제공합니다.

---

## 핵심 기능

- AI 기반 추천: 사용자의 입력(또는 대표 장소)을 바탕으로 유사한 분위기의 가게 추천
- 지도 탐색: 카카오맵 SDK 기반의 위치/클러스터링, InfoWindow 제공
- 찜(보석함): 가게를 컬렉션에 저장하고 관리할 수 있는 기능
- 상세 페이지: 장소 상세 정보, 거리 계산, 리뷰 렌더링
- 온보딩: 사용자 취향을 반영하기 위한 간단한 온보딩 플로우

---

## 빠른 시작

필수: Node.js(>=16 권장)와 npm 또는 yarn이 설치되어 있어야 합니다.

1. 저장소를 클론합니다.

```bash
git clone <REPO_URL>
cd <repo-folder>
```

2. 의존성 설치

```bash
# npm
npm install

# 또는 yarn
# yarn
```

3. 개발 서버 실행

```bash
npm run dev
# 또는
# yarn dev
```

개발 서버는 기본적으로 Vite를 사용합니다. 로컬에서 `http://localhost:5173` (기본값)으로 접속하세요.

4. 프로덕션 빌드

```bash
npm run build
```

5. 빌드 결과 미리보기

```bash
npm run preview
```

---

## 환경 변수

루트 또는 `.env.local`에 아래 환경 변수를 설정합니다. Vite는 `VITE_` 접두사가 붙은 환경 변수를 빌드 시 반영합니다.

- `VITE_API_BASE` : 백엔드 API의 베이스 URL (예: `https://api.example.com`)
- `VITE_KAKAO_MAP_API_KEY` : 카카오맵 JavaScript API 키 (필요시)
- `VITE_API_DEBUG` : API 디버그 모드(옵션)
- `VITE_DOUBLE_ENCODE_PATHS` : 일부 배포 환경에서 path 파라미터 이중 디코딩을 제어하는 플래그(옵션)

예시 `.env.local`:

```text
VITE_API_BASE=https://api.example.com
VITE_KAKAO_MAP_API_KEY=YOUR_KAKAO_MAP_API_KEY
VITE_API_DEBUG=0
VITE_DOUBLE_ENCODE_PATHS=0
```

주의: 민감한 키는 절대 공개 저장소에 직접 커밋하지 마세요.

---

## 스크립트

- `npm run dev` : 개발 서버 시작
- `npm run build` : 프로덕션 빌드 생성
- `npm run preview` : 빌드 결과 로컬 미리보기
- `npm run deploy` : 프로젝트의 커스텀 배포 스크립트를 실행(프로젝트에 `scripts/deploy.sh` 존재 시)
- `npm run lint` : ESLint 실행
- `npm run format` : 코드 포맷터(Prettier) 실행

---

## 코드 구조 (주요 폴더)

- `src/` : 프론트엔드 소스 코드
  - `pages/` : 라우트 단위 페이지 컴포넌트
  - `components/` : 재사용 가능한 UI 컴포넌트
  - `lib/` : API 래퍼, 유틸리티, 스토리지 등
  - `hooks/` : 커스텀 React 훅
  - `assets/` 또는 `public/` : 정적 리소스

---

## 배포 및 운영 관련 권장 사항

- 정적 리소스(이미지 등)는 가능하면 객체 스토리지(S3) 및 CDN으로 외부 호스팅 권장
- EC2에서 직접 파일을 관리할 경우 디스크 용량·백업 정책과 nginx 정적 서빙을 고려
- 환경별(스테이징/프로덕션) 환경 변수 관리를 철저히 하세요
- 브랜치 전략: `develop` → `main`(배포) / PR 기반 병합 권장

---

## 기여

기여는 환영합니다. 버그 리포트, 개선 제안, PR 등 모두 환영합니다.

- 작업 절차 권장:
  1. `develop` 브랜치로부터 feature 브랜치 생성
  2. 변경 사항 커밋 후 원격에 푸시
  3. Pull Request 생성, 설명 및 관련 이슈 연결

---

## 연락/도움말

프로젝트 관련 더 자세한 설명이나 협업 관련 문의는 리포지토리 이슈를 남겨주세요.

---

## 라이선스

프로젝트의 라이선스 정보를 여기에 명시하세요(예: MIT). 현재 리포지토리에 별도 라이선스 파일이 없다면 팀 정책에 따라 추가해 주세요.

