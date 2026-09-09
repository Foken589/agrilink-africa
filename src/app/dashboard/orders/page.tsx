'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Lock, 
  MapPin, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle, 
  FileText, 
  Key 
} from 'lucide-react';
import { useStore } from '@/lib/data/store-context';
import { formatCurrency, formatDateTime, getOrderStateBadge } from '@/lib/utils';
import { Order, OrderState } from '@/types';

export default function OrdersLifecyclePage() {
  const { orders, advanceOrderState, currentUser } = useStore();
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || '');
  const [transitionNotes, setTransitionNotes] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  const statesSequence: OrderState[] = [
    'REQUESTED',
    'QUOTED',
    'ACCEPTED',
    'CONFIRMED',
    'SCHEDULED',
    'PICKED_UP',
    'IN_TRANSIT',
    'DELIVERED',
    'COMPLETED',
  ];

  const currentStateIndex = selectedOrder ? statesSequence.indexOf(selectedOrder.currentState) : -1;

  const handleNextStep = (nextState: OrderState) => {
    if (!selectedOrder) return;
    const result = advanceOrderState(
      selectedOrder.id,
      nextState,
      transitionNotes || `Transitioned to ${nextState} by ${currentUser.fullName}`
    );

    if (result.success) {
      setActionSuccess(`Order updated to state: ${nextState}!`);
      setTransitionNotes('');
      setTimeout(() => setActionSuccess(''), 2500);
    }
  };

  const getNextAvailableStates = (current: OrderState): OrderState[] => {
    switch (current) {
      case 'REQUESTED':
        return ['QUOTED', 'CANCELLED'];
      case 'QUOTED':
        return ['ACCEPTED', 'CANCELLED'];
      case 'ACCEPTED':
        return ['CONFIRMED', 'CANCELLED'];
      case 'CONFIRMED':
        return ['SCHEDULED', 'DISPUTED', 'CANCELLED'];
      case 'SCHEDULED':
        return ['PICKED_UP', 'DISPUTED'];
      case 'PICKED_UP':
        return ['IN_TRANSIT', 'DISPUTED'];
      case 'IN_TRANSIT':
        return ['DELIVERED', 'DISPUTED'];
      case 'DELIVERED':
        return ['COMPLETED', 'DISPUTED'];
      case 'DISPUTED':
        return ['COMPLETED', 'CANCELLED'];
      default:
        return [];
    }
  };

  const nextStates = selectedOrder ? getNextAvailableStates(selectedOrder.currentState) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">11-Stage Escrow Order Lifecycle</h1>
          <p className="text-xs text-slate-500 mt-1">
            REQUESTED → QUOTED → ACCEPTED → CONFIRMED → SCHEDULED → PICKED_UP → IN_TRANSIT → DELIVERED → COMPLETED.
          </p>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Orders List */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider px-1">
            Active Orders ({orders.length})
          </h3>
          <div className="space-y-2">
            {orders.map((ord) => {
              const isSelected = ord.id === selectedOrderId;
              const badge = getOrderStateBadge(ord.currentState);

              return (
                <button
                  key={ord.id}
                  onClick={() => setSelectedOrderId(ord.id)}
                  className={`w-full text-left p-4 rounded-xl border transition ${
                    isSelected
                      ? 'bg-white border-emerald-600 shadow-md ring-1 ring-emerald-600'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-mono font-bold text-slate-900 text-xs">{ord.orderNumber}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badge.bg} ${badge.color} ${badge.border}`}>
                      {badge.label}
                    </span>
                  </div>
                  <div className="font-bold text-slate-800 text-xs mt-1 truncate">{ord.commodityName}</div>
                  <div className="flex justify-between items-center text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
                    <span>{ord.quantity} {ord.unitOfMeasure}</span>
                    <span className="font-bold text-slate-900">{formatCurrency(ord.totalAmount, ord.currency)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Order Stepper & Controller */}
        {selectedOrder && (
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            {/* Order Title & Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-100 gap-2">
              <div>
                <span className="text-[10px] font-mono text-slate-400 block">{selectedOrder.orderNumber}</span>
                <h2 className="text-lg font-bold text-slate-900">{selectedOrder.commodityName}</h2>
                <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                  <span>Buyer: <strong className="text-slate-800">{selectedOrder.buyerName}</strong></span>
                  <span>•</span>
                  <span>Seller: <strong className="text-slate-800">{selectedOrder.sellerName}</strong></span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Total Escrow Value</div>
                <div className="text-2xl font-black text-emerald-700">
                  {formatCurrency(selectedOrder.totalAmount, selectedOrder.currency)}
                </div>
              </div>
            </div>

            {/* 11-State Visual Stepper */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Lifecycle Progression
              </span>
              <div className="overflow-x-auto pb-2">
                <div className="flex items-center min-w-[720px] justify-between text-xs">
                  {statesSequence.map((st, idx) => {
                    const isPassed = currentStateIndex >= idx;
                    const isCurrent = currentStateIndex === idx;

                    return (
                      <div key={st} className="flex-1 flex flex-col items-center relative">
                        {idx > 0 && (
                          <div
                            className={`absolute top-3 right-1/2 left-0 h-0.5 -z-0 ${
                              isPassed ? 'bg-emerald-600' : 'bg-slate-200'
                            }`}
                          />
                        )}
                        {idx < statesSequence.length - 1 && (
                          <div
                            className={`absolute top-3 left-1/2 right-0 h-0.5 -z-0 ${
                              currentStateIndex > idx ? 'bg-emerald-600' : 'bg-slate-200'
                            }`}
                          />
                        )}

                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] z-10 ${
                            isCurrent
                              ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 shadow'
                              : isPassed
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <span
                          className={`mt-1.5 text-[10px] font-bold text-center capitalize ${
                            isCurrent ? 'text-emerald-700' : isPassed ? 'text-slate-700' : 'text-slate-400'
                          }`}
                        >
                          {st.toLowerCase().replace(/_/g, ' ')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Financial Breakdown & Biosecurity Location Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Financial Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Escrow Breakdown</span>
                </h4>
                <div className="flex justify-between text-slate-600">
                  <span>Produce Subtotal ({selectedOrder.quantity} {selectedOrder.unitOfMeasure}):</span>
                  <span className="font-semibold text-slate-800">
                    {formatCurrency(selectedOrder.subtotalAmount, selectedOrder.currency)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Logistics / Haulage:</span>
                  <span className="font-semibold text-slate-800">
                    {formatCurrency(selectedOrder.logisticsAmount, selectedOrder.currency)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>AgriLink Platform Escrow Fee:</span>
                  <span className="font-semibold text-slate-800">
                    {formatCurrency(selectedOrder.platformFeeAmount, selectedOrder.currency)}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                  <span>Payment Settlement Status:</span>
                  <span className="text-emerald-700 uppercase font-black">{selectedOrder.paymentStatus.replace(/_/g, ' ')}</span>
                </div>
              </div>

              {/* Private Pickup & OTP Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>Biosecure Pickup & Digital Handshake</span>
                </h4>

                {['CONFIRMED', 'SCHEDULED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'COMPLETED'].includes(selectedOrder.currentState) ? (
                  <div className="space-y-1.5 text-slate-700">
                    <div className="text-[11px] text-emerald-900 bg-emerald-100/60 p-2 rounded-lg font-medium">
                      <strong>Authorized Farm Gate:</strong> {selectedOrder.authorizedPickupAddress || 'Kilometer 8 Abeokuta Expressway'}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Transporter:</span>
                      <span className="font-semibold">{selectedOrder.transporterName || 'Kazi Swift Haulage'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Waybill #:</span>
                      <span className="font-mono font-bold text-slate-900">{selectedOrder.waybillNumber || 'WAY-AGL-77492'}</span>
                    </div>
                    <div className="flex justify-between font-mono bg-white p-1.5 rounded border border-slate-200">
                      <span>Pickup OTP: <strong className="text-slate-900">{selectedOrder.pickupOtp || '8492'}</strong></span>
                      <span>Delivery OTP: <strong className="text-emerald-700">{selectedOrder.deliveryOtp || '3190'}</strong></span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-[11px] space-y-1">
                    <div className="font-bold flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" /> Farm Gate Coordinates Encrypted
                    </div>
                    <p>
                      Exact road location and farm contacts are masked until buyer completes payment into escrow and state enters <code>CONFIRMED</code>.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Advance State Controller */}
            {nextStates.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold uppercase tracking-wider text-emerald-400">
                    Advance Order State Machine
                  </span>
                  <span className="text-slate-400">Current Role: {currentUser.fullName} ({currentUser.role})</span>
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Audit note for this transition (e.g. Verified 250 birds loaded, scale calibrated)..."
                    value={transitionNotes}
                    onChange={(e) => setTransitionNotes(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {nextStates.map((st) => (
                    <button
                      key={st}
                      onClick={() => handleNextStep(st)}
                      className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow ${
                        st === 'DISPUTED' || st === 'CANCELLED'
                          ? 'bg-rose-700 hover:bg-rose-800 text-white'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      }`}
                    >
                      <span>Transition to: {st.replace(/_/g, ' ')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Audit History */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Permanent Order State History
              </h4>
              <div className="space-y-2 text-xs">
                {selectedOrder.history.map((h) => (
                  <div key={h.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex justify-between items-start">
                    <div>
                      <div className="font-bold text-slate-900">
                        {h.state} — <span className="text-slate-600 font-normal">{h.actor} ({h.actorRole})</span>
                      </div>
                      {h.notes && <div className="text-[11px] text-slate-500 mt-0.5">{h.notes}</div>}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                      {formatDateTime(h.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
