# Phase 2: Core Data Models & Types

## Overview

**Goal**: Define the TypeScript data structures and create a mock data service that powers the application.

**Status**: ✅ Complete

## Dependencies

| Dependency | Required | Description |
|------------|----------|-------------|
| **Phase 1** | ✅ Yes | Project foundation must be complete |

### Why Phase 1 is Required
- TypeScript configuration must be in place
- Utility functions (`generateId`, etc.) are needed
- Project structure must exist for file placement

## What This Phase Enables

After completing Phase 2, the following phases can begin:
- **Phase 3**: Customer Tracking Interface (uses Project and Stage types)
- **Phase 4**: Admin Portal Foundation (uses all data models)
- **Phase 5**: Stage Management System (extends stage logic)

## Deliverables

### 2.1 TypeScript Type Definitions

Define all data structures used throughout the application.

**Tasks**:
- [x] Define `ProjectStage` enum
- [x] Define `StageStatus` enum
- [x] Create `Project` interface
- [x] Create `StageProgress` interface
- [x] Create `Task` interface
- [x] Create `Address` interface
- [x] Create helper functions

**Core Types**:

```typescript
// Project Stages (the 5-stage workflow)
enum ProjectStage {
  OUTSIDE_PLANT = "outside_plant",
  FIBER_DELIVERY = "fiber_delivery",
  NETWORK_SETUP = "network_setup",
  RELEASE_TO_BILLING = "release_to_billing",
  FOLLOW_UP = "follow_up",
}

// Stage Status
enum StageStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  BLOCKED = "blocked",
}

// Main Project Interface
interface Project {
  id: string;
  trackingCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  companyName?: string;
  address: Address;
  currentStage: ProjectStage;
  stages: StageProgress[];
  createdAt: Date;
  updatedAt: Date;
  estimatedCompletion?: Date;
  projectManager?: string;
  serviceType?: string;
}
```

**Files Created**:
```
/src/types/index.ts
```

### 2.2 Stage Configuration

Define metadata and default tasks for each stage.

**Tasks**:
- [x] Create `StageConfig` interface
- [x] Define `STAGE_CONFIGS` constant
- [x] Set default tasks per stage
- [x] Configure icons and descriptions

**Stage Configurations**:

| Stage | Default Tasks |
|-------|---------------|
| Outside Plant | Permits, Route survey, Trenching, Conduit, Fiber placement |
| Fiber Delivery | Cable pull, External termination, Internal wiring, Testing |
| Network Setup | ONT install, Router config, Connectivity test, Speed test |
| Release to Billing | Service activation, Billing account, Welcome packet |
| Follow-Up | Survey sent, Follow-up call, Issues resolved, Project closed |

### 2.3 Mock Data Service

Create a service that simulates backend operations.

**Tasks**:
- [x] Create sample projects (5 in various stages)
- [x] Implement CRUD operations
- [x] Add simulated network delay
- [x] Create activity log data

**Mock Projects**:

| Project | Customer | Stage | Status |
|---------|----------|-------|--------|
| FBRX-2K9M-HTPW | John Anderson | Fiber Delivery | In Progress |
| FBRX-7NQ3-LPVC | Emily Watson | Outside Plant | In Progress |
| FBRX-4RTK-ZMNB | Robert Martinez | Network Setup | In Progress |
| FBRX-8YWS-JKLD | Amanda Thompson | Follow-Up | Completed |
| FBRX-5PLQ-RVMX | David Kim | Outside Plant | Blocked |

**Service Methods**:
```typescript
class MockDataService {
  getProjects(): Promise<Project[]>
  getProjectById(id: string): Promise<Project | null>
  getProjectByTrackingCode(code: string): Promise<Project | null>
  createProject(data: Partial<Project>): Promise<Project>
  updateProject(id: string, updates: Partial<Project>): Promise<Project>
  updateStageStatus(projectId: string, stage: ProjectStage, status: StageStatus): Promise<Project>
  updateTask(projectId: string, stage: ProjectStage, taskId: string, completed: boolean): Promise<Project>
  getDashboardStats(): Promise<DashboardStats>
}
```

**Files Created**:
```
/src/lib/mock-data.ts
```

### 2.4 Helper Functions

Utility functions for working with project data.

**Tasks**:
- [x] `getStageOrder(stage)` - Get numeric order of stage
- [x] `getNextStage(stage)` - Get the next stage in workflow
- [x] `getPreviousStage(stage)` - Get previous stage
- [x] `isStageComplete(project, stage)` - Check completion
- [x] `getOverallProgress(project)` - Calculate percentage
- [x] `generateTrackingCode()` - Create unique codes
- [x] `formatTrackingCode(code)` - Format as XXXX-XXXX-XXXX

### 2.5 API Route Structure (Planned)

Define the API endpoints (implemented with mock data for now).

**Endpoints**:
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/projects` | List all projects (admin) |
| GET | `/api/projects/[id]` | Get project by ID |
| GET | `/api/track/[code]` | Customer lookup by tracking code |
| POST | `/api/projects` | Create new project |
| PATCH | `/api/projects/[id]` | Update project |
| PATCH | `/api/projects/[id]/stage` | Update stage status |

## Verification Checklist

- [x] All types compile without TypeScript errors
- [x] Mock data service returns expected data
- [x] `getProjectByTrackingCode` finds projects correctly
- [x] Stage helper functions work correctly
- [x] Tracking code generation creates unique codes
- [x] CRUD operations update state correctly

## Technical Notes

### Tracking Code Format
Tracking codes follow the pattern `XXXX-XXXX-XXXX`:
- 12 alphanumeric characters
- Excludes confusing characters (0, O, I, 1, L)
- Case-insensitive lookup

### Mock Delay Simulation
The mock service includes a 300ms delay to simulate network latency:
```typescript
private async delay(ms: number = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
```

### Data Persistence
Current implementation stores data in memory. Data resets on page refresh. Phase 9 will add persistent database storage.

## Migration Path to Real Database

When implementing Phase 9 (Database Integration), the mock data service will be replaced:

1. Keep the same interface (`MockDataService` → `DatabaseService`)
2. Replace in-memory storage with Prisma queries
3. Remove simulated delays
4. Add proper error handling

```typescript
// Future: Replace mock with real database
// const data = await mockDataService.getProjects();
const data = await prisma.project.findMany();
```

## Next Steps

With Phase 2 complete, proceed to:
1. **[Phase 3: Customer Tracking Interface](./PHASE-3-CUSTOMER-TRACKER.md)** - Build the visual tracker
2. **[Phase 4: Admin Portal](./PHASE-4-ADMIN-PORTAL.md)** - Build management interface

Both Phase 3 and Phase 4 can be developed in parallel.

---

*Phase 2 completed: February 2026*
