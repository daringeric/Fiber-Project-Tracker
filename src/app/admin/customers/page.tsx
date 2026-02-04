"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-700">Customers</h1>
        <p className="text-gray-500">Manage customer information</p>
      </div>

      <Card>
        <CardContent className="py-16 text-center">
          <Construction className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Coming Soon
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Customer management features will be available in a future update.
            This will include customer profiles, communication history, and more.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
