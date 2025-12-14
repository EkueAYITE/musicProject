import Link from 'next/link';
import { Metadata } from 'next';
import { BookOpen, Feather, Calendar } from 'lucide-react';
import { publicApi } from '@/lib/api';
import { Poesie } from '@/types';

export const metadata: Metadata = {
  title: 'Poésies - Œuvres & Arts',
  description: 'Découvrez ma collection de poésies et de vers.',
};

export default async function PoemsPage() {
  const { data } = await publicApi.getPoesies({ next: { revalidate: 5 } });
  const poesies = (data as Poesie[]).filter(poesie => poesie.statut === 'publié');

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
            {`Explorez ${poesies.length} poème${poesies.length > 1 ? 's' : ''} et laissez-vous emporter par les mots et les émotions.`}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {poesies.map(poesie => (
            <div key={poesie.id} className="group bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg dark:shadow-gray-950/50 border border-gray-200/60 dark:border-gray-700/60 hover:shadow-xl transition-all duration-300">
              <div className="flex items-start justify-between mb-6">
                <Feather className="w-8 h-8 text-rose-500 dark:text-rose-400" />
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(poesie.datePublication ?? poesie.dateCreation).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                {poesie.titre}
              </h2>

              <div className="relative mb-6">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-200 dark:bg-rose-900 rounded-full"></div>
                <p className="pl-6 text-lg text-gray-600 dark:text-gray-300 italic font-serif leading-relaxed line-clamp-4">
                  {poesie.extrait}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {poesie.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-700">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {poesie.nombreLignes} vers
                </span>
                <Link
                  href={`/poems/${poesie.id}`}
                  className="inline-flex items-center px-4 py-2 rounded-full bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Lire le poème
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
