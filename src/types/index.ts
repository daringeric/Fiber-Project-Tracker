// ============================================
// Project Stage Enums
// ============================================

export enum ProjectStage {
  OUTSIDE_PLANT = "outside_plant",
  FIBER_DELIVERY = "fiber_delivery",
  NETWORK_SETUP = "network_setup",
  RELEASE_TO_BILLING = "release_to_billing",
  FOLLOW_UP = "follow_up",
}

export enum StageStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  BLOCKED = "blocked",
}

// ============================================
// Stage Configuration
// ============================================

export interface StageConfig {
  id: ProjectStage;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  defaultTasks: string[];
  order: number;
}

export const STAGE_CONFIGS: Record<ProjectStage, StageConfig> = {
  [ProjectStage.OUTSIDE_PLANT]: {
    id: ProjectStage.OUTSIDE_PLANT,
    name: "Outside Plant",
    shortName: "OSP",
    description: "Construction and infrastructure work to deliver fiber to your location",
    icon: "construction",
    defaultTasks: [
      "Permits obtained",
      "Route survey completed",
      "Trenching/boring complete",
      "Conduit installed",
      "Fiber cable placed",
    ],
    order: 1,
  },
  [ProjectStage.FIBER_DELIVERY]: {
    id: ProjectStage.FIBER_DELIVERY,
    name: "Fiber Delivery",
    shortName: "Delivery",
    description: "Physical fiber installation and connection to your premises",
    icon: "cable",
    defaultTasks: [
      "Fiber cable pulled to premises",
      "External termination complete",
      "Internal wiring installed",
      "Fiber tested and verified",
    ],
    order: 2,
  },
  [ProjectStage.NETWORK_SETUP]: {
    id: ProjectStage.NETWORK_SETUP,
    name: "Network Setup",
    shortName: "Setup",
    description: "Configuration and hardware installation at your location",
    icon: "router",
    defaultTasks: [
      "ONT installed and powered",
      "Router configured",
      "Network connectivity verified",
      "Speed test completed",
      "Customer equipment connected",
    ],
    order: 3,
  },
  [ProjectStage.RELEASE_TO_BILLING]: {
    id: ProjectStage.RELEASE_TO_BILLING,
    name: "Release to Billing",
    shortName: "Billing",
    description: "Service activation and account setup",
    icon: "receipt",
    defaultTasks: [
      "Service activated",
      "Billing account created",
      "Welcome packet sent",
      "Account portal access enabled",
    ],
    order: 4,
  },
  [ProjectStage.FOLLOW_UP]: {
    id: ProjectStage.FOLLOW_UP,
    name: "Follow-Up",
    shortName: "Follow-Up",
    description: "Ensuring your satisfaction and addressing any concerns",
    icon: "headset",
    defaultTasks: [
      "Satisfaction survey sent",
      "Follow-up call completed",
      "Any issues resolved",
      "Project closed",
    ],
    order: 5,
  },
};

// ============================================
// Task & Stage Progress
// ============================================

export interface Task {
  id: string;
  description: string;
  completed: boolean;
  completedAt?: Date;
  notes?: string;
}

export interface StageProgress {
  stage: ProjectStage;
  status: StageStatus;
  startedAt?: Date;
  completedAt?: Date;
  estimatedCompletion?: Date;
  notes?: string;
  tasks: Task[];
  blockers?: string[];
}

// ============================================
// Address
// ============================================

export interface Address {
  street: string;
  unit?: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
}

// ============================================
// Project
// ============================================

export interface Project {
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
  projectManagerEmail?: string;
  notes?: string;
  serviceType?: string;
  contractId?: string;
}

// ============================================
// Activity Log
// ============================================

export interface ActivityLog {
  id: string;
  projectId: string;
  timestamp: Date;
  type: "stage_change" | "task_update" | "note_added" | "status_change";
  description: string;
  previousValue?: string;
  newValue?: string;
  userId?: string;
  userName?: string;
}

// ============================================
// Admin User
// ============================================

export enum UserRole {
  ADMIN = "admin",
  PROJECT_MANAGER = "project_manager",
  VIEWER = "viewer",
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  lastLogin?: Date;
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================
// Email Types
// ============================================

export interface EmailNotification {
  id: string;
  projectId: string;
  type: "welcome" | "stage_update" | "completion" | "feedback_request";
  recipientEmail: string;
  subject: string;
  sentAt?: Date;
  status: "pending" | "sent" | "failed";
}

// ============================================
// Dashboard Stats
// ============================================

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  blockedProjects: number;
  projectsByStage: Record<ProjectStage, number>;
  recentActivity: ActivityLog[];
}

// ============================================
// Helper Functions
// ============================================

export function getStageOrder(stage: ProjectStage): number {
  return STAGE_CONFIGS[stage].order;
}

export function getNextStage(currentStage: ProjectStage): ProjectStage | null {
  const currentOrder = getStageOrder(currentStage);
  const stages = Object.values(ProjectStage);
  const nextStage = stages.find(
    (s) => STAGE_CONFIGS[s].order === currentOrder + 1
  );
  return nextStage || null;
}

export function getPreviousStage(currentStage: ProjectStage): ProjectStage | null {
  const currentOrder = getStageOrder(currentStage);
  const stages = Object.values(ProjectStage);
  const prevStage = stages.find(
    (s) => STAGE_CONFIGS[s].order === currentOrder - 1
  );
  return prevStage || null;
}

export function isStageComplete(
  project: Project,
  stage: ProjectStage
): boolean {
  const stageProgress = project.stages.find((s) => s.stage === stage);
  return stageProgress?.status === StageStatus.COMPLETED;
}

export function getOverallProgress(project: Project): number {
  const totalStages = Object.keys(ProjectStage).length;
  const completedStages = project.stages.filter(
    (s) => s.status === StageStatus.COMPLETED
  ).length;
  return Math.round((completedStages / totalStages) * 100);
}

export function formatTrackingCode(code: string): string {
  // Format: XXXX-XXXX-XXXX
  const cleaned = code.replace(/[^A-Z0-9]/gi, "").toUpperCase();
  return cleaned.match(/.{1,4}/g)?.join("-") || code;
}

export function generateTrackingCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 12; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return formatTrackingCode(code);
}
