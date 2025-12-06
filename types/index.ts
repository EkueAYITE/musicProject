export interface Plateformes {
  spotify: string | null;
  appleMusic: string | null;
  deezer: string | null;
  youtube: string | null;
  soundcloud: string | null;
  tidal: string | null;
}

export interface ChansonMetadata {
  genre: string;
  album: string | null;
  annee: number;
  compositeur: string;
}

export interface Chanson {
  id: number;
  titre: string;
  duree: string;
  imageCouvertureUrl: string;
  paroles: string;
  statut: 'publié' | 'brouillon';
  plays: number;
  dateCreation: string;
  datePublication: string | null;
  dateModification: string;
  ordreAffichage: number;
  plateformes: Plateformes;
  metadata: ChansonMetadata;
}

export interface Video {
  id: number;
  titre: string;
  description: string;
  duree: string;
  urlYoutube: string;
  thumbnailUrl: string;
  typeVideo: string;
  vues: number;
  statut: 'publié' | 'brouillon';
  dateCreation: string;
  datePublication: string | null;
  dateModification: string;
  ordreAffichage: number;
}

export interface Poesie {
  id: number;
  titre: string;
  contenu: string;
  nombreLignes: number;
  extrait: string;
  statut: 'publié' | 'brouillon';
  vues: number;
  dateCreation: string;
  datePublication: string | null;
  dateModification: string;
  ordreAffichage: number;
  tags: string[];
}

export interface Article {
  id: number;
  titre: string;
  contenu: string;
  extrait: string;
  imagePrincipaleUrl: string;
  auteur: string;
  statut: 'publié' | 'brouillon';
  vues: number;
  dateCreation: string;
  datePublication: string | null;
  dateModification: string;
  categorie: string;
  tags: string[];
}

export interface GalerieItem {
  id: number;
  titre: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  typeImage: string;
  ordreAffichage: number;
  dateCreation: string;
  statut: 'publié' | 'brouillon';
}

export interface StatistiqueMetadata {
  dureeEcoute?: string;
  origine?: string;
  dureeVue?: string;
  tempsLecture?: string;
}

export interface Statistique {
  id: number;
  typeContenu: 'chanson' | 'video' | 'poesie' | 'article' | 'galerie';
  contenuId: number;
  action: string;
  dateAction: string;
  ipAddress: string;
  userAgent: string;
  metadata: StatistiqueMetadata;
}

export interface DashboardSummary {
  totals: {
    chansons: number;
    videos: number;
    poesies: number;
    articles: number;
    galerie: number;
  };
  publishedCounts: {
    chansons: number;
    videos: number;
    poesies: number;
    articles: number;
  };
  latestUpdates: Array<{
    type: 'chanson' | 'video' | 'poesie' | 'article';
    titre: string;
    statut: string;
    dateModification: string;
  }>;
  recentStats: Statistique[];
}

export interface ApiResponse<T> {
  data: T;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}
