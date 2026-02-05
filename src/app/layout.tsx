import type { Metadata } from "next";
import "@/styles/globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Light Curve Fiber Tracker",
  description: "Track your fiber installation project from start to finish",
  keywords: ["fiber", "internet", "installation", "tracker", "project"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-md focus:outline-none"
        >
          Skip to main content
        </a>
        <SessionProvider>
          <main id="main-content">{children}</main>
        </SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
