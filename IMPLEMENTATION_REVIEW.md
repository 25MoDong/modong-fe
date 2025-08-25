# Frontend Implementation Review

This document summarizes what’s implemented in the frontend, how it integrates with the backend API, and how to deploy behind CloudFront + API Gateway without 404/400 issues. It also confirms the “recently visited place” modal scope.

## App Overview

- Routing: `src/App.jsx` defines routes for Home, Map, Search, Favorites, PlaceDetail, MyPage, Coupons, CouponDetail, WriteReview, ReviewComplete, SavedHistory, MyReviews. Pages are lazily loaded.
- Layout: `src/components/Layout/Layout.jsx` provides the shell, search mode context, and bottom tab visibility rules.
- Initialization: `src/components/AppInitializer.jsx` coordinates the initial loading screen, onboarding redirect enforcement, selected-user hydration, and the PlaceAddModal.
- State: `src/lib/userStore.js` stores the current user id and data; `src/contexts/SearchModeContext.jsx` drives search UI state.
- API: Thin wrapper in `src/lib/api.js` with environment-based base URL and request helper; feature-specific wrappers bundled in `src/lib/*.js` files.

## Key Features Implemented

- Onboarding
  - Components under `src/components/Onboarding/*` implement test-user selection and preference redefinition.
  - Completion dispatches `OnboardingCompleted` event and sets `onboarding_completed` in localStorage.
- Home Page (`src/pages/Home.jsx`)
  - Gate with onboarding; hero with place selection; tags from user’s favorites; stamp/coupon status cards; favorites collection UI.
- Map (`src/pages/Map.jsx` + `src/components/map/*`)
  - Kakao map integration with marker clusterer, info window, search modal flow, filters, and view/marker interactions. Debounced viewport tracking and state sync are present.
- Favorites/Collections
  - `src/components/favorites/*` for collections CRUD and picker sheet.
  - Data via `favoriteStoreApi.js`, `jtApi.js`, and `jsApi.js` wrappers.
- Reviews
  - `src/pages/WriteReview.jsx`, `src/pages/MyReviews.jsx`, `src/pages/PlaceDetail.jsx` integrate with `reviewApi.js` for create/list/update/delete.
- Misc
  - Saved history, coupons, and simple utility components (toasts, tags, cards, etc.).

## “Recently Visited Place” Modal Scope

- Implemented as `src/components/modals/PlaceAddModal.jsx` and orchestrated by `src/components/AppInitializer.jsx`.
- Confirmed behavior:
  - Shows only on homepage (`'/'`), after initialization delay, and only after onboarding completes.
  - Respects a localStorage “snooze” period via `hide_place_modal_until`.
  - Automatically closes when navigating away from `'/'`.

No code change required; scope is already home-only and robust.

## Backend API Integration

- Base config: `src/lib/api.js` chooses `VITE_API_BASE` if set; otherwise uses relative paths so platform rewrites/proxy handle routing.
- Path encoding: All path params now use a shared encoder to avoid 400s when IDs or names include spaces/special characters.
  - Helper: `encodePathSegment` exported by `src/lib/api.js`.
  - Toggle double-encoding with `VITE_DOUBLE_ENCODE_PATHS=1` for environments (e.g., some API Gateway paths) that double-decode.
- Active wrappers used by the app:
  - Users: `src/lib/backend.js`, `src/lib/userApi.js` (v1)
  - Stores/Map: `src/lib/backend.js`, `src/lib/storeApi.js` (v6)
  - Favorites: `src/lib/favoriteStoreApi.js` (v5), `src/lib/jtApi.js` (v3), `src/lib/jsApi.js` (v4)
  - Reviews: `src/lib/reviewApi.js` (v2) with fallback for legacy typo route.

## Deployment: CloudFront + API Gateway

Goal: `https://<your-domain>/api/*` should reach the backend via API Gateway, while SPA routes serve `index.html` from S3.

