import Link from 'next/link';
import { Metadata } from 'next';
import { Video, Play } from 'lucide-react';
import { publicApi } from '@/lib/api';
import { Video as VideoType } from '@/types';

export const metadata: Metadata = {
  title: 'Vidéos - Œuvres & Arts',
  description: 'Regardez mes créations audiovisuelles et vidéos.',
};

export default async function VideosPage() {
  const { data } = await publicApi.getVideos({ next: { revalidate: 5 } });
  const videos = (data as VideoType[]).filter(video => video.statut === 'publié');

  // Grouper les vidéos par catégorie (ou type si pas de catégorie)
  const videosParCategorie = videos.reduce((acc, video) => {
    const categorie = video.categorie || video.typeVideo || 'Autres vidéos';
    if (!acc[categorie]) {
      acc[categorie] = [];
    }
    acc[categorie].push(video);
    return acc;
  }, {} as Record<string, VideoType[]>);

  const categories = Object.keys(videosParCategorie).sort();

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
          <p className="text-xl text-gray-800 dark:text-gray-200 max-w-2xl mx-auto">
            {`Découvrez ${videos.length} création${videos.length > 1 ? 's' : ''} audiovisuelle${videos.length > 1 ? 's' : ''} organisée${videos.length > 1 ? 's' : ''} en ${categories.length} catégorie${categories.length > 1 ? 's' : ''}.`}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {categories.map(categorie => {
            const categorieVideos = videosParCategorie[categorie];
            const totalVideos = categorieVideos.length;
            
            return (
              <Link
                key={categorie}
                href={`/videos/categorie/${encodeURIComponent(categorie)}`}
                className="group block"
              >
                <div className="relative overflow-hidden rounded-3xl bg-amber-400 dark:bg-amber-900/70 p-10 hover:shadow-2xl transition-all duration-300 h-full">
                  <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-white dark:bg-gray-950 rounded-t-[40%]"></div>
                  <div className="relative z-10">
                    <Video className="h-12 w-12 text-amber-900 dark:text-amber-200 mb-6 group-hover:scale-110 transition-transform duration-300" />
                    <h3 className="text-2xl font-bold text-amber-900 dark:text-amber-100 mb-3 line-clamp-2">
                      {categorie}
                    </h3>
                    <p className="text-gray-800 dark:text-gray-100 mb-4 text-base">Catégorie</p>
                    <div className="inline-flex items-center text-sm font-semibold text-gray-800 dark:text-gray-100">
                      <Play className="h-4 w-4 mr-2" />
                      {totalVideos} vidéo{totalVideos > 1 ? 's' : ''}
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
