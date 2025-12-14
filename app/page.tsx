import Link from 'next/link';
import { Play, Music, BookOpen, Video, TrendingUp, Clock, PenSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ContentCard from '@/components/ContentCard';
import { publicApi } from '@/lib/api';
import { Article, Chanson, Poesie, Video as VideoType } from '@/types';

type RecentContent = {
  id: number;
  titre: string;
  type: 'song' | 'video' | 'poem' | 'article';
  date: string;
  href: string;
  excerpt?: string;
};

export default async function Home() {
  const [{ data: dashboard }, { data: chansons }, { data: videos }, { data: poesies }, { data: articles }] =
    await Promise.all([
      publicApi.getDashboard({ next: { revalidate: 5 } }),
      publicApi.getChansons({ next: { revalidate: 5 } }),
      publicApi.getVideos({ next: { revalidate: 5 } }),
      publicApi.getPoesies({ next: { revalidate: 5 } }),
      publicApi.getArticles({ next: { revalidate: 5 } })
    ]);

  const publishedChansons = (chansons as Chanson[]).filter(chanson => chanson.statut === 'publié');
  const publishedVideos = (videos as VideoType[]).filter(video => video.statut === 'publié');
  const publishedPoesies = (poesies as Poesie[]).filter(poesie => poesie.statut === 'publié');
  const publishedArticles = (articles as Article[]).filter(article => article.statut === 'publié');

  const featuredContent = [
    {
      title: 'Chansons',
      description: 'Écoutez toutes mes compositions',
      icon: Music,
      href: '/songs',
      count: `${publishedChansons.length} titre${publishedChansons.length > 1 ? 's' : ''}`
    },
    {
      title: 'Vidéos Musicales',
      description: 'Clips et performances live',
      icon: Video,
      href: '/videos',
      count: `${publishedVideos.length} vidéo${publishedVideos.length > 1 ? 's' : ''}`
    },
    {
      title: 'Poésies',
      description: 'Textes et vers poétiques',
      icon: BookOpen,
      href: '/poems',
      count: `${publishedPoesies.length} poésie${publishedPoesies.length > 1 ? 's' : ''}`
    },
    {
      title: 'Articles',
      description: 'Réflexions et actualités musicales',
      icon: PenSquare,
      href: '/articles',
      count: `${publishedArticles.length} article${publishedArticles.length > 1 ? 's' : ''}`
    }
  ];

  const recentItems: RecentContent[] = [
    ...publishedChansons.map(item => ({
      id: item.id,
      titre: item.titre,
      type: 'song' as const,
      date: item.datePublication ?? item.dateCreation,
      href: `/songs/${item.id}`,
      excerpt: `${item.metadata.genre} · ${item.duree}`
    })),
    ...publishedVideos.map(item => ({
      id: item.id,
      titre: item.titre,
      type: 'video' as const,
      date: item.datePublication ?? item.dateCreation,
      href: `/videos/${item.id}`,
      excerpt: item.description
    })),
    ...publishedPoesies.map(item => ({
      id: item.id,
      titre: item.titre,
      type: 'poem' as const,
      date: item.datePublication ?? item.dateCreation,
      href: `/poems/${item.id}`,
      excerpt: item.extrait
    })),
    ...publishedArticles.map(item => ({
      id: item.id,
      titre: item.titre,
      type: 'article' as const,
      date: item.datePublication ?? item.dateCreation,
      href: `/articles/${item.id}`,
      excerpt: item.extrait
    }))
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);

  return (
    <div>
      <section className="bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-64 bg-white dark:bg-gray-800 rounded-b-[100%] transform -translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/40 dark:bg-gray-700/40 rounded-full transform translate-x-32 translate-y-32"></div>
        <div className="absolute top-20 right-1/4 w-64 h-64 bg-white/30 dark:bg-gray-700/30 rounded-full"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-full text-sm mb-6">
              <TrendingUp className="h-4 w-4 mr-2" />
              {publishedChansons[0]?.metadata.album ?? 'Nouvelle sortie'}
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-6">
              Musique, Poésie & Art
            </h1>
            <p className="mt-4 text-lg sm:text-xl md:text-2xl leading-relaxed text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
              Découvrez et écoutez mes créations musicales, poétiques et visuelles
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
              <Button size="lg" className="w-full sm:w-auto rounded-full px-8 py-6 text-lg" asChild>
                <Link href="/songs">
                  <Play className="mr-2 h-5 w-5 fill-current" />
                  Écouter maintenant
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full px-8 py-6 text-lg" asChild>
                <Link href="/videos">Voir les vidéos</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-gray-950 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1/3 h-full bg-gray-200 dark:bg-gray-900 rounded-r-[50%]"></div>
        <div className="absolute bottom-0 right-0 w-1/4 h-1/2 bg-gray-100 dark:bg-gray-800 rounded-tl-[100%]"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Parcourir par catégorie
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-12 text-lg">Explorez ma bibliothèque complète</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {featuredContent.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group block"
                >
                  <div className="relative overflow-hidden rounded-3xl bg-gray-400 dark:bg-gray-800 p-10 hover:shadow-2xl transition-all duration-300 h-full">
                    <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-white dark:bg-gray-950 rounded-t-[40%]"></div>
                    <div className="relative z-10">
                      <Icon className="h-12 w-12 text-white dark:text-gray-200 mb-6" />
                      <h3 className="text-3xl font-bold text-white dark:text-gray-200 mb-3">
                        {item.title}
                      </h3>
                      <p className="text-gray-900 dark:text-gray-100 mb-4 text-lg">{item.description}</p>
                      <div className="inline-flex items-center text-sm font-semibold text-gray-900 dark:text-gray-100">
                        <Clock className="h-4 w-4 mr-2" />
                        {item.count}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-300 dark:bg-gray-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-2/3 h-48 bg-gray-400 dark:bg-gray-800 rounded-bl-[100%]"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-64 bg-white dark:bg-gray-950 rounded-tr-[80%]"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Ajoutés récemment</h2>
            <p className="text-gray-700 dark:text-gray-300 text-lg">Mes dernières créations musicales et poétiques</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {recentItems.map(item => (
              <ContentCard
                key={`${item.type}-${item.id}`}
                title={item.titre}
                excerpt={item.excerpt}
                date={item.date}
                href={item.href}
                type={item.type}
              />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="rounded-full" asChild>
              <Link href="/songs">Voir toute la bibliothèque</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-400 dark:bg-gray-800 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gray-500 dark:bg-gray-700 rounded-b-[100%] transform -translate-y-16"></div>
        <div className="absolute bottom-0 right-0 w-1/3 h-48 bg-white/20 dark:bg-gray-950/20 rounded-tl-[100%]"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">Suivez mon actualité</h2>
          <p className="text-xl text-gray-800 dark:text-gray-200 mb-8 max-w-2xl mx-auto">
            Ne manquez aucune nouvelle sortie, concert ou création artistique
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" className="rounded-full bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 dark:text-gray-900" asChild>
              <Link href="/contact">S&apos;abonner</Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100 hover:bg-gray-900 hover:text-white dark:hover:bg-gray-100 dark:hover:text-gray-900" asChild>
              <Link href="/about">En savoir plus</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
