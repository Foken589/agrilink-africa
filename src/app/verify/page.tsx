'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sprout, ArrowRight, RefreshCw } from 'lucide-react';

function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email') || 'your email / phone';
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState('');

  const handleChange = (index: number, val: string) => {
    if (val.length > 1) val = val[val.length - 1];
    const nextCode = [...code];
    nextCode[index] = val;
    setCode(nextCode);

    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/dashboard');
    }, 700);
  };

  const handleResend = () => {
    setResendMsg('New 6-digit OTP dispatched via SMS / WhatsApp.');
    setTimeout(() => setResendMsg(''), 3000);
  };

  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
      <div className="bg-white py-8 px-6 shadow-sm rounded-2xl border border-slate-200 sm:px-10 space-y-6">
        <p className="text-xs text-slate-500 text-center">
          We sent a 6-digit verification security code to <strong className="text-slate-800">{emailParam}</strong>
        </p>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-between gap-2">
            {code.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-${idx}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                className="w-11 h-12 text-center text-lg font-bold border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                autoFocus={idx === 0}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-2"
          >
            {loading ? 'Verifying...' : 'Confirm & Open Dashboard'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="flex flex-col items-center gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={handleResend}
            className="font-semibold text-emerald-700 hover:underline flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" /> Resend Verification Code
          </button>
          {resendMsg && <span className="text-emerald-700 font-medium text-[11px]">{resendMsg}</span>}
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-4">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-md">
            <Sprout className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-slate-900 text-2xl tracking-tight">AgriLink Africa</span>
        </Link>
        <h2 className="mt-4 text-2xl font-extrabold text-slate-900">Verify your credentials</h2>
      </div>

      <Suspense fallback={<div className="text-center text-xs text-slate-500">Loading verification details...</div>}>
        <VerifyForm />
      </Suspense>
    </div>
  );
}
