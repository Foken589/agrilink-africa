'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Users, 
  Layers, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  FileSpreadsheet, 
  Scale 
} from 'lucide-react';
import { Header } from '@/components/navigation/header';
import { Footer } from '@/components/navigation/footer';

export default function ForCooperativesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-emerald-950 text-white py-16 lg:py-20 border-b border-emerald-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest bg-emerald-900/80 px-3 py-1 rounded-full border border-emerald-700">
                Smallholder Aggregation Power
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-4 tracking-tight leading-tight">
                Empower your cooperative members to aggregate, sell, and prosper.
              </h1>
              <p className="text-emerald-100 text-base sm:text-lg mt-4 leading-relaxed">
                Transform smallholder fragmentation into commercial leverage. AgriLink Africa provides cooperative federations with member digital rosters, pooled grain & livestock batches, collective listings, and transparent member payout calculations.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/dashboard/cooperative"
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm shadow-md transition flex items-center gap-2"
                >
                  <span>Open Cooperative Hub</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features for Cooperatives */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Digital Member Ledger</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Maintain accurate records of all member farmers, farm sizes, crops, livestock batches, and cooperative membership numbers with offline access.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Bulk Produce Aggregation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pool 50 bags of maize from 20 different members into a single 1,000-bag commercial lot to bid for lucrative industrial brewery and feed mill contracts.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Transparent Dividend Splits</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automated payout reconciliation allocates contract proceeds directly to individual member bank accounts or mobile money (M-Pesa, MTN MoMo) according to contributed weight.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
