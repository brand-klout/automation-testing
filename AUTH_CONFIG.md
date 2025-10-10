# BrandKlout Test Reports Authentication Configuration

## Current Access Codes

The following access codes are currently configured for the test reports:

- `brandklout2024` - Main access code
- `test-reports-2024` - Alternative code  
- `qa-team-access` - QA team specific code

## How to Change Access Codes

To update the access codes:

1. **Edit the authentication template** (`auth-template.html`):
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
   git add auth-template.html
   git commit -m "Update access codes for test reports"
   git push
   ```

3. **The new codes will be active** after the next CI/CD deployment.

## Security Settings

- **Session Duration**: 4 hours (configurable in auth-guard.js)
- **Auto-logout**: Sessions expire automatically
- **Secure Storage**: Uses localStorage with expiration
- **Page Protection**: All report pages are protected

## Access URL

https://brand-klout.github.io/automation-testing/

## Backup Access

If you need immediate access and forget the codes:

1. Check this configuration file for current codes
2. Contact the repository administrator
3. Review the GitHub Actions workflow for emergency access

## Technical Notes

- Authentication is client-side JavaScript based
- Codes are stored in the deployed HTML files
- No server-side authentication required
- Compatible with GitHub Pages static hosting
- Codes are case-insensitive

## Troubleshooting

**Problem**: Can't access reports after entering correct code
- **Solution**: Clear browser localStorage and try again

**Problem**: Session expires too quickly
- **Solution**: Increase SESSION_DURATION in auth-guard.js

**Problem**: Need to add new team member
- **Solution**: Add their preferred code to ACCESS_CODES array

**Problem**: Want to disable authentication temporarily
- **Solution**: Comment out the auth-guard.js script includes in the workflow