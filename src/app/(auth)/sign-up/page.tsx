'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@insforge/sdk';

const insforge = createClient({
  baseUrl: 'https://7k4pu358.ap-southeast.insforge.app',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NTkzNzF9.hcTaGixnECtqoVNUYc8jGlRDQFmpgiPLw5mjDOOT2As',
});

export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState<'signup' | 'verify'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { data, error: signUpError } = await insforge.auth.signUp({
        email,
        password,
        redirectTo: 'https://cashco-krd-opencode.vercel.app/sign-in',
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      if (data?.requireEmailVerification) {
        setStep('verify');
        setResendTimer(60);
        const timer = setInterval(() => {
          setResendTimer(t => {
            if (t <= 1) clearInterval(timer);
            return t - 1;
          });
        }, 1000);
      } else if (data?.accessToken) {
        router.push('/setup');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter the 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error: verifyError } = await insforge.auth.verifyEmail({
        email,
        otp: otpCode,
      });

      if (verifyError) {
        setError(verifyError.message || 'Invalid or expired code');
        setLoading(false);
        return;
      }

      if (data?.user) {
        router.push('/setup');
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;

    try {
      await insforge.auth.resendVerificationEmail({
        email,
        redirectTo: 'https://cashco-krd-opencode.vercel.app/sign-in',
      });
      setResendTimer(60);
      const timer = setInterval(() => {
        setResendTimer(t => {
          if (t <= 1) clearInterval(timer);
          return t - 1;
        });
      }, 1000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) otpInputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  if (step === 'verify') {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={logoStyle}>C</div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2F2F33', marginBottom: '4px' }}>Verify Your Email</h1>
            <p style={{ color: 'rgba(47,47,51,0.6)' }}>Enter the 6-digit code sent to {email}</p>
          </div>

          {error && (
            <div style={{ padding: '12px', backgroundColor: 'rgba(231,76,60,0.1)', borderRadius: '14px', color: '#E74C3C', marginBottom: '16px', fontSize: '14px' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { otpInputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                style={{
                  width: '48px',
                  height: '56px',
                  textAlign: 'center',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  backgroundColor: '#F5F6F7',
                  borderRadius: '14px',
                  border: '1px solid #E0E0E0',
                  outline: 'none',
                }}
              />
            ))}
          </div>

          <button onClick={handleVerify} disabled={loading || otp.join('').length !== 6} style={primaryButtonStyle}>
            {loading ? 'Verifying...' : 'Verify'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            {resendTimer > 0 ? (
              <p style={{ color: 'rgba(47,47,51,0.6)', fontSize: '14px' }}>Resend code in {resendTimer}s</p>
            ) : (
              <button onClick={handleResend} style={{ background: 'none', border: 'none', color: '#6C63FF', cursor: 'pointer', fontSize: '14px' }}>
                Resend Code
              </button>
            )}
          </div>

          <p style={{ textAlign: 'center', marginTop: '24px' }}>
            <Link href="/sign-up" style={{ color: '#6C63FF', fontWeight: 500 }}>Back to Sign Up</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={logoStyle}>C</div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2F2F33', marginBottom: '4px' }}>CashCo-KRD</h1>
          <p style={{ color: 'rgba(47,47,51,0.6)' }}>Create your account</p>
        </div>

        {error && (
          <div style={{ padding: '12px', backgroundColor: 'rgba(231,76,60,0.1)', borderRadius: '14px', color: '#E74C3C', marginBottom: '16px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSignUp}>
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Email</label>
            <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Password</label>
            <input type="password" placeholder="Create a password (min 6 chars)" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} required minLength={6} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Confirm Password</label>
            <input type="password" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={inputStyle} required />
          </div>

          <button type="submit" style={primaryButtonStyle} disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: 'rgba(47,47,51,0.6)' }}>
          Already have an account?{' '}
          <Link href="/sign-in" style={{ color: '#6C63FF', fontWeight: 500 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}

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

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  backgroundColor: '#F5F6F7',
  borderRadius: '16px',
  boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.15)',
  border: '1px solid #E0E0E0',
  outline: 'none',
  fontSize: '16px',
};

const primaryButtonStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px 20px',
  borderRadius: '14px',
  border: 'none',
  backgroundColor: '#6C63FF',
  color: 'white',
  fontSize: '16px',
  fontWeight: 500,
  cursor: 'pointer',
  marginTop: '8px',
};
