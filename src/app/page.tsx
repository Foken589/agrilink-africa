'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sprout, 
  Tractor, 
  ShoppingBag, 
  ShieldCheck, 
  Users, 
  Truck, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  Camera, 
  Lock, 
  Scale, 
  FileCheck, 
  Clock, 
  DollarSign, 
  Award, 
  Building2 
} from 'lucide-react';
import { Header } from '@/components/navigation/header';
import { Footer } from '@/components/navigation/footer';
import { useStore } from '@/lib/data/store-context';
import { formatCurrency } from '@/lib/utils';
import { VeterinaryDisclaimer, PriceDisclaimer } from '@/components/common/veterinary-disclaimer';

export default function HomePage() {
  const { marketPrices, produceListings, farms, livestockBatches } = useStore();

  const totalLivestock = livestockBatches.reduce((acc, b) => acc + b.currentLiveQuantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1">
        {/* Real-time Commodity Price Ticker */}
        <section className="bg-emerald-900 text-white py-2 px-4 border-b border-emerald-800 text-xs overflow-x-auto whitespace-nowrap">
          <div className="max-w-7xl mx-auto flex items-center gap-6">
            <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-emerald-300">
              <TrendingUp className="w-3.5 h-3.5" />
              Live Market Ticker:
            </span>
            <div className="flex items-center gap-6 animate-pulse-slow">
              {marketPrices.slice(0, 5).map((price) => (
                <div key={price.id} className="inline-flex items-center gap-2">
                  <span className="font-medium text-slate-200">{price.commodityName} ({price.city})</span>
                  <span className="font-bold text-emerald-200">
                    {formatCurrency(price.wholesalePrice, price.currency)} / {price.unitOfMeasure}
                  </span>
                  <span className={`text-[10px] font-semibold px-1 rounded ${
                    price.priceTrendPct >= 0 ? 'bg-emerald-800 text-emerald-200' : 'bg-rose-900/80 text-rose-200'
                  }`}>
                    {price.priceTrendPct >= 0 ? `+${price.priceTrendPct}%` : `${price.priceTrendPct}%`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-900 text-white pt-16 pb-24 lg:pt-24 lg:pb-32">
          {/* Subtle Decorative Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/50 text-emerald-200 text-xs font-semibold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  African Digital Operations Platform
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                  From farm to market, <br />
                  <span className="text-emerald-400">with fewer barriers.</span>
                </h1>

                <p className="text-lg sm:text-xl text-emerald-100/90 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                  The unified operating system for African commercial farms, smallholders, cooperatives and bulk buyers. Rigorous livestock ledgers, worker photo-accountability, verified market prices, and escrow trading.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">
                  <Link
                    href="/dashboard"
                    className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-base shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2 active:scale-95"
                  >
                    <span>Launch Live Platform</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>

                  <Link
                    href="/marketplace"
                    className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-base border border-white/20 transition flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-5 h-5 text-emerald-400" />
                    <span>Explore B2B Marketplace</span>
                  </Link>
                </div>

                {/* Key Pillars */}
                <div className="pt-8 border-t border-emerald-800/60 grid grid-cols-2 sm:grid-cols-3 gap-4 text-left">
                  <div>
                    <div className="text-2xl font-black text-white">100%</div>
                    <div className="text-xs text-emerald-300/80 font-medium">Server Stock Integrity (No Negative Stock)</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white">11 States</div>
                    <div className="text-xs text-emerald-300/80 font-medium">Guaranteed Escrow Trade Lifecycle</div>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <div className="text-2xl font-black text-white">Photo Proof</div>
                    <div className="text-xs text-emerald-300/80 font-medium">Worker Accountability Audit Trails</div>
                  </div>
                </div>
              </div>

              {/* Hero Live Snapshot Card */}
              <div className="lg:col-span-5">
                <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 text-slate-900 shadow-2xl border border-white/20">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                        <Tractor className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 font-medium">Active Farm Hub</div>
                        <div className="font-bold text-slate-900 text-sm">Sunrise Agro-Pastoral (Ogun, NG)</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Operational
                    </span>
                  </div>

                  {/* Micro stats */}
                  <div className="grid grid-cols-3 gap-3 my-4">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-[11px] text-slate-500">Live Heads</div>
                      <div className="text-lg font-extrabold text-emerald-700">{totalLivestock.toLocaleString()}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-[11px] text-slate-500">Mortality 7D</div>
                      <div className="text-lg font-extrabold text-slate-700">1.8%</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-[11px] text-slate-500">Evidence Due</div>
                      <div className="text-lg font-extrabold text-amber-600">2 Items</div>
                    </div>
                  </div>

                  {/* Worker audit preview */}
                  <div className="space-y-2 text-xs">
                    <div className="font-semibold text-slate-700 uppercase tracking-wider text-[10px]">
                      Recent Worker Activity with Evidence
                    </div>
                    <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md bg-slate-200 overflow-hidden relative flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=100&auto=format&fit=crop&q=80"
                          alt="Broiler flock proof"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-slate-900 truncate">Fed 65kg Finisher • House Alpha</div>
                        <div className="text-slate-500 text-[11px]">Worker: Ibrahim • 07:55 AM (GPS Verified)</div>
                      </div>
                      <span className="px-2 py-1 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                        Pending
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Waybill #WAY-AGL-77492</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5" /> En Route to Lagos Cold Hub
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Value Pillars */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-emerald-700 font-bold text-xs uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Engineered for African Agricultural Realities
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
                Built specifically for African livestock, farms & supply chains
              </h2>
              <p className="text-slate-600 mt-3 text-base">
                Generic spreadsheets and Western farm tools fail when connectivity drops or when workers lack supervision accountability. AgriLink Africa bridges the trust deficit.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500/50 hover:shadow-lg transition">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-5 shadow-md">
                  <Scale className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Rigorous Stock Ledger
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Server-side ledger formula enforces: Opening + Additions + Births - Sales - Mortality - Culls. Never allows negative stock, preventing theft or phantom numbers.
                </p>
                <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Multi-unit: poultry, fish, cattle, goats, pigs
                </div>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500/50 hover:shadow-lg transition">
                <div className="w-12 h-12 rounded-xl bg-sky-600 text-white flex items-center justify-center mb-5 shadow-md">
                  <Camera className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Worker Photo-Accountability
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Farm hands log feeding, cleaning, vaccinations, and mortalities with timestamped photo evidence. Supervisors approve, reject, or request corrections with an audit trail.
                </p>
                <div className="text-xs font-semibold text-sky-700 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Treated as submitted evidence, not blind proof
                </div>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500/50 hover:shadow-lg transition">
                <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center mb-5 shadow-md">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  11-State Escrow Trading
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  From RFQ to Quote, Escrow Lock, Scheduled Transport, Waybill OTP, to Delivery Sign-off. Protects farmers from bad debts and buyers from delivery failure.
                </p>
                <div className="text-xs font-semibold text-amber-700 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Farm GPS coordinates hidden until booking
                </div>
              </div>

              {/* Feature 4 */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500/50 hover:shadow-lg transition">
                <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-5 shadow-md">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Verified African Market Prices
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Daily wholesale & retail pricing across major urban trading terminals: Lagos Mile 12, Nairobi Wakulima, Kano Dawanau, Accra Agbogbloshie, and Kampala Owino.
                </p>
                <div className="text-xs font-semibold text-purple-700 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Audited field bulletins & aggregator trade receipts
                </div>
              </div>

              {/* Feature 5 */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500/50 hover:shadow-lg transition">
                <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center mb-5 shadow-md">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Cooperative Produce Aggregation
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Smallholders pool their grain harvests, catfish ponds, or dairy outputs to secure massive institutional contracts from supermarkets and food processing mills.
                </p>
                <div className="text-xs font-semibold text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Transparent member ledger & dividend split
                </div>
              </div>

              {/* Feature 6 */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500/50 hover:shadow-lg transition">
                <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center mb-5 shadow-md">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Agricultural Logistics & Waybills
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Verified haulers with specialized livestock cages, aerated fish tanks, and grain trucks. OTP handshakes ensure produce is transferred safely with digital proof.
                </p>
                <div className="text-xs font-semibold text-teal-700 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> End-to-end chain of custody & delivery OTP
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Produce Listings Section */}
        <section className="py-16 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
              <div>
                <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider">
                  Direct Farmgate Sourcing
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                  Live Agricultural Marketplace
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Browse verified listings. Exact coordinates protected for farm biosecurity until an order is confirmed.
                </p>
              </div>

              <Link
                href="/marketplace"
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition"
              >
                <span>View All Listings ({produceListings.length})</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {produceListings.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition flex flex-col"
                >
                  <div className="h-44 bg-slate-100 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={listing.photos[0] || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400&auto=format&fit=crop&q=80'}
                      alt={listing.commodityName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-bold backdrop-blur-sm">
                      {listing.category}
                    </div>
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold">
                      {listing.qualityGrade}
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] text-emerald-800 font-semibold mb-0.5">
                        {listing.approximateLocation}
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm line-clamp-1">
                        {listing.commodityName}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Variety: <span className="text-slate-700 font-medium">{listing.varietyBreed}</span>
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-end justify-between">
                      <div>
                        <div className="text-[10px] text-slate-400">Available: {listing.quantityAvailable.toLocaleString()} {listing.unitOfMeasure}</div>
                        <div className="text-base font-extrabold text-slate-900">
                          {formatCurrency(listing.unitPriceExpected, listing.currency)}{' '}
                          <span className="text-xs font-normal text-slate-500">/ {listing.unitOfMeasure}</span>
                        </div>
                      </div>

                      <Link
                        href={`/marketplace?listing=${listing.id}`}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition"
                      >
                        Order / RFQ
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Disclaimers & Compliance Banner */}
        <section className="py-10 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <VeterinaryDisclaimer />
            <PriceDisclaimer />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
