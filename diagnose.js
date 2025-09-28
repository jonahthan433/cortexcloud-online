// Simple diagnostic script to check deployment
console.log('=== CORTEXCLOUD DEPLOYMENT DIAGNOSTIC ===');
console.log('Current URL:', window.location.href);
console.log('User Agent:', navigator.userAgent);
console.log('Document ready state:', document.readyState);
console.log('Root element exists:', !!document.getElementById('root'));
console.log('Scripts loaded:', document.scripts.length);
console.log('Environment mode:', import.meta?.env?.MODE || 'unknown');
console.log('Base URL:', import.meta?.env?.BASE_URL || 'unknown');
console.log('==========================================');
