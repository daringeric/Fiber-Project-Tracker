import {
  Project,
  ProjectStage,
  StageStatus,
  StageProgress,
  Task,
  ActivityLog,
  DashboardStats,
  generateTrackingCode,
} from "@/types";
import { generateId } from "./utils";

// ============================================
// Helper Functions
// ============================================

function createTask(description: string, completed: boolean): Task {
  return {
    id: generateId(),
    description,
    completed,
    completedAt: completed ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : undefined,
  };
}

function createStageProgress(
  stage: ProjectStage,
  status: StageStatus,
  tasks: { description: string; completed: boolean }[]
): StageProgress {
  const now = new Date();
  const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  let startedAt: Date | undefined;
  let completedAt: Date | undefined;

  if (status === StageStatus.COMPLETED) {
    startedAt = daysAgo(Math.floor(Math.random() * 14) + 7);
    completedAt = daysAgo(Math.floor(Math.random() * 7));
  } else if (status === StageStatus.IN_PROGRESS) {
    startedAt = daysAgo(Math.floor(Math.random() * 5) + 1);
  }

  return {
    stage,
    status,
    startedAt,
    completedAt,
    tasks: tasks.map((t) => createTask(t.description, t.completed)),
  };
}

// ============================================
// Mock Projects
// ============================================

