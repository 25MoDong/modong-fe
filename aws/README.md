# AWS Deployment Resources

This directory contains AWS-specific configuration files for deploying the application.

## Files

### `cloudfront-functions.js`
CloudFront Function code for:
- Proxying `/api/*` requests to the backend server
- Handling SPA routing by serving `index.html` for non-API routes

**Usage:**
1. Copy the code from this file
2. Create a new CloudFront Function in AWS Console
3. Associate it with your CloudFront distribution as a **Viewer Request** function

## Deployment Process

See the main `DEPLOYMENT.md` file in the project root for complete deployment instructions.

The deployment script (`scripts/deploy.sh`) handles:
- Building the application
- Syncing files to S3 with proper cache headers
- Creating CloudFront invalidations

CloudFront Functions must be configured manually in the AWS Console.