"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { mockDataService } from "@/lib/mock-data";
import { formatDate, formatAddress, formatPhone, cn } from "@/lib/utils";
import {
  Project,
  ProjectStage,
  StageStatus,
  STAGE_CONFIGS,
  getOverallProgress,
  getNextStage,
} from "@/types";
import {
  canAdvanceStage,
  getWeightedProgress,
  getProgressBreakdown,
  getStageSLAStatus,
  ENHANCED_STAGE_CONFIGS,
} from "@/lib/workflow";
import { emailTriggerService, getEmailLog, EmailLogEntry } from "@/lib/email";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  User,
  Calendar,
  Building,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Circle,
  Send,
  Clock,
  Save,
  ChevronRight,
  AlertCircle,
  TrendingUp,
  Timer,
} from "lucide-react";

const STAGE_ORDER: ProjectStage[] = [
  ProjectStage.OUTSIDE_PLANT,
  ProjectStage.FIBER_DELIVERY,
  ProjectStage.NETWORK_SETUP,
  ProjectStage.RELEASE_TO_BILLING,
  ProjectStage.FOLLOW_UP,
];

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailLog, setEmailLog] = useState<EmailLogEntry[]>([]);
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null);

  const projectId = params.id as string;

  useEffect(() => {
    const fetchProject = async () => {
      const data = await mockDataService.getProjectById(projectId);
      setProject(data);
      if (data) {
        setEmailLog(getEmailLog(data.id));
      }
      setIsLoading(false);
    };
    fetchProject();
  }, [projectId]);

  const handleSendEmail = async (type: "stage-update" | "welcome" | "completed") => {
    if (!project) return;
    setIsSendingEmail(true);
    setEmailSuccess(null);

    try {
      const result = await emailTriggerService.sendManualEmail(type, project);
      if (result.success) {
        setEmailSuccess(`${type} email sent successfully!`);
        setEmailLog(getEmailLog(project.id));
      }
    } catch (error) {
      console.error("Failed to send email:", error);
    }

    setIsSendingEmail(false);
    setTimeout(() => setEmailSuccess(null), 3000);
  };

  const handleAdvanceStage = async () => {
    if (!project) return;
    const nextStage = getNextStage(project.currentStage);
    if (!nextStage) return;

    setIsSaving(true);
    // Complete current stage and start next
    await mockDataService.updateStageStatus(project.id, project.currentStage, StageStatus.COMPLETED);
    const updated = await mockDataService.updateStageStatus(project.id, nextStage, StageStatus.IN_PROGRESS);
    if (updated) {
      setProject(updated);
      // Send stage update email
      await emailTriggerService.onStageChanged(updated, nextStage);
      setEmailLog(getEmailLog(updated.id));
    }
    setIsSaving(false);
  };

  const handleTaskToggle = async (
    stage: ProjectStage,
    taskId: string,
    completed: boolean
  ) => {
    if (!project) return;

    setIsSaving(true);
    const updated = await mockDataService.updateTask(
      project.id,
      stage,
      taskId,
      completed
    );
    if (updated) {
      setProject(updated);
    }
    setIsSaving(false);
  };

  const handleStageStatusChange = async (
    stage: ProjectStage,
    status: StageStatus
  ) => {
    if (!project) return;

    setIsSaving(true);
    const updated = await mockDataService.updateStageStatus(
      project.id,
      stage,
      status
    );
    if (updated) {
      setProject(updated);
    }
    setIsSaving(false);
  };

  const getStatusIcon = (status: StageStatus) => {
    switch (status) {
      case StageStatus.COMPLETED:
        return <CheckCircle2 className="w-5 h-5 text-success-500" />;
      case StageStatus.IN_PROGRESS:
        return <Loader2 className="w-5 h-5 text-accent-primary animate-spin" />;
      case StageStatus.BLOCKED:
        return <AlertTriangle className="w-5 h-5 text-error-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-300" />;
    }
  };

  const getStatusBadgeVariant = (status: StageStatus) => {
    switch (status) {
      case StageStatus.COMPLETED:
        return "completed";
      case StageStatus.IN_PROGRESS:
        return "inProgress";
      case StageStatus.BLOCKED:
        return "blocked";
      default:
        return "pending";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-accent-primary animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Project Not Found
        </h2>
        <p className="text-gray-500 mb-4">
          The project you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button asChild>
          <Link href="/admin/projects">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Link>
        </Button>
      </div>
    );
  }

  const overallProgress = getOverallProgress(project);
  const weightedProgress = getWeightedProgress(project);
  const progressBreakdown = getProgressBreakdown(project);
  const validation = canAdvanceStage(project);
  const nextStage = getNextStage(project.currentStage);
  const currentSLA = getStageSLAStatus(
    project.stages.find((s) => s.stage === project.currentStage)!,
    project.currentStage
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/projects">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-navy-700">
              {project.customerName}
            </h1>
            {isSaving && (
              <Badge variant="secondary" className="gap-1">
                <Loader2 className="w-3 h-3 animate-spin" />
                Saving...
              </Badge>
            )}
            {emailSuccess && (
              <Badge variant="completed" className="gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {emailSuccess}
              </Badge>
            )}
          </div>
          <p className="text-gray-500 font-mono">{project.trackingCode}</p>
        </div>
        <Button variant="outline" asChild>
          <Link
            href={`/track/${project.trackingCode.replace(/-/g, "")}`}
            target="_blank"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View as Customer
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overall Progress */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Overall Progress</CardTitle>
                  <CardDescription>
                    Current stage: {STAGE_CONFIGS[project.currentStage].name}
                  </CardDescription>
                </div>
                {nextStage && (
                  <Button
                    onClick={handleAdvanceStage}
                    disabled={!validation.canAdvance || isSaving}
                    className="gap-2"
                  >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                    Advance to {STAGE_CONFIGS[nextStage].shortName}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Weighted Progress</span>
                  <span className="font-bold text-navy-700">{weightedProgress}%</span>
                </div>
                <Progress
                  value={weightedProgress}
                  className="h-3"
                  indicatorClassName="bg-gradient-to-r from-wave-500 to-violetta-500"
                />
              </div>

              {/* Validation Status */}
              {!validation.canAdvance && validation.errors.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-amber-800 font-medium text-sm mb-2">
                    <AlertCircle className="w-4 h-4" />
                    Cannot advance stage
                  </div>
                  <ul className="text-sm text-amber-700 space-y-1">
                    {validation.errors.map((error, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-amber-500 rounded-full" />
                        {error.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* SLA Status */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Stage Duration</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {currentSLA.actualDays} / {currentSLA.targetDays} days
                  </span>
                  <Badge
                    variant={
                      currentSLA.status === "on_track"
                        ? "completed"
                        : currentSLA.status === "at_risk"
                        ? "pending"
                        : "blocked"
                    }
                  >
                    {currentSLA.status.replace("_", " ")}
                  </Badge>
                </div>
              </div>

              {/* Stage Progress Summary */}
              <div className="grid grid-cols-5 gap-2">
                {progressBreakdown.stages.map((stage) => (
                  <div
                    key={stage.stage}
                    className={cn(
                      "text-center p-2 rounded-lg text-xs",
                      stage.status === StageStatus.COMPLETED && "bg-wave-50 text-wave-700",
                      stage.status === StageStatus.IN_PROGRESS && "bg-navy-50 text-navy-700 ring-2 ring-navy-200",
                      stage.status === StageStatus.BLOCKED && "bg-violetta-50 text-violetta-700",
                      stage.status === StageStatus.PENDING && "bg-gray-50 text-gray-500"
                    )}
                  >
                    <div className="font-medium truncate">{STAGE_CONFIGS[stage.stage].shortName}</div>
                    <div className="text-xs opacity-75">{stage.completion}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Stage Management */}
          <Card>
            <CardHeader>
              <CardTitle>Stage Management</CardTitle>
              <CardDescription>
                Update stage status and manage tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {STAGE_ORDER.map((stage, index) => {
                  const stageProgress = project.stages.find(
                    (s) => s.stage === stage
                  );
                  const config = STAGE_CONFIGS[stage];
                  const status = stageProgress?.status || StageStatus.PENDING;
                  const tasks = stageProgress?.tasks || [];
                  const completedTasks = tasks.filter((t) => t.completed).length;

                  return (
                    <AccordionItem key={stage} value={stage}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-4 flex-1">
                          {getStatusIcon(status)}
                          <div className="flex-1 text-left">
                            <div className="font-semibold">{config.name}</div>
                            <div className="text-sm text-gray-500">
                              {tasks.length > 0
                                ? `${completedTasks}/${tasks.length} tasks`
                                : "No tasks yet"}
                            </div>
                          </div>
                          <Badge variant={getStatusBadgeVariant(status)}>
                            {status.replace("_", " ")}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-4 space-y-4">
                          {/* Status Controls */}
                          <div className="flex flex-wrap gap-2">
                            <span className="text-sm text-gray-500 mr-2">
                              Set status:
                            </span>
                            {[
                              StageStatus.PENDING,
                              StageStatus.IN_PROGRESS,
                              StageStatus.COMPLETED,
                              StageStatus.BLOCKED,
                            ].map((s) => (
                              <Button
                                key={s}
                                variant={status === s ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleStageStatusChange(stage, s)}
                                disabled={isSaving}
                              >
                                {s.replace("_", " ")}
                              </Button>
                            ))}
                          </div>

                          <Separator />

                          {/* Tasks */}
                          {tasks.length > 0 ? (
                            <div className="space-y-2">
                              {tasks.map((task) => (
                                <div
                                  key={task.id}
                                  className={cn(
                                    "flex items-center gap-3 p-3 rounded-lg",
                                    task.completed ? "bg-success-50" : "bg-gray-50"
                                  )}
                                >
                                  <Checkbox
                                    checked={task.completed}
                                    onCheckedChange={(checked) =>
                                      handleTaskToggle(
                                        stage,
                                        task.id,
                                        checked as boolean
                                      )
                                    }
                                    disabled={isSaving}
                                  />
                                  <span
                                    className={cn(
                                      "flex-1 text-sm",
                                      task.completed && "line-through text-gray-500"
                                    )}
                                  >
                                    {task.description}
                                  </span>
                                  {task.completedAt && (
                                    <span className="text-xs text-gray-400">
                                      {formatDate(task.completedAt)}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 text-center py-4">
                              No tasks defined for this stage
                            </p>
                          )}

                          {/* Timeline Info */}
                          {(stageProgress?.startedAt ||
                            stageProgress?.completedAt) && (
                            <>
                              <Separator />
                              <div className="flex flex-wrap gap-4 text-sm">
                                {stageProgress?.startedAt && (
                                  <div className="flex items-center gap-1 text-gray-600">
                                    <Clock className="w-4 h-4" />
                                    Started: {formatDate(stageProgress.startedAt)}
                                  </div>
                                )}
                                {stageProgress?.completedAt && (
                                  <div className="flex items-center gap-1 text-success-600">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Completed:{" "}
                                    {formatDate(stageProgress.completedAt)}
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="font-medium">{project.customerName}</p>
                  {project.companyName && (
                    <p className="text-sm text-gray-600">{project.companyName}</p>
                  )}
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium whitespace-pre-line">
                    {formatAddress(project.address)}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <a
                    href={`mailto:${project.customerEmail}`}
                    className="font-medium text-accent-primary hover:underline"
                  >
                    {project.customerEmail}
                  </a>
                </div>
              </div>

              {project.customerPhone && (
                <>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <a
                        href={`tel:${project.customerPhone}`}
                        className="font-medium text-accent-primary hover:underline"
                      >
                        {formatPhone(project.customerPhone)}
                      </a>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Project Info */}
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {project.serviceType && (
                <div className="flex items-start gap-3">
                  <Building className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Service Type</p>
                    <p className="font-medium">{project.serviceType}</p>
                  </div>
                </div>
              )}

              <Separator />

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="font-medium">{formatDate(project.createdAt)}</p>
                </div>
              </div>

              {project.estimatedCompletion && (
                <>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-accent-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Est. Completion</p>
                      <p className="font-medium text-accent-primary">
                        {formatDate(project.estimatedCompletion)}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {project.projectManager && (
                <>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Project Manager</p>
                      <p className="font-medium">{project.projectManager}</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full"
                variant="default"
                onClick={() => handleSendEmail("stage-update")}
                disabled={isSendingEmail}
              >
                {isSendingEmail ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Send Status Update
              </Button>
              <Button
                className="w-full"
                variant="outline"
                asChild
              >
                <a href={`mailto:${project.customerEmail}`}>
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Customer
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Email History */}
          <Card>
            <CardHeader>
              <CardTitle>Email History</CardTitle>
              <CardDescription>
                Recent notifications sent
              </CardDescription>
            </CardHeader>
            <CardContent>
              {emailLog.length > 0 ? (
                <div className="space-y-3">
                  {emailLog.slice(0, 5).map((email) => (
                    <div
                      key={email.id}
                      className="flex items-start gap-3 text-sm"
                    >
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full mt-1.5",
                          email.status === "sent" && "bg-wave-500",
                          email.status === "failed" && "bg-violetta-500",
                          email.status === "pending" && "bg-amber-500"
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium capitalize">
                          {email.template.replace("-", " ")}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {formatDate(email.sentAt)}
                        </p>
                      </div>
                      <Badge
                        variant={
                          email.status === "sent"
                            ? "completed"
                            : email.status === "failed"
                            ? "blocked"
                            : "pending"
                        }
                        className="text-xs"
                      >
                        {email.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No emails sent yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
