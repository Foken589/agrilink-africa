'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sprout, 
  Menu, 
  X, 
  ChevronDown, 
  LayoutDashboard, 
  ShoppingBag, 
  Tractor, 
  LineChart, 
  Users, 
  Building2, 
  Truck 
} from 'lucide-react';
import { UserSwitcher } from '../common/user-switcher';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const pathname = usePathname();

  const isDashboard = pathname.startsWith('/dashboard');

  const navLinks = [
    { label: 'Marketplace', href: '/marketplace', icon: ShoppingBag },
    { label: 'Farm Management', href: '/farm-management', icon: Tractor },
    { label: 'Livestock', href: '/livestock', icon: Sprout },
    { label: 'Market Prices', href: '/market-prices', icon: LineChart },
    { label: 'Pricing', href: '/pricing', icon: Building2 },
  ];

  const solutionLinks = [
    { label: 'For Farmers & Producers', href: '/for-farmers', desc: 'Manage units, workers & direct buyer sales' },
    { label: 'For Bulk Buyers & Processors', href: '/for-buyers', desc: 'Direct sourcing, RFQs & escrow assurance' },
    { label: 'For Cooperatives & Unions', href: '/for-cooperatives', desc: 'Aggregate harvests & member dividends' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition">
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-slate-900 text-lg tracking-tight">AgriLink</span>
                  <span className="font-bold text-emerald-600 text-lg">Africa</span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium hidden sm:block">
                  From farm to market, with fewer barriers
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 ml-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                      isActive
                        ? 'text-emerald-700 bg-emerald-50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {/* Solutions Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setSolutionsOpen(!solutionsOpen)}
                  onMouseEnter={() => setSolutionsOpen(true)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                >
                  <span>Solutions</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {solutionsOpen && (
                  <div
                    onMouseLeave={() => setSolutionsOpen(false)}
                    className="absolute top-full left-0 mt-1 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in"
                  >
                    {solutionLinks.map((sol) => (
                      <Link
                        key={sol.href}
                        href={sol.href}
                        onClick={() => setSolutionsOpen(false)}
                        className="block p-2.5 rounded-lg hover:bg-emerald-50 transition"
                      >
                        <div className="text-xs font-semibold text-slate-900">{sol.label}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{sol.desc}</div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            <UserSwitcher />

            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-semibold shadow-sm transition active:scale-95"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition"
              >
                <link.icon className="w-5 h-5 text-emerald-600" />
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-1">
              Sector Solutions
            </div>
            {solutionLinks.map((sol) => (
              <Link
                key={sol.href}
                href={sol.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg"
              >
                {sol.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 py-2.5 text-center font-medium text-sm text-slate-700 bg-slate-100 rounded-lg"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 py-2.5 text-center font-semibold text-sm text-white bg-emerald-700 rounded-lg shadow"
            >
              Open App
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
