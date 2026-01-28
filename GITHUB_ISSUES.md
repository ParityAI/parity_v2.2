# GitHub Issues for Parity AI Platform

This document contains all planned issues for future development. Copy each issue to GitHub.

---

## 🚀 FEATURES - Frontend

### Issue #1: Add user management and role-based access control UI
**Labels:** `enhancement` `frontend` `priority:high`

**Description:**
Implement a full user management interface for administrators to manage team members and their roles.

**Requirements:**
- [ ] User invitation system (email invites)
- [ ] User list with search and filters
- [ ] Role assignment UI (Admin, User, Viewer)
- [ ] Permission matrix display
- [ ] User deactivation/reactivation
- [ ] Activity log per user
- [ ] Bulk user import via CSV

**Technical Details:**
- Database: `user_roles` table already exists
- Need new pages: `/settings/users`, `/settings/roles`
- Integrate with Supabase Auth admin API

---

### Issue #2: Add model detail page with full assessment history
**Labels:** `enhancement` `frontend` `priority:medium`

**Description:**
Create a detailed view page for each AI model showing complete assessment history, linked incidents, and compliance status.

**Requirements:**
- [ ] Model overview with all metadata
- [ ] Assessment history timeline
- [ ] Linked incidents list
- [ ] Compliance status per framework
- [ ] Risk assessment history
- [ ] Version history tracking
- [ ] Edit mode inline

**Route:** `/models/:id`

---

### Issue #3: Add vendor detail page with document attachments
**Labels:** `enhancement` `frontend` `priority:medium`

**Description:**
Create detailed vendor pages with document upload capability for contracts, assessments, and certifications.

**Requirements:**
- [ ] Vendor overview with all metadata
- [ ] Document attachment upload (contracts, SOC2, etc.)
- [ ] Security assessment history
- [ ] Linked models list
- [ ] Risk score history chart
- [ ] Contact management (multiple contacts)

**Route:** `/vendors/:id`

---

### Issue #4: Implement real-time notifications system
**Labels:** `enhancement` `frontend` `priority:high`

**Description:**
Add a notification system for compliance deadlines, task assignments, and incident alerts.

**Requirements:**
- [ ] Notification bell icon in header
- [ ] Notification dropdown panel
- [ ] Mark as read/unread
- [ ] Notification preferences settings
- [ ] Email notification integration
- [ ] Push notifications (optional)

**Notification Types:**
- Compliance deadline approaching (7 days, 1 day)
- Task assigned to you
- Incident reported on your model
- Assessment requires review
- Policy update published

---

### Issue #5: Add dark/light theme persistence
**Labels:** `enhancement` `frontend` `priority:low`

**Description:**
Persist theme preference to user profile in database instead of localStorage.

**Requirements:**
- [ ] Store theme preference in `profiles` table
- [ ] Sync across devices
- [ ] System preference option

---

### Issue #6: Implement dashboard customization
**Labels:** `enhancement` `frontend` `priority:medium`

**Description:**
Allow users to customize their dashboard layout and visible widgets.

**Requirements:**
- [ ] Drag-and-drop widget arrangement
- [ ] Show/hide specific widgets
- [ ] Save layout to user preferences
- [ ] Reset to default option
- [ ] Widget resize capability

---

### Issue #7: Add advanced filtering and saved filters
**Labels:** `enhancement` `frontend` `priority:medium`

**Description:**
Implement advanced filtering with date ranges, multiple selections, and ability to save filter presets.

**Requirements:**
- [ ] Date range filters for all tables
- [ ] Multi-select dropdowns
- [ ] Save filter as preset
- [ ] Share filter URL with team
- [ ] Clear all filters button

**Apply to:** Models, Vendors, Incidents, Tasks, Risks, Evidence

---

### Issue #8: Add keyboard shortcuts
**Labels:** `enhancement` `frontend` `priority:low`

**Description:**
Implement keyboard shortcuts for power users.

