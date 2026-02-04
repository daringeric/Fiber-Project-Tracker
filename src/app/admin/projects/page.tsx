"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { mockDataService } from "@/lib/mock-data";
import { formatDate, formatAddress, cn } from "@/lib/utils";
import { Project, ProjectStage, StageStatus, STAGE_CONFIGS, getOverallProgress } from "@/types";
import { Progress } from "@/components/ui/progress";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  ChevronRight,
  MapPin,
  Calendar,
} from "lucide-react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<ProjectStage | "all">("all");

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await mockDataService.getProjects();
      setProjects(data);
      setFilteredProjects(data);
      setIsLoading(false);
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    let filtered = [...projects];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.customerName.toLowerCase().includes(query) ||
          p.trackingCode.toLowerCase().includes(query) ||
          p.address.city.toLowerCase().includes(query)
      );
    }

    // Apply stage filter
    if (stageFilter !== "all") {
      filtered = filtered.filter((p) => p.currentStage === stageFilter);
    }

    setFilteredProjects(filtered);
  }, [searchQuery, stageFilter, projects]);

  const getStatusBadge = (project: Project) => {
    const currentStageProgress = project.stages.find(
      (s) => s.stage === project.currentStage
    );

    if (currentStageProgress?.status === StageStatus.BLOCKED) {
      return <Badge variant="blocked">Blocked</Badge>;
    }
    if (currentStageProgress?.status === StageStatus.IN_PROGRESS) {
      return <Badge variant="inProgress">In Progress</Badge>;
    }
    if (
      project.stages.every((s) => s.status === StageStatus.COMPLETED)
    ) {
      return <Badge variant="completed">Completed</Badge>;
    }
    return <Badge variant="pending">Pending</Badge>;
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-48" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-700">Projects</h1>
          <p className="text-gray-500">
            Manage all fiber installation projects
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/projects/new">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name, tracking code, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Stage Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={stageFilter}
                onChange={(e) =>
                  setStageFilter(e.target.value as ProjectStage | "all")
                }
                className="h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
              >
                <option value="all">All Stages</option>
                {Object.values(ProjectStage).map((stage) => (
                  <option key={stage} value={stage}>
                    {STAGE_CONFIGS[stage].name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects List */}
      <div className="space-y-4">
        {filteredProjects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No projects found</p>
              {searchQuery || stageFilter !== "all" ? (
                <Button
                  variant="link"
                  onClick={() => {
                    setSearchQuery("");
                    setStageFilter("all");
                  }}
                >
                  Clear filters
                </Button>
              ) : (
                <Button asChild className="mt-4">
                  <Link href="/admin/projects/new">Create your first project</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredProjects.map((project) => {
            const progress = getOverallProgress(project);
            const stageConfig = STAGE_CONFIGS[project.currentStage];

            return (
              <Card
                key={project.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Main Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="font-semibold text-navy-700 truncate">
                            {project.customerName}
                          </h3>
                          {project.companyName && (
                            <p className="text-sm text-gray-500">
                              {project.companyName}
                            </p>
                          )}
                        </div>
                        {getStatusBadge(project)}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                        <span className="font-mono">{project.trackingCode}</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {project.address.city}, {project.address.state}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(project.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Stage & Progress */}
                    <div className="lg:w-48 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                          {stageConfig.shortName}
                        </span>
                        <span className="font-medium text-navy-700">
                          {progress}%
                        </span>
                      </div>
                      <Progress
                        value={progress}
                        className="h-2"
                        indicatorClassName={cn(
                          progress === 100
                            ? "bg-success-500"
                            : "bg-accent-primary"
                        )}
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 lg:ml-4">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/track/${project.trackingCode.replace(/-/g, "")}`} target="_blank">
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/projects/${project.id}`}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/projects/${project.id}`}>
                          Manage
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Summary */}
      {filteredProjects.length > 0 && (
        <div className="text-sm text-gray-500 text-center">
          Showing {filteredProjects.length} of {projects.length} projects
        </div>
      )}
    </div>
  );
}