1) CloudFront Origins
   - `S3Origin`: S3 bucket (website or OAC) hosting the built frontend.
   - `ApiOrigin`: API Gateway HTTP API domain (or another reverse proxy domain you control).

2) Behaviors (order matters)
   - `/api/*` → `ApiOrigin`
     - Methods: OPTIONS, GET, HEAD, POST, PUT, PATCH, DELETE
     - Cache policy: CachingDisabled
     - Origin request policy: forward headers `Authorization, Origin, Content-Type, Accept, Access-Control-Request-Method, Access-Control-Request-Headers`; forward all query strings; cookies as needed
     - Viewer protocol: Redirect HTTP to HTTPS
   - Default `/*` → `S3Origin`
     - SPA caching policy per your needs

3) SPA Routing Function
   - Attach `aws/cloudfront-functions.js` to Default behavior only.
   - It leaves `/api/*` untouched and rewrites non-asset app routes to `/index.html`.

4) API Gateway (HTTP API)
   - Route: `ANY /api/{proxy+}`
   - Integration: HTTP integration → `http://3.36.49.60:8080/api/{proxy}`
   - Stage: deploy (if not `$default`, include `/{stage}` in the CloudFront origin or a behavior path)
   - CORS: enable as needed (especially for direct calls during debugging)

5) Environment
   - Frontend: defaults to relative `/api/...` calls. Set `VITE_API_BASE` only if bypassing CF/APIGW.
   - Path decoding quirks: if API Gateway double-decodes path segments and you see 400s for IDs with spaces, build with `VITE_DOUBLE_ENCODE_PATHS=1`.

## 404/400 Resolution Guide

- 404 on API
  - Ensure CloudFront has a higher-priority `/api/*` behavior pointing at `ApiOrigin`.
  - Confirm SPA function is not attached to the `/api/*` behavior.
  - In API Gateway, verify `ANY /api/{proxy+}` route and correct integration path.
  - If using a non-default stage, ensure CloudFront uses the stage path.

- 400 on path parameters
  - Use the updated client with encoded path segments across all modules.
  - If API Gateway double-decodes: set `VITE_DOUBLE_ENCODE_PATHS=1` at build time.
  - Alternative: change backend endpoints to accept IDs in query params instead of path segments where practical.

## Diagnostics

- Client logging: enable `VITE_API_DEBUG=1` to log each API call (method, URL, status, duration). Useful to confirm which origin served a request and whether SPA rewrites interfered.
- Encoding toggle: set `VITE_DOUBLE_ENCODE_PATHS=1` if you observe 400s when IDs include spaces or special characters behind API Gateway.
- Curl via CloudFront: run the commands in “Quick Verification Commands” pointing at the CloudFront domain to ensure the `/api/*` behavior is used.

## Quick Verification Commands

Replace `<domain>` with your CloudFront domain.

```bash
# Users
curl -i https://<domain>/api/v1
curl -i https://<domain>/api/v1/USER%20WITH%20SPACE

# Stores
curl -i "https://<domain>/api/v6/search?name=%ED%86%A0%EB%A6%AC%EC%BF%A0"
curl -i https://<domain>/api/v6/store%2Fwith%20specials  # if applicable

# Favorites by user
curl -i "https://<domain>/api/v5/getUserFs?userId=johndoe123"
```

## Vercel Deployment (Alternative)

- `vercel.json` already includes a rewrite to proxy `/api/*` to `http://3.36.49.60:8080/api/*` and SPA fallback to `/index.html`.
- You can also set `VITE_API_BASE` if directly calling the backend is desired.

## Noted Gaps and Suggestions

- Add minimal error UI for network failures on Map and Home list fetches.
- Consider consolidating the dual API layers (`backend.js` vs. feature-specific modules) or ensure both stay consistent.
- If JWT is enforced by backend, thread a token provider into `api.js` headers and handle 401 refresh/redirect.

— End of review —
