import Link from 'next/link';
import { Metadata } from 'next';
import { BookOpen, Feather, Calendar, ArrowLeft } from 'lucide-react';
import { publicApi } from '@/lib/api';
import { Poesie } from '@/types';

interface PageProps {
  params: { chapitreNom: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { chapitreNom: rawChapitreNom } = await params;
  const chapitreNom = decodeURIComponent(rawChapitreNom);
  return {
    title: `${chapitreNom} - Poésies - Œuvres & Arts`,
    description: `Découvrez tous les poèmes du ${chapitreNom}`,
  };
}

export default async function ChapitreDetailPage({ params }: PageProps) {
  const { chapitreNom: rawChapitreNom } = await params;
  const { data } = await publicApi.getPoesies({ next: { revalidate: 5 } });
  const chapitreNom = decodeURIComponent(rawChapitreNom);
  
  const poesies = (data as Poesie[])
    .filter(poesie => poesie.statut === 'publié' && poesie.chapitre === chapitreNom)
    .sort((a, b) => a.ordreAffichage - b.ordreAffichage);

  if (poesies.length === 0) {
    return (
      <div className="bg-gray-300 dark:bg-gray-900 min-h-screen py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link href="/poems" className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:underline mb-8">
            <ArrowLeft className="w-4 h-4" />
            Retour aux poésies
          </Link>
          <p className="text-center text-gray-500 dark:text-gray-400">Aucune poésie trouvée pour ce chapitre.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-300 dark:bg-gray-900 min-h-screen py-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-2/3 h-48 bg-gray-400 dark:bg-gray-800 rounded-bl-[100%]"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-64 bg-white dark:bg-gray-950 rounded-tr-[80%]"></div>
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-white/30 dark:bg-gray-800/30 rounded-full"></div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <Link href="/poems" className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" />
          Retour aux poésies
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex p-4 rounded-full bg-white dark:bg-gray-800 mb-4">
            <BookOpen className="h-12 w-12 text-gray-900 dark:text-gray-100" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">{chapitreNom}</h1>
          <p className="text-xl text-gray-700 dark:text-gray-300">
            {poesies.length} poème{poesies.length > 1 ? 's' : ''}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg dark:shadow-gray-950/50 border border-gray-200/60 dark:border-gray-700/60 overflow-hidden">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {poesies.map((poesie, index) => (
              <Link
                key={poesie.id}
                href={`/poems/${poesie.id}`}
                className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400 font-semibold">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                      {poesie.titre}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate italic">
                      {(poesie.extrait || '').substring(0, 60)}...
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6 flex-shrink-0">
                  <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
                    {poesie.nombreLignes} vers
                  </span>
                  <Feather className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


