import Link from 'next/link';
import { Metadata } from 'next';
import { Video, Play, Calendar } from 'lucide-react';
import { publicApi } from '@/lib/api';
import { Video as VideoType } from '@/types';

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
          <p className="text-xl text-gray-800 dark:text-gray-200 max-w-2xl mx-auto">
            {`Découvrez ${videos.length} création${videos.length > 1 ? 's' : ''} audiovisuelle${videos.length > 1 ? 's' : ''} et contenus vidéo.`}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map(video => (
            <div key={video.id} className="group bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg dark:shadow-gray-950/50 hover:shadow-xl transition-all duration-300 border border-gray-200/60 dark:border-gray-700/60">
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={video.thumbnailUrl} 
                  alt={video.titre}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                    <Play className="w-5 h-5 text-gray-900 ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {video.duree}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded">
                    {video.typeVideo}
                  </span>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(video.datePublication ?? video.dateCreation).toLocaleDateString('fr-FR')}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-1">
                  {video.titre}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-4">
                  {video.description}
                </p>
                
                <div className="flex items-center justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
                  <Link 
                    href={`/videos/${video.id}`}
                    className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:underline"
                  >
                    Regarder
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
