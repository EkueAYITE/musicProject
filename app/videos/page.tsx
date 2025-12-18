import { Metadata } from 'next';
import { Video } from 'lucide-react';
import { publicApi } from '@/lib/api';
import { Video as VideoType } from '@/types';
import SearchableVideos from '@/components/SearchableVideos';

export const metadata: Metadata = {
  title: 'Vidéos - Œuvres & Arts',
  description: 'Regardez mes créations audiovisuelles et vidéos.',
};

export default async function VideosPage() {
  const { data } = await publicApi.getVideos({ next: { revalidate: 5 } });
  const videos = (data as VideoType[]).filter(video => video.statut === 'publié');

  return (
    <div className="bg-gray-300 dark:bg-gray-900 min-h-screen py-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-2/3 h-48 bg-gray-400 dark:bg-gray-800 rounded-bl-[100%]"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-64 bg-white dark:bg-gray-950 rounded-tr-[80%]"></div>
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-white/30 dark:bg-gray-800/30 rounded-full"></div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex p-4 rounded-full bg-white dark:bg-gray-800 mb-4">
            <Video className="h-12 w-12 text-gray-900 dark:text-gray-100" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Vidéos</h1>
          <p className="text-xl text-gray-800 dark:text-gray-200 max-w-2xl mx-auto mb-4">
            Découvrez mes créations audiovisuelles par catégorie
          </p>
        </div>

        <SearchableVideos videos={videos} />
      </div>
    </div>
  );
}

/*
        {categories.map(categorie => (
          <div key={categorie} className="mb-16">
            <Link href={`/videos/categorie/${encodeURIComponent(categorie)}`} className="group">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 flex items-center hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                <span className="h-1 w-12 bg-amber-500 dark:bg-amber-400 group-hover:bg-amber-600 dark:group-hover:bg-amber-500 mr-4 transition-colors"></span>
                {categorie}
              </h2>
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videosParCategorie[categorie].map(video => (
*/
