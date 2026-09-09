'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  MapPin, 
  ShieldCheck, 
  ShoppingBag, 
  ArrowRight, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  Tag,
  Clock
} from 'lucide-react';
import { Header } from '@/components/navigation/header';
import { Footer } from '@/components/navigation/footer';
import { useStore } from '@/lib/data/store-context';
import { formatCurrency } from '@/lib/utils';
import { ProduceListing, Currency } from '@/types';

export default function MarketplacePage() {
  const { produceListings, currentUser, createRFQ, advanceOrderState, orders } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedListing, setSelectedListing] = useState<ProduceListing | null>(null);

  // Booking / RFQ Modal state
  const [orderQuantity, setOrderQuantity] = useState<number>(100);
  const [shippingAddress, setShippingAddress] = useState('Central Food Terminal, Lagos, Nigeria');
  const [orderSuccessMsg, setOrderSuccessMsg] = useState('');

  const categories = ['All', 'Poultry', 'Aquaculture', 'Grains & Cereals', 'Roots & Tubers', 'Horticulture'];

  const filteredListings = produceListings.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch =
      item.commodityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.varietyBreed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.approximateLocation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListing) return;

    if (orderQuantity < selectedListing.minimumOrderQty) {
      alert(`Minimum order quantity for this listing is ${selectedListing.minimumOrderQty} ${selectedListing.unitOfMeasure}.`);
      return;
    }

    const subtotal = orderQuantity * selectedListing.unitPriceExpected;
    const logistics = Math.round(subtotal * 0.05); // 5% estimated haulage
    const fee = Math.round(subtotal * 0.02); // 2% platform escrow fee
    const total = subtotal + logistics + fee;

    // Create an RFQ / Order in state
    createRFQ({
      buyerId: currentUser.id,
      buyerName: currentUser.fullName,
      commodityNeeded: selectedListing.commodityName,
      category: selectedListing.category,
      requiredQuantity: orderQuantity,
      unitOfMeasure: selectedListing.unitOfMeasure,
      maxBudgetUnit: selectedListing.unitPriceExpected,
      currency: selectedListing.currency,
      deliveryDestination: shippingAddress,
      deadlineDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      notes: `Order booking initiated for ${selectedListing.commodityName} (${selectedListing.varietyBreed}). Total calculated: ${formatCurrency(total, selectedListing.currency)}.`,
    });

    setOrderSuccessMsg(`Booking order for ${orderQuantity} ${selectedListing.unitOfMeasure} submitted into Escrow Pipeline!`);
    setTimeout(() => {
      setSelectedListing(null);
      setOrderSuccessMsg('');
    }, 2500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Page Title & Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">B2B Agricultural Marketplace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Pan-African Farm Produce & Livestock Marketplace
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Sourced directly from verified African farm holdings and cooperatives. Real-time batch traceability. 
            <strong className="text-emerald-800 ml-1">Farm biosecurity protection:</strong> Exact farm GPS coordinates are withheld until payment is held in escrow and order is confirmed.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search broilers, catfish, white maize, cassava, county or state..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
            >
              <div className="h-48 bg-slate-100 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={listing.photos[0] || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=500&auto=format&fit=crop&q=80'}
                  alt={listing.commodityName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/60 text-white text-[11px] font-bold backdrop-blur-sm">
                  {listing.category}
                </div>
                <div className="absolute top-3 right-3 px-2 py-1 rounded bg-emerald-600 text-white text-[11px] font-bold">
                  {listing.qualityGrade}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span className="font-semibold text-emerald-950">{listing.approximateLocation}</span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                    {listing.commodityName}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {listing.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 text-[11px] block">Variety / Breed:</span>
                      <span className="font-semibold text-slate-800">{listing.varietyBreed}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px] block">Available:</span>
                      <span className="font-semibold text-emerald-700">
                        {listing.quantityAvailable.toLocaleString()} {listing.unitOfMeasure}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px] block">Min Order (MOQ):</span>
                      <span className="font-medium text-slate-800">
                        {listing.minimumOrderQty} {listing.unitOfMeasure}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px] block">Status:</span>
                      <span className="font-medium text-emerald-800 capitalize">
                        {listing.availabilityStatus.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Unit Price</div>
                    <div className="text-lg font-black text-slate-900">
                      {formatCurrency(listing.unitPriceExpected, listing.currency)}
                      <span className="text-xs font-normal text-slate-500 ml-0.5">/ {listing.unitOfMeasure}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedListing(listing);
                      setOrderQuantity(listing.minimumOrderQty);
                    }}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-sm transition active:scale-95"
                  >
                    Direct Order / RFQ
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State if filter yields no result */}
        {filteredListings.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 mt-4">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">No produce matching your criteria</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search query or selecting a different category from the filters above.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Order / RFQ Booking Modal */}
        {selectedListing && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative">
              <div className="flex justify-between items-start mb-4 pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                    Escrow Booking Pipeline
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">
                    {selectedListing.commodityName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Sold by: <span className="font-semibold text-slate-700">{selectedListing.sellerName}</span>
                  </p>
                </div>
                <button
                  onClick={() => setSelectedListing(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              {orderSuccessMsg ? (
                <div className="p-6 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="text-base font-bold text-slate-900">{orderSuccessMsg}</h4>
                  <p className="text-xs text-slate-500">
                    Redirecting your transaction to the 11-stage order lifecycle...
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePlaceOrder} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Order Quantity ({selectedListing.unitOfMeasure}):
                    </label>
                    <input
                      type="number"
                      min={selectedListing.minimumOrderQty}
                      max={selectedListing.quantityAvailable}
                      value={orderQuantity}
                      onChange={(e) => setOrderQuantity(Number(e.target.value))}
                      required
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                    <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
                      <span>Minimum required: {selectedListing.minimumOrderQty} {selectedListing.unitOfMeasure}</span>
                      <span>Maximum available: {selectedListing.quantityAvailable.toLocaleString()}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Delivery Destination Address:
                    </label>
                    <textarea
                      rows={2}
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal ({orderQuantity} × {formatCurrency(selectedListing.unitPriceExpected, selectedListing.currency)}):</span>
                      <span className="font-semibold text-slate-900">
                        {formatCurrency(orderQuantity * selectedListing.unitPriceExpected, selectedListing.currency)}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Estimated Transporter Haulage (5%):</span>
                      <span className="font-semibold text-slate-900">
                        {formatCurrency(Math.round(orderQuantity * selectedListing.unitPriceExpected * 0.05), selectedListing.currency)}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>AgriLink Escrow & Protection Fee (2%):</span>
                      <span className="font-semibold text-slate-900">
                        {formatCurrency(Math.round(orderQuantity * selectedListing.unitPriceExpected * 0.02), selectedListing.currency)}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                      <span>Total Escrow Amount:</span>
                      <span className="text-emerald-700">
                        {formatCurrency(
                          Math.round(orderQuantity * selectedListing.unitPriceExpected * 1.07),
                          selectedListing.currency
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-900 text-[11px] flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                    <span>
                      Funds will be held securely in escrow. Transporter pickup coordinates unlocked only after payment confirmation.
                    </span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedListing(null)}
                      className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow transition"
                    >
                      Confirm Escrow Order
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
