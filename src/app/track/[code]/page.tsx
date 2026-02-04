"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { ProgressTracker } from "@/components/tracker/ProgressTracker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { mockDataService } from "@/lib/mock-data";
import { formatAddress, formatPhone, formatDate } from "@/lib/utils";
import { Project, STAGE_CONFIGS, getOverallProgress } from "@/types";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  User,
  Calendar,
  Building,
  HelpCircle,
  RefreshCw,
  Loader2,
} from "lucide-react";

export default function TrackingPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const code = params.code as string;

  useEffect(() => {
    const fetchProject = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const foundProject = await mockDataService.getProjectByTrackingCode(code);
        if (foundProject) {
          setProject(foundProject);
        } else {
          setError("Project not found. Please check your tracking code and try again.");
        }
      } catch {
        setError("An error occurred. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (code) {
      fetchProject();
    }
  }, [code]);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const foundProject = await mockDataService.getProjectByTrackingCode(code);
      if (foundProject) {
        setProject(foundProject);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-accent-primary animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your project...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-gray-50 px-4">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="w-8 h-8 text-error-500" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Project Not Found
              </h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="space-y-3">
                <Button asChild className="w-full">
                  <Link href="/">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Try Again
                  </Link>
                </Button>
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // No Project Found
  if (!project) {
    return null;
  }

  const currentStageConfig = STAGE_CONFIGS[project.currentStage];
  const overallProgress = getOverallProgress(project);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* Hero Header */}
        <section className="bg-gradient-to-br from-navy-800 via-navy-700 to-navy-900 text-white py-12">
          <div className="container px-4 md:px-6">
            {/* Back Link */}
            <Link
              href="/"
              className="inline-flex items-center text-gray-300 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>

            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold">
                    Your Fiber Installation
                  </h1>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRefresh}
                    className="text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-gray-300">
                  Tracking Code:{" "}
                  <span className="font-mono font-semibold text-white">
                    {project.trackingCode}
                  </span>
                </p>
              </div>

              <div className="text-left md:text-right">
                <p className="text-sm text-gray-400 mb-1">Current Stage</p>
                <Badge
                  variant="info"
                  className="text-base px-4 py-1 bg-accent-primary/20 text-accent-secondary border border-accent-primary/30"
                >
                  {currentStageConfig.name}
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8 md:py-12">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Tracker */}
              <div className="lg:col-span-2">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-navy-700">
                      Project Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ProgressTracker project={project} />
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar - Project Details */}
              <div className="space-y-6">
                {/* Customer Info */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-navy-700">
                      Project Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Customer</p>
                        <p className="font-medium text-gray-900">
                          {project.customerName}
                        </p>
                        {project.companyName && (
                          <p className="text-sm text-gray-600">
                            {project.companyName}
                          </p>
                        )}
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Service Address</p>
                        <p className="font-medium text-gray-900 whitespace-pre-line">
                          {formatAddress(project.address)}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-gray-900">
                          {project.customerEmail}
                        </p>
                      </div>
                    </div>

                    {project.customerPhone && (
                      <>
                        <Separator />
                        <div className="flex items-start gap-3">
                          <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="font-medium text-gray-900">
                              {formatPhone(project.customerPhone)}
                            </p>
                          </div>
                        </div>
                      </>
                    )}

                    {project.serviceType && (
                      <>
                        <Separator />
                        <div className="flex items-start gap-3">
                          <Building className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-500">Service Type</p>
                            <p className="font-medium text-gray-900">
                              {project.serviceType}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Timeline Card */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-navy-700">
                      Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Project Started</p>
                        <p className="font-medium text-gray-900">
                          {formatDate(project.createdAt)}
                        </p>
                      </div>
                    </div>

                    {project.estimatedCompletion && overallProgress < 100 && (
                      <>
                        <Separator />
                        <div className="flex items-start gap-3">
                          <Calendar className="w-5 h-5 text-accent-primary mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-500">
                              Estimated Completion
                            </p>
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
                            <p className="text-sm text-gray-500">
                              Project Manager
                            </p>
                            <p className="font-medium text-gray-900">
                              {project.projectManager}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Help Card */}
                <Card className="bg-navy-50 border-navy-100">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-navy-700 mb-2">
                      Need Help?
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Have questions about your installation? Our team is here to
                      help.
                    </p>
                    <div className="space-y-2">
                      <Button className="w-full" variant="default">
                        Contact Support
                      </Button>
                      <Button className="w-full" variant="outline">
                        View FAQ
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
