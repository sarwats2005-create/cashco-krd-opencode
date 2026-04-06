'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { ClayCard } from '@/components/ui/clay/ClayCard';
import { ClayButton } from '@/components/ui/clay/ClayButton';
import { ClayInput } from '@/components/ui/clay/ClayInput';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      router.push('/setup');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F5F6F7]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <ClayCard className="p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-[20px] bg-[#6C63FF] flex items-center justify-center font-bold text-2xl text-white mx-auto mb-4 shadow-[0_8px_30px_rgba(108,99,255,0.3)]">
              C
            </div>
            <h1 className="text-2xl font-bold text-[#2F2F33]">CashCo-KRD</h1>
            <p className="text-[#2F2F33]/60 mt-1">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-[14px] bg-[#E74C3C]/10 text-[#E74C3C] text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#2F2F33]">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2F2F33]/40" />
                <ClayInput
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#2F2F33]">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2F2F33]/40" />
                <ClayInput
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2F2F33]/40"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link 
                href="/forgot-password" 
                className="text-sm text-[#6C63FF] hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <ClayButton 
              type="submit" 
              variant="primary"
              className="w-full py-3"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </ClayButton>
          </form>

          <p className="text-center mt-6 text-[#2F2F33]/60">
            Don't have an account?{' '}
            <Link href="/sign-up" className="text-[#6C63FF] font-medium hover:underline">
              Sign Up
            </Link>
          </p>
        </ClayCard>
      </motion.div>
    </div>
  );
}
