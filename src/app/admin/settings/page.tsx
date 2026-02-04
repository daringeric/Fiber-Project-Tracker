"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-700">Settings</h1>
        <p className="text-gray-500">Configure application settings</p>
      </div>

      <Card>
        <CardContent className="py-16 text-center">
          <Construction className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Coming Soon
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Settings and configuration options will be available in a future update.
            This will include email templates, notification preferences, and user management.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
