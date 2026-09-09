'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Package, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  DollarSign, 
  Search, 
  ArrowDownRight, 
  ArrowUpRight 
} from 'lucide-react';
import { useStore } from '@/lib/data/store-context';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function InventoryDashboardPage() {
  const { feedInventory, feedTypes } = useStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInventory = feedInventory.filter((inv) =>
    inv.feedTypeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Feed & Input Inventory</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track feed bags, kilograms, low-stock thresholds, and expiration dates.
          </p>
        </div>
      </div>

      {/* Inventory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInventory.map((item) => {
          const isLow = item.currentStockKg <= item.lowStockThresholdKg;
          const feedType = feedTypes.find((f) => f.id === item.feedTypeId);

          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border p-6 shadow-sm space-y-4 flex flex-col justify-between ${
                isLow ? 'border-amber-300 ring-1 ring-amber-300 bg-amber-50/20' : 'border-slate-200'
              }`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {feedType?.category || 'Feed Category'}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm mt-0.5">{item.feedTypeName}</h3>
                  </div>
                  {isLow ? (
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Low Stock
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Adequate Stock
                    </span>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Available Bags</span>
                    <span className="text-xl font-black text-slate-900">{item.currentStockBags} bags</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Total Mass (kg)</span>
                    <span className="text-xl font-black text-emerald-700">{item.currentStockKg} kg</span>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Reorder Threshold:</span>
                    <span className="font-semibold text-slate-800">{item.lowStockThresholdKg} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Location:</span>
                    <span className="font-semibold text-slate-800">{item.storageLocation || 'Central Store'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Expiry Date:</span>
                    <span className="font-semibold text-slate-800">{item.expiryDate ? formatDate(item.expiryDate) : 'Not Specified'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">Restocked: {formatDate(item.lastRestockedAt)}</span>
                <Link
                  href="/marketplace"
                  className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 font-bold rounded-lg transition"
                >
                  Order Feed
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
