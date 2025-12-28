'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Feather, FileText } from 'lucide-react';
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

  // Si recherche active, afficher les poésies individuelles
  // Sinon, afficher les chapitres
  const isSearching = searchQuery.trim().length > 0;

  // Grouper les poésies filtrées par chapitre (pour l'affichage par défaut)
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

      {filteredPoesies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {isSearching 
              ? `Aucune poésie trouvée pour "${searchQuery}"`
              : 'Aucune poésie disponible pour le moment'
            }
          </p>
        </div>
      ) : isSearching ? (
        // Affichage des poésies individuelles lors de la recherche
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {filteredPoesies.length} résultat{filteredPoesies.length > 1 ? 's' : ''} trouvé{filteredPoesies.length > 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPoesies.map((poesie) => (
              <Link
                key={poesie.id}
                href={`/poems/${poesie.id}`}
                className="group block"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-rose-500 dark:hover:border-rose-400">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg flex items-center justify-center">
                        <Feather className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-1 line-clamp-2 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                        {poesie.titre}
                      </h3>
                      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        {poesie.chapitre && (
                          <p className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            <span className="truncate">{poesie.chapitre}</span>
                          </p>
                        )}
                        {poesie.extrait && (
                          <p className="flex items-start gap-1 mt-2">
                            <FileText className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span className="text-xs text-gray-500 dark:text-gray-500 line-clamp-2 italic">
                              {poesie.extrait}
                            </span>
                          </p>
                        )}
                        {poesie.tags && poesie.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {poesie.tags.slice(0, 3).map((tag, idx) => (
                              <span 
                                key={idx}
                                className="text-xs bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
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
        // Affichage des chapitres par défaut (sans recherche)
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




