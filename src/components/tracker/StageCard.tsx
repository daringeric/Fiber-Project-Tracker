"use client";

import { cn } from "@/lib/utils";
import { StageProgress, StageConfig, StageStatus } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate } from "@/lib/utils";
import {
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Circle,
} from "lucide-react";

interface StageCardProps {
  stageProgress?: StageProgress;
  stageConfig: StageConfig;
  isCurrentStage?: boolean;
  className?: string;
}

export function StageCard({
  stageProgress,
  stageConfig,
  isCurrentStage = false,
  className,
}: StageCardProps) {
  const status = stageProgress?.status || StageStatus.PENDING;
  const tasks = stageProgress?.tasks || [];
  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;

  const getStatusBadge = () => {
    switch (status) {
      case StageStatus.COMPLETED:
        return (
          <Badge variant="completed" className="gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </Badge>
        );
      case StageStatus.IN_PROGRESS:
        return (
          <Badge variant="inProgress" className="gap-1">
            <Loader2 className="w-3 h-3 animate-spin" />
            In Progress
          </Badge>
        );
      case StageStatus.BLOCKED:
        return (
          <Badge variant="blocked" className="gap-1">
            <AlertTriangle className="w-3 h-3" />
            Blocked
          </Badge>
        );
      default:
        return (
          <Badge variant="pending" className="gap-1">
            <Circle className="w-3 h-3" />
            Upcoming
          </Badge>
        );
    }
  };

  const getCardBorderStyle = () => {
    if (status === StageStatus.IN_PROGRESS && isCurrentStage) {
      return "border-accent-primary border-2 shadow-lg shadow-accent-primary/10";
    }
    if (status === StageStatus.COMPLETED) {
      return "border-success-200";
    }
    if (status === StageStatus.BLOCKED) {
      return "border-error-200";
    }
    return "border-gray-200";
  };

  return (
    <Card className={cn("transition-all duration-300", getCardBorderStyle(), className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl text-navy-700 mb-1">
              {stageConfig.name}
            </CardTitle>
            <p className="text-sm text-gray-500">{stageConfig.description}</p>
          </div>
          {getStatusBadge()}
        </div>

        {/* Timeline Info */}
        {(stageProgress?.startedAt || stageProgress?.completedAt || stageProgress?.estimatedCompletion) && (
          <div className="flex flex-wrap gap-4 mt-4 text-sm">
            {stageProgress?.startedAt && (
              <div className="flex items-center gap-1.5 text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Started: {formatDate(stageProgress.startedAt)}</span>
              </div>
            )}
            {stageProgress?.completedAt && (
              <div className="flex items-center gap-1.5 text-success-600">
                <CheckCircle2 className="w-4 h-4" />
                <span>Completed: {formatDate(stageProgress.completedAt)}</span>
              </div>
            )}
            {stageProgress?.estimatedCompletion &&
              status !== StageStatus.COMPLETED && (
                <div className="flex items-center gap-1.5 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Estimated: {formatDate(stageProgress.estimatedCompletion)}
                  </span>
                </div>
              )}
          </div>
        )}
      </CardHeader>

      <CardContent>
        {/* Blockers Alert */}
        {stageProgress?.blockers && stageProgress.blockers.length > 0 && (
          <div className="mb-4 p-3 bg-error-50 border border-error-200 rounded-lg">
            <div className="flex items-center gap-2 text-error-700 font-medium mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Current Blockers</span>
            </div>
            <ul className="space-y-1">
              {stageProgress.blockers.map((blocker, index) => (
                <li key={index} className="text-sm text-error-600 ml-6">
                  • {blocker}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Task Progress */}
        {tasks.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">
                Tasks
              </span>
              <span className="text-sm text-gray-500">
                {completedTasks} of {totalTasks} complete
              </span>
            </div>

            {/* Tasks List */}
            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg transition-colors",
                    task.completed ? "bg-success-50" : "bg-gray-50"
                  )}
                >
                  <Checkbox
                    checked={task.completed}
                    disabled
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <span
                      className={cn(
                        "text-sm",
                        task.completed
                          ? "text-success-700 line-through"
                          : "text-gray-700"
                      )}
                    >
                      {task.description}
                    </span>
                    {task.completedAt && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        Completed {formatDate(task.completedAt)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State for Pending Stages */}
        {tasks.length === 0 && status === StageStatus.PENDING && (
          <div className="text-center py-6 text-gray-400">
            <p>Tasks will appear when this stage begins</p>
          </div>
        )}

        {/* Notes */}
        {stageProgress?.notes && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Notes
            </span>
            <p className="text-sm text-gray-700 mt-1">{stageProgress.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
