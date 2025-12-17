import Link from 'next/link';
import { Metadata } from 'next';
import { FileText, User, Calendar, ArrowRight } from 'lucide-react';
import { publicApi } from '@/lib/api';
import { Article } from '@/types';

export const metadata: Metadata = {
  title: 'Articles scientifiques - Œuvres & Arts',
  description: 'Découvrez mes travaux scientifiques et articles de recherche.',
};

export default async function ArticlesPage() {
  const { data } = await publicApi.getArticles({ next: { revalidate: 5 } });
  const articles = (data as Article[]).filter(article => article.statut === 'publié');

  return (
    <div className="bg-gray-300 dark:bg-gray-900 min-h-screen py-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-2/3 h-48 bg-gray-400 dark:bg-gray-800 rounded-bl-[100%]"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-64 bg-white dark:bg-gray-950 rounded-tr-[80%]"></div>
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-white/30 dark:bg-gray-800/30 rounded-full"></div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex p-4 rounded-full bg-white dark:bg-gray-800 mb-4">
            <FileText className="h-12 w-12 text-gray-900 dark:text-gray-100" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Articles & Réflexions</h1>
          <p className="text-xl text-gray-800 dark:text-gray-200 max-w-2xl mx-auto">
            {`Explorez ${articles.length} publication${articles.length > 1 ? 's' : ''} et travaux de recherche.`}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {articles.map(article => (
            <article key={article.id} className="flex flex-col bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg dark:shadow-gray-950/50 hover:shadow-xl transition-all duration-300 border border-gray-200/60 dark:border-gray-700/60">
              <div className="h-64 w-full relative overflow-hidden">
                <img 
                  src={article.imagePrincipaleUrl} 
                  alt={article.titre}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-gray-900/90 text-xs font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 backdrop-blur-sm">
                    {article.categorie}
                  </span>
                </div>
              </div>
              
              <div className="flex-1 p-8 flex flex-col">
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    {article.auteur}
                  </div>
                  <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(article.datePublication ?? article.dateCreation).toLocaleDateString('fr-FR')}
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 line-clamp-2 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  <Link href={`/articles/${article.id}`}>
                    {article.titre}
                  </Link>
                </h2>

                <p className="text-gray-600 dark:text-gray-300 mb-6 flex-1 line-clamp-3 leading-relaxed">
                  {article.extrait}
                </p>

                <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex gap-2">
                    {article.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <Link 
                    href={`/articles/${article.id}`}
                    className="inline-flex items-center text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    Lire l&apos;article
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
