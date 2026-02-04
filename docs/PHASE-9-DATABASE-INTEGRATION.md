# Phase 9: Database Integration

## Overview

**Goal**: Connect the application to a real database and prepare for integration with external billing and project management systems.

**Status**: ⬜ Pending (Future)

## Dependencies

| Dependency | Required | Description |
|------------|----------|-------------|
| **Phases 1-8** | ✅ Yes | Complete application with all features tested |

### Why All Phases Are Required

Phase 9 replaces the mock data layer with a real database. This requires:
- All features working with mock data (Phases 1-7)
- All features tested and polished (Phase 8)
- Stable interfaces that won't change frequently

### Note: This is a "Future" Phase

Phase 9 is marked as future because:
- MVP can run with mock data for demonstrations
- Database setup requires infrastructure decisions
- External integrations need partner coordination

## What This Phase Enables

After completing Phase 9:
- Production deployment with persistent data
- Integration with billing systems
- Integration with project management tools
- Real customer usage
- Analytics and reporting

## Deliverables

### 9.1 Database Setup

Configure PostgreSQL database with Prisma ORM.

**Tasks**:
- [ ] Set up PostgreSQL database
- [ ] Install and configure Prisma
- [ ] Create database schema
- [ ] Set up migrations
- [ ] Configure connection pooling
- [ ] Set up development/staging/production databases

**Installation**:
```bash
npm install prisma @prisma/client
npx prisma init
```

**Environment Variables**:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/fiber_tracker?schema=public"
```

### 9.2 Prisma Schema

Define the complete database schema.

**Schema**:
```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// User & Authentication
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  name          String
  role          UserRole  @default(PROJECT_MANAGER)
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  lastLogin     DateTime?

  // Relations
  projects      Project[] @relation("AssignedTo")
  activityLogs  ActivityLog[]
  emailLogs     EmailLog[]
}

enum UserRole {
  ADMIN
  PROJECT_MANAGER
  VIEWER
}

// Customer
model Customer {
  id            String    @id @default(cuid())
  name          String
  email         String
  phone         String?
  companyName   String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  projects      Project[]
  addresses     Address[]
}

// Address
model Address {
  id            String    @id @default(cuid())
  street        String
  unit          String?
  city          String
  state         String
  zipCode       String
  country       String    @default("USA")

  // Relations
  customerId    String
  customer      Customer  @relation(fields: [customerId], references: [id])
  projects      Project[]
}

// Project
model Project {
  id                  String        @id @default(cuid())
  trackingCode        String        @unique
  currentStage        ProjectStage  @default(OUTSIDE_PLANT)
  serviceType         String?
  notes               String?
  createdAt           DateTime      @default(now())
  updatedAt           DateTime      @updatedAt
  estimatedCompletion DateTime?
  completedAt         DateTime?

  // Relations
  customerId          String
  customer            Customer      @relation(fields: [customerId], references: [id])
  addressId           String
  address             Address       @relation(fields: [addressId], references: [id])
  projectManagerId    String?
  projectManager      User?         @relation("AssignedTo", fields: [projectManagerId], references: [id])
  stages              StageProgress[]
  activityLogs        ActivityLog[]
  emailLogs           EmailLog[]

  // External IDs
  externalBillingId   String?
  externalProjectId   String?
}

enum ProjectStage {
  OUTSIDE_PLANT
  FIBER_DELIVERY
  NETWORK_SETUP
  RELEASE_TO_BILLING
  FOLLOW_UP
}

// Stage Progress
model StageProgress {
  id                  String      @id @default(cuid())
  stage               ProjectStage
  status              StageStatus @default(PENDING)
  startedAt           DateTime?
  completedAt         DateTime?
  estimatedCompletion DateTime?
  notes               String?

  // Relations
  projectId           String
  project             Project     @relation(fields: [projectId], references: [id], onDelete: Cascade)
  tasks               Task[]
  blockers            Blocker[]

  @@unique([projectId, stage])
}

enum StageStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  BLOCKED
}

// Task
model Task {
  id            String    @id @default(cuid())
  description   String
  completed     Boolean   @default(false)
  required      Boolean   @default(true)
  order         Int       @default(0)
  completedAt   DateTime?
  completedBy   String?
  dueDate       DateTime?
  notes         String?

  // Relations
  stageProgressId String
  stageProgress   StageProgress @relation(fields: [stageProgressId], references: [id], onDelete: Cascade)
}

// Blocker
model Blocker {
  id            String        @id @default(cuid())
  description   String
  category      BlockerCategory
  impact        BlockerImpact @default(MEDIUM)
  createdAt     DateTime      @default(now())
  createdBy     String
  resolvedAt    DateTime?
  resolvedBy    String?
  resolution    String?

  // Relations
  stageProgressId String
  stageProgress   StageProgress @relation(fields: [stageProgressId], references: [id], onDelete: Cascade)
}

enum BlockerCategory {
  PERMIT
  WEATHER
  CUSTOMER
  EQUIPMENT
  SCHEDULING
  OTHER
}

enum BlockerImpact {
  LOW
  MEDIUM
  HIGH
}

// Activity Log
model ActivityLog {
  id            String    @id @default(cuid())
  action        String
  resource      String
  resourceId    String
  details       Json?
  timestamp     DateTime  @default(now())

  // Relations
  userId        String?
  user          User?     @relation(fields: [userId], references: [id])
  projectId     String?
  project       Project?  @relation(fields: [projectId], references: [id])
}

// Email Log
model EmailLog {
  id            String      @id @default(cuid())
  template      String
  subject       String
  recipientEmail String
  status        EmailStatus @default(PENDING)
  sentAt        DateTime?
  error         String?

  // Relations
  projectId     String
  project       Project     @relation(fields: [projectId], references: [id])
  sentById      String?
  sentBy        User?       @relation(fields: [sentById], references: [id])
}

