'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Feather } from 'lucide-react';
import { Poesie } from '@/types';
import SearchBar from './SearchBar';

interface SearchablePoemsProps {
  poesies: Poesie[];
}

export default function SearchablePoems({ poesies }: SearchablePoemsProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrer les poésies selon la recherche
  const filteredPoesies = poesies.filter(poesie => {
    const query = searchQuery.toLowerCase();
    return (
      poesie.titre.toLowerCase().includes(query) ||
      poesie.chapitre?.toLowerCase().includes(query) ||
      poesie.extrait?.toLowerCase().includes(query) ||
      poesie.tags?.some(tag => tag.toLowerCase().includes(query))
    );
  });

  // Grouper les poésies filtrées par chapitre
  const poesiesParChapitre = filteredPoesies.reduce((acc, poesie) => {
    const chapitre = poesie.chapitre || 'Autres poésies';
    if (!acc[chapitre]) {
      acc[chapitre] = [];
    }
    acc[chapitre].push(poesie);
    return acc;
  }, {} as Record<string, Poesie[]>);

  const chapitres = Object.keys(poesiesParChapitre).sort();

  return (
    <>
      <div className="mb-8 max-w-2xl mx-auto">
        <SearchBar
          placeholder="Rechercher par titre, chapitre ou contenu..."
          onSearch={setSearchQuery}
        />
      </div>

      {chapitres.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Aucune poésie trouvée pour &quot;{searchQuery}&quot;
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {chapitres.map(chapitre => {
            const chapitrePoesies = poesiesParChapitre[chapitre];
            const totalPoems = chapitrePoesies.length;
            
            return (
              <Link
                key={chapitre}
                href={`/poems/chapitre/${encodeURIComponent(chapitre)}`}
                className="group block"
              >
                <div className="relative overflow-hidden rounded-3xl bg-rose-400 dark:bg-rose-900/70 p-10 hover:shadow-2xl transition-all duration-300 h-full">
                  <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-white dark:bg-gray-950 rounded-t-[40%]"></div>
                  <div className="relative z-10">
                    <BookOpen className="h-12 w-12 text-rose-900 dark:text-rose-200 mb-6 group-hover:scale-110 transition-transform duration-300" />
                    <h3 className="text-2xl font-bold text-rose-900 dark:text-rose-100 mb-3 line-clamp-2">
                      {chapitre}
                    </h3>
                    <p className="text-gray-800 dark:text-gray-100 mb-4 text-base">Chapitre</p>
                    <div className="inline-flex items-center text-sm font-semibold text-gray-800 dark:text-gray-100">
                      <Feather className="h-4 w-4 mr-2" />
                      {totalPoems} poème{totalPoems > 1 ? 's' : ''}
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

