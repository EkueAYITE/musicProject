'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Disc, Music, Clock } from 'lucide-react';
import { Chanson } from '@/types';
import SearchBar from './SearchBar';

interface SearchableSongsProps {
  chansons: Chanson[];
}

export default function SearchableSongs({ chansons }: SearchableSongsProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrer les chansons selon la recherche
  const filteredChansons = chansons.filter(chanson => {
    const query = searchQuery.toLowerCase();
    return (
      chanson.titre.toLowerCase().includes(query) ||
      chanson.metadata.album?.toLowerCase().includes(query) ||
      chanson.metadata.genre?.toLowerCase().includes(query) ||
      chanson.metadata.compositeur?.toLowerCase().includes(query)
    );
  });

  // Si recherche active, afficher les chansons individuelles
  // Sinon, afficher les albums
  const isSearching = searchQuery.trim().length > 0;

  // Grouper les chansons filtrées par album (pour l'affichage par défaut)
  const chansonsParAlbum = filteredChansons.reduce((acc, chanson) => {
    const album = chanson.metadata.album || 'Singles';
    if (!acc[album]) {
      acc[album] = [];
    }
    acc[album].push(chanson);
    return acc;
  }, {} as Record<string, Chanson[]>);

  const albums = Object.keys(chansonsParAlbum).sort();

  return (
    <>
      <div className="mb-8 max-w-2xl mx-auto">
        <SearchBar
          placeholder="Rechercher par titre, album, genre ou compositeur..."
          onSearch={setSearchQuery}
        />
      </div>

      {filteredChansons.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {isSearching 
              ? `Aucune chanson trouvée pour "${searchQuery}"`
              : 'Aucune chanson disponible pour le moment'
            }
          </p>
        </div>
      ) : isSearching ? (
        // Affichage des chansons individuelles lors de la recherche
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {filteredChansons.length} résultat{filteredChansons.length > 1 ? 's' : ''} trouvé{filteredChansons.length > 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredChansons.map((chanson) => (
              <Link
                key={chanson.id}
                href={`/songs/${chanson.id}`}
                className="group block"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Music className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-1 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {chanson.titre}
                      </h3>
                      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        {chanson.metadata.album && (
                          <p className="flex items-center gap-1">
                            <Disc className="w-3 h-3" />
                            <span className="truncate">{chanson.metadata.album}</span>
                          </p>
                        )}
                        {chanson.duree && (
                          <p className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{chanson.duree}</span>
                          </p>
                        )}
                        {chanson.metadata.genre && (
                          <p className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full inline-block">
                            {chanson.metadata.genre}
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
        // Affichage des albums par défaut (sans recherche)
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {albums.map(album => {
            const albumChansons = chansonsParAlbum[album];
            const totalDuration = albumChansons.length;
            
            return (
              <Link
                key={album}
                href={`/songs/album/${encodeURIComponent(album)}`}
                className="group block"
              >
                <div className="relative overflow-hidden rounded-3xl bg-gray-400 dark:bg-gray-800 p-10 hover:shadow-2xl transition-all duration-300 h-full">
                  <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-white dark:bg-gray-950 rounded-t-[40%]"></div>
                  <div className="relative z-10">
                    <Disc className="h-12 w-12 text-gray-800 dark:text-gray-200 mb-6 group-hover:rotate-180 transition-transform duration-500" />
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-200 mb-3 line-clamp-2">
                      {album}
                    </h3>
                    <p className="text-gray-800 dark:text-gray-100 mb-4 text-base">Album</p>
                    <div className="inline-flex items-center text-sm font-semibold text-gray-800 dark:text-gray-100">
                      <Music className="h-4 w-4 mr-2" />
                      {totalDuration} titre{totalDuration > 1 ? 's' : ''}
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




