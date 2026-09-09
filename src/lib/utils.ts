// AgriLink Africa - Utility functions and formatters

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Currency, OrderState, ReviewStatus } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: Currency = 'NGN'): string {
  const symbols: Record<Currency, string> = {
    NGN: '₦',
    KES: 'KSh ',
    GHS: 'GH₵ ',
    UGX: 'USh ',
    USD: '$',
  };

  const symbol = symbols[currency] || `${currency} `;
  return `${symbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getOrderStateBadge(state: OrderState): { label: string; color: string; bg: string; border: string } {
  switch (state) {
    case 'REQUESTED':
      return { label: 'Requested', color: 'text-amber-800', bg: 'bg-amber-50', border: 'border-amber-200' };
    case 'QUOTED':
      return { label: 'Quoted', color: 'text-blue-800', bg: 'bg-blue-50', border: 'border-blue-200' };
    case 'ACCEPTED':
      return { label: 'Accepted', color: 'text-indigo-800', bg: 'bg-indigo-50', border: 'border-indigo-200' };
    case 'CONFIRMED':
      return { label: 'Confirmed (Escrow Paid)', color: 'text-emerald-800', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    case 'SCHEDULED':
      return { label: 'Scheduled for Pickup', color: 'text-purple-800', bg: 'bg-purple-50', border: 'border-purple-200' };
    case 'PICKED_UP':
      return { label: 'Picked Up', color: 'text-sky-800', bg: 'bg-sky-50', border: 'border-sky-200' };
    case 'IN_TRANSIT':
      return { label: 'In Transit', color: 'text-cyan-800', bg: 'bg-cyan-50', border: 'border-cyan-200' };
    case 'DELIVERED':
      return { label: 'Delivered', color: 'text-teal-800', bg: 'bg-teal-50', border: 'border-teal-200' };
    case 'COMPLETED':
      return { label: 'Completed & Released', color: 'text-green-800', bg: 'bg-green-50', border: 'border-green-200' };
    case 'DISPUTED':
      return { label: 'Disputed', color: 'text-rose-800', bg: 'bg-rose-50', border: 'border-rose-200' };
    case 'CANCELLED':
      return { label: 'Cancelled', color: 'text-gray-800', bg: 'bg-gray-100', border: 'border-gray-300' };
    default:
      return { label: state, color: 'text-gray-800', bg: 'bg-gray-50', border: 'border-gray-200' };
  }
}

export function getReviewStatusBadge(status: ReviewStatus): { label: string; color: string; bg: string } {
  switch (status) {
    case 'approved':
      return { label: 'Approved by Supervisor', color: 'text-emerald-800', bg: 'bg-emerald-100' };
    case 'rejected':
      return { label: 'Rejected (Audit Flagged)', color: 'text-rose-800', bg: 'bg-rose-100' };
    case 'correction_requested':
      return { label: 'Correction Requested', color: 'text-amber-800', bg: 'bg-amber-100' };
    case 'pending_review':
    default:
      return { label: 'Awaiting Supervisor Review', color: 'text-blue-800', bg: 'bg-blue-100' };
  }
}