export const MOCK_PROJECTS: Project[] = [
  // Project 1: In Progress - Fiber Delivery Stage
  {
    id: "proj_001",
    trackingCode: "FBRX-2K9M-HTPW",
    customerName: "John Anderson",
    customerEmail: "john.anderson@email.com",
    customerPhone: "(555) 123-4567",
    address: {
      street: "1234 Oak Street",
      city: "Springfield",
      state: "IL",
      zipCode: "62701",
    },
    currentStage: ProjectStage.FIBER_DELIVERY,
    stages: [
      createStageProgress(ProjectStage.OUTSIDE_PLANT, StageStatus.COMPLETED, [
        { description: "Permits obtained", completed: true },
        { description: "Route survey completed", completed: true },
        { description: "Trenching/boring complete", completed: true },
        { description: "Conduit installed", completed: true },
        { description: "Fiber cable placed", completed: true },
      ]),
      createStageProgress(ProjectStage.FIBER_DELIVERY, StageStatus.IN_PROGRESS, [
        { description: "Fiber cable pulled to premises", completed: true },
        { description: "External termination complete", completed: true },
        { description: "Internal wiring installed", completed: false },
        { description: "Fiber tested and verified", completed: false },
      ]),
      createStageProgress(ProjectStage.NETWORK_SETUP, StageStatus.PENDING, [
        { description: "ONT installed and powered", completed: false },
        { description: "Router configured", completed: false },
        { description: "Network connectivity verified", completed: false },
        { description: "Speed test completed", completed: false },
        { description: "Customer equipment connected", completed: false },
      ]),
      createStageProgress(ProjectStage.RELEASE_TO_BILLING, StageStatus.PENDING, [
        { description: "Service activated", completed: false },
        { description: "Billing account created", completed: false },
        { description: "Welcome packet sent", completed: false },
        { description: "Account portal access enabled", completed: false },
      ]),
      createStageProgress(ProjectStage.FOLLOW_UP, StageStatus.PENDING, [
        { description: "Satisfaction survey sent", completed: false },
        { description: "Follow-up call completed", completed: false },
        { description: "Any issues resolved", completed: false },
        { description: "Project closed", completed: false },
      ]),
    ],
    createdAt: new Date("2025-01-15"),
    updatedAt: new Date(),
    estimatedCompletion: new Date("2025-02-20"),
    projectManager: "Sarah Mitchell",
    projectManagerEmail: "sarah.mitchell@lightcurve.com",
    serviceType: "Business Fiber 1Gbps",
  },

  // Project 2: Early Stage - Outside Plant
  {
    id: "proj_002",
    trackingCode: "FBRX-7NQ3-LPVC",
    customerName: "Emily Watson",
    customerEmail: "emily.watson@email.com",
    customerPhone: "(555) 987-6543",
    companyName: "Watson & Associates",
    address: {
      street: "5678 Business Center Dr",
      unit: "Suite 200",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
    },
    currentStage: ProjectStage.OUTSIDE_PLANT,
    stages: [
      createStageProgress(ProjectStage.OUTSIDE_PLANT, StageStatus.IN_PROGRESS, [
        { description: "Permits obtained", completed: true },
        { description: "Route survey completed", completed: true },
        { description: "Trenching/boring complete", completed: false },
        { description: "Conduit installed", completed: false },
        { description: "Fiber cable placed", completed: false },
      ]),
      createStageProgress(ProjectStage.FIBER_DELIVERY, StageStatus.PENDING, [
        { description: "Fiber cable pulled to premises", completed: false },
        { description: "External termination complete", completed: false },
        { description: "Internal wiring installed", completed: false },
        { description: "Fiber tested and verified", completed: false },
      ]),
      createStageProgress(ProjectStage.NETWORK_SETUP, StageStatus.PENDING, [
        { description: "ONT installed and powered", completed: false },
        { description: "Router configured", completed: false },
        { description: "Network connectivity verified", completed: false },
        { description: "Speed test completed", completed: false },
        { description: "Customer equipment connected", completed: false },
      ]),
      createStageProgress(ProjectStage.RELEASE_TO_BILLING, StageStatus.PENDING, [
        { description: "Service activated", completed: false },
        { description: "Billing account created", completed: false },
        { description: "Welcome packet sent", completed: false },
        { description: "Account portal access enabled", completed: false },
      ]),
      createStageProgress(ProjectStage.FOLLOW_UP, StageStatus.PENDING, [
        { description: "Satisfaction survey sent", completed: false },
        { description: "Follow-up call completed", completed: false },
        { description: "Any issues resolved", completed: false },
        { description: "Project closed", completed: false },
      ]),
    ],
    createdAt: new Date("2025-01-28"),
    updatedAt: new Date(),
    estimatedCompletion: new Date("2025-03-15"),
    projectManager: "Michael Chen",
    projectManagerEmail: "michael.chen@lightcurve.com",
    serviceType: "Enterprise Fiber 10Gbps",
  },

  // Project 3: Network Setup Stage
  {
    id: "proj_003",
    trackingCode: "FBRX-4RTK-ZMNB",
    customerName: "Robert Martinez",
    customerEmail: "robert.martinez@email.com",
    customerPhone: "(555) 456-7890",
    address: {
      street: "910 Residential Lane",
      city: "Peoria",
      state: "IL",
      zipCode: "61602",
    },
    currentStage: ProjectStage.NETWORK_SETUP,
    stages: [
      createStageProgress(ProjectStage.OUTSIDE_PLANT, StageStatus.COMPLETED, [
        { description: "Permits obtained", completed: true },
        { description: "Route survey completed", completed: true },
        { description: "Trenching/boring complete", completed: true },
        { description: "Conduit installed", completed: true },
        { description: "Fiber cable placed", completed: true },
      ]),
      createStageProgress(ProjectStage.FIBER_DELIVERY, StageStatus.COMPLETED, [
        { description: "Fiber cable pulled to premises", completed: true },
        { description: "External termination complete", completed: true },
        { description: "Internal wiring installed", completed: true },
        { description: "Fiber tested and verified", completed: true },
      ]),
      createStageProgress(ProjectStage.NETWORK_SETUP, StageStatus.IN_PROGRESS, [
        { description: "ONT installed and powered", completed: true },
        { description: "Router configured", completed: true },
        { description: "Network connectivity verified", completed: false },
        { description: "Speed test completed", completed: false },
        { description: "Customer equipment connected", completed: false },
      ]),
      createStageProgress(ProjectStage.RELEASE_TO_BILLING, StageStatus.PENDING, [
        { description: "Service activated", completed: false },
        { description: "Billing account created", completed: false },
        { description: "Welcome packet sent", completed: false },
        { description: "Account portal access enabled", completed: false },
      ]),
      createStageProgress(ProjectStage.FOLLOW_UP, StageStatus.PENDING, [
        { description: "Satisfaction survey sent", completed: false },
        { description: "Follow-up call completed", completed: false },
        { description: "Any issues resolved", completed: false },
        { description: "Project closed", completed: false },
      ]),
    ],
    createdAt: new Date("2025-01-05"),
    updatedAt: new Date(),
    estimatedCompletion: new Date("2025-02-10"),
    projectManager: "Sarah Mitchell",
    projectManagerEmail: "sarah.mitchell@lightcurve.com",
    serviceType: "Residential Fiber 500Mbps",
  },

  // Project 4: Completed Project
  {
    id: "proj_004",
    trackingCode: "FBRX-8YWS-JKLD",
    customerName: "Amanda Thompson",
    customerEmail: "amanda.thompson@email.com",
    customerPhone: "(555) 234-5678",
    companyName: "Thompson Legal Services",
    address: {
      street: "2345 Professional Plaza",
      unit: "Floor 3",
      city: "Springfield",
      state: "IL",
      zipCode: "62702",
    },
    currentStage: ProjectStage.FOLLOW_UP,
    stages: [
      createStageProgress(ProjectStage.OUTSIDE_PLANT, StageStatus.COMPLETED, [
        { description: "Permits obtained", completed: true },
        { description: "Route survey completed", completed: true },
        { description: "Trenching/boring complete", completed: true },
        { description: "Conduit installed", completed: true },
        { description: "Fiber cable placed", completed: true },
      ]),
      createStageProgress(ProjectStage.FIBER_DELIVERY, StageStatus.COMPLETED, [
        { description: "Fiber cable pulled to premises", completed: true },
        { description: "External termination complete", completed: true },
        { description: "Internal wiring installed", completed: true },
        { description: "Fiber tested and verified", completed: true },
      ]),
      createStageProgress(ProjectStage.NETWORK_SETUP, StageStatus.COMPLETED, [
        { description: "ONT installed and powered", completed: true },
        { description: "Router configured", completed: true },
        { description: "Network connectivity verified", completed: true },
        { description: "Speed test completed", completed: true },
        { description: "Customer equipment connected", completed: true },
      ]),
      createStageProgress(ProjectStage.RELEASE_TO_BILLING, StageStatus.COMPLETED, [
        { description: "Service activated", completed: true },
        { description: "Billing account created", completed: true },
        { description: "Welcome packet sent", completed: true },
        { description: "Account portal access enabled", completed: true },
      ]),
      createStageProgress(ProjectStage.FOLLOW_UP, StageStatus.COMPLETED, [
        { description: "Satisfaction survey sent", completed: true },
        { description: "Follow-up call completed", completed: true },
        { description: "Any issues resolved", completed: true },
        { description: "Project closed", completed: true },
      ]),
    ],
    createdAt: new Date("2024-12-01"),
    updatedAt: new Date("2025-01-30"),
    projectManager: "Michael Chen",
    projectManagerEmail: "michael.chen@lightcurve.com",
    serviceType: "Business Fiber 2Gbps",
  },

  // Project 5: Blocked Project
  {
    id: "proj_005",
    trackingCode: "FBRX-5PLQ-RVMX",
    customerName: "David Kim",
    customerEmail: "david.kim@email.com",
    customerPhone: "(555) 345-6789",
    address: {
      street: "6789 Industrial Way",
      city: "Decatur",
      state: "IL",
      zipCode: "62521",
    },
    currentStage: ProjectStage.OUTSIDE_PLANT,
    stages: [
      {
        stage: ProjectStage.OUTSIDE_PLANT,
        status: StageStatus.BLOCKED,
        startedAt: new Date("2025-01-20"),
        tasks: [
          createTask("Permits obtained", true),
          createTask("Route survey completed", true),
          createTask("Trenching/boring complete", false),
          createTask("Conduit installed", false),
          createTask("Fiber cable placed", false),
        ],
        blockers: ["Waiting for city utility clearance", "Weather delay - ground frozen"],
      },
      createStageProgress(ProjectStage.FIBER_DELIVERY, StageStatus.PENDING, [
        { description: "Fiber cable pulled to premises", completed: false },
        { description: "External termination complete", completed: false },
        { description: "Internal wiring installed", completed: false },
        { description: "Fiber tested and verified", completed: false },
      ]),
      createStageProgress(ProjectStage.NETWORK_SETUP, StageStatus.PENDING, [
        { description: "ONT installed and powered", completed: false },
        { description: "Router configured", completed: false },
        { description: "Network connectivity verified", completed: false },
        { description: "Speed test completed", completed: false },
        { description: "Customer equipment connected", completed: false },
      ]),
      createStageProgress(ProjectStage.RELEASE_TO_BILLING, StageStatus.PENDING, [
        { description: "Service activated", completed: false },
        { description: "Billing account created", completed: false },
        { description: "Welcome packet sent", completed: false },
        { description: "Account portal access enabled", completed: false },
      ]),
      createStageProgress(ProjectStage.FOLLOW_UP, StageStatus.PENDING, [
        { description: "Satisfaction survey sent", completed: false },
        { description: "Follow-up call completed", completed: false },
        { description: "Any issues resolved", completed: false },
        { description: "Project closed", completed: false },
      ]),
    ],
    createdAt: new Date("2025-01-18"),
    updatedAt: new Date(),
    estimatedCompletion: new Date("2025-03-01"),
    projectManager: "Sarah Mitchell",
    projectManagerEmail: "sarah.mitchell@lightcurve.com",
    serviceType: "Business Fiber 1Gbps",
    notes: "Customer notified of delay. Revisit when weather improves.",
  },
];

