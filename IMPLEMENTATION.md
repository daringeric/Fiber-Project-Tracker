# Fiber Project Tracker - Implementation Plan

## Project Overview

A customer-facing fiber installation project tracker with an admin portal for project managers. Similar to a Domino's Pizza Tracker, this application provides real-time visibility into the progress of fiber optic installation projects through clearly defined stages.

### Core Features
- **Customer Portal**: Visual progress tracker showing project stages
- **Admin Portal**: Project management interface for internal teams
- **Email Notifications**: Automated emails on status changes
- **Modern UI**: Polished, professional design with Light Curve branding

### Project Stages (The "Pizza Tracker" Phases)
1. **Outside Plant** - Construction and infrastructure work to deliver fiber
2. **Physical Fiber Delivery** - Fiber cable installation and delivery
3. **Network Setup** - Configuration and hardware installation on site
4. **Release to Billing** - Service activation and billing system integration
5. **Follow-Up** - Customer feedback collection and support requests

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | Next.js 14 (App Router) | Full-stack React framework |
| Language | TypeScript | Type safety and developer experience |
| Styling | Tailwind CSS | Utility-first CSS framework |
| UI Components | shadcn/ui | High-quality, accessible components |
| Database ORM | Prisma | Database abstraction (future integration) |
| Authentication | NextAuth.js | Secure authentication |
| Email | React Email + Resend | Transactional emails |
| State Management | Zustand | Lightweight state management |
| Forms | React Hook Form + Zod | Form handling and validation |
| Icons | Lucide React | Modern icon library |

### Design System
- **Primary Color**: Navy Blue (`#1e3a5f`)
- **Brand**: Light Curve (colors to be provided)
- **Typography**: Inter (modern, clean sans-serif)
- **Design Philosophy**: Clean, professional, trustworthy

---

## Phase 1: Project Foundation & Setup
**Goal**: Establish the development environment and project structure

### 1.1 Initialize Next.js Project
- [ ] Create Next.js 14 app with TypeScript
- [ ] Configure Tailwind CSS
- [ ] Set up ESLint and Prettier
- [ ] Create folder structure

### 1.2 Design System Setup
- [ ] Configure Tailwind theme with brand colors
- [ ] Install and configure shadcn/ui
- [ ] Create color palette constants
- [ ] Set up typography scale
- [ ] Create base layout components

### 1.3 Project Structure
```
src/
├── app/                          # Next.js App Router
│   ├── (customer)/              # Customer-facing routes
│   │   ├── track/[projectId]/   # Project tracking page
│   │   └── page.tsx             # Customer landing/lookup
│   ├── (admin)/                 # Admin portal routes
│   │   ├── dashboard/           # Admin dashboard
│   │   ├── projects/            # Project management
│   │   └── layout.tsx           # Admin layout with sidebar
│   ├── api/                     # API routes
│   │   ├── projects/            # Project CRUD
│   │   ├── notifications/       # Email triggers
│   │   └── auth/                # Authentication
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home/redirect
├── components/
│   ├── ui/                      # shadcn/ui components
│   ├── tracker/                 # Tracker-specific components
│   │   ├── ProgressTracker.tsx  # Main tracker component
│   │   ├── StageCard.tsx        # Individual stage card
│   │   ├── StageDetails.tsx     # Expanded stage info
│   │   └── TimelineConnector.tsx
│   ├── admin/                   # Admin-specific components
│   │   ├── ProjectForm.tsx
│   │   ├── ProjectList.tsx
│   │   └── StatusUpdater.tsx
│   └── shared/                  # Shared components
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── Logo.tsx
├── lib/
│   ├── db/                      # Database utilities (future)
│   ├── email/                   # Email templates and utilities
│   ├── utils.ts                 # Utility functions
│   └── constants.ts             # App constants
├── types/
│   └── index.ts                 # TypeScript types
├── hooks/                       # Custom React hooks
└── styles/
    └── globals.css              # Global styles
```

### 1.4 Verification Checklist
- [ ] `npm run dev` starts without errors
- [ ] Tailwind classes render correctly
- [ ] shadcn/ui components work
- [ ] TypeScript compiles without errors
- [ ] Brand colors visible in test component

---

