import Link from 'next/link';
import { Metadata } from 'next';
import { BookOpen, Feather, Calendar, Music } from 'lucide-react';
import { publicApi } from '@/lib/api';
import { Poesie } from '@/types';

export const metadata: Metadata = {
  title: 'Poésies - Œuvres & Arts',
  description: 'Découvrez ma collection de poésies et de vers.',
};

export default async function PoemsPage() {
  const { data } = await publicApi.getPoesies({ next: { revalidate: 5 } });
  const poesies = (data as Poesie[]).filter(poesie => poesie.statut === 'publié');

  // Grouper les poèmes par chapitre
  const poesiesParChapitre = poesies.reduce((acc, poesie) => {
    const chapitre = poesie.chapitre || 'Autres poésies';
    if (!acc[chapitre]) {
      acc[chapitre] = [];
    }
    acc[chapitre].push(poesie);
    return acc;
  }, {} as Record<string, Poesie[]>);

  const chapitres = Object.keys(poesiesParChapitre).sort();

  return (
    <div className="bg-gray-300 dark:bg-gray-900 min-h-screen py-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-2/3 h-48 bg-gray-400 dark:bg-gray-800 rounded-bl-[100%]"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-64 bg-white dark:bg-gray-950 rounded-tr-[80%]"></div>
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-white/30 dark:bg-gray-800/30 rounded-full"></div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex p-4 rounded-full bg-white dark:bg-gray-800 mb-4">
            <BookOpen className="h-12 w-12 text-gray-900 dark:text-gray-100" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Poésies</h1>
          <p className="text-xl text-gray-800 dark:text-gray-200 max-w-2xl mx-auto">
            {`Explorez ${poesies.length} poème${poesies.length > 1 ? 's' : ''} organisé${poesies.length > 1 ? 's' : ''} en ${chapitres.length} chapitre${chapitres.length > 1 ? 's' : ''}.`}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {chapitres.map(chapitre => {
            const chapitrePoesies = poesiesParChapitre[chapitre];
            const totalPoems = chapitrePoesies.length;
            
            return (
              <Link
                key={chapitre}
                href={`/poems/chapitre/${encodeURIComponent(chapitre)}`}
                className="group block"
              >
                <div className="relative overflow-hidden rounded-3xl bg-rose-400 dark:bg-rose-900/70 p-10 hover:shadow-2xl transition-all duration-300 h-full">
                  <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-white dark:bg-gray-950 rounded-t-[40%]"></div>
                  <div className="relative z-10">
                    <BookOpen className="h-12 w-12 text-rose-900 dark:text-rose-200 mb-6 group-hover:scale-110 transition-transform duration-300" />
                    <h3 className="text-2xl font-bold text-rose-900 dark:text-rose-100 mb-3 line-clamp-2">
                      {chapitre}
                    </h3>
                    <p className="text-gray-800 dark:text-gray-100 mb-4 text-base">Chapitre</p>
                    <div className="inline-flex items-center text-sm font-semibold text-gray-800 dark:text-gray-100">
                      <Feather className="h-4 w-4 mr-2" />
                      {totalPoems} poème{totalPoems > 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/*
        {chapitres.map(chapitre => (
          <div key={chapitre} className="mb-16">
            <Link href={`/poems/chapitre/${encodeURIComponent(chapitre)}`} className="group">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 flex items-center hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                <span className="h-1 w-12 bg-rose-500 dark:bg-rose-400 group-hover:bg-rose-600 dark:group-hover:bg-rose-500 mr-4 transition-colors"></span>
                {chapitre}
              </h2>
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {poesiesParChapitre[chapitre].map(poesie => (
*/
