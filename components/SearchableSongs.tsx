'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Disc, Music } from 'lucide-react';
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

  // Grouper les chansons filtrées par album
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

      {albums.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Aucune chanson trouvée pour &quot;{searchQuery}&quot;
          </p>
        </div>
      ) : (
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