// ============================================
// Mock Activity Logs
// ============================================

export const MOCK_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: "act_001",
    projectId: "proj_001",
    timestamp: new Date(),
    type: "task_update",
    description: "External termination completed",
    userName: "Tech Team A",
  },
  {
    id: "act_002",
    projectId: "proj_003",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    type: "task_update",
    description: "Router configured successfully",
    userName: "Tech Team B",
  },
  {
    id: "act_003",
    projectId: "proj_001",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    type: "stage_change",
    description: "Project moved to Fiber Delivery stage",
    previousValue: "Outside Plant",
    newValue: "Fiber Delivery",
    userName: "Sarah Mitchell",
  },
  {
    id: "act_004",
    projectId: "proj_005",
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
    type: "status_change",
    description: "Project blocked due to permit issues",
    previousValue: "In Progress",
    newValue: "Blocked",
    userName: "Sarah Mitchell",
  },
  {
    id: "act_005",
    projectId: "proj_004",
    timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000),
    type: "stage_change",
    description: "Project completed - moved to Follow-Up",
    previousValue: "Release to Billing",
    newValue: "Follow-Up",
    userName: "Michael Chen",
  },
];

// ============================================
// Dashboard Stats
// ============================================

export function getMockDashboardStats(): DashboardStats {
  const projects = MOCK_PROJECTS;

  const activeProjects = projects.filter(
    (p) =>
      p.stages.some((s) => s.status === StageStatus.IN_PROGRESS) &&
      !p.stages.some((s) => s.status === StageStatus.BLOCKED)
  ).length;

  const completedProjects = projects.filter((p) =>
    p.stages.every((s) => s.status === StageStatus.COMPLETED)
  ).length;

  const blockedProjects = projects.filter((p) =>
    p.stages.some((s) => s.status === StageStatus.BLOCKED)
  ).length;

  const projectsByStage = {
    [ProjectStage.OUTSIDE_PLANT]: projects.filter(
      (p) => p.currentStage === ProjectStage.OUTSIDE_PLANT
    ).length,
    [ProjectStage.FIBER_DELIVERY]: projects.filter(
      (p) => p.currentStage === ProjectStage.FIBER_DELIVERY
    ).length,
    [ProjectStage.NETWORK_SETUP]: projects.filter(
      (p) => p.currentStage === ProjectStage.NETWORK_SETUP
    ).length,
    [ProjectStage.RELEASE_TO_BILLING]: projects.filter(
      (p) => p.currentStage === ProjectStage.RELEASE_TO_BILLING
    ).length,
    [ProjectStage.FOLLOW_UP]: projects.filter(
      (p) => p.currentStage === ProjectStage.FOLLOW_UP
    ).length,
  };

  return {
    totalProjects: projects.length,
    activeProjects,
    completedProjects,
    blockedProjects,
    projectsByStage,
    recentActivity: MOCK_ACTIVITY_LOGS.slice(0, 5),
  };
}

