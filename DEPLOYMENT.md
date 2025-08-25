# Deployment Guide

This document explains how to deploy the frontend application to different platforms while ensuring proper backend API connectivity.

## Backend API Configuration

The application uses a backend API hosted at `http://3.36.49.60:8080`. The frontend handles this differently in development and production:

- **Development**: Vite proxy forwards `/api/*` requests to the backend
- **Production**: Platform-specific proxy/rewrite rules handle API requests

## Vercel Deployment

### 1. Vercel Configuration

The `vercel.json` file includes rewrite rules that proxy API requests:

```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "http://3.36.49.60:8080/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 2. Environment Variables (Optional)

You can override the API base URL using environment variables:

```bash
# In Vercel dashboard or .env file
VITE_API_BASE=http://3.36.49.60:8080
```

### 3. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## CloudFront + S3 Deployment

### 1. Build and Upload to S3

```bash
# Build the application
npm run build

# Upload dist/ folder to your S3 bucket
aws s3 sync dist/ s3://your-bucket-name --delete
```

### 2. CloudFront Configuration

#### Recommended: Behavior-based routing (no code)

Configure CloudFront to route API traffic via a dedicated behavior, and use the function only for SPA routing.

1) Origins
- `S3Origin` (default): your S3 website bucket or S3 origin access
- `ApiOrigin`: a hostname you control that proxies to the backend (see "Backend origin options" below)

2) Behaviors (order matters)
- Path pattern: `/api/*`
  - Origin: `ApiOrigin`
  - Allowed HTTP methods: `OPTIONS, GET, HEAD, POST, PUT, PATCH, DELETE`
  - Cache policy: `CachingDisabled` (managed)
  - Origin request policy: custom or managed that forwards:
    - Headers: `Authorization, Origin, Content-Type, Accept, Access-Control-Request-Method, Access-Control-Request-Headers`
    - Query strings: All
    - Cookies: All or as needed
  - Viewer protocol policy: `Redirect HTTP to HTTPS`

- Default behavior `/*`
  - Origin: `S3Origin`
  - Cache policy: optimized for static assets (e.g., Managed-CachingOptimized)
  - Viewer protocol policy: `Redirect HTTP to HTTPS`

3) Function for SPA routing
- Attach `aws/cloudfront-functions.js` as a Viewer Request function to the Default behavior only.
- It rewrites non-asset paths to `/index.html`.

4) Invalidation
- Invalidate `/*` after deploys that change `index.html` or routing.

#### Alternative: Lambda@Edge (Origin Request) for dynamic origin

If you must choose origin dynamically in code, use Lambda@Edge at the Origin Request trigger. CloudFront Functions cannot change the origin.

Example (note: still prefer behavior-based routing when possible):

```javascript
exports.handler = async (event) => {
  const request = event.Records[0].cf.request;
  const uri = request.uri;

  if (uri.startsWith('/api/')) {
    request.origin = {
      custom: {
        domainName: 'your-proxy.example.com',
        port: 443,
        protocol: 'https',
        path: ''
      }
    };
    // Ensure Host header matches the new origin
    request.headers.host = [{ key: 'host', value: 'your-proxy.example.com' }];
  }

  return request;
};
```

### 3. CloudFront Distribution Settings

- **Default Root Object**: `index.html`
- **Error Pages**: Configure 404 errors to return `index.html` (status 200) for SPA routing
- **Cache Behavior**: 
  - `/api/*` - No caching, forward all headers
  - `/*` - Cache static assets, forward minimal headers

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure proxy/rewrite rules are correctly configured
2. **404 on API Routes**: Check that `/api/*` patterns are properly routed to backend
3. **Mixed Content**: Use HTTPS backend or ensure proper proxy configuration
4. **SPA Routing**: Configure fallback to `index.html` for non-API routes

### Debug Tips

1. Check browser Network tab for API request destinations
2. Verify environment variables are loaded correctly:
   ```javascript
   console.log('API Base:', import.meta.env.VITE_API_BASE);
   ```
3. Test API endpoints directly: `https://yourdomain.com/api/v1`

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE` | Override API base URL | `http://3.36.49.60:8080` |

## Platform-Specific Notes

### Vercel
- Uses `rewrites` in `vercel.json` for API proxying
- Automatic HTTPS with proper certificate handling
- Zero-config deployment for most cases

### CloudFront + S3
- Requires explicit proxy configuration via a `/api/*` behavior
- CloudFront Functions for SPA routing only; use behaviors or Lambda@Edge for origin routing
- Better for high-traffic applications with strong caching control

### Backend origin options
- API Gateway HTTP API: Create an HTTP integration to `http://3.36.49.60:8080`, deploy, and use the API Gateway hostname as `ApiOrigin`.
- Nginx on EC2: Run a small reverse proxy that forwards `/api/` to `http://3.36.49.60:8080`. Use the EC2 public DNS or attach a domain; set that as `ApiOrigin`.
- ALB: If the backend can be registered as a target (within your VPC), front it with an ALB and use the ALB DNS as `ApiOrigin`.
