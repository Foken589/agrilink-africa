import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/navigation/header';
import { Footer } from '@/components/navigation/footer';
import { Scale, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="mb-8">
          <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider">Legal Framework</span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Agricultural Trading Terms & Escrow SLA</h1>
          <p className="text-xs text-slate-500 mt-1">Effective Date: September 2026 • Governing Agricultural Commerce Across Pan-African Corridors</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6 text-xs leading-relaxed text-slate-700">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-600" />
              1. The 11-State Order Lifecycle
            </h2>
            <p>
              All marketplace bookings and bulk contracts executed on AgriLink Africa transition sequentially through 11 immutable states: <code>REQUESTED</code> → <code>QUOTED</code> → <code>ACCEPTED</code> → <code>CONFIRMED</code> → <code>SCHEDULED</code> → <code>PICKED_UP</code> → <code>IN_TRANSIT</code> → <code>DELIVERED</code> → <code>COMPLETED</code> (or <code>DISPUTED</code> / <code>CANCELLED</code>). Orders cannot skip verification stages or bypass escrow authorization.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              2. Strict Non-Veterinary Disclaimer
            </h2>
            <p className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 font-medium">
              AgriLink Africa provides an operational software ledger, calculation tools, and mortality logging interfaces for internal agricultural accounting. In no circumstance does any software feature, calculation, or mortality log constitute a licensed veterinary diagnosis, pathological finding, or prescription advice.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              3. Delivery Inspection & Escrow Release
            </h2>
            <p>
              Upon delivery of live livestock or bulk agricultural produce, the buyer has a standard inspection window of four (4) hours to verify arrival headcount, live condition, and weight calibration against the official waybill. Release of escrow funds to the seller occurs automatically upon delivery OTP submission or after the expiration of the inspection window without a registered dispute.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              4. Dispute Arbitration & Evidence Requirement
            </h2>
            <p>
              Any dispute regarding weight shortage, mortality during transit, or quality grading below agreed specifications must be filed with photographic proof, weight bridge slips, and driver gate passes. AgriLink Africa arbitration panels investigate disputes within 24 hours.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
