#!/bin/bash
# Deploy script for test reports with authentication

set -e

DEPLOY_DIR="deploy"
ACCESS_CODE="${ACCESS_CODE:-BK@123}"

echo "🚀 Preparing deployment..."

# Create deployment directory
mkdir -p "$DEPLOY_DIR"

# Copy auth system
echo "📁 Setting up authentication..."
cp -r auth/* "$DEPLOY_DIR/"

# Update access code from environment variable or secret
echo "🔐 Configuring access code..."
sed -i "s/BK@123/$ACCESS_CODE/g" "$DEPLOY_DIR/auth.html"

# Set up main pages
echo "📄 Setting up main pages..."
if [ -f "auth/templates/index.html" ]; then
    cp "auth/templates/index.html" "$DEPLOY_DIR/index.html"
fi

if [ -f "auth/templates/dashboard.html" ]; then
    cp "auth/templates/dashboard.html" "$DEPLOY_DIR/dashboard.html"
fi

# Add authentication to allure report if it exists
if [ -f "$DEPLOY_DIR/index.html" ] && [ -f "allure-report/index.html" ]; then
    echo "🔒 Adding auth protection to Allure report..."
    cp "allure-report/index.html" "$DEPLOY_DIR/report.html"
    sed -i 's|<head>|<head><script src="auth-guard.js"></script>|' "$DEPLOY_DIR/report.html"
fi

echo "✅ Deployment ready in $DEPLOY_DIR/"