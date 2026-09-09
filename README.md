# AgriLink Africa

> **Tagline:** *"From farm to market, with fewer barriers."*
> **Platform Version:** 2.4 (Production Vercel & Supabase Ready)

AgriLink Africa is an all-in-one digital operations platform engineered specifically for the realities of African agriculture. It unifies agricultural marketplace, multi-site farm operations, tamper-evident livestock ledger accounting, two-sided worker accountability with timestamped photo proof, verified wholesale market price intelligence, and 11-stage escrow trading.

---

## Key Features

1. **Tamper-Evident Livestock Ledger**:
   - Server-side calculation invariant:
     $$\text{Live Stock} = \text{Opening} + \text{Additions} + \text{Births} + \text{TransfersIn} - \text{Sales} - \text{Mortality} - \text{Culls} - \text{TransfersOut}$$
   - Strict rejection of negative balances and anomaly flagging.
   - Comprehensive mortality logging with handling records and statutory non-veterinary disclaimer.

2. **Worker Accountability & Photo Proof**:
   - Field attendant daily task lists.
   - Activity submission with timestamped photos, GPS tags, quantities, and equipment/mortality issue flags.
   - Supervisor Review Console: Approve, Reject with audit flag, or Request Re-check.
   - Treating images as submitted evidence rather than blind proof.

3. **Pan-African Agricultural Marketplace**:
   - B2B catalog covering poultry, catfish, tilapia, goats, cattle, white maize, cassava, soybeans, and vegetables.
   - **Biosecurity Private Location Protection**: Exact farm coordinates and contact details are masked from public listings and only unlocked upon confirmed escrow payment.

4. **11-Stage Escrow Order Lifecycle**:
   - Sequential progression: `REQUESTED` → `QUOTED` → `ACCEPTED` → `CONFIRMED` → `SCHEDULED` → `PICKED_UP` → `IN_TRANSIT` → `DELIVERED` → `COMPLETED` (with `DISPUTED` / `CANCELLED` branches).
   - Digital handshake via Waybill Number, Pickup OTP, and Delivery OTP.

5. **Verified African Market Prices**:
   - Daily benchmarks across Lagos Mile 12, Nairobi Wakulima, Kano Dawanau, Accra Agbogbloshie, and Kampala Owino.
   - Clear classification: Verified Exchange Bulletin, Aggregator Trade Audited, Farmer Crowd-sourced, or Estimated Model.

6. **Smallholder Cooperative Aggregation**:
   - Digital member roster and pooling of grain, livestock, or dairy batches.
   - Automated member dividend split calculator proportional to contributed harvest acreage.

7. **Payments & Escrow Abstraction**:
   - Provider interface compatible with Paystack, Flutterwave, M-Pesa, and MTN Mobile Money.
   - Zero storage of raw card PAN or CVV.

8. **Mobile-First & Low-Bandwidth Optimizations**:
   - Compact initial JS bundle (< 119kB across all routes).
   - High-contrast touch targets for budget Android smartphones.
   - Offline-first draft persistence with automatic re-sync.

---

## Tech Stack

- **Framework**: Next.js 14 App Router
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS & Lucide Icons
- **Database / Backend**: Supabase PostgreSQL, Row Level Security (RLS) policies, and Storage Buckets
- **State & Offline**: Reactive Local Storage Store with Seed Data + Dual Supabase Mode

---

## Project Structure

```
agrilink-africa/
├── src/
│   ├── app/
│   │   ├── (public pages)/
│   │   │   ├── page.tsx               # Homepage & Live Ticker
│   │   │   ├── marketplace/           # B2B Produce & Livestock Catalog
│   │   │   ├── farm-management/       # Production Units Showcase
│   │   │   ├── livestock/             # Stock Ledger & Movement Sandbox
│   │   │   ├── market-prices/         # Verified African Price Feeds
│   │   │   ├── for-farmers/           # Farmer Value Proposition
│   │   │   ├── for-buyers/            # Bulk Procurement Solutions
│   │   │   ├── for-cooperatives/      # Smallholder Aggregation
│   │   │   ├── pricing/               # Multi-Currency Plans (NGN, KES, GHS, USD)
│   │   │   ├── about/                 # Vision & Regional Offices
│   │   │   ├── contact/               # Support Inquiries Form
│   │   │   ├── privacy/               # Data Sovereignty & Location Masking
│   │   │   └── terms/                 # 11-Stage Escrow Trading SLA
│   │   ├── (auth)/
│   │   │   ├── login/                 # Multi-Role Sign In & Quick Switcher
│   │   │   ├── signup/                # Role-Based Agricultural Onboarding
│   │   │   ├── verify/                # 6-Digit OTP Verification
│   │   │   └── reset-password/        # Password Recovery
│   │   └── dashboard/                 # Role-Adaptive Protected Workspace
│   │       ├── page.tsx               # Master KPI & Activity Overview
│   │       ├── farms/                 # Farm Sites & Unit Manager
│   │       ├── livestock/             # Batches, Movements, and Ledger Integrity
│   │       ├── logs/                  # Daily Feeding, Mortality, Treatments
│   │       ├── workers/               # Task Delegation & Supervisor Review Console
│   │       ├── inventory/             # Feed & Meds Stock with Threshold Alerts
│   │       ├── orders/                # 11-Stage Order Lifecycle & OTP Stepper
│   │       ├── buyer/                 # RFQ Publishing & Quote Bids
│   │       ├── logistics/             # Transporter Waybills & Digital Handshake
│   │       ├── cooperative/           # Member Roster & Dividend Calculator
│   │       ├── payments/              # Escrow Wallet & Gateway Simulator
│   │       ├── disputes/              # Arbitration Case Files & Evidence
│   │       ├── alerts/                # Biosecurity & Mortality Spike Warnings
│   │       └── admin/                 # Platform Telemetry & Governance
│   ├── components/
│   │   ├── common/                    # UserSwitcher, VeterinaryDisclaimer
│   │   └── navigation/                # Header, Footer, DashboardLayout
│   ├── lib/
│   │   ├── data/                      # StoreContext & Realistic African Seed Store
│   │   ├── payments/                  # Paystack / Flutterwave Engine Abstraction
│   │   ├── services/                  # Stock Ledger & FCR Calculation Service
│   │   └── supabase/                  # Supabase Client & RLS Adapters
│   └── types/                         # Complete Domain TypeScript Definitions
└── supabase/
    ├── migrations/                    # 36-Table PostgreSQL Schema with RLS & Triggers
    └── seed.sql                       # African Agricultural Seed Data
```

---

## Getting Started

### 1. Development Server
```bash
cd agrilink-africa
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Production Build
```bash
npm run build
npm run start
```

### 3. Running Domain Tests
```bash
node test-verification.mjs
```

---

## User Personas (Switchable with 1-Click)
'''These are dummy data'''
1. **Adebayo Ogunlesi** (`Farmer / Livestock Owner` - Ogun State, Nigeria)
2. **Ibrahim Danladi** (`Worker / Field Attendant` - Farm Hand)
3. **Grace Mutua** (`Buyer / Supermarket Procurement` - Nairobi, Kenya)
4. **Samuel Mensah** (`Transporter / Fleet Dispatch` - Greater Accra, Ghana)
5. **David K. Ochieng** (`Cooperative Union Chairman` - Western Kenya)
6. **Zainab Bello** (`Platform Administrator & Compliance Auditor`)
