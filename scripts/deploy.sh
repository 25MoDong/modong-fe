#!/usr/bin/env bash
set -euo pipefail

# Deployment script: sync build into S3 with recommended cache headers
# - hashed assets: long cache (1 year)
# - index.html: no-cache (short) and CloudFront invalidation
# Usage: ./scripts/deploy.sh

DIST_ID="EJ9HR2ARNB6X7"
BUCKET="modong-prod"
BUILD_DIR="dist"

if ! command -v aws >/dev/null 2>&1; then
  echo "aws CLI not found. Install and configure AWS CLI with credentials." >&2
  exit 1
fi

if [ ! -d "$BUILD_DIR" ]; then
  echo "Build directory '$BUILD_DIR' not found. Run 'npm run build' first." >&2
  exit 1
fi

echo "Syncing assets to s3://$BUCKET (excluding index.html) with long cache TTL..."
# Try using --cache-control with sync; if not supported, fall back to sync without cache-control
if aws s3 sync "$BUILD_DIR" "s3://$BUCKET" --delete --exclude "index.html" --cache-control "max-age=31536000, public"; then
  echo "Assets synced with cache-control set."
else
  echo "Warning: 'aws s3 sync --cache-control' failed; retrying without cache-control." >&2
  aws s3 sync "$BUILD_DIR" "s3://$BUCKET" --delete --exclude "index.html"
  echo "Assets synced (no cache-control applied). Consider upgrading AWS CLI or applying metadata separately."
fi

echo "Uploading index.html with short/no-cache headers..."
aws s3 cp "$BUILD_DIR/index.html" "s3://$BUCKET/index.html" \
  --cache-control "max-age=0, no-cache, no-store, must-revalidate" \
  --content-type "text/html"

echo "Creating CloudFront invalidation for /index.html on distribution $DIST_ID..."
aws cloudfront create-invalidation --distribution-id "$DIST_ID" --paths "/index.html"

echo "Deployment completed."