## Phase 2: Core Data Models & Types
**Goal**: Define the data structures that power the application

### 2.1 TypeScript Types
```typescript
// Project Stage Enum
enum ProjectStage {
  OUTSIDE_PLANT = 'outside_plant',
  FIBER_DELIVERY = 'fiber_delivery',
  NETWORK_SETUP = 'network_setup',
  RELEASE_TO_BILLING = 'release_to_billing',
  FOLLOW_UP = 'follow_up'
}

// Stage Status
enum StageStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  BLOCKED = 'blocked'
}

// Project Interface
interface Project {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  address: Address;
  trackingCode: string;
  currentStage: ProjectStage;
  stages: StageProgress[];
  createdAt: Date;
  updatedAt: Date;
  estimatedCompletion?: Date;
  projectManager?: string;
  notes?: string;
}

// Stage Progress
interface StageProgress {
  stage: ProjectStage;
  status: StageStatus;
  startedAt?: Date;
  completedAt?: Date;
  notes?: string;
  tasks?: Task[];
  blockers?: string[];
}
```

### 2.2 Mock Data Service
- [ ] Create mock data for development
- [ ] Implement mock CRUD operations
- [ ] Create data seeding utility
- [ ] Set up mock delay simulation

### 2.3 API Route Structure
- [ ] `GET /api/projects` - List projects (admin)
- [ ] `GET /api/projects/[id]` - Get project details
- [ ] `GET /api/track/[code]` - Customer tracking lookup
- [ ] `POST /api/projects` - Create project
- [ ] `PATCH /api/projects/[id]` - Update project
- [ ] `PATCH /api/projects/[id]/stage` - Update stage status

### 2.4 Verification Checklist
- [ ] Types compile without errors
- [ ] Mock data loads correctly
- [ ] API routes return expected data
- [ ] CRUD operations work in development

---

## Phase 3: Customer Tracking Interface
**Goal**: Build the customer-facing project tracker (the "star" of the show)

### 3.1 Tracking Lookup Page
- [ ] Project lookup by tracking code
- [ ] Clean, welcoming design
- [ ] Error handling for invalid codes
- [ ] Remember recent lookups (localStorage)

### 3.2 Progress Tracker Component
The main visual component showing project progress:

```
┌─────────────────────────────────────────────────────────────┐
│                    YOUR PROJECT STATUS                       │
│                                                             │
│  ● Outside Plant ─── ● Fiber Delivery ─── ○ Network Setup  │
│      ✓ Complete         In Progress           Upcoming      │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  📦 FIBER DELIVERY                    IN PROGRESS   │   │
│  │                                                     │   │
│  │  Our team is installing fiber to your location.    │   │
│  │                                                     │   │
│  │  Started: Jan 15, 2025                             │   │
│  │  Estimated: Jan 20, 2025                           │   │
│  │                                                     │   │
│  │  Tasks:                                            │   │
│  │  ✓ Fiber cable pulled to premises                  │   │
│  │  ✓ External termination complete                   │   │
│  │  ○ Internal wiring in progress                     │   │
│  │  ○ ONT installation pending                        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3.3 Stage Components
- [ ] `ProgressTracker` - Horizontal/vertical stage visualization
- [ ] `StageIndicator` - Individual stage circle/icon
- [ ] `StageCard` - Expanded view of current/selected stage
- [ ] `TaskList` - Checklist of tasks within a stage
- [ ] `TimelineView` - Scrollable timeline of all activity

### 3.4 Responsive Design
- [ ] Mobile-first approach
- [ ] Horizontal tracker on desktop
- [ ] Vertical tracker on mobile
- [ ] Touch-friendly interactions

### 3.5 Animations & Polish
- [ ] Smooth stage transitions
- [ ] Progress indicator animations
- [ ] Subtle hover effects
- [ ] Loading states

### 3.6 Verification Checklist
- [ ] Tracker displays all 5 stages correctly
- [ ] Current stage is highlighted
- [ ] Stage details expand on click/tap
- [ ] Responsive on mobile and desktop
- [ ] Animations are smooth

---

## Phase 4: Admin Portal Foundation
**Goal**: Build the project manager interface for managing projects

### 4.1 Admin Layout
- [ ] Sidebar navigation
- [ ] Header with user info
- [ ] Responsive drawer for mobile
- [ ] Breadcrumb navigation

### 4.2 Dashboard
- [ ] Project overview cards (by status)
- [ ] Recent activity feed
- [ ] Quick actions
- [ ] Search functionality

### 4.3 Project List View
- [ ] Sortable/filterable table
- [ ] Status badges
- [ ] Quick status update
- [ ] Bulk actions

### 4.4 Project Detail View
- [ ] Full project information
- [ ] Stage management interface
- [ ] Activity history
- [ ] Notes/comments section

### 4.5 Project Form
- [ ] Create new project form
- [ ] Edit existing project
- [ ] Form validation
- [ ] Address autocomplete (future)

### 4.6 Verification Checklist
- [ ] Admin layout renders correctly
- [ ] Dashboard shows accurate data
- [ ] Projects can be created/edited
- [ ] Stage updates work
- [ ] Navigation is intuitive

---

## Phase 5: Stage Management System
**Goal**: Implement the core stage progression logic

### 5.1 Stage Workflow
```
[Outside Plant] → [Fiber Delivery] → [Network Setup] → [Release to Billing] → [Follow-Up]
     ↓                   ↓                 ↓                   ↓                  ↓
  Tasks:              Tasks:            Tasks:              Tasks:            Tasks:
  - Permits          - Cable pull      - Config router     - Activate        - Survey sent
  - Trenching        - Termination     - Install ONT       - Bill start      - Check-in call
  - Conduit          - Testing         - Speed test        - Welcome email   - Issue form
