'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Tractor, 
  ShieldCheck, 
  DollarSign, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  Smartphone, 
  Lock 
} from 'lucide-react';
import { Header } from '@/components/navigation/header';
import { Footer } from '@/components/navigation/footer';

export default function ForFarmersPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-emerald-950 text-white py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest bg-emerald-900/80 px-3 py-1 rounded-full border border-emerald-700">
                Built For African Producers
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-4 tracking-tight leading-tight">
                Run your farm with precision, sell without predatory middlemen.
              </h1>
              <p className="text-emerald-100 text-base sm:text-lg mt-4 leading-relaxed">
                AgriLink Africa gives farmers total control over livestock mortality, daily feeding costs, worker accountability with photo proof, and direct access to institutional buyers who pay on time through guaranteed escrow.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/dashboard/farms"
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm shadow-md transition flex items-center gap-2"
                >
                  <span>Launch Farmer Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/marketplace"
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-sm border border-white/20 transition"
                >
                  <span>List Farm Produce</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 4 Pillars for Farmers */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Eliminate Broker Gouging</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect directly with commercial food processors, restaurant chains, and retail buyers who offer transparent market rates.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Supervise Workers Remotely</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Assign daily tasks to farm hands. Inspect photo and video evidence of feeding, cleaning, and medication before approving logs.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Guaranteed Escrow Payouts</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Never deliver produce on speculative credit again. Buyer payments are locked in escrow before trucks are dispatched to your farm gate.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Works on 3G & Low-Cost Phones</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Lightweight bundle engineered for low-bandwidth rural networks. Save drafts offline and sync as soon as you reach cellular range.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
