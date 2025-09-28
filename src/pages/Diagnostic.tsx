import React from 'react';

const Diagnostic = () => {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: 'white', 
      color: 'black',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>Diagnostic Page</h1>
      <p>If you can see this, React is loading correctly.</p>
      <p>Environment variables:</p>
      <ul>
        <li>VITE_SUPABASE_URL: {import.meta.env.VITE_SUPABASE_URL ? 'Set' : 'Not set'}</li>
        <li>VITE_SUPABASE_PUBLISHABLE_KEY: {import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ? 'Set' : 'Not set'}</li>
        <li>VITE_APP_URL: {import.meta.env.VITE_APP_URL || 'Not set'}</li>
      </ul>
      <p>Current URL: {window.location.href}</p>
      <p>User Agent: {navigator.userAgent}</p>
    </div>
  );
};

export default Diagnostic;
