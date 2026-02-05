"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        classNames: {
          toast: "bg-white border-gray-200 shadow-lg",
          title: "text-gray-900 font-medium",
          description: "text-gray-600",
          actionButton: "bg-primary-600 text-white",
          cancelButton: "bg-gray-100 text-gray-700",
          success: "border-l-4 border-l-green-500",
          error: "border-l-4 border-l-red-500",
          warning: "border-l-4 border-l-amber-500",
          info: "border-l-4 border-l-blue-500",
        },
      }}
      richColors
      closeButton
    />
  );
}
