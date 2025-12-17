import Link from 'next/link';
import { Metadata } from 'next';
import { Video, Play, Calendar, ArrowLeft } from 'lucide-react';
import { publicApi } from '@/lib/api';
import { Video as VideoType } from '@/types';

interface PageProps {
  params: { categorieNom: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { categorieNom: rawCategorieNom } = await params;
  const categorieNom = decodeURIComponent(rawCategorieNom);
  return {
    title: `${categorieNom} - Vidéos - Œuvres & Arts`,
    description: `Découvrez toutes les vidéos de la catégorie ${categorieNom}`,
  };
}

export default async function CategorieDetailPage({ params }: PageProps) {
  const { categorieNom: rawCategorieNom } = await params;
  const { data } = await publicApi.getVideos({ next: { revalidate: 5 } });
  const categorieNom = decodeURIComponent(rawCategorieNom);
  
  const target = categorieNom.trim().toLowerCase();
  const videos = (data as VideoType[])
    .filter(video => {
      const cat = (video.categorie || video.typeVideo || 'Autres vidéos').trim().toLowerCase();
      return video.statut === 'publié' && cat === target;
    })
    .sort((a, b) => a.ordreAffichage - b.ordreAffichage);

  if (videos.length === 0) {
    return (
      <div className="bg-gray-300 dark:bg-gray-900 min-h-screen py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link href="/videos" className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:underline mb-8">
            <ArrowLeft className="w-4 h-4" />
            Retour aux vidéos
          </Link>
          <p className="text-center text-gray-500 dark:text-gray-400">Aucune vidéo trouvée pour cette catégorie.</p>
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
        <Link href="/videos" className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" />
          Retour aux vidéos
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex p-4 rounded-full bg-white dark:bg-gray-800 mb-4">
            <Video className="h-12 w-12 text-gray-900 dark:text-gray-100" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">{categorieNom}</h1>
          <p className="text-xl text-gray-700 dark:text-gray-300">
            {videos.length} vidéo{videos.length > 1 ? 's' : ''}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg dark:shadow-gray-950/50 border border-gray-200/60 dark:border-gray-700/60 overflow-hidden">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {videos.map((video, index) => (
              <Link
                key={video.id}
                href={`/videos/${video.id}`}
                className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 font-semibold">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {video.titre}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {video.typeVideo}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6 flex-shrink-0">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {video.duree}
                  </span>
                  <Play className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

