import Link from 'next/link';
import { Calendar } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface ContentCardProps {
  title: string;
  excerpt?: string;
  date: string;
  href: string;
  type?: 'poem' | 'song' | 'article' | 'video';
}

export default function ContentCard({ title, excerpt, date, href, type = 'article' }: ContentCardProps) {
  const typeColors = {
    poem: 'text-rose-600 dark:text-rose-400',
    song: 'text-blue-600 dark:text-blue-400',
    article: 'text-emerald-600 dark:text-emerald-400',
    video: 'text-amber-600 dark:text-amber-400',
  };

  const typeLabels = {
    poem: 'Poésie',
    song: 'Chanson',
    article: 'Article',
    video: 'Vidéo',
  };

  return (
    <Link href={href} className="block h-full group">
      <Card className="h-full hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-300 group-hover:scale-[1.02]">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-semibold uppercase tracking-wide ${typeColors[type]}`}>
              {typeLabels[type]}
            </span>
            <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
              <Calendar className="h-3 w-3 mr-1" />
              {new Date(date).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </div>
          </div>
          <CardTitle className="text-xl font-bold group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors line-clamp-2">
            {title}
          </CardTitle>
        </CardHeader>
        {excerpt && (
          <CardContent>
            <p className="text-slate-600 dark:text-slate-300 line-clamp-3">{excerpt}</p>
          </CardContent>
        )}
        <CardFooter>
          <span className="text-sm font-medium text-slate-900 dark:text-slate-100 group-hover:underline">
            Lire la suite →
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
