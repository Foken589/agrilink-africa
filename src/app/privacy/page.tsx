import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/navigation/header';
import { Footer } from '@/components/navigation/footer';
import { ShieldCheck, Lock, Eye, MapPin } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="mb-8">
          <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider">Compliance & Sovereignty</span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Data Sovereignty & Privacy Policy</h1>
          <p className="text-xs text-slate-500 mt-1">Last revised: September 2026 • Compliant with NDPR, Kenya Data Protection Act & GDPR</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6 text-xs leading-relaxed text-slate-700">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              1. Farm Geolocation Masking & Biosecurity Protection
            </h2>
            <p>
              AgriLink Africa strictly implements private location protection for all agricultural holdings. Precise GPS coordinates, physical road plots, and boundary polygons are never exposed publicly on the marketplace. Listings only disclose regional districts (e.g., &quot;Ogun State&quot; or &quot;Nakuru County&quot;). Exact gate coordinates are disclosed strictly to authorized, verified transporters only after payment is securely locked in escrow.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-600" />
              2. Worker Photo & Video Evidence Privacy
            </h2>
            <p>
              Images submitted by field attendants and farm hands for daily task accountability (feeding, cleaning, mortalities) are stored in secure Supabase Storage buckets with access restricted to the farm owner and designated farm supervisors. Photos are treated as operational submitted evidence and are never syndicated to public search engines.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600" />
              3. Payment Credentials & Multi-Tenant Isolation
            </h2>
            <p>
              AgriLink Africa operates a zero-knowledge payment architecture. Raw debit card numbers, CVVs, and mobile money PINs are never stored or processed directly on our servers. All financial transactions are tokenized through licensed PCI-DSS compliant gateways (Paystack and Flutterwave). Database isolation is rigorously maintained at the database engine level via PostgreSQL Row Level Security (RLS).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              4. Data Export & Right to Deletion
            </h2>
            <p>
              Farm owners retain total sovereignty over their agricultural production records. You may export your entire batch history, mortality ledgers, and feed conversion logs in CSV or JSON at any time from your account settings.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
