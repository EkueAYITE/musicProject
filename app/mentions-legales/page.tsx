import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Mentions légales - Œuvres & Arts',
  description: 'Informations légales, éditeur du site et politique de données.',
};

export default function MentionsLegalesPage() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Mentions légales
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Informations relatives à l&apos;éditeur du site, l&apos;hébergement et la protection des données.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Éditeur du site</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-gray-700 dark:text-gray-300">
            <p>Œuvres &amp; Arts</p>
            <p>Email : <a className="underline hover:text-gray-900 dark:hover:text-gray-100" href="mailto:contact@example.com">contact@example.com</a></p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hébergement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-gray-700 dark:text-gray-300">
            <p>Le site est hébergé par un prestataire spécialisé garantissant la sécurité et la disponibilité du service.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Propriété intellectuelle</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-gray-700 dark:text-gray-300">
            <p>
              L&apos;ensemble des contenus (textes, images, sons, vidéos, codes) présents sur ce site sont la propriété exclusive
              de leurs auteurs, sauf mention contraire. Toute reproduction ou diffusion requiert une autorisation préalable.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Données personnelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-gray-700 dark:text-gray-300">
            <p>
              Les données collectées via les formulaires sont utilisées uniquement pour répondre aux demandes et ne sont jamais
              revendues. Vous pouvez demander l&apos;accès, la rectification ou la suppression de vos données en écrivant à
              <a className="underline ml-1 hover:text-gray-900 dark:hover:text-gray-100" href="mailto:contact@example.com">contact@example.com</a>.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-gray-700 dark:text-gray-300">
            <p>Pour toute question, merci d&apos;utiliser la page <a className="underline hover:text-gray-900 dark:hover:text-gray-100" href="/contact">Contact</a>.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


