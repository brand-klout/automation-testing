# Authentication System

Secure access control for BrandKlout test reports using GitHub Secrets and client-side authentication.

## 🔐 Security Model

- **Access Codes**: Managed via GitHub Secrets (`ACCESS_CODE`)
- **Session Duration**: 4 hours with auto-renewal
- **Storage**: Secure localStorage with expiration timestamps
- **Protection**: All report pages require authentication

## 🔑 Access Management

### Current Access
- **Reports URL**: https://brand-klout.github.io/automation-testing/
- **Access Code**: Managed via GitHub repository secrets

### Setting Access Code

1. **GitHub Repository Settings** → **Secrets and Variables** → **Actions**
2. **Add Secret**: `ACCESS_CODE` with desired value
3. **Deploy**: Next CI run will use the new code

### Emergency Access

If locked out:
1. Check repository secrets for current `ACCESS_CODE`
2. Contact repository administrators
3. Use browser dev tools: `localStorage.clear()` to reset session

## 🛠️ Technical Details

### Files Structure
```
auth/
├── auth.html          # Login page
├── auth-guard.js      # Session management
└── templates/         # Page templates
    ├── index.html     # Main redirect page
    └── dashboard.html # Dashboard template
```

### Configuration

**Session Duration** (in `auth-guard.js`):
```javascript
const SESSION_DURATION = 4 * 60 * 60 * 1000; // 4 hours
```

**Deployment Integration**:
Access codes are automatically injected during CI/CD deployment via `scripts/deploy.sh`.

## 🔧 Development

### Local Testing
```bash
# Serve auth pages locally
cd auth && python -m http.server 8000
```

### Security Features
- Auto-logout on session expiration
- Periodic session validation
- Secure redirect handling
- XSS protection

---

For repository access or technical issues, contact the development team.