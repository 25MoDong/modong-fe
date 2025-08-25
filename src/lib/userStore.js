const USER_KEY = 'selected_user_id';

// Simple user store using localStorage and custom events for cross-component updates
const userStore = {
  getUserId() {
    return localStorage.getItem(USER_KEY);
  },

  async setUser(user) {
    try {
      if (user && user.id) {
        localStorage.setItem(USER_KEY, String(user.id));
      } else {
        localStorage.removeItem(USER_KEY);
      }
    } catch (e) {}
    // dispatch event for listeners
    window.dispatchEvent(new CustomEvent('UserChanged', { detail: user }));
  },

  clear() {
    try { localStorage.removeItem(USER_KEY); } catch (e) {}
    window.dispatchEvent(new CustomEvent('UserChanged', { detail: null }));
  }
};

export default userStore;
