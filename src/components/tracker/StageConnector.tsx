"use client";

import { cn } from "@/lib/utils";
import { StageStatus } from "@/types";

interface StageConnectorProps {
  fromStatus: StageStatus;
  toStatus: StageStatus;
  orientation?: "horizontal" | "vertical";
}

export function StageConnector({
  fromStatus,
  toStatus,
  orientation = "horizontal",
}: StageConnectorProps) {
  const isCompleted = fromStatus === StageStatus.COMPLETED;
  const isInProgress =
    fromStatus === StageStatus.COMPLETED &&
    (toStatus === StageStatus.IN_PROGRESS || toStatus === StageStatus.BLOCKED);

  const getConnectorStyles = () => {
    if (isCompleted && toStatus === StageStatus.COMPLETED) {
      return "bg-success-500";
    }
    if (isInProgress) {
      return "bg-gradient-to-r from-success-500 to-gray-300";
    }
    return "bg-gray-200";
  };

  if (orientation === "vertical") {
    return (
      <div className="flex justify-center py-2">
        <div
          className={cn(
            "w-1 h-8 rounded-full transition-all duration-500",
            getConnectorStyles().replace("to-r", "to-b")
          )}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center px-1">
      <div
        className={cn(
          "h-1 w-full rounded-full transition-all duration-500",
          getConnectorStyles()
        )}
      />
    </div>
  );
}