**Shortcuts:**
- `Cmd/Ctrl + K` - Global search
- `Cmd/Ctrl + N` - New item (context-aware)
- `Cmd/Ctrl + S` - Save current form
- `G + D` - Go to Dashboard
- `G + M` - Go to Models
- `?` - Show shortcuts help

---

### Issue #9: Implement global search
**Labels:** `enhancement` `frontend` `priority:high`

**Description:**
Add a global search feature to find any entity across the platform.

**Requirements:**
- [ ] Search modal with `Cmd+K`
- [ ] Search across models, vendors, incidents, tasks, policies
- [ ] Recent searches
- [ ] Search suggestions
- [ ] Navigate directly to result

---

### Issue #10: Add data export to Excel format
**Labels:** `enhancement` `frontend` `priority:medium`

**Description:**
In addition to PDF, allow Excel export for all data tables.

**Requirements:**
- [ ] Export to .xlsx format
- [ ] Include all visible columns
- [ ] Respect current filters
- [ ] Add export button next to PDF export

---

## 🗄️ FEATURES - Database

### Issue #11: Create database tables for Tasks, Use Cases, Risks, Evidence, Policies
**Labels:** `enhancement` `database` `priority:critical`

**Description:**
Currently these entities use local state. Need to persist to Supabase database.

