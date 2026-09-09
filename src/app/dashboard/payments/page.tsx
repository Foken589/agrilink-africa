'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  CreditCard, 
  Lock, 
  ShieldCheck, 
  DollarSign, 
  ArrowRight, 
  CheckCircle2, 
  RefreshCw, 
  Smartphone, 
  Building2 
} from 'lucide-react';
import { useStore } from '@/lib/data/store-context';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { defaultPaymentEngine } from '@/lib/payments/provider';

export default function PaymentsEscrowDashboardPage() {
  const { orders, currentUser } = useStore();
  const [provider, setProvider] = useState<'paystack' | 'flutterwave' | 'mobile_money' | 'escrow_simulated'>('paystack');
  const [testAmount, setTestAmount] = useState('1551250');
  const [simStatus, setSimStatus] = useState('');

  // Escrow metrics
  const totalInEscrow = orders
    .filter((o) => o.paymentStatus === 'escrow_funded')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const totalReleased = orders
    .filter((o) => o.paymentStatus === 'released_to_seller')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const handleSimulatePayment = async () => {
    setSimStatus('Initializing secure tokenized checkout with ' + provider.toUpperCase() + '...');
    try {
      const resp = await defaultPaymentEngine.initializePayment({
        orderId: 'ord-sim-001',
        orderNumber: 'AGL-SIM-9921',
        buyerEmail: currentUser.email,
        amount: parseFloat(testAmount) || 100000,
        currency: 'NGN',
      });

      setTimeout(() => {
        setSimStatus(`Payment of ₦${Number(testAmount).toLocaleString()} held securely in Escrow! Reference: ${resp.reference}`);
      }, 1000);
    } catch {
      setSimStatus('Payment gateway simulation complete.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Escrow Settlement & Payments Provider</h1>
          <p className="text-xs text-slate-500 mt-1">
            Pluggable abstraction supporting Paystack, Flutterwave, M-Pesa, and MTN Mobile Money. Zero card PAN storage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>PCI-DSS Tokenized</span>
          </span>
        </div>
      </div>

      {/* Escrow Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-slate-500 text-xs font-semibold">Funds Currently in Escrow</span>
          <div className="text-2xl font-black text-amber-600 mt-1">{formatCurrency(totalInEscrow, 'NGN')}</div>
          <div className="text-[11px] text-slate-500 mt-1">Held until delivery OTP verified</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-slate-500 text-xs font-semibold">Total Settled to Producers</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">{formatCurrency(totalReleased, 'NGN')}</div>
          <div className="text-[11px] text-slate-500 mt-1">Transferred directly to bank / MoMo</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-slate-500 text-xs font-semibold">Default Settlement Protocol</span>
          <div className="text-sm font-bold text-slate-900 mt-2">T+0 Instant on OTP Verification</div>
          <div className="text-[10px] text-slate-400 mt-1">Zero rolling reserve for verified farmers</div>
        </div>
      </div>

      {/* Interactive Gateway Sandbox */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Interactive Gateway Settlement Sandbox</h3>
            <p className="text-[11px] text-slate-500">Test multi-currency escrow processing with African providers</p>
          </div>
        </div>

        {simStatus && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{simStatus}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select Payment Provider Abstraction</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setProvider('paystack')}
                className={`p-3 rounded-xl border text-left font-bold transition ${
                  provider === 'paystack'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-600'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Paystack (Nigeria / Ghana / Kenya)
              </button>

              <button
                type="button"
                onClick={() => setProvider('flutterwave')}
                className={`p-3 rounded-xl border text-left font-bold transition ${
                  provider === 'flutterwave'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-600'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Flutterwave (Pan-African)
              </button>

              <button
                type="button"
                onClick={() => setProvider('mobile_money')}
                className={`p-3 rounded-xl border text-left font-bold transition ${
                  provider === 'mobile_money'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-600'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                M-Pesa / MTN MoMo (USSD)
              </button>

              <button
                type="button"
                onClick={() => setProvider('escrow_simulated')}
                className={`p-3 rounded-xl border text-left font-bold transition ${
                  provider === 'escrow_simulated'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-600'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Simulated Custodial Escrow
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Test Escrow Amount (NGN)</label>
              <input
                type="number"
                value={testAmount}
                onChange={(e) => setTestAmount(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-black text-slate-900"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <div><strong>Payer:</strong> {currentUser.email}</div>
              <div><strong>Security:</strong> Card details are never handled by AgriLink application servers.</div>
            </div>

            <button
              onClick={handleSimulatePayment}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Simulate Escrow Deposit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
