# Hooks

Custom React hooks for data fetching, mutations, and UI utilities. All data hooks use [TanStack React Query](https://tanstack.com/query) for caching, invalidation, and server state management.

## Data Hooks

### `useModels.ts`
CRUD operations for the **AI Models** inventory.
- `useModels()` — Fetches all models with joined vendor name.
- `useCreateModel()` — Creates a new model, auto-assigns `organization_id` from the user's profile.
- `useUpdateModel()` — Updates an existing model by ID.
- `useDeleteModel()` — Deletes a model by ID.
- Invalidates `models` and `dashboard-stats` queries on mutation.

### `useVendors.ts`
CRUD operations for **Vendor Management**.
- `useVendors()` — Fetches all vendors ordered by creation date (newest first).
- `useCreateVendor()` — Creates a new vendor.
- `useUpdateVendor()` — Updates an existing vendor by ID.
- `useDeleteVendor()` — Deletes a vendor by ID.
- Invalidates `vendors` and `dashboard-stats` queries on mutation.

### `useIncidents.ts`
CRUD operations for **Incident Management**.
- `useIncidents()` — Fetches all incidents with joined model and vendor names.
- `useCreateIncident()` — Reports a new incident, auto-assigns `organization_id`.
- `useUpdateIncident()` — Updates incident details (severity, status, notes, assignment).
- `useDeleteIncident()` — Deletes an incident by ID.
- Invalidates `incidents`, `dashboard-stats`, and `recent-activity` queries on mutation.
- Supports the full incident lifecycle: Open → Investigating → Mitigated → Closed.

### `useCompliance.ts`
Data hooks for the **Compliance Frameworks** system.
- `useComplianceFrameworks()` — Fetches active compliance frameworks.
- `useFrameworkChecklists(frameworkId)` — Fetches checklist items for a specific framework.
- `useAllFrameworkChecklists()` — Fetches all checklists (used for PDF export).
- `useComplianceAssessments()` — Fetches assessments with joined framework data.
- `useCreateAssessment()` / `useUpdateAssessment()` — Manages assessment records.

### `useDashboardStats.ts`
Real-time dashboard statistics with Supabase subscriptions.
- `useDashboardStats()` — Aggregates KPIs (models, vendors, incidents, compliance score, evidence coverage), risk distribution, incident breakdown, task radar, and recent items. Subscribes to real-time changes on `models`, `vendors`, `incidents`, and `compliance_assessments` tables. Falls back to 30-second polling.
- `useRecentActivity()` — Fetches latest 5 audit log entries with real-time subscription.

## UI Hooks

### `use-toast.ts`
shadcn/ui toast notification hook (reducer-based state management).

### `use-mobile.tsx`
Mobile breakpoint detection (768px) using `window.matchMedia`.
