'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail } from 'lucide-react';
import { ClayCard } from '@/components/ui/clay/ClayCard';
import { ClayButton } from '@/components/ui/clay/ClayButton';

export default function VerifyOtpPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every(digit => digit !== '') && index === 5) {
      handleSubmit(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const newOtp = pasted.split('');
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (code?: string) => {
    const otpCode = code || otp.join('');
    if (otpCode.length !== 6) return;
    
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    router.push('/setup');
  };

  const handleResend = async () => {
    setResendTimer(60);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F5F6F7]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <ClayCard className="p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-[20px] bg-[#6C63FF]/10 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-[#6C63FF]" />
            </div>
            <h1 className="text-2xl font-bold text-[#2F2F33]">Verify Your Email</h1>
            <p className="text-[#2F2F33]/60 mt-1">Enter the 6-digit code sent to your email</p>
          </div>

          <div 
            className="flex justify-center gap-2 mb-6"
            onPaste={handlePaste}
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-xl font-bold bg-[#F5F6F7] rounded-[14px] border border-transparent focus:border-[#6C63FF] focus:shadow-[0_0_0_3px_rgba(108,99,255,0.2)] outline-none transition-all"
              />
            ))}
          </div>

          <ClayButton 
            variant="primary"
            className="w-full py-3"
            disabled={loading || otp.join('').length !== 6}
            onClick={() => handleSubmit()}
          >
            {loading ? 'Verifying...' : 'Verify'}
          </ClayButton>

          <div className="text-center mt-6">
            {resendTimer > 0 ? (
              <p className="text-sm text-[#2F2F33]/60">
                Resend code in <span className="font-medium">{resendTimer}s</span>
              </p>
            ) : (
              <button 
                onClick={handleResend}
                className="text-sm text-[#6C63FF] font-medium hover:underline"
              >
                Resend Code
              </button>
            )}
          </div>

          <p className="text-center mt-6 text-[#2F2F33]/60">
            <Link href="/sign-in" className="text-[#6C63FF] font-medium hover:underline flex items-center justify-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Link>
          </p>
        </ClayCard>
      </motion.div>
    </div>
  );
}
