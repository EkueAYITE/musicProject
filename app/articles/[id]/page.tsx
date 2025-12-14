import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ShareButtons from '@/components/ShareButtons';
import { publicApi } from '@/lib/api';
import { Article } from '@/types';
import { notFound } from 'next/navigation';

interface ArticlePageProps {
  params: {
    id: string;
  };
}

function estimateReadingTime(content: string): string {
  const words = content.split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min de lecture`;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  try {
    const { data } = await publicApi.getArticle(Number(params.id));
    const article = data as Article;

    return {
      title: `${article.titre} - Article`,
      description: article.extrait,
      openGraph: {
        title: `${article.titre} - Article`,
        description: article.extrait,
        images: article.imagePrincipaleUrl ? [article.imagePrincipaleUrl] : undefined
      }
    };
  } catch (error) {
    return {
      title: 'Article introuvable',
      description: 'Cet article n’existe pas ou a été retiré.'
    };
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const id = Number(params.id);
  let article: Article | null = null;
  let autresArticles: Article[] = [];

  try {
    const [{ data: articleData }, { data: liste }] = await Promise.all([
      publicApi.getArticle(id, { next: { revalidate: 120 } }),
      publicApi.getArticles({ next: { revalidate: 120 } })
    ]);

    const currentArticle = articleData as Article | null;
    if (!currentArticle) {
      notFound();
    }

    article = currentArticle;
    autresArticles = (liste as Article[])
      .filter(item => item.statut === 'publié' && item.id !== currentArticle.id)
      .slice(0, 3);
  } catch (error) {
    notFound();
  }

  if (!article) {
    notFound();
  }

  const readingTime = estimateReadingTime(article.contenu);

  return (
    <div className="bg-slate-50 dark:bg-gray-950 min-h-screen py-12">
      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button variant="ghost" asChild>
            <Link href="/articles">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux articles
            </Link>
          </Button>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden">
          <div className="h-64 bg-gradient-to-r from-emerald-200 via-emerald-300 to-emerald-500 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900" />
          <div className="p-8 md:p-12">
            <div className="mb-8 space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-sm text-emerald-600 dark:text-emerald-400">
                <span className="font-semibold uppercase tracking-wide">Article</span>
                <Badge variant="outline" className="border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300">
                  {article.categorie}
                </Badge>
                <span className="text-slate-500 dark:text-slate-400">Par {article.auteur}</span>
              </div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">{article.titre}</h1>
              <p className="text-lg text-slate-600 dark:text-slate-300">{article.extrait}</p>
              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <time>{new Date(article.datePublication ?? article.dateCreation).toLocaleDateString('fr-FR')}</time>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{readingTime}</span>
                </div>
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-2" />
                  <span>{article.vues.toLocaleString('fr-FR')} lectures</span>
                </div>
              </div>
              {article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {article.tags.map(tag => (
                    <Badge key={tag} variant="secondary">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="prose prose-slate dark:prose-invert prose-lg max-w-none mb-8 whitespace-pre-line">
              {article.contenu}
            </div>

            <div className="border-t border-slate-200 dark:border-gray-700 pt-6">
              <ShareButtons title={`Lisez ${article.titre}`} />
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Articles similaires</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {autresArticles.map(item => (
              <Link
                key={item.id}
                href={`/articles/${item.id}`}
                className="block bg-white dark:bg-gray-900 rounded-xl p-4 border border-slate-200/70 dark:border-gray-800 hover:border-emerald-400 transition-colors"
              >
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">{item.titre}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{item.extrait}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                  {new Date(item.datePublication ?? item.dateCreation).toLocaleDateString('fr-FR')}
                </p>
              </Link>
            ))}
            {autresArticles.length === 0 && (
              <div className="col-span-full text-center text-slate-500 dark:text-slate-400">
                Aucun autre article publié pour le moment.
              </div>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
