// ============================================
// Stage Workflow Validation Service
// ============================================

import { Project, ProjectStage, StageStatus, StageProgress, Task } from "@/types";
import {
  ValidationResult,
  ValidationError,
  ValidationWarning,
  ENHANCED_STAGE_CONFIGS,
  EnhancedTask,
  Blocker,
} from "./types";

/**
 * Validates whether a project can advance from its current stage to the next
 */
export function canAdvanceStage(
  project: Project,
  fromStage?: ProjectStage
): ValidationResult {
  const stage = fromStage || project.currentStage;
  const stageProgress = project.stages.find((s) => s.stage === stage);
  const config = ENHANCED_STAGE_CONFIGS[stage];

  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if (!stageProgress) {
    errors.push({
      code: "STAGE_NOT_FOUND",
      message: `Stage ${stage} not found in project`,
    });
    return { canAdvance: false, errors, warnings };
  }

  // Check if stage is already completed
  if (stageProgress.status === StageStatus.COMPLETED) {
    errors.push({
      code: "STAGE_ALREADY_COMPLETED",
      message: "This stage is already completed",
    });
    return { canAdvance: false, errors, warnings };
  }

  // Check if stage is blocked
  if (stageProgress.status === StageStatus.BLOCKED) {
    errors.push({
      code: "STAGE_BLOCKED",
      message: "Stage has active blockers that must be resolved",
    });
  }

  // Check required tasks
  const requiredTasks = stageProgress.tasks.filter((t, index) => {
    const template = config.tasks[index];
    return template?.required ?? true;
  });

  const incompleteTasks = requiredTasks.filter((t) => !t.completed);
  if (incompleteTasks.length > 0) {
    errors.push({
      code: "REQUIRED_TASKS_INCOMPLETE",
      message: `${incompleteTasks.length} required task(s) must be completed`,
      field: "tasks",
    });
  }

  // Check completion percentage
  const completedCount = stageProgress.tasks.filter((t) => t.completed).length;
  const totalCount = stageProgress.tasks.length;
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  if (completionPercentage < config.requiredCompletionPercentage) {
    errors.push({
      code: "COMPLETION_PERCENTAGE_LOW",
      message: `Stage requires ${config.requiredCompletionPercentage}% completion (currently ${Math.round(completionPercentage)}%)`,
      field: "completion",
    });
  }

  // Check for blockers (from blockers array if present)
  if (stageProgress.blockers && stageProgress.blockers.length > 0) {
    errors.push({
      code: "ACTIVE_BLOCKERS",
      message: `${stageProgress.blockers.length} active blocker(s) must be resolved`,
      field: "blockers",
    });
  }

  // Add warnings for non-critical issues
  if (completionPercentage < 100) {
    const optionalIncomplete = stageProgress.tasks.length - completedCount;
    if (optionalIncomplete > 0 && errors.length === 0) {
      warnings.push({
        code: "OPTIONAL_TASKS_INCOMPLETE",
        message: `${optionalIncomplete} optional task(s) are incomplete`,
        field: "tasks",
      });
    }
  }

  return {
    canAdvance: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates whether a specific task can be marked as complete
 */
export function canCompleteTask(
  project: Project,
  stage: ProjectStage,
  taskId: string,
  enhancedTasks?: EnhancedTask[]
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  const stageProgress = project.stages.find((s) => s.stage === stage);
  if (!stageProgress) {
    errors.push({
      code: "STAGE_NOT_FOUND",
      message: `Stage ${stage} not found`,
    });
    return { canAdvance: false, errors, warnings };
  }

  const task = stageProgress.tasks.find((t) => t.id === taskId);
  if (!task) {
    errors.push({
      code: "TASK_NOT_FOUND",
      message: `Task ${taskId} not found`,
    });
    return { canAdvance: false, errors, warnings };
  }

  // Check task dependencies if using enhanced tasks
  if (enhancedTasks) {
    const enhancedTask = enhancedTasks.find((t) => t.id === taskId);
    if (enhancedTask?.dependsOn && enhancedTask.dependsOn.length > 0) {
      const incompleteDeps = enhancedTask.dependsOn.filter((depId) => {
        const depTask = stageProgress.tasks.find((t) => t.id === depId);
        return depTask && !depTask.completed;
      });

      if (incompleteDeps.length > 0) {
        errors.push({
          code: "DEPENDENCIES_INCOMPLETE",
          message: `${incompleteDeps.length} dependent task(s) must be completed first`,
          field: "dependencies",
        });
      }
    }
  }

  return {
    canAdvance: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates whether a stage can be started
 */
export function canStartStage(
  project: Project,
  stage: ProjectStage
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  const config = ENHANCED_STAGE_CONFIGS[stage];
  const stageProgress = project.stages.find((s) => s.stage === stage);

  // Check if already started or completed
  if (stageProgress?.status === StageStatus.IN_PROGRESS) {
    errors.push({
      code: "STAGE_ALREADY_IN_PROGRESS",
      message: "This stage is already in progress",
    });
    return { canAdvance: false, errors, warnings };
  }

  if (stageProgress?.status === StageStatus.COMPLETED) {
    errors.push({
      code: "STAGE_ALREADY_COMPLETED",
      message: "This stage is already completed",
    });
    return { canAdvance: false, errors, warnings };
  }

  // Check required previous stages
  for (const requiredStage of config.requiredPreviousStages) {
    const prevStageProgress = project.stages.find((s) => s.stage === requiredStage);
    if (!prevStageProgress || prevStageProgress.status !== StageStatus.COMPLETED) {
      const prevConfig = ENHANCED_STAGE_CONFIGS[requiredStage];
      errors.push({
        code: "PREVIOUS_STAGE_INCOMPLETE",
        message: `${prevConfig.name} must be completed first`,
        field: requiredStage,
      });
    }
  }

  return {
    canAdvance: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Gets the overall validation status for a project
 */
export function getProjectValidationStatus(project: Project): {
  currentStageValid: boolean;
  canAdvance: boolean;
  validation: ValidationResult;
  nextStage: ProjectStage | null;
} {
  const validation = canAdvanceStage(project);
  const stages = Object.values(ProjectStage);
  const currentIndex = stages.indexOf(project.currentStage);
  const nextStage = currentIndex < stages.length - 1 ? stages[currentIndex + 1] : null;

  return {
    currentStageValid: validation.errors.length === 0,
    canAdvance: validation.canAdvance,
    validation,
    nextStage,
  };
}

/**
 * Validates a blocker can be added
 */
export function canAddBlocker(
  project: Project,
  stage: ProjectStage
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  const stageProgress = project.stages.find((s) => s.stage === stage);

  if (!stageProgress) {
    errors.push({
      code: "STAGE_NOT_FOUND",
      message: `Stage ${stage} not found`,
    });
    return { canAdvance: false, errors, warnings };
  }

  if (stageProgress.status === StageStatus.COMPLETED) {
    errors.push({
      code: "STAGE_COMPLETED",
      message: "Cannot add blocker to completed stage",
    });
    return { canAdvance: false, errors, warnings };
  }

  if (stageProgress.status === StageStatus.PENDING) {
    warnings.push({
      code: "STAGE_NOT_STARTED",
      message: "Adding blocker to a stage that hasn't started",
    });
  }

  return {
    canAdvance: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Calculate task completion percentage for a stage
 */
export function getStageCompletionPercentage(stageProgress: StageProgress): number {
  if (stageProgress.tasks.length === 0) return 0;
  const completed = stageProgress.tasks.filter((t) => t.completed).length;
  return Math.round((completed / stageProgress.tasks.length) * 100);
}

/**
 * Calculate required task completion percentage
 */
export function getRequiredTaskCompletionPercentage(
  stageProgress: StageProgress,
  stage: ProjectStage
): number {
  const config = ENHANCED_STAGE_CONFIGS[stage];
  const requiredTasks = stageProgress.tasks.filter((_, index) => {
    return config.tasks[index]?.required ?? true;
  });

  if (requiredTasks.length === 0) return 100;
  const completed = requiredTasks.filter((t) => t.completed).length;
  return Math.round((completed / requiredTasks.length) * 100);
}
