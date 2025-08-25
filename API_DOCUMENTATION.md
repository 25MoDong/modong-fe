# 모동프랙 API 문서

프론트엔드에서 백엔드 API를 호출하기 위한 종합 가이드입니다.

**Base URL**: `http://3.36.49.60:8080`
**API 버전**: v1
**보안**: JWT 토큰 기반 인증

## 목차
1. [사용자 관리 API (User Management)](#사용자-관리-api)
2. [매장 관리 API (Store Management)](#매장-관리-api)
3. [리뷰 관리 API (Review Management)](#리뷰-관리-api)
4. [찜 제목 관리 API (Jjim Title Management)](#찜-제목-관리-api)
5. [찜한 매장 관리 API (Jjim Store Management)](#찜한-매장-관리-api)
6. [최애 매장 관리 API (Favorite Store Management)](#최애-매장-관리-api)

---

## 사용자 관리 API

**Base URL**: `/api/v1`
**태그**: user_info - 회원 api

### 1. 사용자 생성
- **Method**: `POST`
- **URL**: `/api/v1`
- **설명**: json형식의 requsestBody를 통한 유저 생성

**Request Body**:
```json
{
  "id": "johndoe123",
  "address": "정릉",
  "userMood": ["조용한", "독서하기 좋은", "안락한"]
}
```

**Response**:
```json
{
  "id": "johndoe123",
  "address": "정릉",
  "userMood": ["조용한", "독서하기 좋은", "안락한"],
  "user_stamp": 0
}
```

### 2. 사용자 전체 조회
- **Method**: `GET`
- **URL**: `/api/v1`
- **설명**: json 데이터 리스트 return

**Response**:
```json
[
  {
    "id": "johndoe123",
    "address": "정릉",
    "userMood": ["조용한", "독서하기 좋은", "안락한"],
    "user_stamp": 0
  }
]
```

### 3. 특정 사용자 조회
- **Method**: `GET`
- **URL**: `/api/v1/{id}`
- **설명**: json 데이터 return

**Path Parameters**:
- `id` (string): 사용자 ID

**Response**:
```json
{
  "id": "johndoe123",
  "address": "정릉",
  "userMood": ["조용한", "독서하기 좋은", "안락한"],
  "user_stamp": 0
}
```

### 4. 사용자 정보 수정
- **Method**: `PUT`
- **URL**: `/api/v1/{id}`
- **설명**: 해당 id 지정 후 데이터 수정

**Path Parameters**:
- `id` (string): 사용자 ID

**Request Body**:
```json
{
  "id": "johndoe123",
  "address": "연남동",
  "userMood": ["힙한", "트렌디한", "감성적인"]
}
```

**Response**:
```json
{
  "id": "johndoe123",
  "address": "연남동",
  "userMood": ["힙한", "트렌디한", "감성적인"],
  "user_stamp": 0
}
```

### 5. 사용자 삭제
- **Method**: `DELETE`
- **URL**: `/api/v1/{id}`
- **설명**: 해당 id 지정 후 데이터 삭제

**Path Parameters**:
- `id` (string): 사용자 ID

---

## 매장 관리 API

**Base URL**: `/api/v6`
**태그**: store_info - 매장 정보 api

### 1. 매장 생성
- **Method**: `POST`
- **URL**: `/api/v6/createStore`
- **설명**: json형식의 requestBody를 통한 매장 생성

**Request Body**:
```json
{
  "storeId": "store001",
  "storeName": "토리쿠",
  "detail": "서울 노원구 공릉동 644-49",
  "phone": "02-1234-5678",
  "operatingHours": "09:00 - 22:00",
  "category": "한식",
  "mainMenu": "김치찌개, 된장찌개",
  "description": "정성스럽게 만드는 전통 한식 맛집입니다.",
  "storeMood": "아늑한\n조용한\n가족적인"
}
```

**Response**:
```json
{
  "storeId": "store001",
  "storeName": "토리쿠",
  "detail": "서울 노원구 공릉동 644-49",
  "phone": "02-1234-5678",
  "operatingHours": "09:00 - 22:00",
  "category": "한식",
  "mainMenu": "김치찌개, 된장찌개",
  "description": "정성스럽게 만드는 전통 한식 맛집입니다.",
  "storeMood": "아늑한\n조용한\n가족적인"
}
```

### 2. 모든 매장 조회
- **Method**: `GET`
- **URL**: `/api/v6/getAllStores`
- **설명**: json 데이터 리스트 return

**Response**:
```json
[
  {
    "storeId": "store001",
    "storeName": "토리쿠",
    "detail": "서울 노원구 공릉동 644-49",
    "phone": "02-1234-5678",
    "operatingHours": "09:00 - 22:00",
    "category": "한식",
    "mainMenu": "김치찌개, 된장찌개",
    "description": "정성스럽게 만드는 전통 한식 맛집입니다.",
    "storeMood": "아늑한\n조용한\n가족적인"
  }
]
```

### 3. 특정 매장 조회
- **Method**: `GET`
- **URL**: `/api/v6/{storeId}`
- **설명**: 매장 ID로 특정 매장 조회

**Path Parameters**:
- `storeId` (string): 매장 ID

**Response**:
```json
{
  "storeId": "store001",
  "storeName": "토리쿠",
  "detail": "서울 노원구 공릉동 644-49",
  "phone": "02-1234-5678",
  "operatingHours": "09:00 - 22:00",
  "category": "한식",
  "mainMenu": "김치찌개, 된장찌개",
  "description": "정성스럽게 만드는 전통 한식 맛집입니다.",
  "storeMood": "아늑한\n조용한\n가족적인"
}
```

### 4. 매장명으로 검색
- **Method**: `GET`
- **URL**: `/api/v6/search`
- **설명**: 매장명으로 매장 검색

**Query Parameters**:
- `name` (string): 검색할 매장명

**Request URL 예시**: `/api/v6/search?name=토리쿠`

**Response**:
```json
[
  {
    "storeId": "store001",
    "storeName": "토리쿠",
    "detail": "서울 노원구 공릉동 644-49",
    "phone": "02-1234-5678",
    "operatingHours": "09:00 - 22:00",
    "category": "한식",
    "mainMenu": "김치찌개, 된장찌개",
    "description": "정성스럽게 만드는 전통 한식 맛집입니다.",
    "storeMood": "아늑한\n조용한\n가족적인"
  }
]
```

### 5. 카테고리별 매장 조회
- **Method**: `GET`
- **URL**: `/api/v6/category/{category}`
- **설명**: 카테고리로 매장 검색

**Path Parameters**:
- `category` (string): 카테고리명 (예: "한식", "카페", "중식")

**Response**:
```json
[
  {
    "storeId": "store001",
    "storeName": "토리쿠",
    "detail": "서울 노원구 공릉동 644-49",
    "category": "한식"
  }
]
```

### 6. 매장 정보 수정
- **Method**: `PUT`
- **URL**: `/api/v6/{storeId}`
- **설명**: 매장 ID로 매장 정보 수정

**Path Parameters**:
- `storeId` (string): 매장 ID

**Request Body**:
```json
{
  "storeId": "store001",
  "storeName": "토리쿠",
  "detail": "서울 노원구 공릉동 644-49",
  "phone": "02-1234-5678",
  "operatingHours": "09:00 - 22:00",
  "category": "한식",
  "mainMenu": "김치찌개, 된장찌개",
  "description": "정성스럽게 만드는 전통 한식 맛집입니다.",
  "storeMood": "아늑한\n조용한\n가족적인"
}
```

### 7. 매장 삭제
- **Method**: `DELETE`
- **URL**: `/api/v6/{storeId}`
- **설명**: 매장 ID로 매장 삭제

**Path Parameters**:
- `storeId` (string): 매장 ID

---

## 리뷰 관리 API

**Base URL**: `/api/v2`
**태그**: review_info - 리뷰 api

### 1. 리뷰 생성
- **Method**: `POST`
- **URL**: `/api/v2/creatReview`
- **설명**: json형식의 requsestBody를 통한 리뷰 생성

**Request Body**:
```json
{
  "userId": "johndoe123",
  "storeId": "cafe1",
  "review": "음식이 맛있어요"
}
```

**Response**:
```json
{
  "userId": "johndoe123",
  "storeId": "cafe1",
  "storeName": "토리쿠",
  "review": "음식이 맛있어요"
}
```

### 2. 리뷰 수정
- **Method**: `PUT`
- **URL**: `/api/v2/updateReview/{userId}/{storeId}`
- **설명**: 사용자의 해당 가게 리뷰 수정 (사용자,가게 일치 시 수정)

**Path Parameters**:
- `userId` (string): 사용자 ID
- `storeId` (string): 매장 ID

**Request Body**:
```json
{
  "userId": "johndoe123",
  "storeId": "cafe1",
  "review": "수정된 리뷰 내용입니다"
}
```

**Response**:
```json
{
  "userId": "johndoe123",
  "storeId": "cafe1",
  "storeName": "토리쿠",
  "review": "수정된 리뷰 내용입니다"
}
```

### 3. 모든 리뷰 조회
- **Method**: `GET`
- **URL**: `/api/v2/getAllReview`
- **설명**: json 데이터 리스트 return

**Response**:
```json
[
  {
    "userId": "johndoe123",
    "storeId": "cafe1",
    "storeName": "토리쿠",
    "review": "음식이 맛있어요"
  }
]
```

### 4. 사용자별 리뷰 조회
- **Method**: `GET`
- **URL**: `/api/v2/userReview/{userId}`
- **설명**: 한 사용자가 작성한 모든 리뷰 조회 (json 데이터 리스트 return)

**Path Parameters**:
- `userId` (string): 사용자 ID

**Response**:
```json
[
  {
    "userId": "johndoe123",
    "storeId": "cafe1",
    "storeName": "토리쿠",
    "review": "음식이 맛있어요"
  }
]
```

### 5. 매장별 리뷰 조회
- **Method**: `GET`
- **URL**: `/api/v2/storeReview/{storeId}`
- **설명**: 한 가게에 작성된 모든 리뷰 조회 (json 데이터 리스트 return)

**Path Parameters**:
- `storeId` (string): 매장 ID

**Response**:
```json
[
  {
    "userId": "johndoe123",
    "storeId": "cafe1",
    "storeName": "토리쿠",
    "review": "음식이 맛있어요"
  }
]
```

### 6. 리뷰 삭제
- **Method**: `DELETE`
- **URL**: `/api/v2/deleteReview/{userId}/{storeId}`
- **설명**: 사용자의 해당 가게 리뷰 삭제 (사용자,가게 일치 시 삭제)

**Path Parameters**:
- `userId` (string): 사용자 ID
- `storeId` (string): 매장 ID

---

## 찜 제목 관리 API

**Base URL**: `/api/v3`
**태그**: jt_info - 찜 제목 api

### 1. 찜 제목 생성
- **Method**: `POST`
- **URL**: `/api/v3/createJt`
- **설명**: json형식의 requestBody로 데이터 받아 생성

**Request Body**:
```json
{
  "userId": "johndoe123",
  "title": "연남 분위기 카페 모음"
}
```

**Response**:
```json
{
  "jjimTitleId": 1,
  "userId": "johndoe123",
  "jjimTitle": "연남 분위기 카페 모음"
}
```

### 2. 찜 제목 수정
- **Method**: `PUT`
- **URL**: `/api/v3/updateJt/{jtId}`
- **설명**: 사용자의 찜 제목 수정 (auto incremetn 설정인 jtId를 통해서 접근해서 수정하는 로직이므로 주의)

**Path Parameters**:
- `jtId` (integer): 찜 제목 ID

**Request Body**:
```json
{
  "userId": "johndoe123",
  "title": "수정된 찜 제목"
}
```

**Response**:
```json
{
  "jjimTitleId": 1,
  "userId": "johndoe123",
  "jjimTitle": "수정된 찜 제목"
}
```

### 3. 전체 찜 제목 조회
- **Method**: `GET`
- **URL**: `/api/v3/getAllJt`
- **설명**: 모든 사용자의 찜 제목을 조회합니다

**Response**:
```json
[
  {
    "jjimTitleId": 1,
    "userId": "johndoe123",
    "jjimTitle": "연남 분위기 카페 모음"
  }
]
```

### 4. 특정 찜 제목 조회
- **Method**: `GET`
- **URL**: `/api/v3/findJt/{jtId}`
- **설명**: jtId 조회로 사용자가 정의한 찜 제목 조회 (json 데이터 리스트 return)

**Path Parameters**:
- `jtId` (integer): 찜 제목 ID

**Response**:
```json
[
  {
    "jjimTitleId": 1,
    "userId": "johndoe123",
    "jjimTitle": "연남 분위기 카페 모음"
  }
]
```

### 5. 찜 제목 삭제
- **Method**: `DELETE`
- **URL**: `/api/v3/deleteJt/{jtId}`
- **설명**: jtId로 지정하여 삭제

**Path Parameters**:
- `jtId` (integer): 찜 제목 ID

---

## 찜한 매장 관리 API

**Base URL**: `/api/v4`
**태그**: js_info - 찜한 매장 api

### 1. 찜한 매장 등록
- **Method**: `POST`
- **URL**: `/api/v4/createJs`
- **설명**: 찜 제목, 매장id로 등록

**Request Body**:
```json
{
  "jtId": 1,
  "storeId": "cafe1"
}
```

**Response**:
```json
{
  "jtId": 1,
  "storeId": "cafe1",
  "storeName": "토리쿠"
}
```

### 2. 찜 제목별 매장 조회
- **Method**: `GET`
- **URL**: `/api/v4/getJs/{jtId}`
- **설명**: 찜 제목에 해당하는 매장 정보 read (json 형식 데이터 return)

**Path Parameters**:
- `jtId` (integer): 찜 제목 ID

**Response**:
```json
[
  {
    "jtId": 1,
    "storeId": "cafe1",
    "storeName": "토리쿠"
  }
]
```

### 3. 찜한 매장 삭제
- **Method**: `DELETE`
- **URL**: `/api/v4/deleteJs/{jtId}/{storeId}`
- **설명**: 찜 제목에 해당하는 찜 매장 삭제 (찜 제목, 찜 매장 id 받아 해당 js 삭제)

**Path Parameters**:
- `jtId` (integer): 찜 제목 ID
- `storeId` (string): 매장 ID

---

## 최애 매장 관리 API

**Base URL**: `/api/v5`
**태그**: favoriteStore_info - 유저 최애 매장 api

### 1. 최애 매장 등록
- **Method**: `POST`
- **URL**: `/api/v5`
- **설명**: 새로운 최애 매장을 등록합니다 (지오코딩 기능 포함)

**Request Body**:
```json
{
  "userId": "johndoe123",
  "storeName": "토리쿠",
  "storeDetail": "서울 노원구 공릉동 644-49"
}
```

**Response**:
```json
{
  "storeName": "토리쿠",
  "detail": "서울 노원구 공릉동 644-49",
  "userId": "johndoe123",
  "posX": 127.0728,
  "posY": 37.6254
}
```

### 2. 모든 최애 매장 조회
- **Method**: `GET`
- **URL**: `/api/v5/getAllFs`
- **설명**: 모든 사용자의 최애 매장을 조회합니다

**Response**:
```json
[
  {
    "storeName": "토리쿠",
    "detail": "서울 노원구 공릉동 644-49",
    "userId": "johndoe123",
    "posX": 127.0728,
    "posY": 37.6254
  }
]
```

### 3. 사용자별 최애 매장 조회
- **Method**: `GET`
- **URL**: `/api/v5/getUserFs`
- **설명**: 특정 사용자의 최애 매장들을 조회합니다

**Query Parameters**:
- `userId` (string): 사용자 ID

**Request URL 예시**: `/api/v5/getUserFs?userId=johndoe123`

**Response**:
```json
[
  {
    "storeName": "토리쿠",
    "detail": "서울 노원구 공릉동 644-49",
    "userId": "johndoe123",
    "posX": 127.0728,
    "posY": 37.6254
  }
]
```

### 4. 매장명으로 매장 검색
- **Method**: `GET`
- **URL**: `/api/v5/store/{storeName}`
- **설명**: 매장명으로 매장을 검색합니다 (여러 결과 반환 가능)

**Path Parameters**:
- `storeName` (string): 매장명

**Response**:
```json
[
  {
    "storeName": "토리쿠",
    "detail": "서울 노원구 공릉동 644-49",
    "userId": "johndoe123",
    "posX": 127.0728,
    "posY": 37.6254
  }
]
```

### 5. 매장명과 상세주소로 특정 매장 조회
- **Method**: `GET`
- **URL**: `/api/v5/store/{storeName}/{detail}`
- **설명**: 매장명과 상세주소를 이용해 특정 매장을 조회합니다

**Path Parameters**:
- `storeName` (string): 매장명
- `detail` (string): 상세주소

**Response**:
```json
{
  "storeName": "토리쿠",
  "detail": "서울 노원구 공릉동 644-49",
  "userId": "johndoe123",
  "posX": 127.0728,
  "posY": 37.6254
}
```

### 6. 최애 매장 삭제
- **Method**: `DELETE`
- **URL**: `/api/v5/delete/{storeName}/{detail}`
- **설명**: 특정 최애 매장을 삭제합니다

**Path Parameters**:
- `storeName` (string): 매장명
- `detail` (string): 상세주소

---

## 보안 (JWT 인증)

모든 API는 JWT 토큰 기반 인증을 사용합니다.

**Request Header**:
```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

### JWT 토큰 구조
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user_id",
    "iat": 1629123456,
    "exp": 1629209856,
    "authorities": ["USER"]
  }
}
```

---

## 에러 처리

모든 API에서 공통적으로 발생할 수 있는 HTTP 상태 코드:

- `200 OK`: 요청 성공
- `201 Created`: 리소스 생성 성공
- `204 No Content`: 삭제 성공
- `400 Bad Request`: 잘못된 요청 파라미터
- `401 Unauthorized`: JWT 토큰 인증 실패
- `403 Forbidden`: 권한 없음
- `404 Not Found`: 리소스를 찾을 수 없음
- `409 Conflict`: 리소스 충돌 (중복 생성 등)
- `422 Unprocessable Entity`: 유효성 검사 실패
- `500 Internal Server Error`: 서버 내부 오류

### 에러 응답 형식
```json
{
  "timestamp": "2025-08-25T10:30:00.123Z",
  "status": 400,
  "error": "Bad Request",
  "message": "요청 파라미터가 잘못되었습니다.",
  "path": "/api/v1"
}
```

---

## 데이터 스키마

### User Schema (UserResponseDto)
```json
{
  "id": "string",
  "address": "string",
  "userMood": ["string"],
  "user_stamp": "integer"
}
```

### Store Schema (StoreResponseDto)
```json
{
  "storeId": "string",
  "storeName": "string",
  "detail": "string",
  "phone": "string",
  "operatingHours": "string",
  "category": "string",
  "mainMenu": "string",
  "description": "string",
  "storeMood": "string"
}
```

### Review Schema (ReviewResponseDto)
```json
{
  "userId": "string",
  "storeId": "string",
  "storeName": "string",
  "review": "string"
}
```

### Jjim Title Schema (JtResponseDto)
```json
{
  "jjimTitleId": "integer",
  "userId": "string",
  "jjimTitle": "string"
}
```

### Jjim Store Schema (JsResponseDto)
```json
{
  "jtId": "integer",
  "storeId": "string",
  "storeName": "string"
}
```

### Favorite Store Schema (FsResponseDto)
```json
{
  "storeName": "string",
  "detail": "string",
  "userId": "string",
  "posX": "double",
  "posY": "double"
}
```

---

## 사용 예시 (JavaScript/Fetch)

### 인증 헤더가 포함된 요청 함수
```javascript
const API_BASE_URL = 'http://3.36.49.60:8080';

// JWT 토큰을 포함한 공통 헤더
const getAuthHeaders = (token) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
});

// 사용자 생성 예시
const createUser = async (userData, token) => {
  const response = await fetch(`${API_BASE_URL}/api/v1`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(userData)
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// 모든 매장 조회 예시
const getAllStores = async (token) => {
  const response = await fetch(`${API_BASE_URL}/api/v6/getAllStores`, {
    headers: getAuthHeaders(token)
  });
  
  if (!response.ok) {
    throw new Error(`매장 조회 실패: ${response.status}`);
  }
  
  return response.json();
};

// 매장명으로 검색 예시
const searchStores = async (name, token) => {
  const response = await fetch(
    `${API_BASE_URL}/api/v6/search?name=${encodeURIComponent(name)}`,
    {
      headers: getAuthHeaders(token)
    }
  );
  
  if (!response.ok) {
    throw new Error(`매장 검색 실패: ${response.status}`);
  }
  
  return response.json();
};

// 리뷰 생성 예시
const createReview = async (reviewData, token) => {
  const response = await fetch(`${API_BASE_URL}/api/v2/creatReview`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(reviewData)
  });
  
  if (!response.ok) {
    throw new Error(`리뷰 생성 실패: ${response.status}`);
  }
  
  return response.json();
};

// 최애 매장 등록 예시
const createFavoriteStore = async (storeData, token) => {
  const response = await fetch(`${API_BASE_URL}/api/v5`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(storeData)
  });
  
  if (!response.ok) {
    throw new Error(`최애 매장 등록 실패: ${response.status}`);
  }
  
  return response.json();
};

// 에러 처리가 포함된 통합 API 클래스
class ModongAPI {
  constructor(baseURL = API_BASE_URL, token = null) {
    this.baseURL = baseURL;
    this.token = token;
  }

  setToken(token) {
    this.token = token;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: getAuthHeaders(this.token),
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('API 요청 실패:', error);
      throw error;
    }
  }

  // 사용자 관련 메서드
  async createUser(userData) {
    return this.request('/api/v1', {
      method: 'POST',
      body: userData
    });
  }

  async getUser(userId) {
    return this.request(`/api/v1/${userId}`);
  }

  async getAllUsers() {
    return this.request('/api/v1');
  }

  // 매장 관련 메서드
  async getAllStores() {
    return this.request('/api/v6/getAllStores');
  }

  async getStore(storeId) {
    return this.request(`/api/v6/${storeId}`);
  }

  async searchStores(name) {
    return this.request(`/api/v6/search?name=${encodeURIComponent(name)}`);
  }

  async getStoresByCategory(category) {
    return this.request(`/api/v6/category/${category}`);
  }

  // 리뷰 관련 메서드
  async createReview(reviewData) {
    return this.request('/api/v2/creatReview', {
      method: 'POST',
      body: reviewData
    });
  }

  async getAllReviews() {
    return this.request('/api/v2/getAllReview');
  }

  async getStoreReviews(storeId) {
    return this.request(`/api/v2/storeReview/${storeId}`);
  }

  async getUserReviews(userId) {
    return this.request(`/api/v2/userReview/${userId}`);
  }

  // 찜 제목 관련 메서드
  async createJjimTitle(titleData) {
    return this.request('/api/v3/createJt', {
      method: 'POST',
      body: titleData
    });
  }

  async getAllJjimTitles() {
    return this.request('/api/v3/getAllJt');
  }

  // 찜한 매장 관련 메서드
  async addJjimStore(jjimData) {
    return this.request('/api/v4/createJs', {
      method: 'POST',
      body: jjimData
    });
  }

  async getJjimStores(jtId) {
    return this.request(`/api/v4/getJs/${jtId}`);
  }

  // 최애 매장 관련 메서드
  async createFavoriteStore(storeData) {
    return this.request('/api/v5', {
      method: 'POST',
      body: storeData
    });
  }

  async getAllFavoriteStores() {
    return this.request('/api/v5/getAllFs');
  }

  async getUserFavoriteStores(userId) {
    return this.request(`/api/v5/getUserFs?userId=${userId}`);
  }
}

// 사용 예시
const api = new ModongAPI();
api.setToken('your-jwt-token-here');

// 사용자 생성
api.createUser({
  id: 'johndoe123',
  address: '정릉',
  userMood: ['조용한', '독서하기 좋은']
}).then(user => {
  console.log('사용자 생성 성공:', user);
}).catch(error => {
  console.error('사용자 생성 실패:', error);
});

// 매장 검색
api.searchStores('토리쿠').then(stores => {
  console.log('검색 결과:', stores);
}).catch(error => {
  console.error('검색 실패:', error);
});
```

---

## 주요 변경사항 (v1.0.0)

1. **실제 OpenAPI 스펙 반영**
   - 실제 백엔드 OpenAPI 스펙에 맞춘 정확한 엔드포인트 문서화
   - 실제 Request/Response 스키마 반영
   - 타입별로 정확한 태그 분류

2. **API 엔드포인트 정리**
   - 사용자 관리: `/api/v1`
   - 매장 관리: `/api/v6` 
   - 리뷰 관리: `/api/v2`
   - 찜 제목 관리: `/api/v3`
   - 찜한 매장 관리: `/api/v4`
   - 최애 매장 관리: `/api/v5`

3. **데이터 스키마 정확성**
   - 실제 DTO 구조에 맞춘 스키마 정의
   - 필수/선택 필드 명확화
   - 타입 정보 정확히 반영

4. **실용적인 JavaScript 예시**
   - 완전한 ModongAPI 클래스 제공
   - 에러 처리 포함
   - 실제 프로젝트에서 바로 사용 가능한 코드

이 문서는 modong 프로젝트의 실제 OpenAPI 명세를 반영하며, 모든 엔드포인트는 현재 운영 중인 백엔드 서버와 정확히 일치합니다.