**Tables to create:**
```sql
-- tasks
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('todo', 'in_progress', 'review', 'completed')),
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  assignee_id UUID REFERENCES profiles(user_id),
  due_date TIMESTAMPTZ,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- use_cases
CREATE TABLE use_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT,
  progress INTEGER DEFAULT 0,
  risk_level TEXT,
  department TEXT,
  owner_id UUID REFERENCES profiles(user_id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- risks
CREATE TABLE risks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  name TEXT NOT NULL,
  description TEXT,
  severity TEXT,
  risk_level TEXT,
  mitigation_status TEXT,
  owner_id UUID REFERENCES profiles(user_id),
  target_date TIMESTAMPTZ,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- evidence_files
CREATE TABLE evidence_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  project_name TEXT,
  category TEXT,
  uploader_id UUID REFERENCES profiles(user_id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- policies
CREATE TABLE policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT,
  version TEXT,
  category TEXT,
  owner_id UUID REFERENCES profiles(user_id),
  effective_date DATE,
  review_date DATE,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- bias_tests
CREATE TABLE bias_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  model_id UUID REFERENCES models(id),
  test_type TEXT NOT NULL,
  protected_attribute TEXT NOT NULL,
  score DECIMAL(5,4),
  threshold DECIMAL(5,4),
  result TEXT CHECK (result IN ('pass', 'fail', 'warning')),
  tested_by UUID REFERENCES profiles(user_id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**RLS Policies:** Add row-level security for all new tables.

---

### Issue #12: Add audit logging triggers for all tables
**Labels:** `enhancement` `database` `priority:high`

**Description:**
Implement database triggers to automatically log all INSERT, UPDATE, DELETE operations to `audit_logs` table.

**Requirements:**
- [ ] Trigger for models table
- [ ] Trigger for vendors table
- [ ] Trigger for incidents table
- [ ] Trigger for compliance_assessments table
- [ ] Trigger for all new tables (tasks, risks, etc.)
- [ ] Store old and new values in JSONB

---

### Issue #13: Add database indexes for performance
**Labels:** `enhancement` `database` `priority:medium`

**Description:**
Add indexes to improve query performance on frequently filtered columns.

**Indexes needed:**
```sql
CREATE INDEX idx_models_organization ON models(organization_id);
CREATE INDEX idx_models_status ON models(status);
CREATE INDEX idx_models_risk_level ON models(risk_level);
CREATE INDEX idx_vendors_organization ON vendors(organization_id);
CREATE INDEX idx_incidents_organization ON incidents(organization_id);
CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_incidents_severity ON incidents(severity);
CREATE INDEX idx_compliance_assessments_deadline ON compliance_assessments(deadline);
```

---

### Issue #14: Implement soft delete for all entities
**Labels:** `enhancement` `database` `priority:medium`

**Description:**
Instead of hard deleting records, add `deleted_at` column for soft deletes to maintain audit history.

**Requirements:**
- [ ] Add `deleted_at` column to all entity tables
- [ ] Update RLS policies to filter deleted records
- [ ] Add "Trash" view for admins to restore items
- [ ] Auto-purge after 30 days (optional)

---

### Issue #15: Add file storage bucket for evidence uploads
**Labels:** `enhancement` `database` `priority:high`

**Description:**
Configure Supabase Storage bucket for evidence file uploads.

**Requirements:**
- [ ] Create `evidence` storage bucket
- [ ] Configure RLS for bucket access
- [ ] Set file size limits (50MB max)
- [ ] Allow file types: PDF, CSV, XLSX, DOC, images
- [ ] Implement virus scanning (optional)

---

## 🔧 FEATURES - Backend/API

### Issue #16: Create Edge Functions for report generation
**Labels:** `enhancement` `backend` `priority:medium`

**Description:**
Move PDF report generation to Supabase Edge Functions for better performance.

**Functions needed:**
- [ ] `generate-model-report`
- [ ] `generate-vendor-report`
- [ ] `generate-compliance-report`
- [ ] `generate-executive-summary`

**Benefits:**
- Server-side rendering
- Scheduled report generation
- Email report delivery

---

### Issue #17: Implement email notifications via Edge Functions
**Labels:** `enhancement` `backend` `priority:high`

**Description:**
Create Edge Functions to send email notifications for important events.

**Email triggers:**
- [ ] Compliance deadline reminders (7 days, 1 day before)
- [ ] Task assignment notifications
- [ ] Incident alerts (critical/high severity)
- [ ] Weekly digest summary
- [ ] User invitation emails

**Integration:** Use Resend or SendGrid

---

### Issue #18: Add API rate limiting
**Labels:** `enhancement` `backend` `security` `priority:medium`

**Description:**
Implement rate limiting to prevent API abuse.

**Requirements:**
- [ ] Limit: 100 requests per minute per user
- [ ] Higher limits for premium tiers
- [ ] Return proper 429 status codes
- [ ] Rate limit headers in responses

---

### Issue #19: Create webhook system for integrations
**Labels:** `enhancement` `backend` `priority:low`

**Description:**
Allow external systems to receive real-time updates via webhooks.

**Webhook events:**
- `model.created`, `model.updated`, `model.deleted`
- `incident.created`, `incident.resolved`
- `compliance.deadline_approaching`
- `bias_test.failed`

**Requirements:**
- [ ] Webhook registration UI
- [ ] Webhook delivery logs
- [ ] Retry mechanism (3 attempts)
- [ ] HMAC signature verification

---

### Issue #20: Implement scheduled jobs for compliance reminders
**Labels:** `enhancement` `backend` `priority:high`

**Description:**
Create cron jobs to check compliance deadlines and send reminders.

**Jobs needed:**
- [ ] Daily: Check deadlines, send reminders
- [ ] Weekly: Generate activity digest
- [ ] Monthly: Compliance status report
- [ ] Quarterly: Bias audit reminders

---

## 🚢 DEPLOYMENT

### Issue #21: Set up CI/CD pipeline
**Labels:** `devops` `priority:critical`

**Description:**
Implement automated testing and deployment pipeline.

**Requirements:**
- [ ] GitHub Actions workflow
- [ ] Run ESLint on PR
- [ ] Run TypeScript check
- [ ] Run unit tests
- [ ] Build verification
- [ ] Auto-deploy to staging on PR merge
- [ ] Manual deploy to production

**Workflow file:** `.github/workflows/ci.yml`

---

### Issue #22: Configure production environment
**Labels:** `devops` `priority:critical`

**Description:**
Set up production deployment infrastructure.

**Options:**
- Vercel (recommended for React)
- Netlify
- AWS Amplify

**Requirements:**
- [ ] Custom domain setup
- [ ] SSL certificate
- [ ] Environment variables
- [ ] SPA routing configuration (`_redirects` or `vercel.json`)
- [ ] CDN caching headers

---

### Issue #23: Set up staging environment
**Labels:** `devops` `priority:high`

**Description:**
Create a staging environment for testing before production.

**Requirements:**
- [ ] Separate Supabase project for staging
- [ ] Staging URL (e.g., staging.parity.ai)
- [ ] Seed data for testing
- [ ] Auto-deploy on `develop` branch

---

### Issue #24: Implement error monitoring
**Labels:** `devops` `priority:high`

**Description:**
Set up error tracking and monitoring.

**Tools:**
- Sentry (recommended)
- LogRocket
- Datadog

**Requirements:**
- [ ] Capture frontend errors
- [ ] Capture API errors
- [ ] Source maps upload
- [ ] Slack/email alerts for errors
- [ ] User session replay (optional)

---

### Issue #25: Set up application monitoring
**Labels:** `devops` `priority:medium`

**Description:**
Implement application performance monitoring (APM).

**Metrics to track:**
- [ ] Page load times
- [ ] API response times
- [ ] Database query performance
- [ ] User session metrics
- [ ] Error rates

---

### Issue #26: Configure backup strategy
**Labels:** `devops` `database` `priority:critical`

**Description:**
Ensure database backups are properly configured.

**Requirements:**
- [ ] Daily automated backups (Supabase provides this)
- [ ] Point-in-time recovery enabled
- [ ] Backup restoration tested
- [ ] Off-site backup storage (optional)

---

## 🔒 SECURITY

### Issue #27: Implement Content Security Policy (CSP)
**Labels:** `security` `priority:high`

**Description:**
Add CSP headers to prevent XSS attacks.

**Headers to add:**
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co
```

