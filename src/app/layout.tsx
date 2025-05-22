import type { Metadata } from 'next';
import { Geist } from 'next/font/google'; // Geist_Mono removed as not explicitly requested
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'DayScribe - Your Daily Task Manager',
  description: 'Organize your day with DayScribe and get intelligent task suggestions.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark"> {/* Enforce dark theme */}
      <body className={`${geistSans.variable} antialiased bg-background text-foreground`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
