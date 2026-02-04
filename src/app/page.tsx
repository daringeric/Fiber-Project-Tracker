"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  Wifi,
  Shield,
  Clock,
  ArrowRight,
  Construction,
  Cable,
  Router,
  Receipt,
  Headphones,
} from "lucide-react";

const STAGES = [
  {
    icon: Construction,
    title: "Outside Plant",
    description: "Infrastructure construction and fiber routing",
  },
  {
    icon: Cable,
    title: "Fiber Delivery",
    description: "Physical fiber installation to your location",
  },
  {
    icon: Router,
    title: "Network Setup",
    description: "Equipment configuration and testing",
  },
  {
    icon: Receipt,
    title: "Release to Billing",
    description: "Service activation and account setup",
  },
  {
    icon: Headphones,
    title: "Follow-Up",
    description: "Support and satisfaction assurance",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [trackingCode, setTrackingCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!trackingCode.trim()) {
      setError("Please enter your tracking code");
      return;
    }

    setIsLoading(true);

    // Normalize the tracking code
    const normalizedCode = trackingCode.replace(/[^A-Z0-9]/gi, "").toUpperCase();

    // Navigate to tracking page
    router.push(`/track/${normalizedCode}`);
  };

  const formatTrackingInput = (value: string) => {
    // Remove non-alphanumeric characters and uppercase
    const cleaned = value.replace(/[^A-Z0-9]/gi, "").toUpperCase();
    // Add dashes every 4 characters
    const formatted = cleaned.match(/.{1,4}/g)?.join("-") || cleaned;
    return formatted.slice(0, 14); // XXXX-XXXX-XXXX = 14 chars
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-navy-800 via-navy-700 to-navy-900 text-white py-20 md:py-32 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-accent-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-accent-primary/10 rounded-full blur-3xl" />
          </div>

          <div className="container relative px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Track Your{" "}
                <span className="text-accent-primary">Fiber Installation</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                Stay informed every step of the way. Enter your tracking code to see
                real-time updates on your fiber installation project.
              </p>

              {/* Tracking Code Input */}
              <Card className="max-w-md mx-auto bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Enter tracking code (e.g., FBRX-2K9M-HTPW)"
                        value={trackingCode}
                        onChange={(e) => setTrackingCode(formatTrackingInput(e.target.value))}
                        className="pl-10 h-12 bg-white text-gray-900 border-0 text-lg tracking-wider"
                      />
                    </div>
                    {error && (
                      <p className="text-error-500 text-sm text-left">{error}</p>
                    )}
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-accent-primary hover:bg-accent-primary/90 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        "Loading..."
                      ) : (
                        <>
                          Track My Project
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <p className="mt-4 text-sm text-gray-400">
                Your tracking code was sent to your email when your project began.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-navy-700 mb-4">
                Your Installation Journey
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We guide you through each phase of your fiber installation, keeping
                you informed from the first shovel to your first gigabit.
              </p>
            </div>

            {/* Timeline */}
            <div className="relative max-w-4xl mx-auto">
              {/* Connecting Line */}
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-success-500 via-accent-primary to-gray-300 -translate-y-1/2" />

              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {STAGES.map((stage, index) => {
                  const Icon = stage.icon;
                  return (
                    <div key={stage.title} className="relative">
                      <div className="flex flex-col items-center text-center">
                        <div
                          className={`
                            relative z-10 w-16 h-16 rounded-full flex items-center justify-center mb-4
                            ${index < 2 ? "bg-success-500 text-white" : ""}
                            ${index === 2 ? "bg-accent-primary text-white animate-pulse-glow" : ""}
                            ${index > 2 ? "bg-gray-200 text-gray-400" : ""}
                          `}
                        >
                          <Icon className="w-7 h-7" />
                        </div>
                        <h3 className="font-semibold text-navy-700 mb-1">
                          {stage.title}
                        </h3>
                        <p className="text-sm text-gray-500">{stage.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 bg-accent-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Clock className="w-6 h-6 text-accent-primary" />
                  </div>
                  <CardTitle className="text-navy-700">Real-Time Updates</CardTitle>
                  <CardDescription>
                    Get instant notifications when your project moves to a new stage
                    or tasks are completed.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 bg-accent-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Wifi className="w-6 h-6 text-accent-primary" />
                  </div>
                  <CardTitle className="text-navy-700">Complete Visibility</CardTitle>
                  <CardDescription>
                    See every task and milestone in your installation, from permits
                    to your speed test results.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 bg-accent-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-accent-primary" />
                  </div>
                  <CardTitle className="text-navy-700">Dedicated Support</CardTitle>
                  <CardDescription>
                    Have questions? Our team is ready to help at every step of your
                    installation journey.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-navy-700">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Have Questions About Your Installation?
            </h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              Our support team is here to help. Contact us anytime with questions
              about your fiber installation project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-accent-primary hover:bg-accent-primary/90">
                Contact Support
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                View FAQ
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