---

### Issue #28: Add input sanitization for all forms
**Labels:** `security` `priority:critical`

**Description:**
Ensure all user inputs are properly sanitized to prevent injection attacks.

**Requirements:**
- [ ] Sanitize HTML content before rendering
- [ ] Use parameterized queries (Supabase handles this)
- [ ] Validate file uploads (type, size)
- [ ] Escape special characters in search
- [ ] Add DOMPurify for rich text (if added)

---

### Issue #29: Implement session management improvements
**Labels:** `security` `priority:high`

**Description:**
Enhance session security.

**Requirements:**
- [ ] Session timeout after 30 minutes of inactivity
- [ ] Force re-authentication for sensitive actions
- [ ] "Remember me" option with longer session
- [ ] Single session per user (optional)
- [ ] Session invalidation on password change

---

### Issue #30: Add two-factor authentication (2FA)
**Labels:** `security` `enhancement` `priority:medium`

**Description:**
Implement 2FA for enhanced account security.

**Options:**
- [ ] TOTP (Google Authenticator, Authy)
- [ ] SMS verification
- [ ] Email OTP

**Requirements:**
- [ ] 2FA setup flow
- [ ] Recovery codes
- [ ] Enforce 2FA for admin accounts

---

### Issue #31: Implement API authentication for external integrations
**Labels:** `security` `backend` `priority:medium`

**Description:**
Create API key system for external integrations.

**Requirements:**
- [ ] API key generation UI
- [ ] API key rotation
- [ ] Scoped permissions per key
- [ ] Usage tracking per key
- [ ] Rate limiting per key

---

### Issue #32: Security audit and penetration testing
**Labels:** `security` `priority:high`

**Description:**
Conduct thorough security assessment before launch.

