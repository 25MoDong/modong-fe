// CloudFront Function for SPA routing only
// Attach as a Viewer Request function.
//
// Important: CloudFront Functions cannot change the origin (request.origin) or proxy to
// another endpoint. Use a CloudFront behavior that routes `/api/*` to a proper origin,
// or Lambda@Edge (Origin Request) if you must rewrite origins dynamically.

function handler(event) {
  var request = event.request;
  var uri = request.uri;

  // Leave API requests untouched. A dedicated CloudFront behavior should route
  // `/api/*` to the backend origin with appropriate policies.
  if (uri.startsWith('/api/')) {
    return request;
  }

  // SPA routing: serve index.html for non-asset paths
  if (!uri.includes('.') && uri !== '/') {
    request.uri = '/index.html';
  }

  return request;
}
