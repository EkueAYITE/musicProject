import { Metadata } from 'next';
import { Music } from 'lucide-react';
import { publicApi } from '@/lib/api';
import { Chanson } from '@/types';
import SearchableSongs from '@/components/SearchableSongs';

export const metadata: Metadata = {
  title: 'Chansons - Œuvres & Arts',
  description: 'Écoutez mes compositions musicales et chansons.',
};

export default async function SongsPage() {
  const { data } = await publicApi.getChansons({ next: { revalidate: 5 } });
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
          <p className="text-xl text-gray-800 dark:text-gray-200 max-w-2xl mx-auto mb-4">
            Explorez mes compositions musicales organisées par album
          </p>
        </div>

        <SearchableSongs chansons={chansons} />
      </div>
    </div>
  );
}

/*
        {albums.map(album => (
          <div key={album} className="mb-16">
            <Link href={`/songs/album/${encodeURIComponent(album)}`} className="group">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Disc className="w-8 h-8 text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 mr-4 transition-colors" />
                {album}
              </h2>
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {chansonsParAlbum[album].map(chanson => (
*/
