import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ShareButtons from '@/components/ShareButtons';
import { Badge } from '@/components/ui/badge';
import { publicApi } from '@/lib/api';
import { Video } from '@/types';
import { notFound } from 'next/navigation';

interface VideoPageProps {
  params: {
    id: string;
  };
}

function toYoutubeEmbed(url: string): string {
  try {
    const parsed = new URL(url);
    const idParam = parsed.searchParams.get('v');
    if (idParam) {
      return `https://www.youtube.com/embed/${idParam}`;
    }
    const pathSegments = parsed.pathname.split('/');
    const videoId = pathSegments[pathSegments.length - 1];
    return `https://www.youtube.com/embed/${videoId}`;
  } catch (error) {
    return url;
  }
}

export async function generateMetadata({ params }: VideoPageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const { data } = await publicApi.getVideo(Number(id));
    const video = data as Video;

    return {
      title: `${video.titre} - Vidéo`,
      description: video.description,
      openGraph: {
        title: `${video.titre} - Vidéo`,
        description: video.description,
        images: video.thumbnailUrl ? [video.thumbnailUrl] : undefined
      }
    };
  } catch (error) {
    return {
      title: 'Vidéo introuvable',
      description: 'Cette vidéo n’existe pas ou a été retirée.'
    };
  }
}

export default async function VideoPage({ params }: VideoPageProps) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  let video: Video | null = null;
  let autresVideos: Video[] = [];

  try {
    const [{ data: videoData }, { data: liste }] = await Promise.all([
      publicApi.getVideo(id, { next: { revalidate: 120 } }),
      publicApi.getVideos({ next: { revalidate: 120 } })
    ]);

    const currentVideo = videoData as Video | null;
    if (!currentVideo) {
      notFound();
    }

    video = currentVideo;
    autresVideos = (liste as Video[])
      .filter(item => item.statut === 'publié' && item.id !== currentVideo.id)
      .slice(0, 3);
  } catch (error) {
    notFound();
  }

  if (!video) {
    notFound();
  }

  const embedUrl = toYoutubeEmbed(video.urlYoutube);

  return (
    <div className="bg-slate-50 dark:bg-gray-950 min-h-screen py-12">
      <article className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button variant="ghost" asChild>
            <Link href="/videos">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux vidéos
            </Link>
          </Button>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-8 md:p-12">
          <div className="mb-8 space-y-6">
            <div className="flex flex-wrap items-center gap-3 text-sm text-amber-600 dark:text-amber-400">
              <span className="font-semibold uppercase tracking-wide">Vidéo</span>
              <Badge variant="outline" className="border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300">
                {video.typeVideo}
              </Badge>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">{video.titre}</h1>
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <time>{new Date(video.datePublication ?? video.dateCreation).toLocaleDateString('fr-FR')}</time>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>{video.duree}</span>
              </div>
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                <span>{video.vues.toLocaleString('fr-FR')} vues</span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="relative w-full overflow-hidden rounded-xl bg-black aspect-video">
              <iframe
                src={embedUrl}
                title={video.titre}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Description</h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p>{video.description}</p>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-gray-700 pt-6">
            <ShareButtons title={`Regardez ${video.titre}`} />
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Vidéos similaires</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {autresVideos.map(item => (
              <Link
                key={item.id}
                href={`/videos/${item.id}`}
                className="block bg-white dark:bg-gray-900 rounded-xl p-4 border border-slate-200/70 dark:border-gray-800 hover:border-amber-400 transition-colors"
              >
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">{item.titre}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{item.typeVideo}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                  {new Date(item.datePublication ?? item.dateCreation).toLocaleDateString('fr-FR')}
                </p>
              </Link>
            ))}
            {autresVideos.length === 0 && (
              <div className="col-span-full text-center text-slate-500 dark:text-slate-400">
                Aucune autre vidéo publiée pour le moment.
              </div>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
