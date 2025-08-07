# PROJECT_INFO.md

## 프로젝트 개요
**프로젝트명**: 성북구 AI 맛집 추천 서비스  
**해커톤 주제**: AI로 다시 뛰는 우리 동네 - 지역 경제와 삶을 AI로 연결  
**타겟**: 성북구 거주 대학생 중심 20대 젊은 층  
**핵심 기능**: 내가 갔던 타 지역 장소와 유사한 내 주변 장소를 AI로 추천

## 기술 스택

### Frontend
- **프레임워크**: React.js (18+)
- **빌드 도구**: Vite (SWC 기반)
- **스타일링**: Tailwind CSS + CSS Modules
- **상태관리**: React Context + useState/useReducer
- **라우팅**: React Router DOM
- **HTTP 클라이언트**: Axios
- **지도**: Kakao Map API
- **배포**: Vercel

### Backend  
- **런타임**: Node.js (18+)
- **프레임워크**: Express.js
- **데이터베이스**: PostgreSQL (AWS RDS) + Redis (캐싱)
- **ORM**: Prisma
- **인증**: JWT + bcrypt
- **배포**: AWS EC2 + Lambda (Serverless Framework)
- **파일 스토리지**: AWS S3

### AI/ML
- **언어**: Python
- **프레임워크**: FastAPI
- **ML 라이브러리**: scikit-learn, pandas, numpy
- **추천 시스템**: Collaborative Filtering + Content-based
- **배포**: AWS Lambda + Docker

### 공통
- **버전 관리**: Git + GitHub
- **CI/CD**: GitHub Actions
- **API 문서**: Swagger/OpenAPI
- **모니터링**: AWS CloudWatch

## 디렉토리 구조
```
seongbuk-food-finder/
├── frontend/          # React + Vite 앱
├── backend/           # Node.js Express API
├── ai/               # Python AI 모델
├── shared/           # 공통 타입/유틸
├── deployment/       # AWS 배포 설정
└── docs/            # 문서
```

## 주요 기능
1. **AI 기반 장소 추천**: 유사도 알고리즘으로 맞춤 추천
2. **지역 맛집 발견**: 성북구 내 숨은 맛집 큐레이션  
3. **취향 학습**: 사용자 행동 패턴 분석
4. **소셜 기능**: 리뷰, 평점, 공유
5. **위치 기반 서비스**: 실시간 위치 맞춤 추천

## 개발 우선순위 (해커톤)
1. **Day 1**: Frontend UI 프로토타입 + 기본 라우팅
2. **Day 2**: Backend API + AI 추천 로직 
3. **Day 3**: 통합 + 배포 + 데모 준비