```

### 5.2 Stage Configuration
- [ ] Define tasks per stage
- [ ] Set stage prerequisites
- [ ] Configure stage metadata (icons, descriptions)
- [ ] Create stage transition rules

### 5.3 Stage Update Interface
- [ ] Task checkbox completion
- [ ] Stage status dropdown
- [ ] Notes/comments per stage
- [ ] Blocker flagging
- [ ] Timestamp tracking

### 5.4 Progress Calculation
- [ ] Overall project progress percentage
- [ ] Stage completion percentage
- [ ] Time tracking per stage
- [ ] SLA monitoring (future)

### 5.5 Verification Checklist
- [ ] Stages progress in correct order
- [ ] Tasks can be checked/unchecked
- [ ] Status updates reflect immediately
- [ ] Progress percentages calculate correctly
- [ ] Blockers are visible

---

## Phase 6: Email Notification System
**Goal**: Implement automated email notifications

### 6.1 Email Templates
- [ ] Welcome email (project created)
- [ ] Stage started notification
- [ ] Stage completed notification
- [ ] Project completed celebration
- [ ] Follow-up/feedback request

### 6.2 Email Template Design
```
┌─────────────────────────────────────────────┐
│  [LIGHT CURVE LOGO]                         │
├─────────────────────────────────────────────┤
│                                             │
│  Hi [Customer Name],                        │
│                                             │
│  Great news! Your fiber project has         │
│  moved to a new stage:                      │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  🔧 NETWORK SETUP                   │   │
│  │     Now in progress                 │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [TRACK YOUR PROJECT →]                     │
│                                             │
│  Questions? Contact us at support@...       │
│                                             │
├─────────────────────────────────────────────┤
│  © Light Curve | Unsubscribe               │
└─────────────────────────────────────────────┘
```

### 6.3 Email Triggers
- [ ] Project creation → Welcome email
- [ ] Stage change → Progress update email
- [ ] All stages complete → Completion email
- [ ] Follow-up stage → Feedback request email

### 6.4 Email Configuration
- [ ] Email provider setup (Resend/SendGrid)
- [ ] Template variables system
- [ ] Email preview in admin
- [ ] Send test email function

### 6.5 Verification Checklist
- [ ] Emails render correctly
- [ ] Templates have all variables
- [ ] Triggers fire on status change
- [ ] Links in emails work
- [ ] Unsubscribe works (future)

---

## Phase 7: Authentication & Authorization
**Goal**: Secure the admin portal

### 7.1 Authentication Setup
- [ ] NextAuth.js configuration
- [ ] Admin login page
- [ ] Session management
- [ ] Protected routes

### 7.2 User Management (Basic)
- [ ] Admin user model
- [ ] Role-based access (Admin/Project Manager)
- [ ] User settings page

### 7.3 Customer Access
- [ ] Tracking code validation
- [ ] Rate limiting (prevent brute force)
- [ ] Optional customer accounts (future)

### 7.4 Verification Checklist
- [ ] Admin login works
- [ ] Protected routes redirect properly
- [ ] Sessions persist correctly
- [ ] Customer tracking doesn't require auth

---

## Phase 8: Polish & Production Readiness
**Goal**: Finalize the application for deployment

### 8.1 UI/UX Refinement
- [ ] Loading states everywhere
- [ ] Error boundaries
- [ ] Empty states
- [ ] 404 page
- [ ] Success/error toasts

### 8.2 Performance
- [ ] Image optimization
- [ ] Code splitting
- [ ] Caching strategy
- [ ] Lighthouse audit

### 8.3 Accessibility
- [ ] Keyboard navigation
- [ ] Screen reader testing
- [ ] Color contrast verification
- [ ] Focus management

### 8.4 Testing
- [ ] Component unit tests
- [ ] Integration tests
- [ ] E2E tests (critical paths)
- [ ] Mobile device testing

### 8.5 Documentation
- [ ] API documentation
- [ ] Admin user guide
- [ ] Deployment guide

### 8.6 Verification Checklist
- [ ] No console errors
- [ ] Lighthouse score > 90
- [ ] All flows tested
- [ ] Documentation complete

---

## Phase 9: Database Integration (Future)
**Goal**: Connect to real database and billing systems

### 9.1 Database Setup
- [ ] PostgreSQL configuration
- [ ] Prisma schema finalization
- [ ] Migration system
- [ ] Seeding scripts

### 9.2 Billing System Integration
- [ ] API connection setup
- [ ] Data sync strategy
- [ ] Webhook handlers
- [ ] Error handling

### 9.3 Project Management Integration
- [ ] External system connection
- [ ] Two-way sync
- [ ] Conflict resolution

---

## Design Specifications

### Color Palette
```css
/* Primary - Navy Blue */
--navy-900: #0f1f33;
--navy-800: #1a2e4a;
--navy-700: #1e3a5f;  /* Primary */
--navy-600: #2a4a73;
--navy-500: #3a5f8a;