// ============================================
// Mock Data Service
// ============================================

class MockDataService {
  private projects: Project[] = [...MOCK_PROJECTS];
  private activityLogs: ActivityLog[] = [...MOCK_ACTIVITY_LOGS];

  // Simulate network delay
  private async delay(ms: number = 300): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Get all projects
  async getProjects(): Promise<Project[]> {
    await this.delay();
    return [...this.projects];
  }

  // Get project by ID
  async getProjectById(id: string): Promise<Project | null> {
    await this.delay();
    return this.projects.find((p) => p.id === id) || null;
  }

  // Get project by tracking code
  async getProjectByTrackingCode(code: string): Promise<Project | null> {
    await this.delay();
    const normalizedCode = code.replace(/[^A-Z0-9]/gi, "").toUpperCase();
    return (
      this.projects.find(
        (p) => p.trackingCode.replace(/-/g, "") === normalizedCode
      ) || null
    );
  }

  // Create new project
  async createProject(
    data: Omit<Project, "id" | "trackingCode" | "createdAt" | "updatedAt" | "stages">
  ): Promise<Project> {
    await this.delay();

    const newProject: Project = {
      ...data,
      id: `proj_${generateId()}`,
      trackingCode: generateTrackingCode(),
      createdAt: new Date(),
      updatedAt: new Date(),
      currentStage: ProjectStage.OUTSIDE_PLANT,
      stages: Object.values(ProjectStage).map((stage) => ({
        stage,
        status: stage === ProjectStage.OUTSIDE_PLANT ? StageStatus.IN_PROGRESS : StageStatus.PENDING,
        tasks: [],
        startedAt: stage === ProjectStage.OUTSIDE_PLANT ? new Date() : undefined,
      })),
    };

    this.projects.push(newProject);
    return newProject;
  }

