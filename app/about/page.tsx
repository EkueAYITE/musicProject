import { Metadata } from 'next';
import Link from 'next/link';
import { Mail, BookOpen, Music, FileText, Video, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { publicApi } from '@/lib/api';

export const metadata: Metadata = {
  title: 'À propos - Œuvres & Arts',
  description: 'Découvrez mon parcours artistique et scientifique.',
};

export default async function AboutPage() {
  // Charger le contenu "À propos" depuis l'API
  let apropos = {
    titre: 'À propos de moi',
    sousTitre: 'Artiste et scientifique passionné par la création sous toutes ses formes',
    parcours: "Bienvenue sur mon espace créatif. Je suis un artiste et chercheur passionné, dédié à l'exploration des frontières entre l'art et la science. Mon travail reflète une quête constante d'expression et de compréhension du monde qui nous entoure.\n\nÀ travers la poésie, la musique, les articles scientifiques, les vidéos et la photographie, je m'efforce de capturer l'essence de l'expérience humaine et de partager mes découvertes avec le monde.",
    vision: "Je crois fermement que l'art et la science ne sont pas des domaines opposés, mais plutôt des approches complémentaires pour comprendre et enrichir notre monde. Chaque création, qu'elle soit poétique, musicale, visuelle ou académique, représente une tentative de dialogue avec le public et une invitation à la réflexion."
  };

  try {
    const response = await publicApi.getAPropos({ next: { revalidate: 60 } });
    if (response?.data) {
      apropos = response.data;
    }
  } catch (err) {
    console.error('Erreur chargement À propos:', err);
    // Fallback aux valeurs par défaut ci-dessus
  }

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

  // Séparer les paragraphes du parcours
  const parcoursParas = apropos.parcours.split('\n').filter(p => p.trim() !== '');
  const visionParas = apropos.vision.split('\n').filter(p => p.trim() !== '');

  return (
    <div className="bg-slate-50 dark:bg-gray-950 min-h-screen">
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-gray-950 dark:to-gray-900 text-white py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">{apropos.titre}</h1>
          <p className="text-xl text-slate-300 dark:text-gray-300">
            {apropos.sousTitre}
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
              {parcoursParas.map((para, idx) => (
                <p key={idx} className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  {para}
                </p>
              ))}
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
              {visionParas.map((para, idx) => (
                <p key={idx} className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                  {para}
                </p>
              ))}
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
