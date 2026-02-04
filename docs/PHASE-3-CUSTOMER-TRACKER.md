# Phase 3: Customer Tracking Interface

## Overview

**Goal**: Build the customer-facing project tracker - the visual "pizza tracker" experience that shows installation progress.

**Status**: ✅ Complete

## Dependencies

| Dependency | Required | Description |
|------------|----------|-------------|
| **Phase 1** | ✅ Yes | UI components and styling must be available |
| **Phase 2** | ✅ Yes | Project types and mock data service required |

### Why These Dependencies Are Required

**Phase 1 Required For**:
- Button, Card, Badge, Progress UI components
- Tailwind CSS classes and color palette
- Shared Header/Footer components
- Utility functions (cn, formatDate)

**Phase 2 Required For**:
- `Project` and `StageProgress` types
- `STAGE_CONFIGS` for stage metadata
- `mockDataService.getProjectByTrackingCode()`
- Helper functions (`getOverallProgress`)

## What This Phase Enables

After completing Phase 3:
- **Phase 5**: Stage Management System (enhances tracker logic)
- **Phase 6**: Email Notifications (links to tracking page)
- Customers can view their project status

## Deliverables

### 3.1 Home Page with Tracking Lookup

Create the landing page where customers enter their tracking code.

**Tasks**:
- [x] Hero section with project description
- [x] Tracking code input with formatting
- [x] Form validation and error handling
- [x] "How it works" section showing 5 stages
- [x] Feature highlights (real-time updates, visibility, support)
- [x] Call-to-action for support

**Features**:
- Auto-formats input as `XXXX-XXXX-XXXX`
- Validates code format before submission
- Shows error for invalid codes
- Responsive design (mobile/desktop)

**File**: `/src/app/page.tsx`

### 3.2 Project Tracking Page

The main tracking experience showing project progress.

**Tasks**:
- [x] Fetch project by tracking code
- [x] Display progress tracker visualization
- [x] Show project details sidebar
- [x] Handle loading and error states
- [x] Responsive layout

**Page Sections**:
| Section | Content |
|---------|---------|
| Header | Tracking code, current stage badge, refresh button |
| Progress Tracker | Visual stage indicator with task details |
| Project Details | Customer info, address, service type |
| Timeline | Project start date, estimated completion |
| Support | Contact and FAQ links |

**File**: `/src/app/track/[code]/page.tsx`

### 3.3 Progress Tracker Component

The visual "pizza tracker" style progress display.

**Tasks**:
- [x] Horizontal layout for desktop
- [x] Vertical layout for mobile
- [x] Stage indicators (pending/in-progress/completed/blocked)
- [x] Connecting lines between stages
- [x] Click to select and view stage details
- [x] Overall progress bar

**Visual Design**:
```
Desktop:
● Outside Plant ─── ● Fiber Delivery ─── ○ Network Setup ─── ○ Billing ─── ○ Follow-Up
   ✓ Complete         In Progress           Upcoming

Mobile:
● Outside Plant
│   ✓ Complete
│
● Fiber Delivery
│   In Progress
│
○ Network Setup
│   Upcoming
```

**File**: `/src/components/tracker/ProgressTracker.tsx`

### 3.4 Stage Indicator Component

Individual stage circle/icon with status styling.

**Tasks**:
- [x] Four visual states (pending, in-progress, completed, blocked)
- [x] Icon display based on stage
- [x] Pulse animation for current stage
- [x] Click handler for selection
- [x] Size variants (sm, md, lg)

**Status Styles**:
| Status | Border | Background | Icon Color |
|--------|--------|------------|------------|
| Pending | Gray | Light gray | Gray |
| In Progress | Cyan | Cyan/10 | Cyan + Pulse |
| Completed | Green | Green | White + Check |
| Blocked | Red | Red/10 | Red + Warning |

**File**: `/src/components/tracker/StageIndicator.tsx`

### 3.5 Stage Connector Component

Lines connecting stage indicators.

**Tasks**:
- [x] Horizontal connector for desktop
- [x] Vertical connector for mobile
- [x] Color based on completion status
- [x] Gradient for partial completion

