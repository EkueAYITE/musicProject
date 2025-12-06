import { Metadata } from 'next';
import Link from 'next/link';
import { Mail, BookOpen, Music, FileText, Video, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'À propos - Œuvres & Arts',
  description: 'Découvrez mon parcours artistique et scientifique.',
};

export default function AboutPage() {
  const achievements = [
    {
      icon: BookOpen,
      title: 'Poésie',
      description: 'Des années d\'écriture poétique explorant les émotions humaines',
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
    },
    {
      icon: Music,
      title: 'Musique',
      description: 'Compositions originales mêlant mélodies et paroles inspirantes',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: FileText,
      title: 'Recherche',
      description: 'Publications scientifiques contribuant à l\'avancement des connaissances',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      icon: Video,
      title: 'Audiovisuel',
      description: 'Créations vidéo racontant des histoires captivantes',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      icon: Camera,
      title: 'Photographie',
      description: 'Captures visuelles immortalisant la beauté du monde',
      color: 'text-violet-600',
      bgColor: 'bg-violet-50',
    },
  ];

  return (
    <div className="bg-slate-50 dark:bg-gray-950 min-h-screen">
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-gray-950 dark:to-gray-900 text-white py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">À propos de moi</h1>
          <p className="text-xl text-slate-300 dark:text-gray-300">
            Artiste et scientifique passionné par la création sous toutes ses formes
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-3xl">Mon parcours</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                Bienvenue sur mon espace créatif. Je suis un artiste et chercheur passionné,
                dédié à l&apos;exploration des frontières entre l&apos;art et la science. Mon travail
                reflète une quête constante d&apos;expression et de compréhension du monde qui nous entoure.
              </p>
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                À travers la poésie, la musique, les articles scientifiques, les vidéos et la photographie,
                je m&apos;efforce de capturer l&apos;essence de l&apos;expérience humaine et de partager mes
                découvertes avec le monde.
              </p>
            </CardContent>
          </Card>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8 text-center">Mes domaines</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {achievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <Card key={achievement.title} className="hover:shadow-lg dark:hover:shadow-gray-900/50 transition-shadow">
                    <CardContent className="pt-6">
                      <div className={`inline-flex p-3 rounded-lg ${achievement.bgColor} dark:bg-gray-800 mb-4`}>
                        <Icon className={`h-8 w-8 ${achievement.color} dark:brightness-125`} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                        {achievement.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300">{achievement.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Ma vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                Je crois fermement que l&apos;art et la science ne sont pas des domaines opposés,
                mais plutôt des approches complémentaires pour comprendre et enrichir notre monde.
                Chaque création, qu&apos;elle soit poétique, musicale, visuelle ou académique,
                représente une tentative de dialogue avec le public et une invitation à la réflexion.
              </p>
              <div className="text-center pt-6">
                <Button size="lg" asChild>
                  <Link href="/contact">
                    <Mail className="mr-2 h-5 w-5" />
                    Entrons en contact
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
