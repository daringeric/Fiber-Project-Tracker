// ============================================
// Stage Workflow Engine
// ============================================

import {
  Project,
  ProjectStage,
  StageStatus,
  StageProgress,
  Task,
  getNextStage,
  getPreviousStage,
  STAGE_CONFIGS,
} from "@/types";
import {
  ValidationResult,
  StageActivityLog,
  StageAction,
  ENHANCED_STAGE_CONFIGS,
  SLAStatus,
  ProjectSLASummary,
  Blocker,
} from "./types";
import { canAdvanceStage, canStartStage, getStageCompletionPercentage } from "./validation";

// ============================================
// Stage Transition Functions
// ============================================

export interface StageTransitionResult {
  success: boolean;
  project: Project;
  previousStage: ProjectStage;
  newStage: ProjectStage;
  activityLog: StageActivityLog;
  errors?: string[];
}

/**
 * Advances a project to the next stage
 */
export function advanceToNextStage(
  project: Project,
  userId: string,
  userName?: string
): StageTransitionResult {
  const validation = canAdvanceStage(project);

  if (!validation.canAdvance) {
    return {
      success: false,
      project,
      previousStage: project.currentStage,
      newStage: project.currentStage,
      activityLog: createActivityLog(project.id, project.currentStage, "completed", userId, userName, "Advancement blocked"),
      errors: validation.errors.map((e) => e.message),
    };
  }

  const nextStage = getNextStage(project.currentStage);
  if (!nextStage) {
    return {
      success: false,
      project,
      previousStage: project.currentStage,
      newStage: project.currentStage,
      activityLog: createActivityLog(project.id, project.currentStage, "completed", userId, userName, "No next stage"),
      errors: ["This is the final stage"],
    };
  }

  const previousStage = project.currentStage;

  // Update current stage to completed
  const updatedStages = project.stages.map((s) => {
    if (s.stage === project.currentStage) {
      return {
        ...s,
        status: StageStatus.COMPLETED,
        completedAt: new Date(),
      };
    }
    if (s.stage === nextStage) {
      return {
        ...s,
        status: StageStatus.IN_PROGRESS,
        startedAt: new Date(),
      };
    }
    return s;
  });

  const updatedProject: Project = {
    ...project,
    currentStage: nextStage,
    stages: updatedStages,
    updatedAt: new Date(),
  };

  return {
    success: true,
    project: updatedProject,
    previousStage,
    newStage: nextStage,
    activityLog: createActivityLog(
      project.id,
      nextStage,
      "started",
      userId,
      userName,
      `Advanced from ${STAGE_CONFIGS[previousStage].name} to ${STAGE_CONFIGS[nextStage].name}`
    ),
  };
}

/**
 * Starts a specific stage (must be the current pending stage)
 */
export function startStage(
  project: Project,
  stage: ProjectStage,
  userId: string,
  userName?: string
): StageTransitionResult {
  const validation = canStartStage(project, stage);

  if (!validation.canAdvance) {
    return {
      success: false,
      project,
      previousStage: project.currentStage,
      newStage: project.currentStage,
      activityLog: createActivityLog(project.id, stage, "started", userId, userName, "Start blocked"),
      errors: validation.errors.map((e) => e.message),
    };
  }

  const updatedStages = project.stages.map((s) => {
    if (s.stage === stage) {
      return {
        ...s,
        status: StageStatus.IN_PROGRESS,
        startedAt: new Date(),
      };
    }
    return s;
  });

  const updatedProject: Project = {
    ...project,
    currentStage: stage,
    stages: updatedStages,
    updatedAt: new Date(),
  };

  return {
    success: true,
    project: updatedProject,
    previousStage: project.currentStage,
    newStage: stage,
    activityLog: createActivityLog(
      project.id,
      stage,
      "started",
      userId,
      userName,
      `Started ${STAGE_CONFIGS[stage].name}`
    ),
  };
}

/**
 * Marks a stage as blocked
 */
export function blockStage(
  project: Project,
  stage: ProjectStage,
  blockerDescription: string,
  userId: string,
  userName?: string
): { project: Project; activityLog: StageActivityLog } {
  const updatedStages = project.stages.map((s) => {
    if (s.stage === stage) {
      const currentBlockers = s.blockers || [];
      return {
        ...s,
        status: StageStatus.BLOCKED,
        blockers: [...currentBlockers, blockerDescription],
      };
    }
    return s;
  });

  const updatedProject: Project = {
    ...project,
    stages: updatedStages,
    updatedAt: new Date(),
  };

  return {
    project: updatedProject,
    activityLog: createActivityLog(
      project.id,
      stage,
      "blocked",
      userId,
      userName,
      blockerDescription
    ),
  };
}

/**
 * Removes a blocker and potentially unblocks the stage
 */
