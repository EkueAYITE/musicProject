'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Video, Play, Clock } from 'lucide-react';
import { Video as VideoType } from '@/types';
import SearchBar from './SearchBar';

interface SearchableVideosProps {
  videos: VideoType[];
}

export default function SearchableVideos({ videos }: SearchableVideosProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrer les vidéos selon la recherche
  const filteredVideos = videos.filter(video => {
    const query = searchQuery.toLowerCase();
    return (
      video.titre.toLowerCase().includes(query) ||
      video.categorie?.toLowerCase().includes(query) ||
      video.description?.toLowerCase().includes(query) ||
      video.typeVideo?.toLowerCase().includes(query)
    );
  });

  // Si recherche active, afficher les vidéos individuelles
  // Sinon, afficher les catégories
  const isSearching = searchQuery.trim().length > 0;

  // Grouper les vidéos filtrées par catégorie (pour l'affichage par défaut)
  const videosParCategorie = filteredVideos.reduce((acc, video) => {
    const categorie = video.categorie || video.typeVideo || 'Autres vidéos';
    if (!acc[categorie]) {
      acc[categorie] = [];
    }
    acc[categorie].push(video);
    return acc;
  }, {} as Record<string, VideoType[]>);

  const categories = Object.keys(videosParCategorie).sort();

  return (
    <>
      <div className="mb-8 max-w-2xl mx-auto">
        <SearchBar
          placeholder="Rechercher par titre, catégorie ou description..."
          onSearch={setSearchQuery}
        />
      </div>

      {filteredVideos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {isSearching 
              ? `Aucune vidéo trouvée pour "${searchQuery}"`
              : 'Aucune vidéo disponible pour le moment'
            }
          </p>
        </div>
      ) : isSearching ? (
        // Affichage des vidéos individuelles lors de la recherche
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {filteredVideos.length} résultat{filteredVideos.length > 1 ? 's' : ''} trouvé{filteredVideos.length > 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVideos.map((video) => (
              <Link
                key={video.id}
                href={`/videos/${video.id}`}
                className="group block"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-amber-500 dark:hover:border-amber-400">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                        <Play className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-1 line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {video.titre}
                      </h3>
                      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        {video.categorie && (
                          <p className="flex items-center gap-1">
                            <Video className="w-3 h-3" />
                            <span className="truncate">{video.categorie}</span>
                          </p>
                        )}
                        {video.duree && (
                          <p className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{video.duree}</span>
                          </p>
                        )}
                        {video.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-500 line-clamp-2">
                            {video.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        // Affichage des catégories par défaut (sans recherche)
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
      )}
    </>
  );
}




