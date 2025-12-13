// src/app/ClientLayout.tsx (Client Component)

'use client'; // This directive is crucial

import { SessionProvider } from 'next-auth/react';
import { usePathname } from 'next/navigation'; // Import usePathname
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');

  return (
    <SessionProvider>
      <div className="min-h-screen flex flex-col">
        {!isAdminPage && <Header />}
        <main className="flex-1">{children}</main>
        {!isAdminPage && <Footer />}
      </div>
    </SessionProvider>
  );
}