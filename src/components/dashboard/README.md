# Dashboard Components

Components that make up the main `/dashboard` page. All data is supplied by the `useDashboardStats` and `useRecentActivity` hooks, which provide real-time updates via Supabase subscriptions.

## Components

### `DashboardStats.tsx`
Five KPI summary cards displayed at the top of the dashboard:
- **AI Models** — Total registered models.
- **Vendors** — Total active vendors.
- **Open Incidents** — Non-closed incidents (shows critical count as subtitle).
- **Compliance Score** — Percentage of passed assessments out of total assessments.
- **Evidence Coverage** — Percentage of models with completed security assessments/documentation.

Includes a loading skeleton state with 5 placeholder cards.

### `DashboardCharts.tsx`
Three data visualization charts built with [Recharts](https://recharts.org/):
- **Task Radar** — Donut pie chart showing Overdue / Due Soon / Upcoming compliance tasks.
- **Incident Status** — Horizontal bar chart showing Open / Investigating / Mitigated / Closed counts.
- **Risk Distribution** — Donut pie chart showing High / Medium / Low risk model breakdown.

Each chart handles empty data gracefully with a centered "No data" message.

### `QuickViewPanels.tsx`
Two side-by-side panels for quick access:
- **Recent Models** — Last 5 registered models with status badges and relative timestamps.
- **Recent Incidents** — Last 5 incidents with severity and status badges.

Uses color maps for status/severity visual indicators.

### `RecentActivity.tsx`
Activity feed showing the latest 5 entries from the `audit_logs` table:
- Icons mapped by entity type (model, vendor, incident, assessment, framework, user).
- Human-readable messages formatted from action + entity type.
- Relative timestamps.
- Empty state with guidance text when no activity exists.

## Data Flow

```
useDashboardStats() ─┬─→ DashboardStats (KPIs)
                     ├─→ DashboardCharts (charts)
                     └─→ QuickViewPanels (recent items)

useRecentActivity() ──→ RecentActivity (audit feed)
```

Both hooks subscribe to Supabase real-time channels and automatically refetch when data changes.
