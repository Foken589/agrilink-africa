import React from 'react';
import Link from 'next/link';
import { Sprout, ShieldCheck, MapPin, Phone, Mail, Globe, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <span className="font-extrabold text-white text-xl tracking-tight">AgriLink</span>
                <span className="font-bold text-emerald-400 text-xl ml-1">Africa</span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              From farm to market, with fewer barriers. The unified digital platform powering African agricultural operations, verified livestock records, worker accountability with photo proof, and guaranteed escrow trading.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                RLS Encrypted
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Globe className="w-4 h-4 text-emerald-400" />
                Pan-African Reach
              </span>
            </div>
          </div>

          {/* Solutions Column */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Platform Solutions
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/farm-management" className="text-slate-400 hover:text-emerald-400 transition">
                  Farm Operations
                </Link>
              </li>
              <li>
                <Link href="/livestock" className="text-slate-400 hover:text-emerald-400 transition">
                  Livestock Ledger
                </Link>
              </li>
              <li>
                <Link href="/marketplace" className="text-slate-400 hover:text-emerald-400 transition">
                  B2B Marketplace
                </Link>
              </li>
              <li>
                <Link href="/market-prices" className="text-slate-400 hover:text-emerald-400 transition">
                  Verified Market Prices
                </Link>
              </li>
              <li>
                <Link href="/for-cooperatives" className="text-slate-400 hover:text-emerald-400 transition">
                  Cooperative Aggregation
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-slate-400 hover:text-emerald-400 transition">
                  Pricing Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Stakeholders Column */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Who We Serve
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/for-farmers" className="text-slate-400 hover:text-emerald-400 transition">
                  Smallholders & Commercial
                </Link>
              </li>
              <li>
                <Link href="/for-buyers" className="text-slate-400 hover:text-emerald-400 transition">
                  Food Processors & Retail
                </Link>
              </li>
              <li>
                <Link href="/for-cooperatives" className="text-slate-400 hover:text-emerald-400 transition">
                  Farmer Associations
                </Link>
              </li>
              <li>
                <Link href="/dashboard/logistics" className="text-slate-400 hover:text-emerald-400 transition">
                  Agricultural Haulers
                </Link>
              </li>
              <li>
                <Link href="/dashboard/workers" className="text-slate-400 hover:text-emerald-400 transition">
                  Field Farm Hands
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Compliance */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Trust & Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="text-slate-400 hover:text-emerald-400 transition">
                  About AgriLink
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-emerald-400 transition">
                  Regional Offices
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-slate-400 hover:text-emerald-400 transition">
                  Data Sovereignty & Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-400 hover:text-emerald-400 transition">
                  Trading Terms & SLA
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Regional Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} AgriLink Africa Technologies Ltd. Engineered for African Agricultural Sovereignty.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-500" />
              Lagos • Nairobi • Accra • Kampala • Addis Ababa
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
