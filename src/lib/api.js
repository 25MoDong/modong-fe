// Avoid accessing `process` directly in the browser runtime where it may be undefined.
const _env = (typeof process !== 'undefined' && process.env) ? process.env : (typeof window !== 'undefined' && window.__env ? window.__env : {});
// If a runtime env override is provided, use it. In development (localhost) prefer relative
// paths so Vite dev server proxy (configured in vite.config.js) handles CORS.
let BASE = '';
if (_env.REACT_APP_API_BASE) {
  BASE = _env.REACT_APP_API_BASE.replace(/\/$/, '');
} else if (_env.API_BASE) {
  BASE = _env.API_BASE.replace(/\/$/, '');
} else if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
  // Use relative base so Vite proxy proxies /api requests to target
  BASE = '';
} else {
  // In production, prefer relative URLs so the browser requests go to the same origin
  // (CloudFront) which can proxy to the backend. Using an absolute http:// URL from
  // an HTTPS-served site causes Mixed Content errors in browsers.
  BASE = '';
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
    throw err;
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
