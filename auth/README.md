# Authentication System for BrandKlout Test Reports

## Overview

This directory contains the authentication system that protects access to the BrandKlout test reports. The system provides client-side authentication with session management and automatic security features.

## Files Structure

```
auth/
├── README.md           # This documentation
├── auth.html          # Authentication login page
└── auth-guard.js      # Authentication guard script
```

## Current Access Codes

The following access codes are currently configured:

- `brandklout2024` - Primary access code
- `test-reports-2024` - Alternative access code  
- `qa-team-access` - QA team specific code

## How to Change Access Codes

To update the access codes:

1. **Edit the authentication page** (`auth/auth.html`):
   - Find the `ACCESS_CODES` array in the JavaScript section
   - Add, remove, or modify the codes as needed
   - Example:
     ```javascript
     const ACCESS_CODES = [
         'your-new-code-2024',
         'another-access-code',
         'team-specific-code'
     ];
     ```

2. **Commit and push changes**:
   ```bash
   git add auth/auth.html
   git commit -m "Update access codes for test reports"
   git push
   ```

3. **The new codes will be active** after the next CI/CD deployment.

## Security Features

- **Session Duration**: 4 hours (configurable in auth-guard.js)
- **Auto-logout**: Sessions expire automatically
- **Secure Storage**: Uses localStorage with expiration timestamps
- **Page Protection**: All report pages are protected by auth-guard.js
- **Security Measures**: Disabled developer tools, context menus in production
- **Session Extension**: Active sessions are automatically extended

## Session Management

### User Experience
- **Login Page**: Beautiful, responsive authentication interface
- **Session Info**: Display remaining session time in bottom-right corner
- **Logout Button**: Quick logout option in top-right corner
- **Auto-redirect**: Redirect to intended page after authentication
- **Session Warnings**: Visual indicators for session status

### Technical Implementation
- **Client-side Authentication**: No server required, works with GitHub Pages
- **localStorage**: Secure token storage with expiration
- **sessionStorage**: Return page tracking for smooth UX
- **Periodic Checks**: Session validation every minute

## Access URL

**Main Entry Point**: https://brand-klout.github.io/automation-testing/

**Direct Auth Page**: https://brand-klout.github.io/automation-testing/auth.html

## Configuration Options

### Session Duration
Modify in `auth-guard.js`:
```javascript
const SESSION_DURATION = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
```

### Security Settings
Adjust in `auth-guard.js`:
- Enable/disable developer tools blocking
- Configure session check intervals
- Modify redirect behavior

### Access Codes
Update in `auth/auth.html`:
```javascript
const ACCESS_CODES = [
    'code1',
    'code2',
    'code3'
];
```

## Deployment Integration

The authentication system is automatically deployed via GitHub Actions:

1. **File Copy**: Auth files are copied to deployment directory
2. **Script Injection**: auth-guard.js is injected into all protected pages
3. **Index Redirect**: Main index.html redirects to authentication
4. **Report Protection**: Allure reports are protected by authentication

## Troubleshooting

### Common Issues

**Problem**: Can't access reports after entering correct code
- **Solution**: Clear browser localStorage and try again
- **Command**: Open browser console and run `localStorage.clear()`

**Problem**: Session expires too quickly
- **Solution**: Increase `SESSION_DURATION` in auth-guard.js

**Problem**: Need to add new team member
- **Solution**: Add their preferred code to `ACCESS_CODES` array

**Problem**: Want to disable authentication temporarily
- **Solution**: Comment out the auth-guard.js script includes in the GitHub Actions workflow

### Emergency Access

If you're locked out:
1. Check this README for current access codes
2. Contact the repository administrator
3. Review commit history for recent code changes
4. Check GitHub Actions logs for deployment issues

## Development

### Local Testing
1. Serve the auth directory locally:
   ```bash
   cd auth
   python -m http.server 8000
   ```
2. Visit `http://localhost:8000/auth.html`
3. Test authentication flow

### Customization
- **Styling**: Modify CSS in auth.html
- **Behavior**: Update JavaScript logic
- **Security**: Adjust protection levels in auth-guard.js

## Maintenance

### Regular Tasks
- Review and rotate access codes quarterly
- Monitor session duration effectiveness
- Update security measures as needed
- Verify authentication flow after major changes

### Security Best Practices
- Use strong, unique access codes
- Regularly update access codes
- Monitor usage patterns
- Keep authentication logic up to date