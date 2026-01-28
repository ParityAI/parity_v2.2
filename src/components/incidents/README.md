# Incident Management Components

This directory contains all React components for the **Incident Management** feature — a full CRUD interface for tracking, investigating, and resolving incidents across AI systems.

## Architecture

The incident management system follows the same proven pattern used by Models and Vendors:
- **Page** (`src/pages/Incidents.tsx`) — Orchestrates state, filtering, and child components.
- **Hook** (`src/hooks/useIncidents.ts`) — CRUD operations via Supabase + React Query.
- **Components** (this directory) — Presentational and interactive UI pieces.

## Components

### `IncidentsTable.tsx`
Data table displaying all incidents with columns:
- **Title** (with description preview)
- **Severity** (Critical / High / Medium / Low)
- **Status** (Open / Investigating / Mitigated / Closed)
- **Linked Model** (from joined `models` table)
- **Reported date** and **Last updated** date
- **Actions** dropdown (Edit / Delete)

Includes loading skeleton and empty state.

Exports the `IncidentRow` type used by sibling components.

### `IncidentsFilters.tsx`
Filter controls for the incidents list:
- **Search** — Filters by title or description (client-side).
- **Severity** dropdown — All / Critical / High / Medium / Low.
- **Status** dropdown — All / Open / Investigating / Mitigated / Closed.
- **Clear** button — Resets all filters (appears when any filter is active).

### `IncidentsStats.tsx`
Six summary statistic cards:
- Total Incidents, Open, Investigating, Mitigated, Closed, Critical.
- Each card shows an icon and count derived from the incidents array.

### `IncidentFormDialog.tsx`
Modal dialog for creating or editing incidents. Fields:
- **Title** (required), **Description**, **Severity**, **Status**
- **Linked Model** and **Linked Vendor** (dropdowns from existing data)
- **Reported By** and **Assigned To** (free text)
- **Investigation Notes** and **Resolution Notes** (textareas)
- Auto-sets `resolved_at` timestamp when status is changed to "closed".
- Uses Zod schema validation with React Hook Form.

### `IncidentDeleteDialog.tsx`
Confirmation dialog for deleting an incident. Shows the incident title and warns that investigation/resolution data will be permanently removed.

### `SeverityBadge.tsx`
Color-coded badge for incident severity levels:
- **Critical** — red-600
- **High** — destructive (red)
- **Medium** — yellow-500
- **Low** — primary (green)

### `IncidentStatusBadge.tsx`
Color-coded badge for incident status:
- **Open** — destructive (red)
- **Investigating** — yellow
- **Mitigated** — blue
- **Closed** — primary (green)

## Database Schema

Uses the `incidents` table in Supabase:
```
incidents (
  id            UUID PRIMARY KEY,
  title         TEXT NOT NULL,
  description   TEXT,
  severity      incident_severity (critical | high | medium | low),
  status        incident_status (open | investigating | mitigated | closed),
  model_id      UUID → models(id),
  vendor_id     UUID → vendors(id),
  reported_by   TEXT,
  assigned_to   TEXT,
  investigation_notes  TEXT,
  resolution_notes     TEXT,
  resolved_at   TIMESTAMPTZ,
  organization_id UUID → organizations(id),
  created_at    TIMESTAMPTZ,
  updated_at    TIMESTAMPTZ
)
```

Row-Level Security (RLS) is enabled. Data is scoped per organization.
