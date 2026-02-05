import type { Metadata } from "next";
import "@/styles/globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";

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
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
