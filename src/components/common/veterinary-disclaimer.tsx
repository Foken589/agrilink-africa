'use client';

import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export function VeterinaryDisclaimer({ className = '' }: { className?: string }) {
  return (
    <div className={`p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-sm flex items-start gap-3 ${className}`}>
      <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
      <div>
        <h4 className="font-semibold text-amber-950 flex items-center gap-1.5">
          <span>Biosecurity & Veterinary Compliance Notice</span>
          <span className="text-xs bg-amber-200/80 text-amber-800 px-2 py-0.5 rounded-full font-medium">Policy Rule</span>
        </h4>
        <p className="mt-1 text-xs leading-relaxed text-amber-800">
          This system records operational observations, environmental events, and mortality logs for farm accounting and trend monitoring. 
          <strong> Software observations must never be interpreted as formal veterinary diagnoses or toxicological clearances.</strong> Always consult a registered veterinary surgeon or state agricultural extension officer for disease outbreaks, persistent mortality spikes, and prescription antibiotics.
        </p>
      </div>
    </div>
  );
}

export function PriceDisclaimer({ className = '' }: { className?: string }) {
  return (
    <div className={`p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs flex items-start gap-2.5 ${className}`}>
      <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
      <p>
        <strong>Market Price Transparency:</strong> Benchmark commodity rates are derived from field agent bulletins, verified aggregator invoices, and user submissions. Rates fluctuate rapidly due to fuel tariffs, road conditions, and seasonal yields. AgriLink Africa does not guarantee or fix final trade prices between independent buyers and sellers.
      </p>
    </div>
  );
}
