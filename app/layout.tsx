import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Œuvres & Arts - Poésies, Chansons, Articles & Plus',
  description: 'Découvrez mes créations artistiques et scientifiques : poésies, chansons, articles, vidéos et photographies.',
  keywords: 'poésie, chanson, article scientifique, vidéo, galerie photo, œuvres artistiques',
  authors: [{ name: 'Auteur' }],
  openGraph: {
    title: 'Œuvres & Arts',
    description: 'Créations artistiques et scientifiques',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ErrorBoundary>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
