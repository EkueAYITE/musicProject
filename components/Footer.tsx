import Link from 'next/link';
import { Facebook, Twitter, Youtube, Instagram, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 border-t border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-gray-900 dark:text-gray-100 text-lg font-semibold mb-4">Œuvres & Arts</h3>
            <p className="text-sm mb-4">
              Un espace dédié à la présentation de mes créations artistiques et scientifiques.
              Poésies, chansons, articles, vidéos et photographies.
            </p>
          </div>

          <div>
            <h4 className="text-gray-900 dark:text-gray-100 font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/poems" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">Poésies</Link></li>
              <li><Link href="/songs" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">Chansons</Link></li>
              <li><Link href="/articles" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">Articles</Link></li>
              <li><Link href="/videos" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">Vidéos</Link></li>
              <li><Link href="/gallery" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">Galerie</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 dark:text-gray-100 font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">À propos</Link></li>
              <li><Link href="/contact" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">Contactez-moi</Link></li>
            </ul>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors" aria-label="YouTube">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="/contact" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors" aria-label="Email">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-sm text-center">
          <p>&copy; {currentYear} Œuvres & Arts. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
