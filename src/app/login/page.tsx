'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sprout, Lock, Mail, Phone, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useStore } from '@/lib/data/store-context';

export default function LoginPage() {
  const router = useRouter();
  const { allUsers, switchUser } = useStore();
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      setLoading(false);
      // Automatically route to dashboard
      router.push('/dashboard');
    }, 600);
  };

  const handleQuickDemoPersona = (userId: string) => {
    switchUser(userId);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-md">
            <Sprout className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-slate-900 text-2xl tracking-tight">AgriLink Africa</span>
        </Link>
        <h2 className="mt-4 text-2xl font-extrabold text-slate-900">Sign in to your account</h2>
        <p className="mt-1 text-xs text-slate-500">
          Or{' '}
          <Link href="/signup" className="font-semibold text-emerald-700 hover:underline">
            create a new agricultural account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-sm rounded-2xl border border-slate-200 sm:px-10 space-y-6">
          {/* Email vs Phone Toggle */}
          <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setAuthMethod('email')}
              className={`flex-1 py-1.5 rounded-lg transition ${
                authMethod === 'email' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
              }`}
            >
              Email Address
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod('phone')}
              className={`flex-1 py-1.5 rounded-lg transition ${
                authMethod === 'phone' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
              }`}
            >
              Mobile Phone / WhatsApp
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {authMethod === 'email' ? 'Email Address' : 'Phone Number'}
              </label>
              <div className="relative">
                {authMethod === 'email' ? (
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                ) : (
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                )}
                <input
                  type={authMethod === 'email' ? 'email' : 'tel'}
                  required
                  placeholder={authMethod === 'email' ? 'adebayo.farm@agrilink.africa' : '+234 803 456 7890'}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block font-semibold text-slate-700">Password</label>
                <Link href="/reset-password" className="text-emerald-700 font-semibold hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-sm transition flex items-center justify-center gap-2"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Personas Direct Login */}
          <div className="pt-4 border-t border-slate-100">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-3">
              One-Click Role Demonstration
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {allUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => handleQuickDemoPersona(u.id)}
                  className="p-2 text-left rounded-lg bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition"
                >
                  <div className="font-bold text-slate-900 truncate text-[11px]">{u.fullName.split(' ')[0]}</div>
                  <div className="text-[10px] text-emerald-700 capitalize font-medium">{u.role.replace(/_/g, ' ')}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
