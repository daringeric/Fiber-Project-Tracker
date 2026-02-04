# Phase 7: Authentication & Authorization

## Overview

**Goal**: Secure the admin portal with user authentication and implement role-based access control.

**Status**: ⬜ Pending

## Dependencies

| Dependency | Required | Description |
|------------|----------|-------------|
| **Phase 1** | ✅ Yes | Project foundation |
| **Phase 4** | ✅ Yes | Admin portal must exist to be secured |

### Optional Dependencies

| Dependency | Required | Description |
|------------|----------|-------------|
| Phase 5 | ⚠️ Optional | Stage management can have role-based restrictions |
| Phase 6 | ⚠️ Optional | Email history access can be role-restricted |

### Note: Can Run in Parallel with Phase 5-6

Phase 7 only requires Phase 4 to be complete. It can be developed alongside Phases 5 and 6, though some role-based restrictions for those features would be added later.

## What This Phase Enables

After completing Phase 7:
- **Phase 8**: Production polish (security audit, testing)
- Secure admin access
- User audit trails
- Multi-user support

## Deliverables

### 7.1 NextAuth.js Setup

Configure authentication framework.

**Tasks**:
- [ ] Install NextAuth.js
- [ ] Configure authentication providers
- [ ] Set up session management
- [ ] Create auth configuration file

**Installation**:
```bash
npm install next-auth @auth/prisma-adapter
```

**Files to Create**:
```
/src/app/api/auth/[...nextauth]/route.ts
/src/lib/auth.ts
/src/types/next-auth.d.ts
```

**Auth Configuration**:
```typescript
// src/lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Validate credentials against database
        // Return user object or null
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
  },
};
```

### 7.2 Admin Login Page

Create the login interface for administrators.

**Tasks**:
- [ ] Login form with email/password
- [ ] Form validation
- [ ] Error handling (invalid credentials)
- [ ] Remember me option
- [ ] Forgot password link (future)
- [ ] Loading states

**Login Page Design**:
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    [LIGHT CURVE LOGO]                       │
│                                                             │
│                    Admin Portal Login                       │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Email                                              │   │
│  │  ┌───────────────────────────────────────────────┐ │   │
│  │  │ admin@lightcurve.com                          │ │   │
│  │  └───────────────────────────────────────────────┘ │   │
│  │                                                     │   │
│  │  Password                                           │   │
│  │  ┌───────────────────────────────────────────────┐ │   │
│  │  │ ••••••••••••                                  │ │   │
│  │  └───────────────────────────────────────────────┘ │   │
│  │                                                     │   │
│  │  ☐ Remember me                  Forgot password?   │   │
│  │                                                     │   │
│  │  ┌───────────────────────────────────────────────┐ │   │
│  │  │              Sign In                          │ │   │
│  │  └───────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**File**: `/src/app/admin/login/page.tsx`

### 7.3 Protected Routes

Secure all admin routes with authentication.

**Tasks**:
- [ ] Create authentication middleware
- [ ] Protect all `/admin/*` routes
- [ ] Redirect unauthenticated users to login
- [ ] Preserve intended destination after login

**Middleware**:
```typescript
// src/middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/admin/login",
  },
});

export const config = {
  matcher: ["/admin/:path*"],
};
```

### 7.4 User Roles & Permissions

Implement role-based access control.

**Tasks**:
- [ ] Define user roles (Admin, Project Manager, Viewer)
- [ ] Create permission matrix
- [ ] Role checking utility functions
- [ ] UI elements hidden based on role

**Role Definitions**:
| Role | Description | Permissions |
|------|-------------|-------------|
| Admin | Full system access | All actions |
| Project Manager | Manage assigned projects | Edit projects, update stages |
| Viewer | Read-only access | View projects, view dashboard |

**Permission Matrix**:
| Action | Admin | Project Manager | Viewer |
|--------|-------|-----------------|--------|
| View Dashboard | ✓ | ✓ | ✓ |
| View Projects | ✓ | ✓ (assigned) | ✓ |
| Create Project | ✓ | ✓ | ✗ |
| Edit Project | ✓ | ✓ (assigned) | ✗ |
| Update Stage | ✓ | ✓ (assigned) | ✗ |
| Send Emails | ✓ | ✓ (assigned) | ✗ |
| Manage Users | ✓ | ✗ | ✗ |
| System Settings | ✓ | ✗ | ✗ |

**Permission Check**:
```typescript
function hasPermission(user: User, action: Permission): boolean {
  const rolePermissions = ROLE_PERMISSIONS[user.role];
  return rolePermissions.includes(action);
}

// Usage in component
{hasPermission(user, 'CREATE_PROJECT') && (
  <Button>Create Project</Button>
)}
```

