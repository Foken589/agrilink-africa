'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sprout, 
  LayoutDashboard, 
  Tractor, 
  Layers, 
  ClipboardList, 
  Users, 
  Package, 
  ShoppingBag, 
  Truck, 
  Building2, 
  CreditCard, 
  AlertTriangle, 
  ShieldCheck, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  LineChart, 
  CheckCircle2 
} from 'lucide-react';
import { useStore } from '@/lib/data/store-context';
import { UserSwitcher } from '../common/user-switcher';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentUser, alerts, activityLogs, orders } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const pendingEvidenceCount = activityLogs.filter((l) => l.reviewStatus === 'pending_review').length;
  const activeAlertsCount = alerts.filter((a) => !a.resolved).length;
  const activeOrdersCount = orders.filter((o) => !['COMPLETED', 'CANCELLED'].includes(o.currentState)).length;

  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Farms & Units', href: '/dashboard/farms', icon: Tractor },
    { label: 'Livestock Ledger', href: '/dashboard/livestock', icon: Layers },
    { label: 'Daily Farm Logs', href: '/dashboard/logs', icon: ClipboardList },
    { 
      label: 'Workers & Evidence', 
      href: '/dashboard/workers', 
      icon: Users, 
      badge: pendingEvidenceCount > 0 ? `${pendingEvidenceCount}` : undefined,
      badgeColor: 'bg-amber-500 text-white'
    },
    { label: 'Feed & Inventory', href: '/dashboard/inventory', icon: Package },
    { 
      label: 'Orders (11-Stage)', 
      href: '/dashboard/orders', 
      icon: ShoppingBag,
      badge: activeOrdersCount > 0 ? `${activeOrdersCount}` : undefined,
      badgeColor: 'bg-emerald-600 text-white'
    },
    { label: 'Buyer RFQs & Sourcing', href: '/dashboard/buyer', icon: Building2 },
    { label: 'Logistics & Haulage', href: '/dashboard/logistics', icon: Truck },
    { label: 'Cooperative Hub', href: '/dashboard/cooperative', icon: Layers },
    { label: 'Escrow & Payments', href: '/dashboard/payments', icon: CreditCard },
    { 
      label: 'Biosecurity Alerts', 
      href: '/dashboard/alerts', 
      icon: AlertTriangle,
      badge: activeAlertsCount > 0 ? `${activeAlertsCount}` : undefined,
      badgeColor: 'bg-rose-600 text-white'
    },
    { label: 'Disputes & Trust', href: '/dashboard/disputes', icon: ShieldCheck },
    { label: 'Admin Telemetry', href: '/dashboard/admin', icon: LineChart },
  ];

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex-shrink-0">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold shadow">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-white text-base tracking-tight">AgriLink</span>
              <span className="font-bold text-emerald-400 text-base ml-1">Africa</span>
            </div>
          </Link>
        </div>

        {/* User Identity Chip */}
        <div className="p-3 mx-3 my-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={currentUser.fullName}
              className="w-9 h-9 rounded-full object-cover border border-emerald-500/50"
            />
            <div className="min-w-0 flex-1">
              <div className="font-bold text-white text-xs truncate">{currentUser.fullName}</div>
              <div className="text-[10px] text-emerald-400 capitalize font-medium">
                {currentUser.role.replace(/_/g, ' ')}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto py-2 text-xs">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition ${
                  isActive
                    ? 'bg-emerald-700 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${item.badgeColor || 'bg-slate-700 text-white'}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-slate-800 flex items-center justify-between text-xs">
          <Link href="/" className="text-slate-400 hover:text-white flex items-center gap-1.5 transition">
            <LogOut className="w-3.5 h-3.5" />
            <span>Public Site</span>
          </Link>
          <span className="text-[10px] text-slate-500 font-mono">v2.4 Africa</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg"
              aria-label="Open navigation sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:block">
              <span className="text-xs text-slate-500">Operating Zone:</span>
              <span className="ml-1 text-xs font-bold text-slate-900">{currentUser.stateRegion}, {currentUser.country}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <UserSwitcher />

            <Link
              href="/dashboard/alerts"
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
              title="Biosecurity & Operational Alerts"
            >
              <Bell className="w-5 h-5" />
              {activeAlertsCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-600 rounded-full ring-2 ring-white animate-pulse" />
              )}
            </Link>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setMobileOpen(false)} />
            <div className="relative w-72 max-w-[80vw] bg-slate-900 text-slate-300 flex flex-col h-full z-10 shadow-2xl">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
                    <Sprout className="w-5 h-5" />
                  </div>
                  <span className="font-extrabold text-white text-base">AgriLink Africa</span>
                </Link>
                <button onClick={() => setMobileOpen(false)} className="p-1 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 px-3 space-y-1 overflow-y-auto py-3 text-xs">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-medium ${
                        isActive ? 'bg-emerald-700 text-white font-bold' : 'text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${item.badgeColor || 'bg-slate-700 text-white'}`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
