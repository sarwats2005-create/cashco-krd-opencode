'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    router.push('/setup');
  };

  const pageStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    backgroundColor: '#F5F6F7',
  };

  const cardStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '420px',
    padding: '32px',
    backgroundColor: '#F5F6F7',
    borderRadius: '24px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.06), 0 2px 4px rgba(255,255,255,0.8) inset',
  };

  const logoStyle: React.CSSProperties = {
    width: '64px',
    height: '64px',
    borderRadius: '20px',
    backgroundColor: '#6C63FF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    fontWeight: 'bold',
    color: 'white',
    margin: '0 auto 16px',
    boxShadow: '0 8px 30px rgba(108,99,255,0.3)',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '14px',
    fontWeight: 500,
    color: '#2F2F33',
    marginBottom: '8px',
  };

  const inputWrapperStyle: React.CSSProperties = {
    position: 'relative',
    marginBottom: '16px',
  };

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 20px',
    borderRadius: '14px',
    border: 'none',
    backgroundColor: '#6C63FF',
    color: 'white',
    fontSize: '16px',
    fontWeight: 500,
    cursor: 'pointer',
    marginTop: '8px',
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={logoStyle}>C</div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2F2F33', marginBottom: '4px' }}>CashCo-KRD</h1>
          <p style={{ color: 'rgba(47,47,51,0.6)' }}>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={inputWrapperStyle}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#F5F6F7',
                borderRadius: '16px',
                boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.15)',
                border: '1px solid #E0E0E0',
                outline: 'none',
                fontSize: '16px',
              }}
              required
            />
          </div>

          <div style={inputWrapperStyle}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#F5F6F7',
                borderRadius: '16px',
                boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.15)',
                border: '1px solid #E0E0E0',
                outline: 'none',
                fontSize: '16px',
              }}
              required
            />
          </div>

          <div style={{ textAlign: 'right', marginBottom: '16px' }}>
            <Link href="/forgot-password" style={{ fontSize: '14px', color: '#6C63FF' }}>
              Forgot password?
            </Link>
          </div>

          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: 'rgba(47,47,51,0.6)' }}>
          Don't have an account?{' '}
          <Link href="/sign-up" style={{ color: '#6C63FF', fontWeight: 500 }}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
