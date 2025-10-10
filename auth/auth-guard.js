// Authentication Guard Script for BrandKlout Test Reports
// Include this script in all protected pages

(function() {
    'use strict';
    
    // Configuration
    const AUTH_PAGE = 'auth.html';
    const SESSION_DURATION = 4 * 60 * 60 * 1000; // 4 hours
    
    // Check authentication status
    function checkAuth() {
        const authData = localStorage.getItem('brandklout_auth');
        
        if (!authData) {
            redirectToAuth();
            return false;
        }
        
        try {
            const data = JSON.parse(authData);
            const now = new Date().getTime();
            
            if (!data.authenticated || data.expires <= now) {
                localStorage.removeItem('brandklout_auth');
                redirectToAuth();
                return false;
            }
            
            // Extend session if more than half expired
            const sessionHalfLife = SESSION_DURATION / 2;
            const timeRemaining = data.expires - now;
            
            if (timeRemaining < sessionHalfLife) {
                // Extend session
                data.expires = now + SESSION_DURATION;
                localStorage.setItem('brandklout_auth', JSON.stringify(data));
            }
            
            return true;
        } catch (e) {
            localStorage.removeItem('brandklout_auth');
            redirectToAuth();
            return false;
        }
    }
    
    // Redirect to authentication page
    function redirectToAuth() {
        // Store current page for redirect after auth
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        sessionStorage.setItem('brandklout_return_page', currentPage);
        
        // Determine correct path to auth.html based on current location
        const currentPath = window.location.pathname;
        let authPath = AUTH_PAGE;
        
        if (currentPath.includes('/archive/')) {
            // We're in an archive subdirectory, need to go up two levels
            authPath = '../../' + AUTH_PAGE;
        } else if (currentPath.includes('/')) {
            // We might be in a subdirectory, go up one level
            const pathDepth = (currentPath.match(/\//g) || []).length;
            if (pathDepth > 1) {
                authPath = '../' + AUTH_PAGE;
            }
        }
        
        window.location.href = authPath;
    }
    
    // Add logout functionality
    function addLogoutButton() {
        // Only add if not already present
        if (document.getElementById('brandklout-logout')) return;
        
        const logoutBtn = document.createElement('button');
        logoutBtn.id = 'brandklout-logout';
        logoutBtn.innerHTML = '🔓 Logout';
        logoutBtn.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: rgba(231, 76, 60, 0.9);
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            transition: all 0.3s ease;
            backdrop-filter: blur(5px);
        `;
        
        logoutBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                logout();
            }
        });
        
        logoutBtn.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(231, 76, 60, 1)';
            this.style.transform = 'scale(1.05)';
        });
        
        logoutBtn.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(231, 76, 60, 0.9)';
            this.style.transform = 'scale(1)';
        });
        
        document.body.appendChild(logoutBtn);
    }
    
    // Logout function
    function logout() {
        localStorage.removeItem('brandklout_auth');
        sessionStorage.removeItem('brandklout_return_page');
        window.location.href = AUTH_PAGE;
    }
    
    // Add session info display
    function addSessionInfo() {
        const authData = localStorage.getItem('brandklout_auth');
        if (!authData) return;
        
        try {
            const data = JSON.parse(authData);
            const expiresAt = new Date(data.expires);
            const timeRemaining = data.expires - new Date().getTime();
            
            if (timeRemaining > 0) {
                const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
                const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
                
                const infoDiv = document.createElement('div');
                infoDiv.id = 'brandklout-session-info';
                infoDiv.style.cssText = `
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 9999;
                    background: rgba(52, 73, 94, 0.9);
                    color: white;
                    padding: 8px 12px;
                    border-radius: 6px;
                    font-size: 11px;
                    backdrop-filter: blur(5px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                `;
                infoDiv.innerHTML = `🕒 Session: ${hours}h ${minutes}m remaining`;
                
                document.body.appendChild(infoDiv);
                
                // Update every minute
                setInterval(() => {
                    const newTimeRemaining = data.expires - new Date().getTime();
                    if (newTimeRemaining > 0) {
                        const newHours = Math.floor(newTimeRemaining / (1000 * 60 * 60));
                        const newMinutes = Math.floor((newTimeRemaining % (1000 * 60 * 60)) / (1000 * 60));
                        infoDiv.innerHTML = `🕒 Session: ${newHours}h ${newMinutes}m remaining`;
                    } else {
                        logout();
                    }
                }, 60000);
            }
        } catch (e) {
            // Ignore errors
        }
    }
    
    // Initialize authentication check
    function init() {
        // Skip auth check for auth page itself
        const currentPage = window.location.pathname.split('/').pop();
        if (currentPage === 'auth.html') {
            return;
        }
        
        if (checkAuth()) {
            // Add UI enhancements
            document.addEventListener('DOMContentLoaded', function() {
                addLogoutButton();
                addSessionInfo();
            });
            
            // If DOM already loaded
            if (document.readyState === 'loading') {
                // Do nothing, event listener above will handle it
            } else {
                addLogoutButton();
                addSessionInfo();
            }
        }
        
        // Periodic auth check
        setInterval(checkAuth, 60000); // Check every minute
    }
    
    // Security measures
    function addSecurityMeasures() {
        // Disable right-click context menu on production
        document.addEventListener('contextmenu', function(e) {
            if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
                e.preventDefault();
                return false;
            }
        });
        
        // Disable F12, Ctrl+Shift+I, Ctrl+U
        document.addEventListener('keydown', function(e) {
            if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
                if (e.key === 'F12' || 
                    (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                    (e.ctrlKey && e.key === 'u')) {
                    e.preventDefault();
                    return false;
                }
            }
        });
        
        // Clear auth on tab visibility change (optional)
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                // Optionally clear auth when tab becomes hidden
                // localStorage.removeItem('brandklout_auth');
            }
        });
    }
    
    // Start the authentication system
    init();
    addSecurityMeasures();
    
    // Expose logout function globally
    window.brandkloutLogout = logout;
    
})();