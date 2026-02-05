# Fiber Project Tracker - API Documentation

## Overview

The Fiber Project Tracker API provides endpoints for managing fiber installation projects, authentication, and system health monitoring.

**Base URL**: `http://localhost:3000/api` (development)

---

## Authentication

### POST /api/auth/signin

Authenticate a user and create a session.

**Request Body**:
```json
{
  "email": "admin@lightcurve.com",
  "password": "admin123"
}
```

**Response**: Redirects to callback URL on success, or returns to login page with error.

### GET /api/auth/session

Get the current user session.

**Response (200 OK)**:
```json
{
  "user": {
    "id": "user_admin",
    "name": "Admin User",
    "email": "admin@lightcurve.com",
    "role": "admin"
  },
  "expires": "2025-02-06T12:00:00.000Z"
}
```

**Response (Unauthenticated)**:
```json
{}
```

### POST /api/auth/signout

Sign out the current user and destroy the session.

---

## System

### GET /api/health

Check system health status.

**Authentication**: Not required

**Response (200 OK)**:
```json
{
  "status": "healthy",
  "timestamp": "2025-02-05T12:00:00.000Z",
  "version": "1.0.0",
  "uptime": 3600,
  "environment": "development"
}
```

---

## Data Models

### Project

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique project identifier |
| trackingCode | string | Customer-facing tracking code (e.g., FBRX-2K9M-HTPW) |
| customerName | string | Customer's full name |
| customerEmail | string | Customer's email address |
| customerPhone | string | Customer's phone number |
| companyName | string? | Optional company name |
| address | Address | Installation address |
| currentStage | ProjectStage | Current project stage |
| stages | StageProgress[] | Array of all stage progress objects |
| createdAt | Date | Project creation timestamp |
| updatedAt | Date | Last update timestamp |
| estimatedCompletion | Date? | Estimated completion date |
| projectManager | string | Assigned project manager name |
| projectManagerEmail | string | Project manager email |
| serviceType | string | Type of fiber service |
| notes | string? | Optional project notes |

### Address

| Field | Type | Description |
|-------|------|-------------|
| street | string | Street address |
| unit | string? | Optional unit/suite number |
| city | string | City |
| state | string | State code (e.g., IL) |
| zipCode | string | ZIP code |

### StageProgress

| Field | Type | Description |
|-------|------|-------------|
| stage | ProjectStage | Stage identifier |
| status | StageStatus | Current status |
| startedAt | Date? | When stage started |
| completedAt | Date? | When stage completed |
| tasks | Task[] | Tasks for this stage |
| blockers | string[]? | Array of blocker descriptions |

### Task

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique task identifier |
| description | string | Task description |
| completed | boolean | Completion status |
| completedAt | Date? | Completion timestamp |

### Enums

**ProjectStage**:
- `OUTSIDE_PLANT` - Construction and infrastructure
- `FIBER_DELIVERY` - Physical fiber installation
- `NETWORK_SETUP` - Configuration and hardware
- `RELEASE_TO_BILLING` - Service activation
- `FOLLOW_UP` - Customer feedback and support

**StageStatus**:
- `PENDING` - Not yet started
- `IN_PROGRESS` - Currently active
- `COMPLETED` - Successfully finished
- `BLOCKED` - Waiting on external factor

---

## User Roles & Permissions

### Roles

| Role | Description |
|------|-------------|
| admin | Full system access |
| project_manager | Manage projects and send emails |
| viewer | Read-only dashboard access |

### Permissions by Role

| Permission | Admin | Project Manager | Viewer |
|------------|-------|-----------------|--------|
| VIEW_DASHBOARD | ✓ | ✓ | ✓ |
| VIEW_PROJECTS | ✓ | ✓ | ✓ |
| CREATE_PROJECT | ✓ | ✓ | - |
| EDIT_PROJECT | ✓ | ✓ | - |
| UPDATE_STAGE | ✓ | ✓ | - |
| SEND_EMAIL | ✓ | ✓ | - |
| MANAGE_USERS | ✓ | - | - |
| SYSTEM_SETTINGS | ✓ | - | - |

---

## Error Responses

All API errors follow a consistent format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "Additional context if applicable"
    }
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| UNAUTHORIZED | 401 | Authentication required |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| VALIDATION_ERROR | 400 | Invalid request data |
| INTERNAL_ERROR | 500 | Server error |

---

## Mock Data Service

In development mode, the application uses a mock data service that simulates API behavior with a 300ms delay.

### Available Methods

| Method | Description |
|--------|-------------|
| getProjects() | Get all projects |
| getProjectById(id) | Get project by ID |
| getProjectByTrackingCode(code) | Get project by tracking code |
| createProject(data) | Create a new project |
| updateProject(id, updates) | Update project details |
| updateStageStatus(projectId, stage, status) | Update stage status |
| updateTask(projectId, stage, taskId, completed) | Update task completion |
| getDashboardStats() | Get dashboard statistics |
| getActivityLogs(projectId?) | Get activity logs |

---

## Test Credentials

For development and testing:

| Email | Password | Role |
|-------|----------|------|
| admin@lightcurve.com | admin123 | Admin |
| pm@lightcurve.com | pm123 | Project Manager |
| viewer@lightcurve.com | viewer123 | Viewer |

---

## Sample Tracking Codes

| Code | Project State |
|------|---------------|
| FBRX-2K9M-HTPW | Fiber Delivery - In Progress |
| FBRX-7NQ3-LPVC | Outside Plant - In Progress |
| FBRX-4RTK-ZMNB | Network Setup - In Progress |
| FBRX-8YWS-JKLD | Follow-Up - Completed |
| FBRX-5PLQ-RVMX | Outside Plant - Blocked |

---

*Last Updated: February 2026*
