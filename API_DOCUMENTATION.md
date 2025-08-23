# 모동프랙 API 문서

프론트엔드에서 백엔드 API를 호출하기 위한 종합 가이드입니다.

## 목차
1. [사용자 관리 API (User API)](#사용자-관리-api)
2. [리뷰 관리 API (Review API)](#리뷰-관리-api)
3. [찜 제목 관리 API (JjimTitle API)](#찜-제목-관리-api)
4. [찜한 매장 관리 API (JjimStore API)](#찜한-매장-관리-api)
5. [최애 매장 관리 API (FavoriteStore API)](#최애-매장-관리-api)

---

## 사용자 관리 API

**Base URL**: `/api/v1`

### 1. 사용자 생성
- **Method**: `POST`
- **URL**: `/api/v1`
- **설명**: 새로운 사용자를 생성합니다.

**Request Body**:
```json
{
  "id": "johndoe123",
  "address": "정릉",
  "userMood": "조용한\n독서하기 좋은\n안락한"
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
- **설명**: 모든 사용자 목록을 조회합니다.

**Response**:
```json
[
  {
    "id": "johndoe123",
    "address": "정릉",
    "userMood": ["조용한", "독서하기 좋은", "안락한"],
    "user_stamp": 0
  },
  {
    "id": "janedoe456",
    "address": "홍대",
    "userMood": ["활기찬", "시끌벅적한"],
    "user_stamp": 5
  }
]
```

### 3. 특정 사용자 조회
- **Method**: `GET`
- **URL**: `/api/v1/{id}`
- **설명**: 특정 사용자 정보를 조회합니다.

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
- **설명**: 특정 사용자의 정보를 수정합니다.

**Path Parameters**:
- `id` (string): 사용자 ID

**Request Body**:
```json
{
  "id": "johndoe123",
  "address": "연남동",
  "userMood": "힙한\n트렌디한\n감성적인"
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
- **설명**: 특정 사용자를 삭제합니다.

**Path Parameters**:
- `id` (string): 사용자 ID

**Response**: `204 No Content`

---

## 리뷰 관리 API

**Base URL**: `/api/v2`

### 1. 리뷰 생성
- **Method**: `POST`
- **URL**: `/api/v2/creatReview`
- **설명**: 새로운 리뷰를 생성합니다.

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
  "review": "음식이 맛있어요"
}
```

### 2. 리뷰 수정
- **Method**: `PUT`
- **URL**: `/api/v2/updateReview/{userId}/{storeId}`
- **설명**: 특정 사용자의 특정 가게 리뷰를 수정합니다.

**Path Parameters**:
- `userId` (string): 사용자 ID
- `storeId` (string): 매장 ID

**Request Body**:
```json
{
  "userId": "johndoe123",
  "storeId": "cafe1",
  "review": "음식이 정말 맛있고 분위기도 좋아요"
}
```

**Response**:
```json
{
  "userId": "johndoe123",
  "storeId": "cafe1",
  "review": "음식이 정말 맛있고 분위기도 좋아요"
}
```

### 3. 모든 리뷰 조회
- **Method**: `GET`
- **URL**: `/api/v2/getAllReview`
- **설명**: 모든 리뷰를 조회합니다.

**Response**:
```json
[
  {
    "userId": "johndoe123",
    "storeId": "cafe1",
    "review": "음식이 맛있어요"
  },
  {
    "userId": "janedoe456",
    "storeId": "cafe2",
    "review": "분위기가 좋아요"
  }
]
```

### 4. 사용자별 리뷰 조회
- **Method**: `GET`
- **URL**: `/api/v2/userReview/{userId}`
- **설명**: 특정 사용자가 작성한 모든 리뷰를 조회합니다.

**Path Parameters**:
- `userId` (string): 사용자 ID

**Response**:
```json
[
  {
    "userId": "johndoe123",
    "storeId": "cafe1",
    "review": "음식이 맛있어요"
  },
  {
    "userId": "johndoe123",
    "storeId": "restaurant1",
    "review": "서비스가 친절해요"
  }
]
```

### 5. 매장별 리뷰 조회
- **Method**: `GET`
- **URL**: `/api/v2/storeReview/{storeId}`
- **설명**: 특정 매장에 작성된 모든 리뷰를 조회합니다.

**Path Parameters**:
- `storeId` (string): 매장 ID

**Response**:
```json
[
  {
    "userId": "johndoe123",
    "storeId": "cafe1",
    "review": "음식이 맛있어요"
  },
  {
    "userId": "janedoe456",
    "storeId": "cafe1",
    "review": "분위기가 아늑해요"
  }
]
```

### 6. 리뷰 삭제
- **Method**: `DELETE`
- **URL**: `/api/v2/deleteReview/{userId}/{storeId}`
- **설명**: 특정 사용자의 특정 매장 리뷰를 삭제합니다.

**Path Parameters**:
- `userId` (string): 사용자 ID
- `storeId` (string): 매장 ID

**Response**: `200 OK`

---

## 찜 제목 관리 API

**Base URL**: `/api/v3`

### 1. 찜 제목 생성
- **Method**: `POST`
- **URL**: `/api/v3/createJt`
- **설명**: 새로운 찜 제목을 생성합니다.

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
- **설명**: 특정 찜 제목을 수정합니다.

**Path Parameters**:
- `jtId` (integer): 찜 제목 ID (자동 증가)

**Request Body**:
```json
{
  "userId": "johndoe123",
  "title": "홍대 힙한 카페 모음"
}
```

**Response**:
```json
{
  "jjimTitleId": 1,
  "userId": "johndoe123",
  "jjimTitle": "홍대 힙한 카페 모음"
}
```

### 3. 찜 제목 조회
- **Method**: `GET`
- **URL**: `/api/v3/findJt/{jtId}`
- **설명**: 특정 찜 제목을 조회합니다.

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

### 4. 찜 제목 삭제
- **Method**: `DELETE`
- **URL**: `/api/v3/deleteJt/{jtId}`
- **설명**: 특정 찜 제목을 삭제합니다.

**Path Parameters**:
- `jtId` (integer): 찜 제목 ID

**Response**: `200 OK`

---

## 찜한 매장 관리 API

**Base URL**: `/api/v4`

### 1. 찜한 매장 등록
- **Method**: `POST`
- **URL**: `/api/v4/createJs`
- **설명**: 찜 제목에 매장을 추가합니다.

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
  "storeId": "cafe1"
}
```

### 2. 찜 제목별 매장 조회
- **Method**: `GET`
- **URL**: `/api/v4/getJs/{jtId}`
- **설명**: 특정 찜 제목에 포함된 모든 매장을 조회합니다.

**Path Parameters**:
- `jtId` (integer): 찜 제목 ID

**Response**:
```json
[
  {
    "jtId": 1,
    "storeId": "cafe1"
  },
  {
    "jtId": 1,
    "storeId": "cafe2"
  }
]
```

### 3. 찜한 매장 삭제
- **Method**: `DELETE`
- **URL**: `/api/v4/deleteJs/{jtId}/{storeId}`
- **설명**: 특정 찜 제목에서 특정 매장을 삭제합니다.

**Path Parameters**:
- `jtId` (integer): 찜 제목 ID
- `storeId` (string): 매장 ID

**Response**: `200 OK`

---

## 최애 매장 관리 API

**Base URL**: `/api/v5`

### 1. 최애 매장 등록
- **Method**: `POST`
- **URL**: `/api/v5`
- **설명**: 새로운 최애 매장을 등록합니다. (지오코딩 기능 포함)

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
- **설명**: 모든 사용자의 최애 매장을 조회합니다.

**Response**:
```json
[
  {
    "storeName": "토리쿠",
    "detail": "서울 노원구 공릉동 644-49",
    "userId": "johndoe123",
    "posX": 127.0728,
    "posY": 37.6254
  },
  {
    "storeName": "스타벅스",
    "detail": "서울 마포구 홍익로 39",
    "userId": "janedoe456",
    "posX": 126.9250,
    "posY": 37.5513
  }
]
```

### 3. 사용자별 최애 매장 조회
- **Method**: `GET`
- **URL**: `/api/v5/getUserFs`
- **설명**: 특정 사용자의 최애 매장들을 조회합니다.

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

### 4. 매장명과 상세주소로 특정 매장 조회
- **Method**: `GET`
- **URL**: `/api/v5/store/{storeName}/{detail}`
- **설명**: 매장명과 상세주소를 이용해 특정 매장을 조회합니다.

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

### 5. 매장명으로 매장 검색
- **Method**: `GET`
- **URL**: `/api/v5/store/{storeName}`
- **설명**: 매장명으로 매장을 검색합니다. (여러 결과 반환 가능)

**Path Parameters**:
- `storeName` (string): 매장명

**Response**:
```json
[
  {
    "storeName": "스타벅스",
    "detail": "서울 마포구 홍익로 39",
    "userId": "johndoe123",
    "posX": 126.9250,
    "posY": 37.5513
  },
  {
    "storeName": "스타벅스",
    "detail": "서울 강남구 테헤란로 152",
    "userId": "janedoe456",
    "posX": 127.0286,
    "posY": 37.4989
  }
]
```

### 6. 최애 매장 삭제
- **Method**: `DELETE`
- **URL**: `/api/v5/delete/{storeName}/{detail}`
- **설명**: 특정 최애 매장을 삭제합니다.

**Path Parameters**:
- `storeName` (string): 매장명
- `detail` (string): 상세주소

**Response**: `200 OK` (성공) 또는 `404 Not Found` (매장이 존재하지 않을 경우)

---

## 에러 처리

모든 API에서 공통적으로 발생할 수 있는 HTTP 상태 코드:

- `200 OK`: 요청 성공
- `201 Created`: 리소스 생성 성공
- `204 No Content`: 삭제 성공
- `400 Bad Request`: 잘못된 요청
- `404 Not Found`: 리소스를 찾을 수 없음
- `500 Internal Server Error`: 서버 내부 오류

## 데이터 타입 참고사항

- **문자열 (String)**: 모든 ID, 텍스트 필드
- **정수 (Integer)**: 찜 제목 ID (자동 증가), 사용자 스탬프 수
- **실수 (Double)**: 위도/경도 좌표 (posX, posY)
- **배열 (Array)**: 사용자 선호 분위기 목록

## 사용 예시 (JavaScript/Fetch)

```javascript
// 사용자 생성 예시
const createUser = async (userData) => {
  const response = await fetch('/api/v1', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData)
  });
  return response.json();
};

// 리뷰 조회 예시
const getUserReviews = async (userId) => {
  const response = await fetch(`/api/v2/userReview/${userId}`);
  return response.json();
};

// 최애 매장 등록 예시
const createFavoriteStore = async (storeData) => {
  const response = await fetch('/api/v5', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(storeData)
  });
  return response.json();
};
```