# Phase 4: Admin Portal Foundation

## Overview

**Goal**: Build the project manager interface for creating, viewing, and managing fiber installation projects.

**Status**: ✅ Complete

## Dependencies

| Dependency | Required | Description |
|------------|----------|-------------|
| **Phase 1** | ✅ Yes | UI components, layout system, styling |
| **Phase 2** | ✅ Yes | Project types, mock data service, dashboard stats |

### Why These Dependencies Are Required

**Phase 1 Required For**:
- Card, Button, Input, Badge components
- Accordion component for stage expansion
- Progress bar component
- Admin layout sidebar structure

**Phase 2 Required For**:
- `Project` interface for data display
- `mockDataService` for CRUD operations
- `DashboardStats` type for overview
- `STAGE_CONFIGS` for stage management

### Note: Can Develop in Parallel with Phase 3
Phase 4 does not depend on Phase 3. Both can be developed simultaneously after Phases 1-2 are complete.

## What This Phase Enables

After completing Phase 4:
- **Phase 5**: Stage Management System (enhances admin capabilities)
- **Phase 6**: Email Notifications (trigger emails from admin actions)
- **Phase 7**: Authentication (secures admin portal)

## Deliverables

### 4.1 Admin Layout

Create the shell/wrapper for all admin pages.

**Tasks**:
- [x] Sidebar navigation with links
- [x] Header with page title
- [x] Responsive drawer for mobile
- [x] Active link highlighting
- [x] Logo placement

**Navigation Items**:
| Link | Icon | Route |
|------|------|-------|
| Dashboard | LayoutDashboard | `/admin/dashboard` |
| Projects | FolderKanban | `/admin/projects` |
| Customers | Users | `/admin/customers` |
| Settings | Settings | `/admin/settings` |

**File**: `/src/app/admin/layout.tsx`

### 4.2 Dashboard Page

Overview of all projects with key metrics.

**Tasks**:
- [x] Stats cards (Total, Active, Completed, Blocked)
- [x] Projects by stage bar chart
- [x] Recent activity feed
- [x] Quick action buttons

**Stats Display**:
```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  Total       │ │  Active      │ │  Completed   │ │  Blocked     │
│     5        │ │     3        │ │     1        │ │     1        │
│  Projects    │ │  Projects    │ │  Projects    │ │  Projects    │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

**File**: `/src/app/admin/dashboard/page.tsx`

### 4.3 Projects List Page

Searchable, filterable list of all projects.

**Tasks**:
- [x] Project cards/table view
- [x] Search by name, tracking code, city
- [x] Filter by stage
- [x] Status badges
- [x] Progress indicators
- [x] Quick actions (view, edit, manage)

**Project Card Layout**:
```
┌─────────────────────────────────────────────────────────────────┐
│  John Anderson                              [In Progress]       │
│  Watson & Associates                                            │
│                                                                 │
│  FBRX-2K9M-HTPW  │  Springfield, IL  │  Jan 15, 2025           │
│                                                                 │
│  Fiber Delivery                                    45% ████░░   │
│                                              [View] [Manage →]  │
└─────────────────────────────────────────────────────────────────┘
```

**File**: `/src/app/admin/projects/page.tsx`

### 4.4 Project Detail/Management Page

Full project view with stage management.

**Tasks**:
- [x] Project info header
- [x] Overall progress display
- [x] Expandable stage accordions
- [x] Task checkboxes (editable)
- [x] Stage status dropdowns
- [x] Customer contact info sidebar
- [x] Quick actions (send email, contact)

**Stage Management UI**:
```
▼ Outside Plant                               [Completed ✓]
  Set status: [Pending] [In Progress] [Completed] [Blocked]
  ─────────────────────────────────────────────────────────
  Tasks:
  ✓ Permits obtained
  ✓ Route survey completed
  ✓ Trenching/boring complete
  ✓ Conduit installed
  ✓ Fiber cable placed

  Started: Jan 5, 2025  |  Completed: Jan 12, 2025
```

**File**: `/src/app/admin/projects/[id]/page.tsx`

### 4.5 New Project Form

Create new installation projects.

**Tasks**:
- [x] Customer information section
- [x] Service address section
- [x] Project details section
- [x] Form validation
- [x] Service type selection
- [x] Project manager assignment
- [x] Estimated completion date

**Form Sections**:
| Section | Fields |
|---------|--------|
| Customer | Name*, Email*, Phone, Company |
| Address | Street*, Unit, City*, State*, ZIP* |
| Project | Service Type, Project Manager, Est. Completion |

**File**: `/src/app/admin/projects/new/page.tsx`

### 4.6 Placeholder Pages

Create stub pages for future features.

**Tasks**:
- [x] Customers page (placeholder)
- [x] Settings page (placeholder)

**Files**:
- `/src/app/admin/customers/page.tsx`
- `/src/app/admin/settings/page.tsx`

## Verification Checklist

- [x] Admin layout renders with sidebar
- [x] Navigation links work correctly
- [x] Dashboard shows accurate stats
- [x] Projects list loads all projects
- [x] Search filters projects correctly
- [x] Stage filter works
- [x] Project detail page loads
- [x] Task checkboxes toggle (updates state)
- [x] Stage status can be changed
- [x] New project form validates input
- [x] New project creates successfully
- [x] Mobile responsive (sidebar drawer)

## Admin Portal Routes

| Route | Description |
|-------|-------------|
| `/admin` | Redirects to dashboard |
| `/admin/dashboard` | Dashboard with stats |
| `/admin/projects` | Projects list |
| `/admin/projects/new` | Create project form |
| `/admin/projects/[id]` | Project detail/management |
| `/admin/customers` | Customer list (placeholder) |
| `/admin/settings` | Settings (placeholder) |

## Technical Notes

### State Updates
When updating tasks or stages:
```typescript
const handleTaskToggle = async (stage, taskId, completed) => {
  setIsSaving(true);
  const updated = await mockDataService.updateTask(
    project.id, stage, taskId, completed
  );
  setProject(updated);
  setIsSaving(false);
};
```

### Optimistic Updates
Consider adding optimistic updates in future:
1. Update UI immediately
2. Send request to backend
3. Revert if request fails

### External Link to Customer View
Admin can preview customer experience:
```typescript
<Link href={`/track/${project.trackingCode.replace(/-/g, "")}`} target="_blank">
  View as Customer
</Link>
```

## Connection to Other Phases

### Phase 5 (Stage Management)
Enhancements to add:
- Stage transition validation rules
- Required fields before stage completion
- Automatic task creation on stage start
- Time tracking per stage

### Phase 6 (Email Notifications)
Add buttons to trigger:
- Send status update email
- Send welcome email
- Send completion email
- Preview email before sending

### Phase 7 (Authentication)
Secure the admin portal:
- Login required for all `/admin/*` routes
- Role-based permissions (Admin vs Project Manager)
- Audit log of who made changes

### Phase 9 (Database)
Replace mock service:
```typescript
// Current
const projects = await mockDataService.getProjects();

// Future
const projects = await prisma.project.findMany({
  include: { stages: true, customer: true }
});
```

## Next Steps

With Phase 4 complete, proceed to:
1. **[Phase 5: Stage Management](./PHASE-5-STAGE-MANAGEMENT.md)** - Enhance workflow logic
2. **[Phase 7: Authentication](./PHASE-7-AUTHENTICATION.md)** - Secure admin access

---

*Phase 4 completed: February 2026*
