# 성북구 AI 맛집 추천 서비스

## 프로젝트 개요
해커톤 프로젝트: "AI로 다시 뛰는 우리 동네 - 지역 경제와 삶을 AI로 연결"  
타겟: 성북구 거주 대학생 중심 20대 젊은 층

## 개발 환경 설정

### 프로젝트 실행
```bash
# 루트 디렉토리에서
npm install

# 프론트엔드 개발 서버 실행 (포트: 3000)
cd frontend
npm install
npm run dev
```

### 빌드
```bash
cd frontend
npm run build
```

### 코드 검사
```bash
cd frontend
npm run lint
npm run lint:fix
```

## 협업 전략

### 커뮤니케이션
- **일일 스탠드업**: 매일 오전 10시, 각자의 진행상황과 이슈 공유
- **주간 회고**: 매주 금요일 오후, 한 주간의 성과와 개선점 논의
- **이슈 관리**: GitHub Issues를 통한 버그 리포트 및 기능 요청 관리
- **코드 리뷰**: 모든 PR은 최소 1명의 동료 검토 후 병합

### 작업 분할
- **기능별 분담**: 각 팀원이 특정 기능 영역을 담당
- **페어 프로그래밍**: 복잡한 기능 개발 시 2명이 함께 작업
- **크로스 리뷰**: 다른 팀원의 코드도 정기적으로 리뷰

### 해커톤 개발 일정 (3일)
- **Day 1**: Frontend UI 프로토타입 + 기본 라우팅
- **Day 2**: Backend API + AI 추천 로직
- **Day 3**: 통합 + 배포 + 데모 준비

## Git 브랜치 전략 (Git Flow)

### 브랜치 구조
```
main (production)
├── develop (development)
    ├── feature/user-auth
    ├── feature/dashboard  
    ├── feature/ai-recommendation
    └── hotfix/critical-bug-fix
```

### 브랜치 유형
- **main**: 프로덕션 배포용 브랜치
- **develop**: 개발 통합 브랜치
- **feature/**: 새로운 기능 개발 브랜치
- **hotfix/**: 긴급 버그 수정 브랜치
- **release/**: 배포 준비 브랜치 (필요시)

### 워크플로우

#### 1. 새 기능 개발
```bash
# develop 브랜치에서 시작
git checkout develop
git pull origin develop

# 새로운 feature 브랜치 생성
git checkout -b feature/기능명

# 개발 작업 후 커밋
git add .
git commit -m "feat: 기능 설명"

# origin에 푸시
git push origin feature/기능명

# GitHub에서 develop으로 PR 생성
```

#### 2. 코드 리뷰 및 병합
- PR 생성 후 팀원 1명 이상의 승인 필요
- 테스트 통과 확인 (있는 경우)
- Conflict 해결 후 develop에 병합
- 병합 완료 후 로컬 feature 브랜치 삭제

#### 3. 배포 준비
```bash
# main으로 직접 병합 (해커톤 특성상 간소화)
git checkout main
git merge develop
git push origin main
```

#### 4. 핫픽스 (긴급 수정)
```bash
# main 브랜치에서 hotfix 브랜치 생성
git checkout main
git checkout -b hotfix/긴급수정사항

# 수정 후 main과 develop 모두에 병합
```

### 커밋 메시지 규칙
```
type(scope): subject

body

footer
```

**타입**:
- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 스타일 변경 (기능 변경 없음)
- `refactor`: 리팩토링
- `test`: 테스트 추가/수정
- `chore`: 빌드 과정 또는 보조 기능 수정

**예시**:
```
feat(recommendation): AI 기반 맛집 추천 기능 구현

- 유사도 알고리즘을 통한 맛집 추천 시스템 도입
- 사용자 취향 학습 기능 추가
- Kakao Map API 연동

Closes #15
```

### 브랜치 보호 규칙
- **main**: 직접 푸시 금지, PR을 통한 병합만 허용
- **develop**: 리뷰어 승인 후 병합 가능
- 최소 1명의 코드 리뷰 승인 필요

## 코딩 컨벤션

### JavaScript/React
- ESLint 규칙 준수
- Prettier를 통한 코드 포맷팅
- 컴포넌트명: PascalCase (HomePage, UserProfile)
- 파일명: PascalCase (HomePage.jsx, UserProfile.jsx)
- 변수/함수명: camelCase (userName, getUserData)
- 상수: UPPER_SNAKE_CASE (API_BASE_URL)

### CSS/Tailwind
- Tailwind CSS 클래스 우선 사용
- 커스텀 CSS는 최소화
- 모바일 우선 반응형 설계 (sm:, md:, lg: 브레이크포인트)

### API 호출
- axios 인스턴스 사용 (src/lib/axios.js)
- 환경변수로 API URL 관리
- 에러 핸들링 일관성 유지

## 프로젝트 구조
```
25_MoDong/
├── frontend/          # React + Vite 앱
│   ├── src/
│   │   ├── components/    # 재사용 컴포넌트
│   │   ├── pages/         # 페이지 컴포넌트  
│   │   ├── lib/          # 라이브러리 설정
│   │   └── assets/       # 정적 파일
│   ├── public/       # 정적 파일
│   └── package.json
├── backend/          # Node.js Express API (예정)
├── ai/              # Python AI 모델 (예정)  
└── README.md
```

## 주요 기능 (개발 예정)
1. **AI 기반 장소 추천**: 유사도 알고리즘으로 맞춤 추천
2. **지역 맛집 발견**: 성북구 내 숨은 맛집 큐레이션
3. **취향 학습**: 사용자 행동 패턴 분석
4. **소셜 기능**: 리뷰, 평점, 공유
5. **위치 기반 서비스**: 실시간 위치 맞춤 추천