enum EmailStatus {
  PENDING
  SENT
  FAILED
  BOUNCED
}
```

### 9.3 Data Migration

Migrate from mock data to real database.

**Tasks**:
- [ ] Create migration scripts
- [ ] Seed initial data (admin users, sample projects)
- [ ] Test data integrity
- [ ] Backup strategy

**Seeding Script**:
```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  await prisma.user.upsert({
    where: { email: 'admin@lightcurve.com' },
    update: {},
    create: {
      email: 'admin@lightcurve.com',
      passwordHash: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  console.log('Seed completed');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

### 9.4 Service Layer Updates

Replace mock data service with Prisma queries.

**Tasks**:
- [ ] Create database service layer
- [ ] Replace mock CRUD operations
- [ ] Add transaction support
- [ ] Implement connection error handling
- [ ] Add query optimization (includes, selects)

**Service Layer Structure**:
```
/src/lib/db/
├── client.ts           # Prisma client instance
├── projects.ts         # Project queries
├── stages.ts           # Stage queries
├── users.ts            # User queries
└── index.ts            # Export all
```

**Example Service**:
```typescript
// src/lib/db/projects.ts
import { prisma } from './client';

export async function getProjectByTrackingCode(code: string) {
  return prisma.project.findUnique({
    where: { trackingCode: code },
    include: {
      customer: true,
      address: true,
      stages: {
        include: {
          tasks: { orderBy: { order: 'asc' } },
          blockers: true,
        },
      },
      projectManager: {
        select: { id: true, name: true, email: true },
      },
    },
  });
}

export async function updateStageStatus(
  projectId: string,
  stage: ProjectStage,
  status: StageStatus
) {
  return prisma.stageProgress.update({
    where: {
      projectId_stage: { projectId, stage },
    },
    data: {
      status,
      startedAt: status === 'IN_PROGRESS' ? new Date() : undefined,
      completedAt: status === 'COMPLETED' ? new Date() : undefined,
    },
  });
}
```

### 9.5 Billing System Integration

Connect to external billing system.

**Tasks**:
- [ ] Define billing system API interface
- [ ] Create webhook handlers for billing events
- [ ] Implement two-way sync
- [ ] Handle sync conflicts
- [ ] Add retry logic for failed syncs

**Integration Interface**:
```typescript
interface BillingSystemIntegration {
  // Outbound
  createBillingAccount(project: Project): Promise<string>;
  activateService(project: Project): Promise<void>;
  updateAccountStatus(billingId: string, status: string): Promise<void>;

  // Inbound (webhook handlers)
  handlePaymentReceived(payload: PaymentPayload): Promise<void>;
  handleAccountUpdated(payload: AccountPayload): Promise<void>;
}
```

**Webhook Endpoint**:
```typescript
// src/app/api/webhooks/billing/route.ts
export async function POST(request: Request) {
  const payload = await request.json();
  const signature = request.headers.get('x-billing-signature');

  // Verify webhook signature
  if (!verifySignature(payload, signature)) {
    return Response.json({ error: 'Invalid signature' }, { status: 401 });
  }

  // Process event
  switch (payload.event) {
    case 'payment.received':
      await handlePaymentReceived(payload);
      break;
    case 'account.updated':
      await handleAccountUpdated(payload);
      break;
  }

  return Response.json({ received: true });
}
```

### 9.6 Project Management Integration

Connect to external PM tools.

**Tasks**:
- [ ] Define PM system API interface
- [ ] Sync project creation
- [ ] Sync stage updates
- [ ] Import task updates
- [ ] Handle bidirectional sync

### 9.7 Data Backup & Recovery

Ensure data safety.

**Tasks**:
- [ ] Automated daily backups
- [ ] Point-in-time recovery capability
- [ ] Backup testing procedures
- [ ] Disaster recovery plan

## Verification Checklist

- [ ] Database connection works
- [ ] All CRUD operations functional
- [ ] Data migrated correctly
- [ ] Seeding works
- [ ] Backups configured
- [ ] Billing integration tested
- [ ] PM integration tested
- [ ] Performance acceptable with real data
- [ ] No N+1 query issues

## Technical Notes

### Connection Pooling

```typescript
// src/lib/db/client.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

### Query Optimization

Avoid N+1 queries with includes:
```typescript
// Bad - N+1 queries
const projects = await prisma.project.findMany();
for (const project of projects) {
  project.stages = await prisma.stageProgress.findMany({
    where: { projectId: project.id }
  });
}

// Good - single query with include
const projects = await prisma.project.findMany({
  include: { stages: true }
});
```

### Transactions

For multi-step operations:
```typescript
await prisma.$transaction(async (tx) => {
  // Create project
  const project = await tx.project.create({ data: projectData });

  // Create stages
  await tx.stageProgress.createMany({
    data: stages.map(s => ({ ...s, projectId: project.id }))
  });

  // Log activity
  await tx.activityLog.create({
    data: {
      action: 'PROJECT_CREATED',
      resource: 'project',
      resourceId: project.id,
    }
  });

  return project;
});
```

## Migration Strategy

1. **Prepare**: Ensure Phase 8 complete, all tests passing
2. **Setup**: Configure production database
3. **Migrate**: Run schema migrations
4. **Seed**: Create admin users
5. **Test**: Verify all features with real database
6. **Deploy**: Roll out to production
7. **Monitor**: Watch for issues

## Next Steps

With Phase 9 complete:
1. **Production Deployment** - Launch the application
2. **Monitoring Setup** - Configure alerts and dashboards
3. **User Training** - Train admin users
4. **Iterate** - Gather feedback and improve

---

*Phase 9 status: Pending (Future)*
