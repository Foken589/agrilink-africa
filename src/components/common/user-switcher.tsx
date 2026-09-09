'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/data/store-context';
import { UserCheck, RefreshCw, ChevronDown, Shield, Users, Truck, ShoppingCart, Tractor } from 'lucide-react';

export function UserSwitcher() {
  const { currentUser, allUsers, switchUser, resetToDemoData } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'worker':
        return <Users className="w-4 h-4 text-sky-600" />;
      case 'buyer':
        return <ShoppingCart className="w-4 h-4 text-indigo-600" />;
      case 'transporter':
        return <Truck className="w-4 h-4 text-amber-600" />;
      case 'cooperative':
        return <Tractor className="w-4 h-4 text-emerald-600" />;
      case 'admin':
        return <Shield className="w-4 h-4 text-purple-600" />;
      default:
        return <Tractor className="w-4 h-4 text-emerald-600" />;
    }
  };

  const handleReset = () => {
    resetToDemoData();
    setResetMessage('Reset to seed state!');
    setTimeout(() => setResetMessage(''), 2500);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2 bg-emerald-900/10 border border-emerald-700/20 rounded-lg p-1.5 text-xs">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-2 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-md font-medium text-slate-800 shadow-sm transition"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="hidden sm:inline text-slate-500">Active Persona:</span>
          <span className="font-semibold text-emerald-900">{currentUser.fullName}</span>
          <span className="capitalize px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
            {currentUser.role.replace(/_/g, ' ')}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>

        <button
          onClick={handleReset}
          title="Reset database to demo seed data"
          className="p-1 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        {resetMessage && (
          <span className="text-[11px] font-medium text-emerald-700 animate-fade-in">{resetMessage}</span>
        )}
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
          <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Switch African Agricultural Persona
          </div>
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
            {allUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => {
                  switchUser(user.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 flex items-start gap-3 hover:bg-emerald-50/60 transition ${
                  currentUser.id === user.id ? 'bg-emerald-50/80 font-medium' : ''
                }`}
              >
                <div className="p-1.5 bg-slate-100 rounded-lg mt-0.5">{getRoleIcon(user.role)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-slate-800 text-xs truncate">{user.fullName}</div>
                    {currentUser.id === user.id && <UserCheck className="w-3.5 h-3.5 text-emerald-600" />}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <span className="capitalize font-medium text-emerald-700">{user.role.replace(/_/g, ' ')}</span>
                    <span>•</span>
                    <span>{user.stateRegion}, {user.country}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="p-2 border-t border-slate-100 bg-slate-50/60 text-[11px] text-slate-500 flex justify-between items-center">
            <span>Each role reveals tailored workflows</span>
            <button
              onClick={handleReset}
              className="text-emerald-700 hover:underline font-semibold flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Reset Demo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