**File**: `/src/components/tracker/StageConnector.tsx`

### 3.6 Stage Card Component

Detailed view of a selected stage with tasks.

**Tasks**:
- [x] Stage name and description
- [x] Status badge
- [x] Task checklist (read-only for customers)
- [x] Timeline info (started, completed, estimated)
- [x] Blocker alerts (if any)
- [x] Notes display

**Card Layout**:
```
┌─────────────────────────────────────────────────────────┐
│  FIBER DELIVERY                         [In Progress]  │
│  Physical fiber installation to your premises          │
│                                                        │
│  Started: Jan 15, 2025  |  Estimated: Jan 20, 2025    │
├────────────────────────────────────────────────────────┤
│  Tasks (2/4 complete)                                  │
│  ✓ Fiber cable pulled to premises                     │
│  ✓ External termination complete                      │
│  ○ Internal wiring installed                          │
│  ○ Fiber tested and verified                          │
└────────────────────────────────────────────────────────┘
```

**File**: `/src/components/tracker/StageCard.tsx`

### 3.7 Responsive Design

Ensure excellent experience on all devices.

**Tasks**:
- [x] Mobile-first CSS approach
- [x] Horizontal tracker → vertical on mobile
- [x] Collapsible sidebar on mobile
- [x] Touch-friendly tap targets (44px minimum)
- [x] Readable text sizes

**Breakpoints**:
| Breakpoint | Layout |
|------------|--------|
| < 768px | Vertical tracker, stacked layout |
| ≥ 768px | Horizontal tracker, sidebar layout |
| ≥ 1024px | Full desktop experience |

## Verification Checklist

- [x] Home page loads without errors
- [x] Tracking code input formats correctly
- [x] Invalid code shows error message
- [x] Valid code navigates to tracking page
- [x] Tracking page displays project info
- [x] All 5 stages render in tracker
- [x] Current stage is visually highlighted
- [x] Clicking stage shows details
- [x] Task list displays correctly
- [x] Page is responsive on mobile
- [x] Loading states show spinner
- [x] Error states show friendly message

## Test Tracking Codes

Use these codes to test different scenarios:

| Code | Project State |
|------|---------------|
| `FBRX-2K9M-HTPW` | Fiber Delivery - In Progress |
| `FBRX-7NQ3-LPVC` | Outside Plant - In Progress |
| `FBRX-4RTK-ZMNB` | Network Setup - In Progress |
| `FBRX-8YWS-JKLD` | Follow-Up - Completed |
| `FBRX-5PLQ-RVMX` | Outside Plant - Blocked |
| `INVALID-CODE` | Error state (not found) |

## Technical Notes

### URL Structure
Tracking pages use dynamic routing:
```
/track/[code]/page.tsx
Example: /track/FBRX2K9MHTPW
```

Codes are normalized (dashes removed) for URL cleanliness.

### State Management
Uses React `useState` for:
- Selected stage
- Loading state
- Error state
- Project data

### Performance
- Mock service has 300ms simulated delay
- Loading spinner during fetch
- Error boundary for unexpected errors

## Connection to Other Phases

### Phase 5 (Stage Management)
The tracker components will be enhanced to:
- Show real-time updates via WebSocket/polling
- Display more detailed task information
- Support stage-specific custom fields

### Phase 6 (Email Notifications)
Emails will link directly to:
```
https://yourapp.com/track/{trackingCode}
```

### Phase 9 (Database)
Replace mock service calls:
```typescript
// Current
const project = await mockDataService.getProjectByTrackingCode(code);

// Future
const project = await prisma.project.findUnique({
  where: { trackingCode: code }
});
```

## Next Steps

With Phase 3 complete, proceed to:
1. **[Phase 4: Admin Portal](./PHASE-4-ADMIN-PORTAL.md)** - Build management interface
2. **[Phase 5: Stage Management](./PHASE-5-STAGE-MANAGEMENT.md)** - Enhance stage logic

---

*Phase 3 completed: February 2026*
