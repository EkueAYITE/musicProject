import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ShareButtons from '@/components/ShareButtons';
import { Badge } from '@/components/ui/badge';
import { publicApi } from '@/lib/api';
import { Poesie } from '@/types';
import { notFound } from 'next/navigation';

interface PoemPageProps {
  params: {
    id: string;
  };
}

function estimateReadingTime(lines: number): string {
  const minutes = Math.max(1, Math.round(lines / 8));
  return `${minutes} min de lecture`;
}

export async function generateMetadata({ params }: PoemPageProps): Promise<Metadata> {
  try {
    const { data } = await publicApi.getPoesie(Number(params.id));
    const poesie = data as Poesie;

    return {
      title: `${poesie.titre} - Poésie`,
      description: poesie.extrait,
      openGraph: {
        title: `${poesie.titre} - Poésie`,
        description: poesie.extrait
      }
    };
  } catch (error) {
    return {
      title: 'Poésie introuvable',
      description: 'Cette poésie n’existe pas ou a été retirée.'
    };
  }
}

export default async function PoemPage({ params }: PoemPageProps) {
  const id = Number(params.id);
  let poesie: Poesie | null = null;
  let autresPoesies: Poesie[] = [];

  try {
    const [{ data: poesieData }, { data: liste }] = await Promise.all([
      publicApi.getPoesie(id, { next: { revalidate: 120 } }),
      publicApi.getPoesies({ next: { revalidate: 120 } })
    ]);

    const currentPoesie = poesieData as Poesie | null;
    if (!currentPoesie) {
      notFound();
    }

    poesie = currentPoesie;
    autresPoesies = (liste as Poesie[])
      .filter(item => item.statut === 'publié' && item.id !== currentPoesie.id)
      .slice(0, 3);
  } catch (error) {
    notFound();
  }

  if (!poesie) {
    notFound();
  }

  return (
    <div className="bg-slate-50 dark:bg-gray-950 min-h-screen py-12">
      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button variant="ghost" asChild>
            <Link href="/poems">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux poésies
            </Link>
          </Button>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-8 md:p-12">
          <div className="mb-8 space-y-4">
            <span className="text-sm font-semibold uppercase tracking-wide text-rose-600 dark:text-rose-400">
              Poésie
            </span>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">{poesie.titre}</h1>
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <time>{new Date(poesie.datePublication ?? poesie.dateCreation).toLocaleDateString('fr-FR')}</time>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>{estimateReadingTime(poesie.nombreLignes)}</span>
              </div>
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                <span>{poesie.vues.toLocaleString('fr-FR')} lectures</span>
              </div>
            </div>
            {poesie.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {poesie.tags.map(tag => (
                  <Badge key={tag} variant="secondary">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none mb-8 whitespace-pre-line">
            {poesie.contenu}
          </div>

          <div className="border-t border-slate-200 dark:border-gray-700 pt-6">
            <ShareButtons title={`Découvrez ${poesie.titre}`} />
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Autres poésies</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {autresPoesies.map(item => (
              <Link
                key={item.id}
                href={`/poems/${item.id}`}
                className="block bg-white dark:bg-gray-900 rounded-xl p-4 border border-slate-200/70 dark:border-gray-800 hover:border-rose-400 transition-colors"
              >
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">{item.titre}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{item.extrait}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                  {new Date(item.datePublication ?? item.dateCreation).toLocaleDateString('fr-FR')}
                </p>
              </Link>
            ))}
            {autresPoesies.length === 0 && (
              <div className="col-span-full text-center text-slate-500 dark:text-slate-400">
                Aucune autre poésie publiée pour le moment.
              </div>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
