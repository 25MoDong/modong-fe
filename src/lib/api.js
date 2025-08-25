// API Base URL configuration
// Priority: Vite env var > legacy env vars > auto-detection
let BASE = '';

// Check for Vite environment variable first
if (import.meta.env.VITE_API_BASE) {
  BASE = import.meta.env.VITE_API_BASE.replace(/\/$/, '');
} else {
  // Fallback to legacy environment variables for backwards compatibility
  const _env = (typeof process !== 'undefined' && process.env) ? process.env : (typeof window !== 'undefined' && window.__env ? window.__env : {});
  
  if (_env.REACT_APP_API_BASE) {
    BASE = _env.REACT_APP_API_BASE.replace(/\/$/, '');
  } else if (_env.API_BASE) {
    BASE = _env.API_BASE.replace(/\/$/, '');
  } else if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    // Use relative base so Vite proxy handles CORS in development
    BASE = '';
  } else {
    // In production, use relative URLs so Vercel rewrites can proxy to backend
    BASE = '';
  }
}

async function request(path, options = {}) {
  const url = path.startsWith('http') ? path : `${BASE}${path.startsWith('/') ? '' : '/'}${path}`;
  const opts = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    method: options.method || 'GET',
    body: options.body ? JSON.stringify(options.body) : undefined,
  };

  const debug = !!(import.meta?.env && import.meta.env.VITE_API_DEBUG);
  const started = Date.now();
  if (debug) {
    // eslint-disable-next-line no-console
    console.debug('[api]', opts.method, url, options.body ? { body: options.body } : '');
  }

  const res = await fetch(url, opts);
  const contentType = res.headers.get('Content-Type') || '';
  let data = null;
  if (contentType.includes('application/json')) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  if (!res.ok) {
    const err = new Error(`HTTP ${res.status} ${res.statusText}`);
    err.status = res.status;
    err.data = data;
    if (debug) {
      // eslint-disable-next-line no-console
      console.debug('[api]', opts.method, url, '->', res.status, `${Date.now() - started}ms`, data);
    }
    throw err;
  }
  if (debug) {
    // eslint-disable-next-line no-console
    console.debug('[api]', opts.method, url, '->', res.status, `${Date.now() - started}ms`);
  }
  return { data, status: res.status, headers: res.headers };
}

export default {
  get: (path, opts) => request(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
  put: (path, body, opts) => request(path, { ...opts, method: 'PUT', body }),
  delete: (path, opts) => request(path, { ...opts, method: 'DELETE' }),
  BASE,
};

// Encode a single path segment safely.
// Some deployments (e.g., behind API Gateway) double-decode path params.
// Toggle double-encoding with VITE_DOUBLE_ENCODE_PATHS=1 at build time.
export const encodePathSegment = (value) => {
  const s = String(value ?? '');
  const double = !!(import.meta?.env && import.meta.env.VITE_DOUBLE_ENCODE_PATHS);
  return double ? encodeURIComponent(encodeURIComponent(s)) : encodeURIComponent(s);
};
