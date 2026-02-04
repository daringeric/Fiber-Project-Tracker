// ============================================
// Enhanced Workflow Types for Phase 5
// ============================================

import { ProjectStage, StageStatus } from "@/types";

// ============================================
// Blocker Types
// ============================================

export type BlockerCategory =
  | "permit"
  | "weather"
  | "customer"
  | "equipment"
  | "scheduling"
  | "third_party"
  | "other";

export type BlockerImpact = "low" | "medium" | "high" | "critical";

export interface Blocker {
  id: string;
  projectId: string;
  stage: ProjectStage;
  category: BlockerCategory;
  description: string;
  impact: BlockerImpact;
  createdAt: Date;
  createdBy: string;
  resolvedAt?: Date;
  resolvedBy?: string;
  resolution?: string;
  estimatedResolution?: Date;
  daysBlocked: number;
}

export const BLOCKER_CATEGORIES: Record<BlockerCategory, { label: string; icon: string }> = {
  permit: { label: "Permit Issue", icon: "file-warning" },
  weather: { label: "Weather Delay", icon: "cloud-rain" },
  customer: { label: "Customer Issue", icon: "user-x" },
  equipment: { label: "Equipment Issue", icon: "wrench" },
  scheduling: { label: "Scheduling Conflict", icon: "calendar-x" },
  third_party: { label: "Third Party Delay", icon: "building" },
  other: { label: "Other", icon: "alert-circle" },
};

// ============================================
// Enhanced Task Types
// ============================================

export type TaskPriority = "low" | "medium" | "high" | "critical";

export interface EnhancedTask {
  id: string;
  description: string;
  completed: boolean;
  completedAt?: Date;
  completedBy?: string;
  required: boolean;
  priority: TaskPriority;
  dependsOn?: string[]; // Task IDs that must be completed first
  assignedTo?: string;
  assignedToName?: string;
  dueDate?: Date;
  notes?: string;
  attachments?: TaskAttachment[];
  estimatedDuration?: number; // in hours
  actualDuration?: number; // in hours
}

export interface TaskAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  uploadedAt: Date;
  uploadedBy: string;
}

export interface TaskTemplate {
  description: string;
  required: boolean;
  priority: TaskPriority;
  estimatedDuration?: number;
  dependsOn?: number[]; // Index of tasks in the array
}

// ============================================
// Enhanced Stage Configuration
// ============================================

export interface EnhancedStageConfig {
  id: ProjectStage;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  tasks: TaskTemplate[];
  requiredCompletionPercentage: number; // Minimum % to advance
  targetDuration: number; // Days
  autoNotifyOnStart: boolean;
  autoNotifyOnComplete: boolean;
  canSkip: boolean;
  requiredPreviousStages: ProjectStage[];
}

