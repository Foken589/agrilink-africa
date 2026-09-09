'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Check, 
  HelpCircle, 
  ArrowRight, 
  ShieldCheck, 
  Building2, 
  Tractor, 
  Users 
} from 'lucide-react';
import { Header } from '@/components/navigation/header';
import { Footer } from '@/components/navigation/footer';
import { Currency } from '@/types';
import { formatCurrency } from '@/lib/utils';

export default function PricingPage() {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('NGN');

  const pricingTiers = [
    {
      name: 'Smallholder Starter',
      tagline: 'Ideal for single-site family farms and artisanal hatcheries.',
      prices: {
        NGN: 0,
        KES: 0,
        GHS: 0,
        UGX: 0,
        USD: 0,
      },
      period: 'Always Free',
      features: [
        'Up to 2 Production Units (e.g. 1 Brooder + 1 Pond)',
        'Up to 1,500 birds or 3,000 fish capacity',
        'Offline Daily Farm Log with photo storage',
        'Standard stock movement ledger calculation',
        'Daily verified market prices ticker',
        'Standard marketplace listings (3% escrow fee on sales)',
      ],
      cta: 'Start Free Today',
      href: '/signup',
      highlight: false,
    },
    {
      name: 'Commercial Producer',
      tagline: 'For intensive commercial farms with field staff and multiple batches.',
      prices: {
        NGN: 18500,
        KES: 1950,
        GHS: 190,
        UGX: 52000,
        USD: 15,
      },
      period: 'per month',
      features: [
        'Unlimited Farm Sites & Production Units',
        'Worker Accounts & Task Delegation',
        'Supervisor Review Console with photo/video audit trail',
        'Feed Inventory & Low-Stock Auto Alerts',
        'Biosecurity & Mortality Spike automated alerts',
        'Direct RFQ Bidding & Priority Marketplace placement',
        'Discounted 1.5% Escrow Transaction Fee',
      ],
      cta: 'Launch Commercial Hub',
      href: '/dashboard',
      highlight: true,
    },
    {
      name: 'Cooperative Union',
      tagline: 'For agricultural federations aggregating smallholder harvests.',
      prices: {
        NGN: 65000,
        KES: 6800,
        GHS: 650,
        UGX: 180000,
        USD: 49,
      },
      period: 'per month',
      features: [
        'Up to 1,000 Registered Cooperative Members',
        'Collective Harvest Pooling & Batch Blending',
        'Member Dividend Split & Auto-Reconciliation',
        'Audited Grain Moisture & Quality Certifications',
        'Integrated Transporter Waybill Dispatching',
        'Dedicated Regional Account Manager',
      ],
      cta: 'Empower Your Cooperative',
      href: '/dashboard/cooperative',
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-emerald-700 font-bold text-xs uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Transparent African Pricing
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
            Predictable plans designed for real agricultural cashflows.
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            No hidden export tariffs or setup fees. Pay seamlessly via Paystack, Flutterwave, M-Pesa, MTN Mobile Money, or bank transfer.
          </p>

          {/* Currency Switcher */}
          <div className="mt-6 inline-flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-sm text-xs font-bold">
            {(['NGN', 'KES', 'GHS', 'USD'] as Currency[]).map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCurrency(c)}
                className={`px-3 py-1.5 rounded-lg transition ${
                  selectedCurrency === c
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {c === 'NGN' ? '₦ Nigerian Naira' : c === 'KES' ? 'KSh Kenyan Shilling' : c === 'GHS' ? 'GH₵ Ghanaian Cedi' : '$ US Dollar'}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className={`bg-white rounded-2xl border p-8 flex flex-col justify-between shadow-sm transition relative ${
                tier.highlight
                  ? 'border-emerald-500 shadow-emerald-500/10 shadow-xl ring-2 ring-emerald-500'
                  : 'border-slate-200 hover:shadow-md'
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-emerald-600 text-white font-bold text-[11px] uppercase tracking-wider shadow">
                  Most Popular for Commercial Farms
                </div>
              )}

              <div>
                <h3 className="text-lg font-bold text-slate-900">{tier.name}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{tier.tagline}</p>

                <div className="my-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black text-slate-900">
                      {tier.prices[selectedCurrency] === 0
                        ? 'Free'
                        : formatCurrency(tier.prices[selectedCurrency], selectedCurrency)}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">/{tier.period}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-6 border-t border-slate-100 text-xs">
                  <div className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">
                    Included Capabilities:
                  </div>
                  {tier.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-700">
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <Link
                  href={tier.href}
                  className={`w-full py-3 rounded-xl font-bold text-xs text-center block transition shadow-sm ${
                    tier.highlight
                      ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">Frequently Asked Questions</h3>
          <div className="space-y-6 text-xs">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">How does the 11-State Escrow work?</h4>
              <p className="text-slate-600 mt-1 leading-relaxed">
                When a buyer agrees on a quote, they deposit the purchase funds into AgriLink Africa’s secure custodial account (powered by Paystack or Flutterwave). The farmer is notified that funds are secured. Once produce is delivered and the buyer inputs their delivery verification OTP, the funds are instantly settled to the farmer’s bank or mobile wallet.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Can farm hands use this with poor internet connectivity?</h4>
              <p className="text-slate-600 mt-1 leading-relaxed">
                Yes. The worker activity module operates in offline-first mode. Workers take photos and record task entries locally. The records are queued safely and automatically synchronize as soon as cellular data or WiFi is available.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">How is farm biosecurity protected in the marketplace?</h4>
              <p className="text-slate-600 mt-1 leading-relaxed">
                We never expose your exact farm coordinates or physical road address publicly. Public listings only state the general district or region (e.g. "Sagamu Axis, Ogun State"). Detailed dispatch and pickup instructions are only disclosed to authorized transporters after payment is secured in escrow.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
