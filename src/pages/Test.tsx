import { useState, useEffect } from 'react';

const Test = () => {
  const [status, setStatus] = useState('Loading...');

  useEffect(() => {
    // Test if the app is working
    setStatus('✅ React app is working!');
  }, []);

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f0f0f0'
    }}>
      <h1>🧪 CortexCloud Test Page</h1>
      <p>Status: {status}</p>
      <p>Environment: {import.meta.env.MODE}</p>
      <p>Base URL: {import.meta.env.BASE_URL}</p>
      <p>Timestamp: {new Date().toISOString()}</p>
      
      <div style={{ marginTop: '20px' }}>
        <h2>Environment Variables Test:</h2>
        <p>VITE_SUPABASE_URL: {import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</p>
        <p>VITE_SUPABASE_PUBLISHABLE_KEY: {import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ? '✅ Set' : '❌ Missing'}</p>
        <p>VITE_APP_URL: {import.meta.env.VITE_APP_URL || '❌ Missing'}</p>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2>Quick Links:</h2>
        <a href="/" style={{ margin: '0 10px', color: 'blue' }}>Home</a>
        <a href="/auth/login" style={{ margin: '0 10px', color: 'blue' }}>Login</a>
        <a href="/checkout" style={{ margin: '0 10px', color: 'blue' }}>Checkout</a>
      </div>
    </div>
  );
};

export default Test;
