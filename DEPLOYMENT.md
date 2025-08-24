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

#### Option A: CloudFront Functions (Recommended)

1. Create a CloudFront Function using the code in `aws/cloudfront-functions.js`
2. Associate it with your distribution as a **Viewer Request** function
3. The function will:
   - Proxy `/api/*` requests to `3.36.49.60:8080`
   - Serve `index.html` for SPA routing

#### Option B: Origin Request Lambda@Edge

Create a Lambda@Edge function that handles API proxying:

```javascript
exports.handler = async (event) => {
    const request = event.Records[0].cf.request;
    const uri = request.uri;
    
    if (uri.startsWith('/api/')) {
        // Modify origin to point to backend
        request.origin = {
            custom: {
                domainName: '3.36.49.60',
                port: 8080,
                protocol: 'http',
                path: ''
            }
        };
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
- Requires explicit proxy configuration (Functions or Lambda@Edge)
- Better for high-traffic applications
- More complex setup but better performance and caching control