/* Accent (To be provided - Light Curve) */
--accent-primary: TBD;
--accent-secondary: TBD;

/* Semantic */
--success: #10b981;
--warning: #f59e0b;
--error: #ef4444;
--info: #3b82f6;

/* Neutral */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;
```

### Typography
```css
/* Font Family */
--font-sans: 'Inter', system-ui, sans-serif;

/* Font Sizes */
--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
--text-xl: 1.25rem;
--text-2xl: 1.5rem;
--text-3xl: 1.875rem;
--text-4xl: 2.25rem;
```

### Component Specifications
- **Border Radius**: 8px (cards), 4px (buttons/inputs)
- **Shadows**: Subtle, layered shadows for depth
- **Spacing**: 8px base unit system
- **Transitions**: 200ms ease-in-out default

---

## Implementation Order

### MVP (Phases 1-4)
1. ✅ Project setup and design system
2. ✅ Data models and mock API
3. ✅ Customer tracking interface
4. ✅ Basic admin portal

### Enhanced (Phases 5-6)
5. ⬜ Stage management system
6. ⬜ Email notifications

### Production (Phases 7-8)
7. ⬜ Authentication
8. ⬜ Polish and testing

### Future (Phase 9+)
9. ⬜ Database integration
10. ⬜ Billing system integration
11. ⬜ Advanced analytics

---

## Success Metrics

### Technical
- Page load time < 2 seconds
- Lighthouse performance > 90
- Zero critical accessibility issues
- 100% uptime (when hosted)

### User Experience
- Customer can find project in < 30 seconds
- Admin can update status in < 3 clicks
- Mobile experience matches desktop quality

---

## Getting Started

To begin implementation, proceed to **Phase 1** and follow the checklist items in order. Each phase builds upon the previous one, and verification checkpoints ensure quality at each step.

```bash
# Quick start commands (after Phase 1 completion)
npm install
npm run dev
# Open http://localhost:3000
```

---

*Last Updated: February 2026*
*Version: 1.0.0*
