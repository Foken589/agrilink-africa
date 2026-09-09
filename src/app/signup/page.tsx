'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sprout, Lock, Mail, Phone, User, Globe, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useStore } from '@/lib/data/store-context';
import { UserRole } from '@/types';

export default function SignupPage() {
  const router = useRouter();
  const { allUsers, switchUser } = useStore();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Nigeria');
  const [stateRegion, setStateRegion] = useState('Ogun State');
  const [role, setRole] = useState<UserRole>('poultry_farmer');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const rolesList: { role: UserRole; title: string; desc: string }[] = [
    { role: 'poultry_farmer', title: 'Poultry Producer', desc: 'Broilers, layers, hatcheries, table eggs' },
    { role: 'fish_farmer', title: 'Aquaculture Producer', desc: 'Catfish, tilapia earthen ponds & tanks' },
    { role: 'cattle_rearer', title: 'Cattle & Dairy', desc: 'Beef herd, dairy zero-grazing, pasture' },
    { role: 'crop_farmer', title: 'Crop & Grain Producer', desc: 'Maize, cassava, soybean, vegetables' },
    { role: 'cooperative', title: 'Cooperative / Federation', desc: 'Smallholder aggregation & joint sales' },
    { role: 'buyer', title: 'Bulk Buyer / Processor', desc: 'Supermarkets, restaurants, feed mills' },
    { role: 'transporter', title: 'Agricultural Hauler', desc: 'Livestock transport, produce vans' },
    { role: 'worker', title: 'Field Attendant / Worker', desc: 'Daily feeding, tasks, and photo logs' },
  ];

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/verify?email=' + encodeURIComponent(email));
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-md">
            <Sprout className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-slate-900 text-2xl tracking-tight">AgriLink Africa</span>
        </Link>
        <h2 className="mt-4 text-2xl font-extrabold text-slate-900">Create your agricultural account</h2>
        <p className="mt-1 text-xs text-slate-500">
          Already registered?{' '}
          <Link href="/login" className="font-semibold text-emerald-700 hover:underline">
            Sign in here
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl px-4">
        <div className="bg-white py-8 px-6 shadow-sm rounded-2xl border border-slate-200 sm:px-10 space-y-6">
          <form onSubmit={handleSignup} className="space-y-4 text-xs">
            {/* Role Selection */}
            <div>
              <label className="block font-bold text-slate-900 mb-2">
                Select Your Agricultural Role:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {rolesList.map((item) => (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => setRole(item.role)}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      role === item.role
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-600'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="text-xs">{item.title}</div>
                    <div className="text-[10px] text-slate-500 font-normal leading-tight mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Legal Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Adebayo Ogunlesi"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="adebayo@farm.africa"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number (WhatsApp)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="+234 803 456 7890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Operating Country</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium"
                >
                  <option>Nigeria</option>
                  <option>Kenya</option>
                  <option>Ghana</option>
                  <option>Uganda</option>
                  <option>Ethiopia</option>
                  <option>Rwanda</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">State / Province / Region</label>
              <input
                type="text"
                required
                placeholder="e.g. Ogun State, Nakuru County, Greater Accra"
                value={stateRegion}
                onChange={(e) => setStateRegion(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Secure Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              By creating an account, you agree to AgriLink Africa&apos;s{' '}
              <Link href="/terms" className="text-emerald-700 underline">Terms of Service</Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-emerald-700 underline">Biosecurity Privacy Rules</Link>.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-2"
            >
              {loading ? 'Creating Account...' : 'Continue to Verification'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