### 7.5 Session Management

Handle user sessions securely.

**Tasks**:
- [ ] JWT token configuration
- [ ] Session expiration (24 hours default)
- [ ] Refresh token rotation
- [ ] Logout functionality
- [ ] Session display in header

**Session Info in Header**:
```
┌─────────────────────────────────────────────────────────────┐
│  [Logo]        Dashboard                      👤 Sarah M. ▼ │
│                                               ├────────────┤ │
│                                               │ Profile    │ │
│                                               │ Settings   │ │
│                                               │ ─────────  │ │
│                                               │ Sign Out   │ │
│                                               └────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 7.6 User Management (Basic)

Admin interface for managing users.

**Tasks**:
- [ ] Users list page
- [ ] Create new user form
- [ ] Edit user details
- [ ] Deactivate/reactivate user
- [ ] Password reset (admin-initiated)

**User Model**:
```typescript
interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
  assignedProjects?: string[];  // For Project Managers
}
```

**Files to Create**:
```
/src/app/admin/users/page.tsx
/src/app/admin/users/new/page.tsx
/src/app/admin/users/[id]/page.tsx
```

### 7.7 Customer Access (Tracking)

Ensure customer tracking remains accessible.

**Tasks**:
- [ ] Tracking pages remain public (no auth required)
- [ ] Rate limiting on tracking lookups
- [ ] Track code validation
- [ ] Optional: customer accounts (future)

**Rate Limiting**:
```typescript
// Prevent brute-force tracking code guessing
const rateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 10,                    // 10 attempts per window
});

// Applied to /api/track/[code] endpoint
```

### 7.8 Audit Logging

Track who did what and when.

**Tasks**:
- [ ] Log authentication events (login, logout, failed)
- [ ] Log data changes (project updates, stage changes)
- [ ] Store user ID with all changes
- [ ] Audit log viewer in admin (Admin role only)

**Audit Log Entry**:
```typescript
interface AuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId: string;
  changes?: Record<string, { old: any; new: any }>;
  ipAddress?: string;
}
```

## Verification Checklist

- [ ] Login page renders correctly
- [ ] Valid credentials allow access
- [ ] Invalid credentials show error
- [ ] Unauthenticated users redirected to login
- [ ] Session persists across page refreshes
- [ ] Logout clears session
- [ ] Role-based UI elements work
- [ ] Protected API routes reject unauthorized requests
- [ ] Tracking pages remain public
- [ ] Rate limiting prevents abuse

## Technical Notes

### Mock Users for Development

Until Phase 9 (database), use mock users:
```typescript
const MOCK_USERS = [
  {
    id: 'user_1',
    email: 'admin@lightcurve.com',
    password: 'admin123',  // Hashed in real implementation
    name: 'Admin User',
    role: 'admin',
  },
  {
    id: 'user_2',
    email: 'pm@lightcurve.com',
    password: 'pm123',
    name: 'Sarah Mitchell',
    role: 'project_manager',
  },
];
```

### Password Handling

**Never store plain text passwords!**
```typescript
import bcrypt from 'bcryptjs';

// Hash on registration
const hashedPassword = await bcrypt.hash(password, 12);

// Compare on login
const isValid = await bcrypt.compare(inputPassword, hashedPassword);
```

### JWT Configuration

```typescript
// In auth options
jwt: {
  maxAge: 24 * 60 * 60, // 24 hours
},
callbacks: {
  jwt: async ({ token, user }) => {
    if (user) {
      token.role = user.role;
      token.id = user.id;
    }
    return token;
  },
  session: async ({ session, token }) => {
    session.user.role = token.role;
    session.user.id = token.id;
    return session;
  },
},
```

## Connection to Other Phases

### Phase 5 (Stage Management)
Add role restrictions:
- Only assigned PM can update stages
- Only Admin can override blocked projects

### Phase 6 (Email Notifications)
Add role restrictions:
- Email history visible to assigned PM
- Only Admin can send custom emails

### Phase 8 (Polish)
Security audit:
- Penetration testing
- Security headers review
- CSRF protection verification

### Phase 9 (Database)
User storage:
```prisma
model User {
  id            String    @id
  email         String    @unique
  passwordHash  String
  name          String
  role          UserRole
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  lastLogin     DateTime?
  projects      Project[] @relation("AssignedTo")
  auditLogs     AuditLog[]
}
```

## Next Steps

With Phase 7 complete, proceed to:
1. **[Phase 8: Polish & Production](./PHASE-8-POLISH-PRODUCTION.md)** - Final preparation for deployment

---

*Phase 7 status: Pending*
