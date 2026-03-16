# Parity AI

**Enterprise AI Governance & Compliance Platform**

[![Deploy Status](https://img.shields.io/badge/deploy-live-success)](https://parity-v2.vercel.app)
[![Build](https://img.shields.io/badge/build-passing-brightgreen)](#verification)
[![Tests](https://img.shields.io/badge/tests-passing-brightgreen)](#verification)
[![License](https://img.shields.io/badge/license-Proprietary-red)](LICENSE)
[![React](https://img.shields.io/badge/React-18.3-61dafb)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6)](https://typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ecf8e)](https://supabase.com)

---

## Author

**Mohammad Zeeshan**
Lead Developer & Architect
GitHub: [@m-zest](https://github.com/m-zest)

---

## Overview

Parity AI is a comprehensive platform that enables organizations to govern AI systems responsibly, ensure regulatory compliance, and mitigate algorithmic risks. Built for enterprises deploying AI at scale, Parity provides the visibility, controls, and documentation needed to meet emerging AI regulations worldwide.

### Key Value Propositions

- **Regulatory Readiness** — Pre-built compliance frameworks for EU AI Act, NYC LL144, Colorado AI Act, NIST AI RMF, and ISO 42001
- **Risk Visibility** — Centralized view of AI model inventory, vendor dependencies, and associated risks
- **Bias Monitoring** — Track fairness metrics across protected attributes with automated testing
- **Audit Trail** — Complete documentation and evidence management for regulatory audits
- **Executive Reporting** — One-click PDF reports for board meetings and regulatory submissions
- **Public Transparency** — Citizen-facing transparency portal for democratic AI accountability
- **RegulatoryRadar** — Autonomous multi-agent regulatory scanning with AI-powered classification and enforcement

---

## Current Status & What's Working

### Build & Tests

| Check | Status |
|-------|--------|
| TypeScript compilation | Passing |
| Vite production build | Passing (3783 modules) |
| Unit tests (Vitest) | Passing (1/1) |
| ESLint | Configured |

### Public Pages (No Login Required)

| Page | Route | What It Does |
|------|-------|--------------|
| **Landing Page** | `/` | Full marketing site with hero, product suite, compliance frameworks, FAQ, testimonials, integrations section |
| **About** | `/about` | Company information |
| **Auth** | `/auth` | Sign up / Sign in with Supabase Auth |
| **Transparency Portal** | `/public/transparency` | Public-facing AI system registry — shows deployed AI systems, risk levels, and incident disclosures for citizens |

### Dashboard Modules (Login Required)

| Module | Route | Features | Data Source |
|--------|-------|----------|-------------|
| **Dashboard** | `/dashboard` | Stats cards, charts (tasks/incidents/risk distribution), recent models & incidents, activity feed | Supabase (real-time) |
| **Tasks** | `/tasks` | Task CRUD, assignees, deadlines, status tracking | Supabase |
| **Use Cases** | `/use-cases` | AI use case documentation, approval workflows, CRUD | Supabase |
| **Vendors** | `/vendors` | Vendor registry, risk scoring, security assessments, CSV import, filters, PDF export | Supabase |
| **Model Inventory** | `/models` | AI model registry, lifecycle tracking, risk levels, CSV import, filters, PDF export | Supabase |
| **Risk Management** | `/risks` | Risk register, severity levels, mitigation plans, CRUD, PDF export | Supabase |
| **Bias & Fairness** | `/bias-metrics` | Fairness metrics, bias test results, protected attribute tracking | Supabase |
| **Compliance** | `/compliance` | Framework checklists, assessment workflows, progress tracking, PDF export | Supabase |
| **Evidence Hub** | `/evidence` | Document upload & storage for audit evidence | Supabase Storage |
| **Reporting** | `/reporting` | 6 PDF report templates — Models, Vendors, Compliance, Incidents, Risks, Executive | jsPDF generation |
| **AI Trust Center** | `/transparency` | Internal transparency dashboard for governance teams | Supabase |
| **Policy Manager** | `/policies` | Policy documentation and management | Supabase |
| **Incidents** | `/incidents` | Incident reporting, investigation workflow, severity tracking, filters, PDF export | Supabase |
| **User Management** | `/settings/users` | Role-based access control (admin/user/viewer), user listing | Supabase (admin only) |
| **RegulatoryRadar** | `/regulatory-radar` | Autonomous regulatory scanning, AI classification, risk enforcement, PDF export, demo mode | TinyFish + Fireworks AI + Supabase |

### RegulatoryRadar — Autonomous Compliance Enforcement

RegulatoryRadar is a professional-grade autonomous compliance scanner that monitors government regulatory sources and automatically classifies and enforces new requirements into your Risk Register.

**How It Works — 3-Phase Pipeline:**

| Phase | What Happens | Technology |
|-------|-------------|------------|
| **DETECT** | 4 TinyFish AI agents browse regulatory sources (EUR-Lex, EU AI Office, NIST, NYC LL144) and extract updates | TinyFish Web Agent API |
| **CLASSIFY** | Raw scraped data is sent to an LLM for severity classification, category tagging, and recommended action generation | Fireworks AI (Llama 3.1 70B) |
| **ENFORCE** | Classified alerts are auto-saved as risks in the Risk Register with full source attribution | Supabase |

**Features:**
- Live scan with animated progress indicators and real-time agent status cards
- 4 regulatory source agents: EUR-Lex, EU AI Office, NIST, NYC Local Law 144
- AI-powered severity classification (Critical / Major / Moderate / Minor)
- Automatic Risk Register enforcement — alerts become tracked risks
- PDF compliance report export with severity breakdown and recommendations
- Demo Mode for presentations — simulated scan with realistic data (no API keys needed)
- Scan history with timestamps, alert counts, and links to Risk Register
- Toast notifications for critical/major alerts

**Environment Variables:**
```
VITE_TINYFISH_API_KEY=your-tinyfish-api-key
VITE_FIREWORKS_API_KEY=your-fireworks-api-key
```

### Transparency Tools (Dashboard)

| Tool | Route | What It Does |
|------|-------|--------------|
| **System Card Generator** | `/system-cards` | Generate standardized AI system cards for public disclosure |
| **Framework Comparison** | `/framework-comparison` | Side-by-side comparison of compliance frameworks |
| **Risk Heatmap** | `/risk-heatmap` | Visual heatmap of AI risks across the organization |
| **Incident Disclosure** | `/incident-disclosure` | Public incident disclosure management |

### Product Pages (Dashboard)

| Product | Route | Description |
|---------|-------|-------------|
| **FairHire AI** | `/dashboard` | HR AI governance (default product) |
| **MedParity** | `/products/medparity` | Healthcare AI governance |
| **FinParity** | `/products/finparity` | Financial AI governance |
| **ContentGuard** | `/products/contentguard` | Media AI governance |
| **Enterprise** | `/products/enterprise` | Cross-organization governance |

### PDF Report Generation (6 Types)

All reports generate downloadable PDFs with real data from Supabase:

1. **Model Inventory Report** — All AI models with risk levels, status, vendors
2. **Vendor Risk Assessment** — Vendor risk scores, security assessments
3. **Compliance Status Report** — Framework compliance progress and checklists
4. **Incident Summary Report** — Incidents by severity and resolution status
5. **Risk Management Report** — Full risk register with mitigation status
6. **Executive Dashboard Report** — High-level KPIs across all modules

### Key Features Across All Modules

- Full CRUD operations (Create, Read, Update, Delete)
- CSV import for Models and Vendors (via PapaParse)
- Search and filtering on all list views
- Real-time data via TanStack React Query + Supabase
- Dark/Light theme toggle
- Responsive sidebar navigation with collapsible sections
- Role-based access control (admin, user, viewer)
- Toast notifications for all operations
- Organization-scoped data isolation (multi-tenant)

---

## Verification Guide

### 1. Build Verification

```bash
# Install dependencies
npm install

# Run production build — should compile 3783+ modules with no errors
npm run build

# Run tests — should pass all tests
npm test

# Start dev server
npm run dev
# App runs at http://localhost:8080
```

### 2. Landing Page Verification

Open `http://localhost:8080` in your browser. You should see:
- Hero section with call-to-action buttons
- Key statistics section
- "Why Parity" value proposition cards
- Public sector AI governance section
- Transparency tools showcase
- Product suite cards (FairHire, MedParity, FinParity, ContentGuard, Enterprise)
- Integrations marquee
- Compliance frameworks grid (EU AI Act, NYC LL144, etc.)
- How it works steps
- FAQ accordion
- Final CTA and footer

### 3. Authentication Verification

1. Click "Get Started" or navigate to `/auth`
2. Sign up with email/password (Supabase Auth)
3. After login, you are redirected to `/dashboard`

### 4. Dashboard Verification

After login, verify:
- **Stats cards** show counts for models, vendors, incidents, compliance
- **Charts** render (task status, incident trends, risk distribution)
- **Quick view panels** show recent models and incidents
- **Activity feed** shows recent actions
- **Sidebar** shows all navigation groups: Main, Discovery, Assurance, Governance, Transparency
- **Product switcher** in sidebar header lets you switch between products

### 5. CRUD Operations Verification

For any module (e.g., Models at `/models`):
1. Click "Add Model" — form dialog opens
2. Fill in details and save — toast confirms creation, table updates
3. Click a row to edit — update dialog opens
4. Delete via delete button — confirmation dialog, then removal
5. Use filters and search to narrow results

### 6. CSV Import Verification

On Models (`/models`) or Vendors (`/vendors`):
1. Click "Import CSV"
2. Upload a CSV file with matching columns
3. Data is parsed (PapaParse) and bulk-inserted into Supabase

### 7. PDF Report Verification

Navigate to `/reporting`:
1. Click any report template card (e.g., "Model Inventory Report")
2. A PDF downloads automatically with real data from your database
3. Report history table updates with the generated report entry

### 8. Transparency Portal Verification

Navigate to `/public/transparency` (no login needed):
- Browse public AI system registry
- View risk levels and status of deployed AI systems
- Search and filter by department or risk level

### 9. Theme Verification

- Click the sun/moon icon in the sidebar footer
- App switches between dark and light themes
- All components respect the theme

### 10. Role-Based Access Verification

- **Admin**: Can see User Management (`/settings/users`), full CRUD on all modules
- **User**: Standard access, no User Management
- **Viewer**: Read-only access to dashboard and modules

### 11. RegulatoryRadar Verification

Navigate to `/regulatory-radar` from the Assurance section in the sidebar:

1. **Demo Mode** — Click "Demo Mode" to run a simulated scan (no API keys needed)
   - Agent status cards should animate from "running" to "complete" one by one
   - Alert feed should populate with 4 classified alerts
   - Stats row should update: Alerts Found, Last Scan time, Success Rate
   - Toast notifications appear for critical and major alerts
2. **Live Scan** — Click "Run Regulatory Scan" (requires TinyFish + Fireworks API keys in `.env`)
   - Real agents browse government websites and extract regulatory updates
   - Alerts are classified by AI and saved to Risk Register
3. **Export PDF** — Click "Export PDF" to download a compliance report of scan results
4. **Risk Register Integration** — Navigate to Risk Management to see auto-generated risks with "auto-generated" badges

---

## Supported Compliance Frameworks

| Framework | Jurisdiction | Focus Area |
|-----------|--------------|------------|
| **EU AI Act** | European Union | Comprehensive AI regulation with risk tiers |
| **NYC Local Law 144** | New York City | Automated employment decision tools |
| **Colorado AI Act** | Colorado, USA | High-risk AI consumer protections |
| **Illinois AIVOIA** | Illinois, USA | AI video interview compliance |
| **NIST AI RMF** | United States | AI risk management framework |
| **ISO 42001** | International | AI management system standard |
| **ECOA** | United States | Equal Credit Opportunity Act |
| **HIPAA** | United States | Healthcare data privacy |
| **FDA AI/ML** | United States | FDA guidelines for AI in healthcare |

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, TypeScript 5.8, Vite 5 |
| **UI Components** | Tailwind CSS 3, shadcn/ui (Radix primitives) |
| **State Management** | TanStack React Query 5 |
| **Backend** | Supabase (PostgreSQL, Auth, Storage, Realtime) |
| **AI Agents** | TinyFish Web Agent API (regulatory scraping) |
| **LLM Classification** | Fireworks AI — Llama 3.1 70B (alert classification) |
| **Charts** | Recharts |
| **PDF Generation** | jsPDF + jsPDF-AutoTable |
| **CSV Import** | PapaParse |
| **Animations** | Framer Motion |
| **Forms** | React Hook Form + Zod validation |
| **Routing** | React Router DOM 6 |
| **Theming** | next-themes (dark/light) |

---

## Project Structure

```
parity-ai/
├── public/                     # Static assets (logo, icons)
├── src/
│   ├── components/
│   │   ├── auth/               # RequireRole guard
│   │   ├── compliance/         # ComplianceFilters, Stats, FrameworkCard
│   │   ├── dashboard/          # DashboardStats, Charts, QuickView, Activity
│   │   ├── incidents/          # IncidentsTable, Filters, FormDialog, Delete
│   │   ├── landing/            # Hero, Header, FAQ, ProductSuite, Footer, etc.
│   │   ├── layout/             # AppLayout, AppSidebar, NotificationsDropdown
│   │   ├── models/             # ModelsTable, Filters, FormDialog, CSVUpload
│   │   ├── ui/                 # 40+ shadcn/ui base components
│   │   └── vendors/            # VendorsTable, Filters, FormDialog, CSVUpload
│   │
│   ├── config/                 # Feature flags & app configuration
│   ├── constants/              # Route constants, status values
│   ├── hooks/                  # 14 React Query hooks (CRUD for all modules)
│   ├── integrations/supabase/  # Supabase client & generated types
│   ├── lib/                    # 6 PDF report generators + utils
│   ├── pages/                  # 25+ route page components
│   │   ├── products/           # FinParity, MedParity, ContentGuard, Enterprise
│   │   └── regulatory-radar/   # RegulatoryRadar page, agents API, classifier, hooks, demo data
│   ├── test/                   # Vitest setup & example test
│   ├── types/                  # TypeScript type definitions
│   ├── App.tsx                 # Root with routes (30+ routes)
│   └── main.tsx                # Entry point
│
├── supabase/                   # SQL migrations for database setup
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── .env.example                # Environment variable template
```

---

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free tier available)

### Installation

```bash
# Clone the repository
git clone https://github.com/m-zest/parity_v2.git
cd parity_v2

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Add your Supabase credentials to .env:
#   VITE_SUPABASE_URL=https://your-project.supabase.co
#   VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`.

### Demo Mode

The application includes built-in demo data for all modules (transparency portal, dashboard charts, etc.), allowing immediate exploration without database configuration. When connected to Supabase, real data replaces demo data automatically.

---

## Database Schema

### Core Tables

| Table | Purpose |
|-------|---------|
| `organizations` | Multi-tenant organization data |
| `profiles` | User profiles linked to organizations |
| `user_roles` | Role-based access (admin, user, viewer) |
| `models` | AI model inventory |
| `vendors` | Third-party vendor registry |
| `incidents` | Incident reports and resolution |
| `compliance_frameworks` | Regulatory framework definitions |
| `compliance_assessments` | Assessment records per framework |
| `framework_checklists` | Checklist items per framework |
| `risks` | Risk register entries |
| `bias_tests` | Bias test results |
| `use_cases` | AI use case documentation |
| `evidence` | Audit evidence records |
| `tasks` | Compliance task tracking |
| `policies` | Policy documents |
| `notifications` | User notification records |
| `audit_logs` | Activity audit trail |

### Security

- Row-Level Security (RLS) on all tables
- Organization-scoped data isolation
- JWT-based authentication via Supabase Auth

### Database Setup

A combined SQL migration file is included in the `supabase/` directory for fresh Supabase setup. Run it in the Supabase SQL editor to create all tables, RLS policies, and seed data.

---

## API Reference

### Data Hooks

All hooks follow a consistent pattern with React Query:

```typescript
// Fetch data
const { data, isLoading, error } = useModels();

// Create
const createModel = useCreateModel();
createModel.mutate({ name: "Model Name", status: "pending" });

// Update
const updateModel = useUpdateModel();
updateModel.mutate({ id: "uuid", status: "approved" });

// Delete
const deleteModel = useDeleteModel();
deleteModel.mutate("uuid");
```

Available hooks:
- `useModels`, `useCreateModel`, `useUpdateModel`, `useDeleteModel`
- `useVendors`, `useCreateVendor`, `useUpdateVendor`, `useDeleteVendor`
- `useIncidents`, `useCreateIncident`, `useUpdateIncident`, `useDeleteIncident`
- `useRisks`, `useCreateRisk`, `useUpdateRisk`, `useDeleteRisk`
- `useBiasTests`, `useCreateBiasTest`, `useDeleteBiasTest`
- `useUseCases`, `useCreateUseCase`, `useUpdateUseCase`, `useDeleteUseCase`
- `useEvidence`, `useCreateEvidence`, `useUploadEvidence`, `useDeleteEvidence`
- `useTasks`, `useCreateTask`, `useUpdateTask`, `useDeleteTask`
- `usePolicies`, `useCreatePolicy`, `useUpdatePolicy`, `useDeletePolicy`
- `useNotifications`, `useMarkAsRead`, `useMarkAllAsRead`
- `useDashboardStats`, `useRecentActivity`
- `useCompliance` (combined frameworks, assessments, checklists)
- `useCurrentUser`, `useUsers`

---

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
3. Deploy

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["npm", "run", "preview"]
```

---

## Roadmap

### Completed

- [x] FairHire AI - HR AI Governance
- [x] MedParity - Healthcare AI Governance
- [x] FinParity - Financial AI Governance
- [x] ContentGuard - Media AI Governance
- [x] Enterprise - Cross-Organization Governance
- [x] Model inventory with CRUD and CSV import
- [x] Vendor management with risk scoring and CSV import
- [x] Incident management workflow with severity tracking
- [x] Compliance framework tracking with checklists (9 frameworks)
- [x] Bias & fairness metric tracking
- [x] Risk register with mitigation plans
- [x] Use case documentation registry
- [x] Evidence hub with file upload management
- [x] PDF report generation (6 report types)
- [x] Task management with assignments and deadlines
- [x] Real-time dashboard with charts and activity feed
- [x] Role-based access control (admin/user/viewer)
- [x] Public transparency portal for citizens
- [x] System card generator
- [x] Framework comparison tool
- [x] Risk heatmap visualization
- [x] Incident disclosure management
- [x] Dark/Light theme support
- [x] Notification system
- [x] Policy management
- [x] Multi-tenant organization support
- [x] Full Supabase integration with RLS
- [x] RegulatoryRadar — Autonomous multi-agent regulatory scanning
- [x] TinyFish integration for web scraping government sources
- [x] Fireworks AI integration for LLM-powered alert classification
- [x] Automatic Risk Register enforcement from regulatory alerts
- [x] RegulatoryRadar PDF compliance report export
- [x] RegulatoryRadar Demo Mode for presentations

### In Development

- [ ] Email notifications for compliance deadlines
- [ ] API integrations (Azure ML, AWS SageMaker, Databricks)
- [ ] Custom report builder
- [ ] Workflow automation
- [ ] SSO/SAML authentication

---

## Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

For major changes, please open an issue first to discuss what you'd like to change.

### Maintainer

**Mohammad Zeeshan**
GitHub: [@m-zest](https://github.com/m-zest)

---

## License

Proprietary License - see [LICENSE](LICENSE) for details.

Copyright (c) 2024-2026 **Mohammad Zeeshan**
