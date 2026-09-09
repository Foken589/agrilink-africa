'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Filter, 
  ShieldCheck, 
  Plus, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { Header } from '@/components/navigation/header';
import { Footer } from '@/components/navigation/footer';
import { PriceDisclaimer } from '@/components/common/veterinary-disclaimer';
import { useStore } from '@/lib/data/store-context';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Currency, PriceSourceType } from '@/types';

export default function MarketPricesPage() {
  const { marketPrices, addMarketPrice } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Submit Price Modal state
  const [showModal, setShowModal] = useState(false);
  const [newCommodity, setNewCommodity] = useState('');
  const [newCategory, setNewCategory] = useState('Poultry');
  const [newMarket, setNewMarket] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newCountry, setNewCountry] = useState('Nigeria');
  const [newWholesale, setNewWholesale] = useState('');
  const [newRetail, setNewRetail] = useState('');
  const [newUnit, setNewUnit] = useState('kg');
  const [newCurrency, setNewCurrency] = useState<Currency>('NGN');
  const [newNotes, setNewNotes] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const countries = ['All', 'Nigeria', 'Kenya', 'Ghana', 'Uganda'];
  const categories = ['All', 'Poultry', 'Aquaculture', 'Grains & Cereals', 'Dairy', 'Tubers & Roots', 'Plantains & Bananas'];

  const filteredPrices = marketPrices.filter((p) => {
    const matchesCountry = selectedCountry === 'All' || p.country === selectedCountry;
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.commodityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.marketName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCountry && matchesCategory && matchesSearch;
  });

  const handleSubmitPrice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommodity || !newMarket || !newWholesale) return;

    addMarketPrice({
      commodityName: newCommodity,
      category: newCategory,
      marketName: newMarket,
      city: newCity || 'Regional Terminal',
      country: newCountry,
      stateRegion: `${newCity} Region`,
      wholesalePrice: parseFloat(newWholesale),
      retailPrice: parseFloat(newRetail) || parseFloat(newWholesale) * 1.15,
      unitOfMeasure: newUnit,
      currency: newCurrency,
      priceDate: new Date().toISOString().split('T')[0],
      dataSourceType: 'user_submitted',
      verificationBadge: 'Farmer Crowd-sourced Sample',
      priceTrendPct: 0.0,
      notes: newNotes || 'Submitted by local platform participant.',
    });

    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setShowModal(false);
      setNewCommodity('');
      setNewMarket('');
      setNewWholesale('');
      setNewRetail('');
      setNewNotes('');
    }, 1500);
  };

  const getBadgeStyle = (sourceType: PriceSourceType) => {
    switch (sourceType) {
      case 'verified_bulletin':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'aggregator_receipt':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'user_submitted':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-purple-100 text-purple-800 border-purple-300';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Link href="/" className="hover:underline">Home</Link>
              <span>/</span>
              <span className="text-slate-900 font-semibold">Commodity Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Verified African Agricultural Market Prices
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Independent benchmark prices collected daily from terminal wholesale hubs across Nigeria, Kenya, Ghana, and Uganda. Clearly labeled by verification level.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Local Market Price</span>
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search commodity (e.g., broiler, catfish, maize) or market name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
              >
                {countries.map((c) => (
                  <option key={c} value={c}>Country: {c}</option>
                ))}
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>Category: {cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Market Prices Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Commodity</th>
                  <th className="py-3 px-4">Market & Location</th>
                  <th className="py-3 px-4 text-right">Wholesale Price</th>
                  <th className="py-3 px-4 text-right">Retail Price</th>
                  <th className="py-3 px-4 text-center">7D Trend</th>
                  <th className="py-3 px-4">Data Source & Badge</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPrices.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div>{record.commodityName}</div>
                      <div className="text-[11px] text-slate-400 font-normal">{record.category}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                        <span>{record.marketName}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {record.city}, {record.country}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="font-black text-slate-900 text-sm">
                        {formatCurrency(record.wholesalePrice, record.currency)}
                      </div>
                      <div className="text-[10px] text-slate-400">per {record.unitOfMeasure}</div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="font-bold text-slate-700">
                        {formatCurrency(record.retailPrice, record.currency)}
                      </div>
                      <div className="text-[10px] text-slate-400">per {record.unitOfMeasure}</div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full font-bold text-[11px] ${
                        record.priceTrendPct > 0
                          ? 'bg-emerald-100 text-emerald-800'
                          : record.priceTrendPct < 0
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {record.priceTrendPct > 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : record.priceTrendPct < 0 ? (
                          <TrendingDown className="w-3 h-3" />
                        ) : null}
                        {record.priceTrendPct > 0 ? `+${record.priceTrendPct}%` : `${record.priceTrendPct}%`}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold border ${getBadgeStyle(record.dataSourceType)}`}>
                        {record.verificationBadge}
                      </span>
                      {record.notes && (
                        <p className="text-[11px] text-slate-500 mt-1 max-w-xs line-clamp-1">{record.notes}</p>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                      {formatDate(record.priceDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Disclaimer Banner */}
        <PriceDisclaimer />

        {/* Submit Price Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
              <div className="flex justify-between items-start mb-4 pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Submit Local Market Price</h3>
                  <p className="text-xs text-slate-500">Crowdsource African farmgate & terminal market prices</p>
                </div>
                <button onClick={() => setShowModal(false)} className="text-slate-400 font-bold p-1">✕</button>
              </div>

              {submitSuccess ? (
                <div className="p-6 text-center space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-slate-900">Price Bulletin Added!</h4>
                  <p className="text-xs text-slate-500">Thank you for contributing to open market transparency.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitPrice} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Commodity Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Live Broiler Chicken, Catfish, White Maize"
                      value={newCommodity}
                      onChange={(e) => setNewCommodity(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Market Name</label>
                      <input
                        type="text"
                        placeholder="e.g., Mile 12, Bodija"
                        value={newMarket}
                        onChange={(e) => setNewMarket(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">City / Town</label>
                      <input
                        type="text"
                        placeholder="e.g., Ibadan, Nairobi"
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Currency</label>
                      <select
                        value={newCurrency}
                        onChange={(e) => setNewCurrency(e.target.value as Currency)}
                        className="w-full px-2 py-2 border border-slate-200 rounded-lg text-xs"
                      >
                        <option value="NGN">NGN (₦)</option>
                        <option value="KES">KES (KSh)</option>
                        <option value="GHS">GHS (GH₵)</option>
                        <option value="UGX">UGX (USh)</option>
                        <option value="USD">USD ($)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Wholesale Price</label>
                      <input
                        type="number"
                        placeholder="5800"
                        value={newWholesale}
                        onChange={(e) => setNewWholesale(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Unit of Measure</label>
                      <input
                        type="text"
                        placeholder="e.g. bird, kg, 50kg bag"
                        value={newUnit}
                        onChange={(e) => setNewUnit(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Field Notes / Sources</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Price confirmed at farmgate after heavy morning truck arrivals."
                      value={newNotes}
                      onChange={(e) => setNewNotes(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold shadow"
                    >
                      Submit Bulletin
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
