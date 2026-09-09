import React from 'react';
import Link from 'next/link';
import { Sprout, Globe, ShieldCheck, Heart, Award, ArrowRight, MapPin } from 'lucide-react';
import { Header } from '@/components/navigation/header';
import { Footer } from '@/components/navigation/footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1">
        <section className="bg-emerald-950 text-white py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest bg-emerald-900/80 px-3 py-1 rounded-full border border-emerald-700">
                Our Pan-African Mission
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-4 tracking-tight leading-tight">
                From farm to market, with fewer barriers.
              </h1>
              <p className="text-emerald-100 text-base sm:text-lg mt-4 leading-relaxed">
                AgriLink Africa was founded to solve the core structural bottlenecks of African agriculture: input opacity, unaccountable farm supervision, predatory intermediary cartels, and post-harvest counterparty default.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Mathematical Transparency</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We believe farmers deserve immutable ledgers that protect their hard-earned livestock and prevent inventory shrinkage through tamper-evident audit trails.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Pan-African Corridors</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connecting agricultural hubs across Nigeria, Kenya, Ghana, Uganda, and Ethiopia. Facilitating cross-regional grain trade, hatchery genetics, and cold chain haulage.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Dignified Farm Work</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Giving field attendants and workers verifiable professional records. Every activity log with photo evidence creates an honest reputation profile.
              </p>
            </div>
          </div>

          <div className="mt-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Regional Headquarters & Corridors</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
              <div className="space-y-1">
                <div className="font-bold text-emerald-800 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Lagos & Abeokuta
                </div>
                <div className="text-slate-600">West Africa Commercial & Aquaculture Operations Hub</div>
                <div className="text-slate-400">Plot 12 Agro-Industrial Corridor, Ikeja</div>
              </div>

              <div className="space-y-1">
                <div className="font-bold text-emerald-800 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Nairobi & Nakuru
                </div>
                <div className="text-slate-600">East Africa Dairy, Grain & Horticulture Hub</div>
                <div className="text-slate-400">Kilimani AgriTech Center, Nairobi</div>
              </div>

              <div className="space-y-1">
                <div className="font-bold text-emerald-800 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Accra & Kumasi
                </div>
                <div className="text-slate-600">Ghana Grain & Poultry Sourcing Desk</div>
                <div className="text-slate-400">Airport Residential Area, Accra</div>
              </div>

              <div className="space-y-1">
                <div className="font-bold text-emerald-800 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Kampala
                </div>
                <div className="text-slate-600">Uganda Smallholder Cooperative Network</div>
                <div className="text-slate-400">Bugolobi Business Park, Kampala</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
