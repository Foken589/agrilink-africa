'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  ShieldCheck, 
  Building2, 
  FileText, 
  Truck, 
  CheckCircle2, 
  ArrowRight, 
  Clock 
} from 'lucide-react';
import { Header } from '@/components/navigation/header';
import { Footer } from '@/components/navigation/footer';

export default function ForBuyersPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-slate-900 text-white py-16 lg:py-20 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
                Institutional Sourcing Engine
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-4 tracking-tight leading-tight">
                Secure bulk agricultural supply with verified batch traceability.
              </h1>
              <p className="text-slate-300 text-base sm:text-lg mt-4 leading-relaxed">
                Supermarkets, hotel chains, feed millers, and food manufacturing plants source high-grade poultry, fish, grains, and tubers directly from audited African farms. Guaranteed quality, competitive quotes, and protected escrow settlement.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/marketplace"
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm shadow-md transition flex items-center gap-2"
                >
                  <span>Browse Farmgate Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/dashboard/buyer"
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-sm border border-white/20 transition"
                >
                  <span>Create RFQ Tender</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Request For Quotes (RFQ)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Post your required volume, delivery deadline, and grade specifications. Audited farmers and cooperatives submit binding quotes with guaranteed lead times.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Inspection Prior to Payout</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Funds are held in AgriLink escrow until goods arrive at your intake dock, are weighed, and receive physical quality clearance from your receiving officer.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Cold-Chain & Live Haulage</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Coordinate with verified transporters equipped with aerated live fish vats, ventilated poultry crates, and refrigerated produce vans with live OTP tracking.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
