# Parity AI — AI Governance & Compliance Platform

An enterprise-grade platform for AI governance, bias testing, and regulatory compliance monitoring. **FairHire AI** (HR/Hiring) is the flagship product, with MedParity, FinParity, ContentGuard, and Enterprise modules on the roadmap.

---

## Table of Contents

- [For Users](#for-users)
  - [Getting Started](#getting-started-users)
  - [Dashboard Overview](#dashboard-overview)
  - [Managing Models](#managing-models)
  - [Managing Vendors](#managing-vendors)
  - [Incident Management](#incident-management)
  - [Compliance Tracking](#compliance-tracking)
  - [Import & Export](#import--export)
- [For Developers](#for-developers)
  - [Tech Stack](#tech-stack)
  - [Installation](#installation)
  - [Project Structure](#project-structure)
  - [Database Schema](#database-schema)
  - [API Hooks Reference](#api-hooks-reference)
  - [Adding New Features](#adding-new-features)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)

---

# For Users

<a name="getting-started-users"></a>
## Getting Started

### Creating an Account
1. Navigate to the app URL
2. Click "Sign Up" and enter your email and password
3. You'll be automatically assigned to the demo organization
4. After signing up, you can sign in and access the dashboard

### Navigation
The sidebar on the left provides access to all features:
- **Dashboard** — Overview of your AI governance status
- **Models** — Manage AI model inventory
- **Vendors** — Track third-party AI vendors
- **Incidents** — Report and resolve issues
- **Compliance** — Monitor regulatory framework compliance

---

## Dashboard Overview

The dashboard provides a real-time overview of your AI governance status:

### Key Metrics
| Metric | Description |
|--------|-------------|
| **Total Models** | Number of AI models in your inventory |
| **Active Vendors** | Third-party vendors being tracked |
| **Open Incidents** | Unresolved issues requiring attention |
| **Compliance Score** | Percentage of frameworks with passing assessments |
| **Evidence Coverage** | Percentage of models with security assessments |

### Charts
- **Risk Distribution** — Pie chart showing high/medium/low risk models
- **Incident Status** — Breakdown of incidents by status
- **Task Radar** — Compliance deadlines (overdue, due soon, upcoming)

### Activity Feed
The right panel shows recent activity including:
- New models added
- Incidents reported or resolved
- Compliance assessments updated

---

## Managing Models

### Adding a Model
1. Go to **Models** in the sidebar
2. Click **"Add Model"** button
3. Fill in the required fields:
   - **Name** (required) — e.g., "Resume Screening Model v2"
   - **Provider** — e.g., "OpenAI", "Anthropic", "Internal"
   - **Version** — e.g., "v1.0", "2024-01"
   - **Status** — Approved, Pending, Restricted, or Blocked
   - **Risk Level** — High, Medium, or Low
   - **Vendor** — Link to a vendor (optional)
   - **Security Assessment** — Toggle if passed security review
4. Click **"Add Model"**

### Bulk Import (CSV)
1. Click **"Import CSV"** button
2. Download the template to see the expected format
3. Fill in your models in the CSV file
4. Upload the file
5. Review validation results and click **"Import"**

**CSV Format:**
```csv
name,provider,version,description,status,risk_level
My Model,OpenAI,v1.0,Description here,pending,medium
```

### Export to PDF
Click **"Export PDF"** to generate a comprehensive report including:
- Executive summary with statistics
- Risk distribution breakdown
- Full model inventory table
- High-risk models requiring attention

---

## Managing Vendors

### Adding a Vendor
1. Go to **Vendors** in the sidebar
2. Click **"Add Vendor"**
3. Fill in the details:
   - **Name** (required) — e.g., "HireAI Corp"
   - **Description** — What services they provide
   - **Contact Email** — Primary contact
   - **Website** — Vendor website URL
   - **Risk Score** — 0-100 (higher = more risk)
   - **Security Assessment** — Toggle if vendor passed security review
4. Click **"Add Vendor"**

### Risk Levels
| Score Range | Level | Color |
|-------------|-------|-------|
| 70-100 | High | Red |
| 40-69 | Medium | Yellow |
| 0-39 | Low | Green |

### Bulk Import & Export
Same as models — use CSV import and PDF export buttons.

---

## Incident Management

### Reporting an Incident
1. Go to **Incidents** in the sidebar
2. Click **"Report Incident"**
3. Fill in the details:
   - **Title** (required) — Brief description
   - **Description** — Detailed explanation
   - **Severity** — Critical, High, Medium, or Low
   - **Status** — Open, Investigating, Mitigated, or Closed
   - **Linked Model** — Which model is affected (optional)
   - **Linked Vendor** — Which vendor is involved (optional)
   - **Investigation Notes** — Findings during investigation
   - **Resolution Notes** — How the incident was resolved

### Incident Workflow
```
Open → Investigating → Mitigated → Closed
```

### Severity Guidelines
| Severity | When to Use |
|----------|-------------|
| **Critical** | Immediate action required, significant impact |
| **High** | Urgent, needs attention within 24 hours |
| **Medium** | Important but not urgent |
| **Low** | Minor issue, can be scheduled |

---

## Compliance Tracking

### Supported Frameworks
| Framework | Region | Description |
|-----------|--------|-------------|
| NYC LL144 | New York | Local Law 144 for automated employment tools |
| EU AI Act | European Union | Comprehensive AI regulation |
| Colorado AI Act | Colorado | Consumer protection for AI decisions |
| Illinois AIVOIA | Illinois | AI Video Interview Act |
| ISO 42001 | International | AI Management System standard |
| NIST AI RMF | USA | AI Risk Management Framework |

### Working with Checklists
1. Go to **Compliance** in the sidebar
2. Click on a framework card to expand
3. Review the checklist items
4. Create an assessment:
   - Click **"Start Assessment"** or **"Update Assessment"**
   - Set the deadline
   - Update the status (Not Started, In Progress, Passed, Failed)
   - Add notes

### Generating Compliance Report
Click **"Export Report"** to generate a PDF including:
- Executive summary
- All framework statuses
- Detailed checklists per framework
- Assessment notes

---

## Import & Export

### CSV Import
Available for: **Models**, **Vendors**

1. Click **"Import CSV"** on the respective page
2. Download the template
3. Fill in your data following the template format
4. Upload and import

### PDF Export
Available for: **Models**, **Vendors**, **Compliance**

Click **"Export PDF"** to generate professional reports suitable for:
- Board meetings
- Regulatory audits
- Internal reviews
- Stakeholder updates

---

# For Developers

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
| **CSV Parsing** | PapaParse |

---

## Installation

### Prerequisites
- Node.js 18+ and npm
- A Supabase project (free tier works)

### Setup

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

---

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
│   │   ├── ModelsTable.tsx
│   │   ├── ModelsFilters.tsx
│   │   ├── ModelsStats.tsx
│   │   ├── ModelFormDialog.tsx
│   │   ├── ModelDeleteDialog.tsx
│   │   └── CSVUploadDialog.tsx
│   ├── ui/              # shadcn/ui base components
│   └── vendors/         # Vendor management components
├── hooks/               # React Query data hooks
│   ├── useModels.ts     # Model CRUD operations
│   ├── useVendors.ts    # Vendor CRUD operations
│   ├── useIncidents.ts  # Incident CRUD operations
│   ├── useCompliance.ts # Compliance operations
│   └── useDashboardStats.ts # Dashboard data with realtime
├── integrations/
│   └── supabase/        # Supabase client and generated types
├── lib/                 # Utilities
│   ├── utils.ts         # cn helper for classNames
│   ├── generateComplianceReport.ts  # PDF generation
│   ├── generateModelsReport.ts      # PDF generation
│   └── generateVendorsReport.ts     # PDF generation
├── pages/               # Route page components
└── App.tsx              # Route definitions
```

---

## Database Schema

### Tables (10 with Row-Level Security)

```sql
-- Core entities
organizations (id, name, created_at, updated_at)
profiles (id, user_id, organization_id, full_name, avatar_url)
user_roles (id, user_id, role: admin|user|viewer)

-- AI governance
models (id, organization_id, vendor_id, name, provider, version,
        description, status, risk_level, security_assessment,
        approved_by, approved_at)

vendors (id, organization_id, name, description, risk_score,
         security_assessment, contact_email, website)

incidents (id, organization_id, model_id, vendor_id, title, description,
           severity, status, investigation_notes, resolution_notes,
           reported_by, assigned_to, resolved_at)

-- Compliance
compliance_frameworks (id, name, short_name, region, description, is_active)
compliance_assessments (id, organization_id, model_id, framework_id,
                        status, score, notes, deadline, checklist_progress)
framework_checklists (id, framework_id, item_text, category, sort_order)

-- Audit
audit_logs (id, organization_id, user_id, action, entity_type,
            entity_id, details)
```

### Row-Level Security
All tables use RLS with `get_user_organization_id(auth.uid())` to ensure users only see data from their organization.

---

## API Hooks Reference

### useModels
```typescript
import { useModels, useCreateModel, useUpdateModel, useDeleteModel } from "@/hooks/useModels";

// Fetch all models
const { data: models, isLoading } = useModels();

// Create a model
const createModel = useCreateModel();
createModel.mutate({
  name: "My Model",
  provider: "OpenAI",
  status: "pending",
  risk_level: "medium",
});

// Update a model
const updateModel = useUpdateModel();
updateModel.mutate({ id: "uuid", name: "Updated Name" });

// Delete a model
const deleteModel = useDeleteModel();
deleteModel.mutate("uuid");
```

### useVendors
```typescript
import { useVendors, useCreateVendor, useUpdateVendor, useDeleteVendor } from "@/hooks/useVendors";

// Same pattern as models
```

### useIncidents
```typescript
import { useIncidents, useCreateIncident, useUpdateIncident, useDeleteIncident } from "@/hooks/useIncidents";

// Includes joined model and vendor names
const { data: incidents } = useIncidents();
// incidents[0].models?.name, incidents[0].vendors?.name
```

### useDashboardStats
```typescript
import { useDashboardStats, useRecentActivity } from "@/hooks/useDashboardStats";

// Aggregated stats with real-time updates
const { data: stats } = useDashboardStats();
// stats.totalModels, stats.openIncidents, stats.complianceScore, etc.

// Recent audit log entries
const { data: activity } = useRecentActivity();
```

---

## Adding New Features

### Adding a New Page

1. Create the page component in `src/pages/`
2. Add the route in `src/App.tsx`
3. Add navigation in `src/components/layout/AppSidebar.tsx`

### Adding a New Data Entity

1. Create migration in `supabase/migrations/`
2. Run `npx supabase db push`
3. Create hook in `src/hooks/useEntity.ts`
4. Create components in `src/components/entity/`
5. Create page in `src/pages/Entity.tsx`
6. Add route and navigation

### Creating PDF Reports

Use the existing pattern in `src/lib/generate*Report.ts`:
```typescript
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

export function generateEntityReport(data: EntityReportData) {
  const doc = new jsPDF();
  // ... add content
  doc.save("filename.pdf");
}
```

---

# Troubleshooting

### "Error creating vendor/model: new row violates row-level security policy"
**Cause:** User doesn't have a profile with organization_id set.
**Solution:** Sign out and create a new account, or manually create a profile in the database.

### Dialog shows black screen
**Cause:** CSS loading issue or component error.
**Solution:**
1. Clear browser cache
2. Check browser console for errors
3. Ensure `@import` statements in CSS are before `@tailwind` directives

### 404 error on page refresh
**Cause:** Server isn't configured for SPA routing.
**Solution:** Configure your hosting to serve `index.html` for all routes:
- **Vercel:** Add `rewrites` in `vercel.json`
- **Netlify:** Add `_redirects` file with `/* /index.html 200`
- **Nginx:** Use `try_files $uri /index.html`

### Changes not appearing in real-time
**Cause:** Realtime subscription might have disconnected.
**Solution:** Refresh the page. The dashboard has a 30-second polling fallback.

---

# Routes

| Route | Page | Auth Required |
|-------|------|:---:|
| `/` | Landing page | No |
| `/auth` | Sign in / Sign up | No |
| `/dashboard` | Main dashboard | Yes |
| `/models` | Model inventory | Yes |
| `/vendors` | Vendor management | Yes |
| `/incidents` | Incident management | Yes |
| `/compliance` | Compliance frameworks | Yes |
| `/tasks` | Task management | Yes |
| `/use-cases` | Use cases registry | Yes |
| `/risks` | Risk management | Yes |
| `/bias-metrics` | Bias & fairness | Yes |
| `/evidence` | Evidence hub | Yes |
| `/reporting` | Reports | Yes |
| `/policies` | Policy manager | Yes |

---

# Roadmap

### In Progress
- [x] Model inventory with CRUD
- [x] Vendor management with CRUD
- [x] Incident management with CRUD
- [x] Compliance framework tracking
- [x] CSV bulk import for models and vendors
- [x] PDF export for models, vendors, compliance

### Planned
- [ ] Bias & Fairness metrics (AIR, Demographic Parity, Selection Rate)
- [ ] Task management with assignees and due dates
- [ ] Risk Management dedicated page
- [ ] Use Cases registry
- [ ] Evidence Hub for documentation
- [ ] Reporting engine with custom reports
- [ ] Policy Manager
- [ ] Model detail pages with assessment history
- [ ] Vendor documentation attachments
- [ ] Operations vs Executive dashboard toggle
- [ ] Email notifications for deadlines
- [ ] API integrations for external data

---

## License

Private — All rights reserved.
