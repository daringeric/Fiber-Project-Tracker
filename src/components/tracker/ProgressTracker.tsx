"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Project, ProjectStage, StageStatus, STAGE_CONFIGS, getOverallProgress } from "@/types";
import { StageIndicator } from "./StageIndicator";
import { StageConnector } from "./StageConnector";
import { StageCard } from "./StageCard";
import { Progress } from "@/components/ui/progress";

interface ProgressTrackerProps {
  project: Project;
  className?: string;
}

const STAGE_ORDER: ProjectStage[] = [
  ProjectStage.OUTSIDE_PLANT,
  ProjectStage.FIBER_DELIVERY,
  ProjectStage.NETWORK_SETUP,
  ProjectStage.RELEASE_TO_BILLING,
  ProjectStage.FOLLOW_UP,
];

export function ProgressTracker({ project, className }: ProgressTrackerProps) {
  const [selectedStage, setSelectedStage] = useState<ProjectStage>(project.currentStage);

  const getStageProgress = (stage: ProjectStage) => {
    return project.stages.find((s) => s.stage === stage);
  };

  const overallProgress = getOverallProgress(project);

  return (
    <div className={cn("space-y-8", className)}>
      {/* Overall Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-sm font-bold text-navy-700">{overallProgress}%</span>
        </div>
        <Progress
          value={overallProgress}
          className="h-2"
          indicatorClassName="bg-gradient-to-r from-success-500 to-accent-primary"
        />
      </div>

      {/* Desktop: Horizontal Tracker */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between">
          {STAGE_ORDER.map((stage, index) => {
            const stageProgress = getStageProgress(stage);
            const isActive = stage === project.currentStage;
            const nextStageProgress = STAGE_ORDER[index + 1]
              ? getStageProgress(STAGE_ORDER[index + 1])
              : null;

            return (
              <div key={stage} className="flex items-center flex-1 last:flex-initial">
                {/* Stage Column */}
                <div className="flex flex-col items-center">
                  <StageIndicator
                    stage={stage}
                    status={stageProgress?.status || StageStatus.PENDING}
                    isActive={isActive}
                    onClick={() => setSelectedStage(stage)}
                    size="lg"
                  />
                  <span
                    className={cn(
                      "mt-3 text-xs font-medium text-center max-w-[80px]",
                      isActive ? "text-accent-primary" : "text-gray-500"
                    )}
                  >
                    {STAGE_CONFIGS[stage].shortName}
                  </span>
                </div>

                {/* Connector */}
                {index < STAGE_ORDER.length - 1 && (
                  <StageConnector
                    fromStatus={stageProgress?.status || StageStatus.PENDING}
                    toStatus={nextStageProgress?.status || StageStatus.PENDING}
                    orientation="horizontal"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile: Vertical Tracker */}
      <div className="md:hidden space-y-4">
        {STAGE_ORDER.map((stage, index) => {
          const stageProgress = getStageProgress(stage);
          const isActive = stage === project.currentStage;
          const nextStageProgress = STAGE_ORDER[index + 1]
            ? getStageProgress(STAGE_ORDER[index + 1])
            : null;

          return (
            <div key={stage}>
              <button
                onClick={() => setSelectedStage(stage)}
                className={cn(
                  "flex items-center gap-4 w-full p-3 rounded-lg transition-colors",
                  selectedStage === stage
                    ? "bg-navy-50"
                    : "hover:bg-gray-50"
                )}
              >
                <StageIndicator
                  stage={stage}
                  status={stageProgress?.status || StageStatus.PENDING}
                  isActive={isActive}
                  size="md"
                />
                <div className="text-left">
                  <div
                    className={cn(
                      "font-medium",
                      isActive ? "text-accent-primary" : "text-gray-700"
                    )}
                  >
                    {STAGE_CONFIGS[stage].name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {stageProgress?.status === StageStatus.COMPLETED
                      ? "Completed"
                      : stageProgress?.status === StageStatus.IN_PROGRESS
                      ? "In Progress"
                      : stageProgress?.status === StageStatus.BLOCKED
                      ? "Blocked"
                      : "Upcoming"}
                  </div>
                </div>
              </button>

              {/* Vertical Connector */}
              {index < STAGE_ORDER.length - 1 && (
                <div className="ml-7">
                  <StageConnector
                    fromStatus={stageProgress?.status || StageStatus.PENDING}
                    toStatus={nextStageProgress?.status || StageStatus.PENDING}
                    orientation="vertical"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Stage Details */}
      <StageCard
        stageProgress={getStageProgress(selectedStage)}
        stageConfig={STAGE_CONFIGS[selectedStage]}
        isCurrentStage={selectedStage === project.currentStage}
      />
    </div>
  );
}
