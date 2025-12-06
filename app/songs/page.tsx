import Link from 'next/link';
import { Metadata } from 'next';
import { Music, Disc, ExternalLink, Play } from 'lucide-react';
import { publicApi } from '@/lib/api';
import { Chanson } from '@/types';

export const metadata: Metadata = {
  title: 'Chansons - Œuvres & Arts',
  description: 'Écoutez mes compositions musicales et chansons.',
};

export default async function SongsPage() {
  const { data } = await publicApi.getChansons({ next: { revalidate: 120 } });
  const chansons = (data as Chanson[]).filter(chanson => chanson.statut === 'publié');

  return (
    <div className="bg-gray-300 dark:bg-gray-900 min-h-screen py-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-2/3 h-48 bg-gray-400 dark:bg-gray-800 rounded-bl-[100%]"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-64 bg-white dark:bg-gray-950 rounded-tr-[80%]"></div>
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-white/30 dark:bg-gray-800/30 rounded-full"></div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex p-4 rounded-full bg-white dark:bg-gray-800 mb-4">
            <Music className="h-12 w-12 text-gray-900 dark:text-gray-100" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Chansons</h1>
          <p className="text-xl text-gray-800 dark:text-gray-200 max-w-2xl mx-auto">
            {`Explorez ${chansons.length} composition${chansons.length > 1 ? 's' : ''} originales issues de mes projets musicaux.`}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {chansons.map(chanson => (
            <div key={chanson.id} className="group bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg dark:shadow-gray-950/50 border border-gray-200/60 dark:border-gray-700/60 transition-transform hover:-translate-y-1">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-900 dark:bg-gray-700 flex items-center justify-center text-white font-semibold">
                    <Disc className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{chanson.titre}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Album : {chanson.metadata.album ?? 'Single'}</p>
                  </div>
                </div>
                <span className="text-xs uppercase tracking-wide px-3 py-1 bg-gray-900 text-white dark:bg-white dark:text-gray-900 rounded-full">
                  {chanson.metadata.genre}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <p>
                  <span className="font-medium text-gray-900 dark:text-gray-100">Durée :</span> {chanson.duree}
                </p>
                <p>
                  <span className="font-medium text-gray-900 dark:text-gray-100">Plays :</span> {chanson.plays.toLocaleString('fr-FR')}
                </p>
                <p>
                  <span className="font-medium text-gray-900 dark:text-gray-100">Composé par :</span> {chanson.metadata.compositeur}
                </p>
                <p>
                  <span className="font-medium text-gray-900 dark:text-gray-100">Publication :</span>{' '}
                  {new Date(chanson.datePublication ?? chanson.dateCreation).toLocaleDateString('fr-FR')}
                </p>
              </div>

              <div className="mt-6">
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
                  Disponible sur
                </p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(chanson.plateformes)
                    .filter(([, url]) => Boolean(url))
                    .map(([platform, url]) => (
                      <a
                        key={platform}
                        href={url as string}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 hover:opacity-80"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {platform}
                      </a>
                    ))}
                </div>
              </div>

              <div className="mt-6 text-right">
                <Link
                  href={`/songs/${chanson.id}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100 hover:underline"
                >
                  Voir les détails
                  <Play className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