**Checklist:**
- [ ] OWASP Top 10 review
- [ ] SQL injection testing
- [ ] XSS testing
- [ ] CSRF protection verification
- [ ] Authentication bypass testing
- [ ] Authorization testing (horizontal/vertical)
- [ ] File upload vulnerability testing
- [ ] Rate limiting verification

---

### Issue #33: Add security headers
**Labels:** `security` `priority:high`

**Description:**
Configure security headers in deployment.

**Headers:**
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

---

## 🐛 BUGS

### Issue #34: Fix 404 error on page refresh in production
**Labels:** `bug` `priority:critical`

**Description:**
When refreshing any page other than `/`, the server returns a 404 error.

**Cause:** SPA routing not configured on hosting.

**Solution:**
Add redirect rules:
- **Vercel:** `vercel.json` with rewrites
- **Netlify:** `_redirects` file with `/* /index.html 200`
- **Nginx:** `try_files $uri /index.html`

---

### Issue #35: Fix mobile responsive issues on tables
**Labels:** `bug` `frontend` `priority:medium`

**Description:**
Data tables overflow on mobile devices.

**Affected pages:** All pages with tables

**Solution:**
- [ ] Add horizontal scroll for tables on mobile
- [ ] Consider card view for mobile
- [ ] Hide less important columns on small screens

---

### Issue #36: Fix form validation error messages not clearing
**Labels:** `bug` `frontend` `priority:low`

**Description:**
Validation error messages persist after fixing the input in some forms.

**Solution:** Properly reset form state on successful submission.

---

### Issue #37: Fix real-time subscription memory leak
**Labels:** `bug` `frontend` `priority:medium`

**Description:**
Real-time subscriptions may not be properly cleaned up on component unmount.

**Solution:**
- [ ] Audit all `useEffect` with subscriptions
- [ ] Ensure cleanup functions are called
- [ ] Use proper dependency arrays

---

## 📈 IMPROVEMENTS

### Issue #38: Implement code splitting for better performance
**Labels:** `improvement` `frontend` `priority:medium`

**Description:**
Bundle size is over 1.5MB. Implement code splitting to reduce initial load.

**Solution:**
```typescript
// Use React.lazy for route-based code splitting
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Models = React.lazy(() => import('./pages/Models'));
// ... etc
```

**Requirements:**
- [ ] Lazy load all page components
- [ ] Add loading spinner/skeleton
- [ ] Preload critical routes

---

### Issue #39: Add loading skeletons for better UX
**Labels:** `improvement` `frontend` `priority:medium`

**Description:**
Replace loading spinners with skeleton screens for perceived performance.

**Apply to:**
- [ ] Dashboard stats cards
- [ ] Data tables
- [ ] Form dialogs
- [ ] Charts

---

### Issue #40: Optimize database queries
**Labels:** `improvement` `database` `priority:medium`

**Description:**
Audit and optimize slow queries.

**Areas to review:**
- [ ] Dashboard stats aggregation
- [ ] Model listing with vendor joins
- [ ] Incident listing with model/vendor joins
- [ ] Compliance assessments with framework data

**Consider:**
- Database views for complex queries
- Materialized views for dashboard stats
- Query caching with React Query

---

### Issue #41: Add accessibility (a11y) improvements
**Labels:** `improvement` `frontend` `priority:high`

**Description:**
Ensure platform meets WCAG 2.1 AA standards.

**Requirements:**
- [ ] Add proper ARIA labels
- [ ] Ensure keyboard navigation works
- [ ] Test with screen reader
- [ ] Color contrast compliance
- [ ] Focus indicators visible
- [ ] Form error announcements

---

### Issue #42: Add internationalization (i18n) support
**Labels:** `improvement` `frontend` `priority:low`

**Description:**
Prepare for multi-language support.

**Requirements:**
- [ ] Extract all strings to translation files
- [ ] Integrate react-i18next
- [ ] Add language switcher
- [ ] Initial languages: English, Spanish, French

---

### Issue #43: Improve test coverage
**Labels:** `improvement` `testing` `priority:high`

