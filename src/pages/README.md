# Pages

Top-level route components for the Clarity Dashboard application. Each file maps to a URL route defined in `src/App.tsx`.

## Public Routes

| File | Route | Description |
|------|-------|-------------|
| `Landing.tsx` | `/` | Marketing landing page. Composes 11 landing sections (Header, Hero, Tagline, WhyParity, ProductSuite, ComplianceFrameworks, HowItWorks, Testimonials, FAQ, FinalCTA, Footer). |
| `Auth.tsx` | `/auth` | Sign-in and sign-up page with Supabase email/password authentication. Redirects to `/dashboard` on successful auth. |
| `ComingSoon.tsx` | `/products/:productId` | Product-specific coming soon pages for MedParity, FinParity, ContentGuard, and Enterprise. |

## Protected Routes (require authentication)

All wrapped in `AppLayout` which provides the sidebar, header, and auth guard.

| File | Route | Description | Status |
|------|-------|-------------|--------|
| `Dashboard.tsx` | `/dashboard` | Main dashboard with KPI stats, charts, quick view panels, and recent activity feed. Real-time updates via Supabase subscriptions. | **Complete** |
| `Models.tsx` | `/models` | AI Model inventory. Full CRUD with search, status filter, and risk filter. | **Complete** |
| `Vendors.tsx` | `/vendors` | Vendor management. Full CRUD with search, risk score filter, and assessment filter. | **Complete** |
| `Compliance.tsx` | `/compliance` | Compliance frameworks with checklist tracking, deadline management, and PDF export. | **Complete** |
| `Incidents.tsx` | `/incidents` | Incident management. Full CRUD with severity/status tracking, model/vendor linking, investigation notes, and resolution workflow. | **Complete** |
| `placeholders.tsx` | Various | Placeholder components for pages under development: Tasks, Use Cases, Risk Management, Bias & Fairness, Evidence Hub, Reporting, Policy Manager. | Placeholder |

## Utility Pages

| File | Route | Description |
|------|-------|-------------|
| `NotFound.tsx` | `*` | 404 error page for unmatched routes. |
| `Index.tsx` | — | Unused legacy boilerplate (no route points to it). |

## Adding a New Page

1. Create your page component in this directory.
2. Add the route in `src/App.tsx` inside the `<Route element={<AppLayout />}>` block.
3. Add the sidebar link in `src/components/layout/AppSidebar.tsx`.
4. If the page needs data, create a hook in `src/hooks/`.
5. If the page needs components, create a directory in `src/components/`.
