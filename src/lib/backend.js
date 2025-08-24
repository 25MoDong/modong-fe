import api from './api';

// Backend helper wrapping documented endpoints (API_DOCUMENTATION.md)
const backend = {
  // v1 - user API
  async getAllUsers() {
    const res = await api.get('/api/v1');
    return Array.isArray(res.data) ? res.data : (res.data?.items || []);
  },

  async getUserById(id) {
    const res = await api.get('/api/v1/' + encodeURIComponent(id));
    return res.data;
  },
  // v6 - store API (map feature priority)
  async getAllStores() {
    // GET /api/v6/getAllStores
    const res = await api.get('/api/v6/getAllStores');
    return Array.isArray(res.data) ? res.data : (res.data?.items || []);
  },

  async getUserStores(userId) {
    // GET /api/v5/getUserFs?userId=...
    if (!userId) return [];
    const res = await api.get('/api/v5/getUserFs?userId=' + encodeURIComponent(userId));
    return Array.isArray(res.data) ? res.data : (res.data?.items || []);
  },

  async getStoreById(storeId) {
    // GET /api/v6/{storeId}
    const res = await api.get('/api/v6/' + encodeURIComponent(storeId));
    return res.data;
  },

  async searchStores(query) {
    // Use documented search endpoint: GET /api/v6/search?name=...
    if (!query || !query.trim()) return [];
    const res = await api.get('/api/v6/search?name=' + encodeURIComponent(query));
    return Array.isArray(res.data) ? res.data : [];
  },

  async getPlaceById(id) {
    // Map to storeId endpoint
    try {
      return await backend.getStoreById(id);
    } catch (_) {
      return null;
    }
  }
};

export default backend;
