import api from './api';

/**
 * AI 기반 추천 API 래퍼
 * - POST /api/ai/recommend
 * - POST /api/ai/feedback
 * - GET  /api/ai/history/{userId}
 */

const aiApi = {
  async recommend(userIdOrPayload, maybePayload) {
    // Two supported call forms for backward-compatibility:
    // - recommend(userId, payload) -> sends POST /api/ai/recommend?userId=... with body=payload
    // - recommend(payload) -> legacy: sends POST /api/ai/recommend with body=payload
    let userId = null;
    let payload = null;
    if (maybePayload !== undefined) {
      userId = userIdOrPayload;
      payload = maybePayload || {};
    } else {
      payload = userIdOrPayload || {};
    }

    const path = userId ? `/api/ai/recommend?userId=${encodeURIComponent(userId)}` : '/api/ai/recommend';
    const res = await api.post(path, payload);
    return res.data || res;
  },

  async feedback(payload) {
    const res = await api.post('/api/ai/feedback', payload);
    return res.data || res;
  },

  async history(userId, opts = {}) {
    const limit = opts.limit != null ? `?limit=${Number(opts.limit)}` : '';
    const res = await api.get(`/api/ai/history/${encodeURIComponent(userId)}${limit}`);
    return res.data || res;
  }
};

export default aiApi;