**Description:**
Add comprehensive test coverage.

**Requirements:**
- [ ] Unit tests for hooks (useModels, useVendors, etc.)
- [ ] Component tests for critical UI components
- [ ] Integration tests for CRUD flows
- [ ] E2E tests for critical user journeys (Playwright)
- [ ] Target: 80% coverage

---

### Issue #44: Add documentation site
**Labels:** `improvement` `documentation` `priority:low`

**Description:**
Create a documentation site for users and developers.

**Sections:**
- [ ] Getting Started guide
- [ ] User manual for each feature
- [ ] API documentation
- [ ] Developer setup guide
- [ ] Contributing guidelines

**Tool:** Docusaurus or GitBook

---

### Issue #45: Performance monitoring and optimization
**Labels:** `improvement` `priority:medium`

**Description:**
Add performance monitoring and optimize critical paths.

**Metrics to track:**
- [ ] First Contentful Paint (FCP)
- [ ] Largest Contentful Paint (LCP)
- [ ] Time to Interactive (TTI)
- [ ] Cumulative Layout Shift (CLS)

**Target:** Core Web Vitals passing score

---

## 📋 TECHNICAL DEBT

### Issue #46: Migrate placeholder pages to database persistence
**Labels:** `tech-debt` `priority:critical`

**Description:**
Currently Tasks, Use Cases, Risks, Evidence, Policies, Bias Metrics use local state. Need to migrate to Supabase.

**Pages affected:**
- [x] Tasks (local state)
- [x] Use Cases (local state)
- [x] Risks (local state)
- [x] Evidence (local state)
- [x] Policies (local state)
- [x] Bias Metrics (local state)

**Steps:**
1. Create database tables (Issue #11)
2. Create React Query hooks
3. Update components to use hooks
4. Add RLS policies
5. Test CRUD operations

---

### Issue #47: Refactor duplicate component code
**Labels:** `tech-debt` `priority:medium`

**Description:**
Several components have duplicated patterns that could be abstracted.

**Examples:**
- Stats cards pattern (used in every page)
- Filter bar pattern
- Data table with actions
- Form dialog pattern

**Solution:** Create reusable generic components

---

### Issue #48: Add TypeScript strict mode
**Labels:** `tech-debt` `priority:low`

**Description:**
Enable stricter TypeScript settings for better type safety.

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

---

### Issue #49: Standardize error handling
**Labels:** `tech-debt` `priority:medium`

**Description:**
Create consistent error handling across the application.

**Requirements:**
- [ ] Error boundary component
- [ ] Standardized error toast messages
- [ ] Error logging to monitoring service
- [ ] Retry mechanisms for failed requests

---

### Issue #50: Clean up unused dependencies
**Labels:** `tech-debt` `priority:low`

**Description:**
Audit and remove unused npm packages to reduce bundle size.

**Run:**
```bash
npx depcheck
```

---

## 🎯 MILESTONES

### Milestone 1: MVP Launch
**Issues:** #11, #21, #22, #27, #28, #34, #46

### Milestone 2: Security Hardening
**Issues:** #29, #30, #31, #32, #33

### Milestone 3: User Management
**Issues:** #1, #17, #4

### Milestone 4: Performance Optimization
**Issues:** #13, #38, #39, #40, #45

### Milestone 5: Enterprise Features
**Issues:** #19, #42, #44

---

## Issue Creation Commands

If you have GitHub CLI installed, run these commands to create issues:

```bash
# Feature issues
gh issue create --title "feat: Add user management and RBAC UI" --label "enhancement,frontend,priority:high"
gh issue create --title "feat: Add model detail page" --label "enhancement,frontend,priority:medium"
# ... etc

# Bug issues
gh issue create --title "bug: Fix 404 on page refresh" --label "bug,priority:critical"

# Security issues
gh issue create --title "security: Implement CSP headers" --label "security,priority:high"
```

---

*Last updated: January 2026*
