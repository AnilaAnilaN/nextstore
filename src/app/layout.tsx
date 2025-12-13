// src/app/layout.tsx (Server Component)

import type { Metadata } from 'next';
import './globals.css';
import ClientLayout from './ClientLayout'; // Import the new client wrapper

export const metadata: Metadata = { // Keep metadata here
  title: 'Shoppers - E-Commerce Store',
  description: 'Find your perfect shoes and clothing',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Call the new client component wrapper */}
        <ClientLayout>{children}</ClientLayout> 
      </body>
    </html>
  );
}