export const ENHANCED_STAGE_CONFIGS: Record<ProjectStage, EnhancedStageConfig> = {
  [ProjectStage.OUTSIDE_PLANT]: {
    id: ProjectStage.OUTSIDE_PLANT,
    name: "Outside Plant",
    shortName: "OSP",
    description: "Construction and infrastructure work to deliver fiber to your location",
    icon: "construction",
    tasks: [
      { description: "Permits obtained", required: true, priority: "critical", estimatedDuration: 24 },
      { description: "Route survey completed", required: true, priority: "high", estimatedDuration: 8 },
      { description: "Trenching/boring complete", required: true, priority: "high", estimatedDuration: 16, dependsOn: [0, 1] },
      { description: "Conduit installed", required: true, priority: "high", estimatedDuration: 8, dependsOn: [2] },
      { description: "Fiber cable placed", required: true, priority: "high", estimatedDuration: 8, dependsOn: [3] },
    ],
    requiredCompletionPercentage: 100,
    targetDuration: 14,
    autoNotifyOnStart: true,
    autoNotifyOnComplete: true,
    canSkip: false,
    requiredPreviousStages: [],
  },
  [ProjectStage.FIBER_DELIVERY]: {
    id: ProjectStage.FIBER_DELIVERY,
    name: "Fiber Delivery",
    shortName: "Delivery",
    description: "Physical fiber installation and connection to your premises",
    icon: "cable",
    tasks: [
      { description: "Fiber cable pulled to premises", required: true, priority: "high", estimatedDuration: 4 },
      { description: "External termination complete", required: true, priority: "high", estimatedDuration: 2, dependsOn: [0] },
      { description: "Internal wiring installed", required: true, priority: "medium", estimatedDuration: 4, dependsOn: [1] },
      { description: "Fiber tested and verified", required: true, priority: "critical", estimatedDuration: 2, dependsOn: [2] },
    ],
    requiredCompletionPercentage: 100,
    targetDuration: 7,
    autoNotifyOnStart: true,
    autoNotifyOnComplete: true,
    canSkip: false,
    requiredPreviousStages: [ProjectStage.OUTSIDE_PLANT],
  },
  [ProjectStage.NETWORK_SETUP]: {
    id: ProjectStage.NETWORK_SETUP,
    name: "Network Setup",
    shortName: "Setup",
    description: "Configuration and hardware installation at your location",
    icon: "router",
    tasks: [
      { description: "ONT installed and powered", required: true, priority: "high", estimatedDuration: 2 },
      { description: "Router configured", required: true, priority: "high", estimatedDuration: 1, dependsOn: [0] },
      { description: "Network connectivity verified", required: true, priority: "critical", estimatedDuration: 1, dependsOn: [1] },
      { description: "Speed test completed", required: true, priority: "critical", estimatedDuration: 1, dependsOn: [2] },
      { description: "Customer equipment connected", required: false, priority: "low", estimatedDuration: 1, dependsOn: [2] },
    ],
    requiredCompletionPercentage: 80,
    targetDuration: 3,
    autoNotifyOnStart: true,
    autoNotifyOnComplete: true,
    canSkip: false,
    requiredPreviousStages: [ProjectStage.FIBER_DELIVERY],
  },
  [ProjectStage.RELEASE_TO_BILLING]: {
    id: ProjectStage.RELEASE_TO_BILLING,
    name: "Release to Billing",
    shortName: "Billing",
    description: "Service activation and account setup",
    icon: "receipt",
    tasks: [
      { description: "Service activated", required: true, priority: "critical", estimatedDuration: 1 },
      { description: "Billing account created", required: true, priority: "high", estimatedDuration: 1, dependsOn: [0] },
      { description: "Welcome packet sent", required: false, priority: "medium", estimatedDuration: 1, dependsOn: [1] },
      { description: "Account portal access enabled", required: true, priority: "high", estimatedDuration: 1, dependsOn: [1] },
    ],
    requiredCompletionPercentage: 75,
    targetDuration: 2,
    autoNotifyOnStart: false,
    autoNotifyOnComplete: true,
    canSkip: false,
    requiredPreviousStages: [ProjectStage.NETWORK_SETUP],
  },
  [ProjectStage.FOLLOW_UP]: {
    id: ProjectStage.FOLLOW_UP,
    name: "Follow-Up",
    shortName: "Follow-Up",
    description: "Ensuring your satisfaction and addressing any concerns",
    icon: "headset",
    tasks: [
      { description: "Satisfaction survey sent", required: true, priority: "high", estimatedDuration: 1 },
      { description: "Follow-up call completed", required: true, priority: "high", estimatedDuration: 1, dependsOn: [0] },
      { description: "Any issues resolved", required: false, priority: "medium", estimatedDuration: 4 },
      { description: "Project closed", required: true, priority: "high", estimatedDuration: 1, dependsOn: [1] },
    ],
    requiredCompletionPercentage: 75,
    targetDuration: 7,
    autoNotifyOnStart: false,
    autoNotifyOnComplete: true,
    canSkip: false,
    requiredPreviousStages: [ProjectStage.RELEASE_TO_BILLING],
  },
};

// ============================================
// Workflow Validation Types
// ============================================

export interface ValidationResult {
  canAdvance: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  code: string;
  message: string;
  field?: string;
}

export interface ValidationWarning {
  code: string;
  message: string;
  field?: string;
}

// ============================================
// Stage Activity Log
// ============================================

export type StageAction =
  | "started"
  | "completed"
  | "blocked"
  | "unblocked"
  | "task_completed"
  | "task_uncompleted"
  | "blocker_added"
  | "blocker_resolved"
  | "note_added";

export interface StageActivityLog {
  id: string;
  projectId: string;
  stage: ProjectStage;
  action: StageAction;
  timestamp: Date;
  userId: string;
  userName?: string;
  details?: string;
  metadata?: Record<string, unknown>;
}

// ============================================
// SLA Tracking
// ============================================

export interface SLAStatus {
  stage: ProjectStage;
  targetDays: number;
  actualDays: number;
  status: "on_track" | "at_risk" | "overdue";
  percentageOfTarget: number;
}

export interface ProjectSLASummary {
  projectId: string;
  overallStatus: "on_track" | "at_risk" | "overdue";
  stages: SLAStatus[];
  projectedCompletionDate: Date;
  originalTargetDate: Date;
  daysAhead: number; // negative if behind
}
