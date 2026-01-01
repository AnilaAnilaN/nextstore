// src/app/layout.tsx (Server Component)

import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./ClientLayout"; // Import the new client wrapper
import { mukta } from "../components/fonts";

export const metadata: Metadata = {
  // Keep metadata here
  title: "StarStore - E-Commerce Store",
  description: "Find your perfect shoes and clothing",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${mukta.className} font-light leading-relaxed text-gray-600`}>
        {/* Call the new client component wrapper */}
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
