# Phase 5: Stage Management System

## Overview

**Goal**: Implement advanced stage progression logic, workflow rules, and enhanced task management.

**Status**: ⬜ Pending

## Dependencies

| Dependency | Required | Description |
|------------|----------|-------------|
| **Phase 1** | ✅ Yes | Foundation and UI components |
| **Phase 2** | ✅ Yes | Data models and types |
| **Phase 3** | ✅ Yes | Customer tracker displays stages |
| **Phase 4** | ✅ Yes | Admin portal manages stages |

### Why All Previous Phases Are Required

**Phase 1-2**: Core infrastructure for types and components

**Phase 3**: Customer tracker must exist to display enhanced stage information

**Phase 4**: Admin portal is where stage management happens - this phase enhances those capabilities

## What This Phase Enables

After completing Phase 5:
- **Phase 6**: Email Notifications (triggered by stage changes)
- Enhanced customer experience with detailed progress
- Better project management workflow

## Deliverables

### 5.1 Stage Workflow Engine

Create a service to manage stage transitions and validation.

**Tasks**:
- [ ] Define stage transition rules
- [ ] Create workflow validation service
- [ ] Implement prerequisite checking
- [ ] Add automatic stage progression triggers

**Stage Workflow**:
```
[Outside Plant] → [Fiber Delivery] → [Network Setup] → [Release to Billing] → [Follow-Up]
     ↓                   ↓                 ↓                   ↓                  ↓
  Required:           Required:         Required:           Required:         Required:
  - All tasks         - All tasks       - All tasks         - All tasks       - Survey sent
  - No blockers       - OSP complete    - Fiber complete    - Setup complete  - Call done
```

**Transition Rules**:
| From Stage | To Stage | Requirements |
|------------|----------|--------------|
| Outside Plant | Fiber Delivery | All OSP tasks complete, no blockers |
| Fiber Delivery | Network Setup | All Fiber tasks complete |
| Network Setup | Release to Billing | Speed test passed, equipment verified |
| Release to Billing | Follow-Up | Service activated, billing started |
| Follow-Up | (Complete) | Survey collected |

**Files to Create**:
```
/src/lib/workflow/
├── stage-workflow.ts    # Transition logic
├── validation.ts        # Rule validation
└── triggers.ts          # Automatic actions
```

### 5.2 Enhanced Task Management

Improve task tracking within stages.

**Tasks**:
- [ ] Task dependencies (task B requires task A)
- [ ] Task assignment to team members
- [ ] Task due dates and reminders
- [ ] Task notes and attachments
- [ ] Task completion timestamps
- [ ] Required vs optional tasks

**Enhanced Task Interface**:
```typescript
interface EnhancedTask {
  id: string;
  description: string;
  completed: boolean;
  completedAt?: Date;
  completedBy?: string;
  required: boolean;
  dependsOn?: string[];  // Task IDs
  assignedTo?: string;
  dueDate?: Date;
  notes?: string;
  attachments?: Attachment[];
}
```

### 5.3 Stage Configuration Enhancement

Extend stage configuration with workflow rules.

**Tasks**:
- [ ] Define required tasks per stage
- [ ] Set minimum completion percentage
- [ ] Configure automatic notifications
- [ ] Add custom fields per stage
- [ ] SLA definitions (target durations)

**Enhanced Stage Config**:
```typescript
interface EnhancedStageConfig {
  id: ProjectStage;
  name: string;
  description: string;
  icon: string;
  tasks: TaskTemplate[];
  requiredCompletion: number;  // Percentage required to move on
  targetDuration: number;      // Days (for SLA tracking)
  autoNotify: boolean;         // Send email on start/complete
  customFields?: CustomField[];
}
```

### 5.4 Progress Calculation Enhancements

Improve how progress is calculated and displayed.

**Tasks**:
- [ ] Weighted task completion (some tasks worth more)
- [ ] Stage-level progress with rollup
- [ ] Time-based progress (on track / behind)
- [ ] SLA compliance indicators
- [ ] Projected completion date

**Progress Display**:
```
Overall Progress: 65%
━━━━━━━━━━━━━━━━━━━━━░░░░░░░░░░

Stage Progress:
✓ Outside Plant    100%  ━━━━━━━━━━  (5 days)
● Fiber Delivery    75%  ━━━━━━━━░░  (3/4 days)
○ Network Setup      0%  ░░░░░░░░░░  (Est. 2 days)
○ Release to Billing 0%  ░░░░░░░░░░  (Est. 1 day)
○ Follow-Up          0%  ░░░░░░░░░░  (Est. 3 days)

Projected Completion: Feb 15, 2025 (On Track ✓)
```