  // Update project
  async updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    await this.delay();
    const index = this.projects.findIndex((p) => p.id === id);
    if (index === -1) return null;

    this.projects[index] = {
      ...this.projects[index],
      ...updates,
      updatedAt: new Date(),
    };

    return this.projects[index];
  }

  // Update stage status
  async updateStageStatus(
    projectId: string,
    stage: ProjectStage,
    status: StageStatus
  ): Promise<Project | null> {
    await this.delay();
    const project = this.projects.find((p) => p.id === projectId);
    if (!project) return null;

    const stageIndex = project.stages.findIndex((s) => s.stage === stage);
    if (stageIndex === -1) return null;

    project.stages[stageIndex].status = status;
    if (status === StageStatus.IN_PROGRESS && !project.stages[stageIndex].startedAt) {
      project.stages[stageIndex].startedAt = new Date();
    }
    if (status === StageStatus.COMPLETED) {
      project.stages[stageIndex].completedAt = new Date();
    }

    project.updatedAt = new Date();
    return project;
  }

  // Update task
  async updateTask(
    projectId: string,
    stage: ProjectStage,
    taskId: string,
    completed: boolean
  ): Promise<Project | null> {
    await this.delay();
    const project = this.projects.find((p) => p.id === projectId);
    if (!project) return null;

    const stageProgress = project.stages.find((s) => s.stage === stage);
    if (!stageProgress) return null;

    const task = stageProgress.tasks.find((t) => t.id === taskId);
    if (!task) return null;

    task.completed = completed;
    task.completedAt = completed ? new Date() : undefined;

    project.updatedAt = new Date();
    return project;
  }

  // Get dashboard stats
  async getDashboardStats(): Promise<DashboardStats> {
    await this.delay();
    return getMockDashboardStats();
  }

  // Get activity logs
  async getActivityLogs(projectId?: string): Promise<ActivityLog[]> {
    await this.delay();
    if (projectId) {
      return this.activityLogs.filter((log) => log.projectId === projectId);
    }
    return [...this.activityLogs];
  }
}

// Export singleton instance
export const mockDataService = new MockDataService();
