import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, Music as MusicIcon, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ShareButtons from '@/components/ShareButtons';
import { publicApi } from '@/lib/api';
import { Chanson } from '@/types';
import { notFound } from 'next/navigation';

interface SongPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: SongPageProps): Promise<Metadata> {
  try {
    const { data } = await publicApi.getChanson(Number(params.id));
    const chanson = data as Chanson;

    return {
      title: `${chanson.titre} - Chanson`,
      description: `Écoutez "${chanson.titre}" (${chanson.metadata.genre})`,
      openGraph: {
        title: `${chanson.titre} - Chanson`,
        description: chanson.paroles.slice(0, 150)
      }
    };
  } catch (error) {
    return {
      title: 'Chanson introuvable',
      description: 'Cette chanson n’existe pas ou a été retirée.'
    };
  }
}

export default async function SongPage({ params }: SongPageProps) {
  const id = Number(params.id);
  let chanson: Chanson | null = null;
  let autresChansons: Chanson[] = [];

  try {
    const [{ data: chansonData }, { data: autres }] = await Promise.all([
      publicApi.getChanson(id, { next: { revalidate: 120 } }),
      publicApi.getChansons({ next: { revalidate: 120 } })
    ]);

    const currentChanson = chansonData as Chanson | null;
    if (!currentChanson) {
      notFound();
    }

    chanson = currentChanson;
    autresChansons = (autres as Chanson[])
      .filter(item => item.statut === 'publié' && item.id !== currentChanson.id)
      .slice(0, 3);
  } catch (error) {
    notFound();
  }

  if (!chanson) {
    notFound();
  }

  return (
    <div className="bg-slate-50 dark:bg-gray-950 min-h-screen py-12">
      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button variant="ghost" asChild>
            <Link href="/songs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux chansons
            </Link>
          </Button>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="md:w-1/3">
              <div className="aspect-square rounded-xl bg-gradient-to-br from-blue-200 via-blue-300 to-blue-500 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
                <MusicIcon className="h-24 w-24 text-white/80" />
              </div>
            </div>

            <div className="md:w-2/3 space-y-4">
              <span className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                {chanson.metadata.genre}
              </span>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">{chanson.titre}</h1>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Album : {chanson.metadata.album ?? 'Single'} · {chanson.duree}
              </p>
              <div className="flex flex-wrap gap-6 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <time>
                    {new Date(chanson.datePublication ?? chanson.dateCreation).toLocaleDateString('fr-FR')}
                  </time>
                </div>
                <div>Plays : {chanson.plays.toLocaleString('fr-FR')}</div>
                <div>Compositeur : {chanson.metadata.compositeur}</div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
                  Écouter sur
                </p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(chanson.plateformes)
                    .filter(([, url]) => Boolean(url))
                    .map(([platform, url]) => (
                      <a
                        key={platform}
                        href={url as string}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600 text-white text-xs hover:bg-blue-500"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {platform}
                      </a>
                    ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Paroles</h2>
            <div className="prose prose-slate dark:prose-invert max-w-none bg-slate-50 dark:bg-gray-800 p-6 rounded-lg whitespace-pre-line">
              {chanson.paroles}
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-gray-700 pt-6">
            <ShareButtons title={`Écoutez ${chanson.titre}`} />
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Autres chansons</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {autresChansons.map(item => (
              <Link
                key={item.id}
                href={`/songs/${item.id}`}
                className="block bg-white dark:bg-gray-900 rounded-xl p-4 border border-slate-200/70 dark:border-gray-800 hover:border-blue-400 transition-colors"
              >
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">{item.titre}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{item.metadata.genre}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                  {new Date(item.datePublication ?? item.dateCreation).toLocaleDateString('fr-FR')}
                </p>
              </Link>
            ))}
            {autresChansons.length === 0 && (
              <div className="col-span-full text-center text-slate-500 dark:text-slate-400">
                Aucune autre chanson publiée pour le moment.
              </div>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
