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
  // v5 - favorite stores / places
  async getAllStores() {
    // GET /api/v5/getAllFs
    const res = await api.get('/api/v5/getAllFs');
    return Array.isArray(res.data) ? res.data : (res.data?.items || []);
  },

  async getUserStores(userId) {
    // GET /api/v5/getUserFs?userId=...
    const res = await api.get('/api/v5/getUserFs', { params: { userId } });
    return Array.isArray(res.data) ? res.data : (res.data?.items || []);
  },

  async getStoreByNameDetail(storeName, detail) {
    // GET /api/v5/store/{storeName}/{detail}
    const url = '/api/v5/store/' + encodeURIComponent(storeName) + '/' + encodeURIComponent(detail || '');
    const res = await api.get(url);
    return res.data;
  },

  async searchStores(query) {
    // No dedicated search endpoint in the docs — fetch all and filter client-side
    if (!query || !query.trim()) return [];
    const list = await backend.getAllStores();
    const q = query.toLowerCase();
    return list.filter((s) => {
      const name = (s.storeName || s.name || '').toLowerCase();
      const detail = (s.detail || s.address || '').toLowerCase();
      const category = (s.category || '').toLowerCase();
      return name.includes(q) || detail.includes(q) || category.includes(q);
    });
  },

  async getPlaceById(id) {
    // The docs don't define an ID-based endpoint; try to find a match in getAllStores by storeName or detail
    const list = await backend.getAllStores();
    const found = list.find((s) => String(s.storeName) === String(id) || String(s.storeId) === String(id) || String(s.detail) === String(id));
    return found || null;
  }
};

export default backend;
