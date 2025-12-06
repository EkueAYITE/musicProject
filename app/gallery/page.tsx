import { Metadata } from 'next';
import { Camera } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Galerie photo - Œuvres & Arts',
  description: 'Explorez ma galerie de photographies et images.',
};

export default async function GalleryPage() {
  return (
    <div className="bg-gray-300 dark:bg-gray-900 min-h-screen py-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-2/3 h-48 bg-gray-400 dark:bg-gray-800 rounded-bl-[100%]"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-64 bg-white dark:bg-gray-950 rounded-tr-[80%]"></div>
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-white/30 dark:bg-gray-800/30 rounded-full"></div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex p-4 rounded-full bg-white dark:bg-gray-800 mb-4">
            <Camera className="h-12 w-12 text-gray-900 dark:text-gray-100" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Galerie photo</h1>
          <p className="text-xl text-gray-800 dark:text-gray-200 max-w-2xl mx-auto">
            Découvrez ma collection de photographies et images artistiques.
          </p>
        </div>

        <div className="text-center py-12">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Connectez votre API Laravel pour afficher votre galerie photo
          </p>
          <code className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-2 rounded text-sm">
            GET /api/gallery
          </code>
        </div>
      </div>
    </div>
  );
}
