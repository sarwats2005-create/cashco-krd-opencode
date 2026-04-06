'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft } from 'lucide-react';
import { ClayCard } from '@/components/ui/clay/ClayCard';
import { ClayButton } from '@/components/ui/clay/ClayButton';
import { ClayInput } from '@/components/ui/clay/ClayInput';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSent(true);
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#F5F6F7]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <ClayCard className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[#27AE60]/10 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-[#27AE60]" />
            </div>
            <h1 className="text-2xl font-bold text-[#2F2F33] mb-2">Check Your Email</h1>
            <p className="text-[#2F2F33]/60 mb-6">
              We've sent password reset instructions to <strong>{email}</strong>
            </p>
            <Link href="/sign-in">
              <ClayButton variant="ghost" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </ClayButton>
            </Link>
          </ClayCard>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F5F6F7]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <ClayCard className="p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-[20px] bg-[#6C63FF] flex items-center justify-center font-bold text-2xl text-white mx-auto mb-4">
              C
            </div>
            <h1 className="text-2xl font-bold text-[#2F2F33]">Forgot Password?</h1>
            <p className="text-[#2F2F33]/60 mt-1">Enter your email to reset your password</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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

            <ClayButton 
              type="submit" 
              variant="primary"
              className="w-full py-3"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Reset Password'}
            </ClayButton>
          </form>

          <p className="text-center mt-6 text-[#2F2F33]/60">
            Remember your password?{' '}
            <Link href="/sign-in" className="text-[#6C63FF] font-medium hover:underline">
              Sign In
            </Link>
          </p>
        </ClayCard>
      </motion.div>
    </div>
  );
}
