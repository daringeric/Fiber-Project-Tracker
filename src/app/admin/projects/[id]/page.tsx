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
} from "@/types";
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

  const projectId = params.id as string;

  useEffect(() => {
    const fetchProject = async () => {
      const data = await mockDataService.getProjectById(projectId);
      setProject(data);
      setIsLoading(false);
    };
    fetchProject();
  }, [projectId]);

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
              <CardTitle>Overall Progress</CardTitle>
              <CardDescription>
                Current stage: {STAGE_CONFIGS[project.currentStage].name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Progress</span>
                  <span className="font-bold text-navy-700">{overallProgress}%</span>
                </div>
                <Progress
                  value={overallProgress}
                  className="h-3"
                  indicatorClassName="bg-gradient-to-r from-success-500 to-accent-primary"
                />
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
              <Button className="w-full" variant="default">
                <Send className="w-4 h-4 mr-2" />
                Send Status Update Email
              </Button>
              <Button className="w-full" variant="outline">
                <Mail className="w-4 h-4 mr-2" />
                Contact Customer
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
