'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sprout, 
  Scale, 
  ArrowRight, 
  ShieldCheck, 
  AlertTriangle, 
  Plus, 
  Minus, 
  RotateCcw, 
  CheckCircle2, 
  Activity 
} from 'lucide-react';
import { Header } from '@/components/navigation/header';
import { Footer } from '@/components/navigation/footer';
import { VeterinaryDisclaimer } from '@/components/common/veterinary-disclaimer';
import { useStore } from '@/lib/data/store-context';

export default function LivestockPublicPage() {
  const { livestockBatches } = useStore();

  // Interactive Live Ledger Simulator for visitors to test formula & negative stock guard!
  const [opening, setOpening] = useState(1000);
  const [purchases, setPurchases] = useState(200);
  const [births, setBirths] = useState(25);
  const [transfersIn, setTransfersIn] = useState(0);
  const [sales, setSales] = useState(150);
  const [mortality, setMortality] = useState(18);
  const [culling, setCulling] = useState(5);
  const [transfersOut, setTransfersOut] = useState(0);
  const [simError, setSimError] = useState('');

  const totalAdditions = purchases + births + transfersIn;
  const totalDeductions = sales + mortality + culling + transfersOut;
  const currentCalculated = opening + totalAdditions - totalDeductions;

  const testDeduction = (amount: number) => {
    if (currentCalculated - amount < 0) {
      setSimError(`Violation Blocked: Cannot deduct ${amount}. Live stock is ${currentCalculated}. Negative stock is strictly rejected.`);
      setTimeout(() => setSimError(''), 4000);
    } else {
      setSales((prev) => prev + amount);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-emerald-950 text-white py-16 lg:py-20 border-b border-emerald-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest bg-emerald-900/80 px-3 py-1 rounded-full border border-emerald-700">
                Tamper-Evident Agricultural Accounting
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-4 tracking-tight leading-tight">
                African Livestock Ledger & Stock Movement Engine
              </h1>
              <p className="text-emerald-100 text-base sm:text-lg mt-4 leading-relaxed">
                Stock loss through unrecorded mortalities, unauthorized sales, and sloppy recordkeeping costs African livestock farmers millions. AgriLink Africa enforces an immutable server-side stock ledger that eliminates phantom inventory and flags anomalies.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/dashboard/livestock"
                  className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm shadow-md transition flex items-center gap-2"
                >
                  <span>Open Livestock Batches</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Live Formula Explanation & Interactive Simulator */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              The Immutable Stock Ledger Formula
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Every bird, fish, goat, pig, and calf is accounted for with mathematical certainty.
            </p>
          </div>

          {/* Formula Callout */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800 mb-10 overflow-x-auto">
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-2">
              Server-Authoritative Stock Invariant
            </div>
            <div className="font-mono text-base sm:text-lg font-bold text-slate-100 py-2">
              Current Live Stock = Opening + Additions + Births + TransfersIn − Sales − Mortality − Culls − TransfersOut
            </div>
            <div className="text-xs text-slate-400 mt-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Constraint Guard: Database transactions fail if calculated stock drops below 0.</span>
            </div>
          </div>

          {/* Interactive Simulator Box */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-100 gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Interactive Stock Movement Sandbox</h3>
                <p className="text-xs text-slate-500">Test how stock additions and deductions calculate real-time live quantities</p>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-500 font-medium">Calculated Live Balance:</div>
                <div className="text-3xl font-black text-emerald-700">
                  {currentCalculated.toLocaleString()} <span className="text-sm font-normal text-slate-500">heads</span>
                </div>
              </div>
            </div>

            {simError && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-bold flex items-center gap-2 animate-bounce">
                <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{simError}</span>
              </div>
            )}

            {/* Inputs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 text-xs">
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                <span className="text-emerald-800 font-bold block mb-1">Opening Stock</span>
                <input
                  type="number"
                  value={opening}
                  onChange={(e) => setOpening(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-white px-2.5 py-1.5 border border-emerald-200 rounded font-bold text-sm"
                />
              </div>

              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                <span className="text-emerald-800 font-bold block mb-1">+ Purchases / Stocking</span>
                <input
                  type="number"
                  value={purchases}
                  onChange={(e) => setPurchases(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-white px-2.5 py-1.5 border border-emerald-200 rounded font-bold text-sm"
                />
              </div>

              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                <span className="text-emerald-800 font-bold block mb-1">+ Births / Hatching</span>
                <input
                  type="number"
                  value={births}
                  onChange={(e) => setBirths(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-white px-2.5 py-1.5 border border-emerald-200 rounded font-bold text-sm"
                />
              </div>

              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                <span className="text-emerald-800 font-bold block mb-1">+ Transfers In</span>
                <input
                  type="number"
                  value={transfersIn}
                  onChange={(e) => setTransfersIn(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-white px-2.5 py-1.5 border border-emerald-200 rounded font-bold text-sm"
                />
              </div>

              <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100">
                <span className="text-rose-800 font-bold block mb-1">− Commercial Sales</span>
                <input
                  type="number"
                  value={sales}
                  onChange={(e) => setSales(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-white px-2.5 py-1.5 border border-rose-200 rounded font-bold text-sm"
                />
              </div>

              <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100">
                <span className="text-rose-800 font-bold block mb-1">− Recorded Mortality</span>
                <input
                  type="number"
                  value={mortality}
                  onChange={(e) => setMortality(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-white px-2.5 py-1.5 border border-rose-200 rounded font-bold text-sm"
                />
              </div>

              <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100">
                <span className="text-rose-800 font-bold block mb-1">− Emergency Culling</span>
                <input
                  type="number"
                  value={culling}
                  onChange={(e) => setCulling(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-white px-2.5 py-1.5 border border-rose-200 rounded font-bold text-sm"
                />
              </div>

              <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100">
                <span className="text-rose-800 font-bold block mb-1">− Transfers Out</span>
                <input
                  type="number"
                  value={transfersOut}
                  onChange={(e) => setTransfersOut(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-white px-2.5 py-1.5 border border-rose-200 rounded font-bold text-sm"
                />
              </div>
            </div>

            {/* Test Action Buttons */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-3 items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => testDeduction(50)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition"
                >
                  Simulate Sale of 50
                </button>
                <button
                  onClick={() => testDeduction(currentCalculated + 10)}
                  className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 font-semibold text-xs rounded-lg transition"
                >
                  Test Negative Stock Attack ({currentCalculated + 10})
                </button>
              </div>

              <div className="text-xs text-slate-500">
                Mortality Rate: <span className="font-bold text-slate-800">{((mortality / (opening + purchases + births)) * 100).toFixed(2)}%</span>
              </div>
            </div>
          </div>
        </section>

        {/* Active Batches Table Preview */}
        <section className="py-12 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Current Production Batches in Platform</h3>
                <p className="text-xs text-slate-500">Real-time status across integrated African poultry houses, ponds, and pens</p>
              </div>
              <Link
                href="/dashboard/livestock"
                className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
              >
                <span>View in Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-y border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Batch Code</th>
                    <th className="py-3 px-4">Species & Breed</th>
                    <th className="py-3 px-4">Age / Class</th>
                    <th className="py-3 px-4">Opening</th>
                    <th className="py-3 px-4">Live Quantity</th>
                    <th className="py-3 px-4">Biomass</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {livestockBatches.map((batch) => (
                    <tr key={batch.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-bold text-slate-900">{batch.batchCode}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{batch.speciesType}</div>
                        <div className="text-[11px] text-slate-500">{batch.breedStrain}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{batch.ageWeeksOrMonths}</td>
                      <td className="py-3 px-4 text-slate-600">{batch.openingQuantity.toLocaleString()}</td>
                      <td className="py-3 px-4 font-black text-emerald-700 text-sm">
                        {batch.currentLiveQuantity.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-semibold">{batch.biomassKg.toLocaleString()} kg</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                          {batch.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Regulatory & Veterinary Disclaimer */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <VeterinaryDisclaimer />
        </div>
      </main>

      <Footer />
    </div>
  );
}
