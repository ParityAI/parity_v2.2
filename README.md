# Parity AI — AI Governance & Compliance Platform

An enterprise-grade platform for AI governance, bias testing, and regulatory compliance monitoring. **FairHire AI** (HR/Hiring) is the flagship product, with MedParity, FinParity, ContentGuard, and Enterprise modules on the roadmap.

## Features

### Dashboard
- Real-time KPI statistics (models, vendors, incidents, compliance score, evidence coverage)
- Risk distribution and incident status charts (Recharts)
- Task radar for compliance deadline tracking
- Recent models, incidents, and audit activity feed
- Live updates via Supabase real-time subscriptions

### Model Inventory
- Full CRUD for AI model registration
- Status tracking: Approved, Restricted, Pending, Blocked
- Risk level classification: High, Medium, Low
- Vendor association and security assessment tracking
- Filterable, searchable data table

### Vendor Management
- Full CRUD for third-party AI vendor registry
- Risk score assessment (0-100 scale)
- Security assessment tracking
- Contact and website management

### Incident Management
- Full CRUD for incident reporting and resolution
- Severity levels: Critical, High, Medium, Low
- Status workflow: Open → Investigating → Mitigated → Closed
- Model and vendor linking
- Investigation and resolution notes
- Assignment tracking

### Compliance Frameworks
- Multi-framework support (NYC LL144, EU AI Act, Colorado AI Act, Illinois AIVOIA, ISO 42001, NIST AI RMF)
- Per-framework interactive checklists
- Deadline tracking with overdue warnings
- Assessment scoring and status management
- PDF compliance report export

### Authentication & Security
- Supabase-powered email/password authentication
- Row-Level Security (RLS) on all tables
- Organization-scoped data isolation
- Role-based access control (Admin, User, Viewer)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 18 + TypeScript |
| **Build** | Vite 5 |
| **Styling** | Tailwind CSS 3 + shadcn/ui (Radix primitives) |
| **State** | TanStack React Query 5 |
| **Backend** | Supabase (PostgreSQL + Auth + Realtime) |
| **Charts** | Recharts |
| **Animations** | Framer Motion |
| **Forms** | React Hook Form + Zod validation |
| **PDF Export** | jsPDF + jsPDF-AutoTable |
| **Testing** | Vitest + Testing Library |

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase project (free tier works)

### Installation

```bash
# Clone the repository
git clone https://github.com/m-zest/clarity-dashboard.git
cd clarity-dashboard

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials:
#   VITE_SUPABASE_URL=https://your-project.supabase.co
#   VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key

# Run database migrations
npx supabase db push

# Start the development server
npm run dev
```

The app will be available at `http://localhost:8080`.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 8080) |
| `npm run build` | Production build |
| `npm run build:dev` | Development build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests |
| `npm run test:watch` | Watch mode tests |

## Project Structure

```
src/
├── components/
│   ├── compliance/      # Compliance framework components
│   ├── dashboard/       # Dashboard widgets and charts
│   ├── incidents/       # Incident management components
│   ├── landing/         # Landing page sections
│   ├── layout/          # App layout and sidebar
│   ├── models/          # Model inventory components
│   ├── ui/              # shadcn/ui base components
│   └── vendors/         # Vendor management components
├── hooks/               # React Query data hooks (CRUD operations)
├── integrations/
│   └── supabase/        # Supabase client and generated types
├── lib/                 # Utilities (cn, PDF generation)
├── pages/               # Route page components
└── test/                # Test setup and specs
```

Each feature directory contains its own `README.md` with detailed documentation.

## Database Schema

9 tables with Row-Level Security:

- **organizations** — Company accounts
- **profiles** — User profiles linked to auth
- **user_roles** — Role-based access (admin, user, viewer)
- **models** — AI model registry
- **vendors** — Third-party vendor registry
- **incidents** — Incident tracking and resolution
- **compliance_frameworks** — Regulatory framework definitions
- **compliance_assessments** — Per-model framework assessments
- **framework_checklists** — Checklist items per framework
- **audit_logs** — Activity audit trail

Migrations are in `supabase/migrations/`.

## Routes

| Route | Page | Auth Required |
|-------|------|:---:|
| `/` | Landing page | No |
| `/auth` | Sign in / Sign up | No |
| `/dashboard` | Main dashboard | Yes |
| `/models` | Model inventory | Yes |
| `/vendors` | Vendor management | Yes |
| `/incidents` | Incident management | Yes |
| `/compliance` | Compliance frameworks | Yes |
| `/products/:id` | Coming soon pages | No |

## Roadmap

- [ ] Bias & Fairness metrics (Adverse Impact Ratio, Demographic Parity, Selection Rate)
- [ ] Task management with assignees and due dates
- [ ] Risk Management dedicated page
- [ ] Use Cases registry
- [ ] Evidence Hub for documentation
- [ ] Reporting engine
- [ ] Policy Manager
- [ ] Model detail pages with assessment history
- [ ] Vendor documentation attachments
- [ ] Operations vs Executive dashboard toggle

## License

Private — All rights reserved.