export function resolveBlocker(
  project: Project,
  stage: ProjectStage,
  blockerIndex: number,
  resolution: string,
  userId: string,
  userName?: string
): { project: Project; activityLog: StageActivityLog } {
  const updatedStages = project.stages.map((s) => {
    if (s.stage === stage) {
      const currentBlockers = s.blockers || [];
      const newBlockers = currentBlockers.filter((_, i) => i !== blockerIndex);
      return {
        ...s,
        status: newBlockers.length === 0 ? StageStatus.IN_PROGRESS : StageStatus.BLOCKED,
        blockers: newBlockers,
      };
    }
    return s;
  });

  const updatedProject: Project = {
    ...project,
    stages: updatedStages,
    updatedAt: new Date(),
  };

  const stageProgress = updatedProject.stages.find((s) => s.stage === stage);
  const action: StageAction = stageProgress?.blockers?.length === 0 ? "unblocked" : "blocker_resolved";

  return {
    project: updatedProject,
    activityLog: createActivityLog(
      project.id,
      stage,
      action,
      userId,
      userName,
      resolution
    ),
  };
}

// ============================================
// Task Management Functions
// ============================================

export interface TaskUpdateResult {
  success: boolean;
  project: Project;
  task: Task;
  activityLog: StageActivityLog;
  stageCompleted?: boolean;
}

/**
 * Updates a task's completion status
 */
export function updateTaskCompletion(
  project: Project,
  stage: ProjectStage,
  taskId: string,
  completed: boolean,
  userId: string,
  userName?: string
): TaskUpdateResult {
  let updatedTask: Task | undefined;
  let stageCompleted = false;

  const updatedStages = project.stages.map((s) => {
    if (s.stage === stage) {
      const updatedTasks = s.tasks.map((t) => {
        if (t.id === taskId) {
          updatedTask = {
            ...t,
            completed,
            completedAt: completed ? new Date() : undefined,
          };
          return updatedTask;
        }
        return t;
      });

      // Check if all tasks are complete
      const allComplete = updatedTasks.every((t) => t.completed);
      if (allComplete && s.status === StageStatus.IN_PROGRESS) {
        stageCompleted = true;
      }

      return {
        ...s,
        tasks: updatedTasks,
      };
    }
    return s;
  });

  if (!updatedTask) {
    return {
      success: false,
      project,
      task: { id: taskId, description: "", completed: false },
      activityLog: createActivityLog(project.id, stage, "task_completed", userId, userName, "Task not found"),
    };
  }

  const updatedProject: Project = {
    ...project,
    stages: updatedStages,
    updatedAt: new Date(),
  };

  return {
    success: true,
    project: updatedProject,
    task: updatedTask,
    activityLog: createActivityLog(
      project.id,
      stage,
      completed ? "task_completed" : "task_uncompleted",
      userId,
      userName,
      updatedTask.description
    ),
    stageCompleted,
  };
}

/**
 * Bulk update multiple tasks
 */
export function bulkUpdateTasks(
  project: Project,
  stage: ProjectStage,
  taskUpdates: { taskId: string; completed: boolean }[],
  userId: string,
  userName?: string
): { project: Project; activityLogs: StageActivityLog[] } {
  let currentProject = project;
  const activityLogs: StageActivityLog[] = [];

  for (const update of taskUpdates) {
    const result = updateTaskCompletion(
      currentProject,
      stage,
      update.taskId,
      update.completed,
      userId,
      userName
    );
    if (result.success) {
      currentProject = result.project;
      activityLogs.push(result.activityLog);
    }
  }

  return { project: currentProject, activityLogs };
}

/**
 * Mark all tasks in a stage as complete
 */
export function completeAllTasks(
  project: Project,
  stage: ProjectStage,
  userId: string,
  userName?: string
): { project: Project; activityLog: StageActivityLog } {
  const updatedStages = project.stages.map((s) => {
    if (s.stage === stage) {
      const updatedTasks = s.tasks.map((t) => ({
        ...t,
        completed: true,
        completedAt: t.completedAt || new Date(),
      }));
      return {
        ...s,
        tasks: updatedTasks,
      };
    }
    return s;
  });

  const updatedProject: Project = {
    ...project,
    stages: updatedStages,
    updatedAt: new Date(),
  };

  return {
    project: updatedProject,
    activityLog: createActivityLog(
      project.id,
      stage,
      "task_completed",
      userId,
      userName,
      "All tasks marked complete"
    ),
  };
}

// ============================================
// SLA Tracking Functions
// ============================================

/**
 * Calculate SLA status for a single stage
 */
