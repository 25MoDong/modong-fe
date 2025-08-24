# AWS Deployment Resources

This directory contains AWS-specific configuration files for deploying the application.

## Files

### `cloudfront-functions.js`
CloudFront Function code for SPA routing only:
- Serves `index.html` for non-API, non-asset routes
- Leaves `/api/*` requests untouched so a CloudFront behavior can route them

Important limitations of CloudFront Functions:
- Cannot change `request.origin` or select a different origin
- Cannot perform network calls or read from external services
- Only suitable for lightweight header/URI rewrites at viewer request/response time

Usage:
1. Create a CloudFront Function in AWS Console with this code
2. Associate it with your distribution as a Viewer Request function
3. Configure a behavior for `/api/*` to route to your backend origin (see below)

## Deployment Process

See the main `DEPLOYMENT.md` file in the project root for complete deployment instructions.

The deployment script (`scripts/deploy.sh`) handles:
- Building the application
- Syncing files to S3 with proper cache headers
- Creating CloudFront invalidations

CloudFront Functions must be configured manually in the AWS Console.

Note on backend origin:
- CloudFront custom origins require a DNS hostname, not a raw IP. If your backend is only reachable via IP:port (e.g. `3.36.49.60:8080`), front it with an HTTP proxy you control (API Gateway HTTP API, or a tiny Nginx on EC2) and point CloudFront to that hostname.