### 5.5 Blocker Management

Enhance how blockers are tracked and resolved.

**Tasks**:
- [ ] Blocker creation with details
- [ ] Blocker categories (permit, weather, customer, equipment)
- [ ] Blocker resolution workflow
- [ ] Blocker impact on timeline
- [ ] Blocker escalation rules

**Blocker Interface**:
```typescript
interface Blocker {
  id: string;
  projectId: string;
  stage: ProjectStage;
  category: BlockerCategory;
  description: string;
  impact: 'low' | 'medium' | 'high';
  createdAt: Date;
  createdBy: string;
  resolvedAt?: Date;
  resolvedBy?: string;
  resolution?: string;
  daysBlocked: number;
}
```

### 5.6 Stage Update Interface Enhancements

Improve the admin UI for stage management.

**Tasks**:
- [ ] Bulk task updates
- [ ] Quick stage advancement button
- [ ] Validation warnings before stage change
- [ ] Blocker quick-add modal
- [ ] Stage history timeline
- [ ] Undo recent changes

**Enhanced Stage Card**:
```
┌─────────────────────────────────────────────────────────────────┐
│  FIBER DELIVERY                              [In Progress ▼]   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  75%        │
├─────────────────────────────────────────────────────────────────┤
│  ⚠️ Cannot advance: 1 required task incomplete                  │
│                                                                 │
│  Tasks (3/4 complete):                                         │
│  ✓ Fiber cable pulled to premises           @Tech Team A       │
│  ✓ External termination complete            @Tech Team A       │
│  ✓ Internal wiring installed                @Tech Team B       │
│  ○ Fiber tested and verified (REQUIRED)     Unassigned         │
│                                                                 │
│  [+ Add Task]  [+ Add Blocker]  [Mark All Complete]            │
├─────────────────────────────────────────────────────────────────┤
│  Stage Duration: 5 days (Target: 4 days) ⚠️ Over SLA           │
│  [← Previous Stage]              [Advance to Network Setup →]  │
└─────────────────────────────────────────────────────────────────┘
```

## Verification Checklist

- [ ] Stage transitions validate correctly
- [ ] Cannot skip stages
- [ ] Required tasks block advancement
- [ ] Blockers prevent stage completion
- [ ] Progress percentages accurate
- [ ] SLA tracking works
- [ ] Task dependencies enforced
- [ ] Stage history recorded
- [ ] Customer tracker shows enhanced info

## Technical Notes

### Workflow Validation
```typescript
function canAdvanceStage(project: Project, fromStage: ProjectStage): ValidationResult {
  const stageProgress = project.stages.find(s => s.stage === fromStage);
  const config = STAGE_CONFIGS[fromStage];

  const errors: string[] = [];

  // Check required tasks
  const requiredTasks = stageProgress.tasks.filter(t => t.required);
  const incompleteTasks = requiredTasks.filter(t => !t.completed);
  if (incompleteTasks.length > 0) {
    errors.push(`${incompleteTasks.length} required tasks incomplete`);
  }

  // Check blockers
  if (stageProgress.blockers?.length > 0) {
    errors.push('Active blockers must be resolved');
  }

  return {
    canAdvance: errors.length === 0,
    errors
  };
}
```

### Activity Logging
All stage changes should be logged:
```typescript
interface StageActivityLog {
  id: string;
  projectId: string;
  stage: ProjectStage;
  action: 'started' | 'completed' | 'blocked' | 'unblocked';
  timestamp: Date;
  userId: string;
  details?: string;
}
```

## Connection to Other Phases

### Phase 6 (Email Notifications)
Stage events trigger emails:
- Stage started → "We've begun [Stage Name]"
- Stage completed → "Great news! [Stage Name] is done"
- Blocker added → Internal notification
- Project completed → Celebration email

### Phase 9 (Database)
Stage workflow data persists:
```prisma
model StageProgress {
  id          String      @id
  projectId   String
  stage       ProjectStage
  status      StageStatus
  startedAt   DateTime?
  completedAt DateTime?
  tasks       Task[]
  blockers    Blocker[]
}

model Task {
  id          String   @id
  stageId     String
  description String
  completed   Boolean
  required    Boolean
  assignedTo  String?
  dueDate     DateTime?
}
```

## Next Steps

With Phase 5 complete, proceed to:
1. **[Phase 6: Email Notifications](./PHASE-6-EMAIL-NOTIFICATIONS.md)** - Automated emails on stage changes

---

*Phase 5 status: Pending*
