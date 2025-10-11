#!/bin/bash
# Deploy script for test reports with authentication

set -e

DEPLOY_DIR="deploy"
ACCESS_CODE="${ACCESS_CODE:-BK@123}"

echo "🚀 Preparing deployment..."

# Ensure deployment directory exists
mkdir -p "$DEPLOY_DIR"

# Auth system should be copied to the same directory as Allure report
echo "📁 Setting up authentication in deployment directory..."
cp auth/auth.html "$DEPLOY_DIR/"
cp auth/auth-guard.js "$DEPLOY_DIR/"

# Update access code from environment variable or secret
echo "🔐 Configuring access code..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/{{ACCESS_CODE}}/$ACCESS_CODE/g" "$DEPLOY_DIR/auth.html"
else
    # Linux
    sed -i "s/{{ACCESS_CODE}}/$ACCESS_CODE/g" "$DEPLOY_DIR/auth.html"
fi

# Check if Allure report exists and set up main entry page
if [ -f "$DEPLOY_DIR/index.html" ]; then
    echo "📊 Allure report found, setting up protected access..."
    # Backup original allure index
    mv "$DEPLOY_DIR/index.html" "$DEPLOY_DIR/allure-report.html"
    # Add auth guard to allure report
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' 's|<head>|<head><script src="auth-guard.js"></script>|' "$DEPLOY_DIR/allure-report.html"
    else
        sed -i 's|<head>|<head><script src="auth-guard.js"></script>|' "$DEPLOY_DIR/allure-report.html"
    fi
fi

# Create main redirect page that goes to auth
echo "📄 Setting up main entry page..."
cp "auth/templates/index.html" "$DEPLOY_DIR/index.html"

# Create dashboard page
echo "📄 Setting up dashboard page..."
cp "auth/templates/dashboard.html" "$DEPLOY_DIR/dashboard.html"

# Update dashboard links to point to the actual allure report
if [ -f "$DEPLOY_DIR/allure-report.html" ]; then
    echo "🔗 Updating dashboard links..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' 's|href="index.html"|href="allure-report.html"|g' "$DEPLOY_DIR/dashboard.html"
    else
        sed -i 's|href="index.html"|href="allure-report.html"|g' "$DEPLOY_DIR/dashboard.html"
    fi
fi

echo "✅ Deployment ready in $DEPLOY_DIR/"