export function getStageSLAStatus(
  stageProgress: StageProgress,
  stage: ProjectStage
): SLAStatus {
  const config = ENHANCED_STAGE_CONFIGS[stage];
  const targetDays = config.targetDuration;

  let actualDays = 0;
  if (stageProgress.startedAt) {
    const endDate = stageProgress.completedAt || new Date();
    actualDays = Math.ceil(
      (endDate.getTime() - stageProgress.startedAt.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  const percentageOfTarget = targetDays > 0 ? (actualDays / targetDays) * 100 : 0;

  let status: "on_track" | "at_risk" | "overdue" = "on_track";
  if (percentageOfTarget > 100) {
    status = "overdue";
  } else if (percentageOfTarget > 80) {
    status = "at_risk";
  }

  return {
    stage,
    targetDays,
    actualDays,
    status,
    percentageOfTarget: Math.round(percentageOfTarget),
  };
}

/**
 * Get full SLA summary for a project
 */
export function getProjectSLASummary(project: Project): ProjectSLASummary {
  const stages: SLAStatus[] = project.stages.map((sp) =>
    getStageSLAStatus(sp, sp.stage)
  );

  // Calculate overall status
  const hasOverdue = stages.some((s) => s.status === "overdue");
  const hasAtRisk = stages.some((s) => s.status === "at_risk");
  const overallStatus: "on_track" | "at_risk" | "overdue" = hasOverdue
    ? "overdue"
    : hasAtRisk
    ? "at_risk"
    : "on_track";

  // Calculate projected completion
  const totalTargetDays = stages.reduce((sum, s) => sum + s.targetDays, 0);
  const createdAt = new Date(project.createdAt);
  const originalTargetDate = new Date(createdAt);
  originalTargetDate.setDate(originalTargetDate.getDate() + totalTargetDays);

  // Project completion based on current progress
  const completedDays = stages
    .filter((s) => s.actualDays > 0)
    .reduce((sum, s) => sum + s.actualDays, 0);
  const remainingStages = stages.filter(
    (s) =>
      project.stages.find((sp) => sp.stage === s.stage)?.status !==
      StageStatus.COMPLETED
  );
  const remainingTargetDays = remainingStages.reduce((sum, s) => sum + s.targetDays, 0);

  const projectedCompletionDate = new Date();
  projectedCompletionDate.setDate(
    projectedCompletionDate.getDate() + remainingTargetDays
  );

  const daysAhead = Math.ceil(
    (originalTargetDate.getTime() - projectedCompletionDate.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return {
    projectId: project.id,
    overallStatus,
    stages,
    projectedCompletionDate,
    originalTargetDate,
    daysAhead,
  };
}

// ============================================
// Progress Calculation Functions
// ============================================

/**
 * Calculate weighted overall progress
 */
export function getWeightedProgress(project: Project): number {
  const stageWeights: Record<ProjectStage, number> = {
    [ProjectStage.OUTSIDE_PLANT]: 30,
    [ProjectStage.FIBER_DELIVERY]: 25,
    [ProjectStage.NETWORK_SETUP]: 20,
    [ProjectStage.RELEASE_TO_BILLING]: 15,
    [ProjectStage.FOLLOW_UP]: 10,
  };

  let totalProgress = 0;

  for (const stageProgress of project.stages) {
    const weight = stageWeights[stageProgress.stage];
    const completion = getStageCompletionPercentage(stageProgress);

    if (stageProgress.status === StageStatus.COMPLETED) {
      totalProgress += weight;
    } else if (stageProgress.status === StageStatus.IN_PROGRESS) {
      totalProgress += (weight * completion) / 100;
    }
  }

  return Math.round(totalProgress);
}

/**
 * Get detailed progress breakdown
 */
export function getProgressBreakdown(project: Project): {
  overall: number;
  stages: {
    stage: ProjectStage;
    name: string;
    status: StageStatus;
    completion: number;
    tasksComplete: number;
    tasksTotal: number;
  }[];
} {
  const stages = project.stages.map((sp) => ({
    stage: sp.stage,
    name: STAGE_CONFIGS[sp.stage].name,
    status: sp.status,
    completion: getStageCompletionPercentage(sp),
    tasksComplete: sp.tasks.filter((t) => t.completed).length,
    tasksTotal: sp.tasks.length,
  }));

  return {
    overall: getWeightedProgress(project),
    stages,
  };
}

// ============================================
// Helper Functions
// ============================================

function createActivityLog(
  projectId: string,
  stage: ProjectStage,
  action: StageAction,
  userId: string,
  userName?: string,
  details?: string
): StageActivityLog {
  return {
    id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    projectId,
    stage,
    action,
    timestamp: new Date(),
    userId,
    userName,
    details,
  };
}

/**
 * Check if project is complete (all stages done)
 */
export function isProjectComplete(project: Project): boolean {
  return project.stages.every((s) => s.status === StageStatus.COMPLETED);
}

/**
 * Get the first incomplete stage
 */
export function getFirstIncompleteStage(project: Project): ProjectStage | null {
  const stageOrder = Object.values(ProjectStage);
  for (const stage of stageOrder) {
    const stageProgress = project.stages.find((s) => s.stage === stage);
    if (stageProgress && stageProgress.status !== StageStatus.COMPLETED) {
      return stage;
    }
  }
  return null;
}
