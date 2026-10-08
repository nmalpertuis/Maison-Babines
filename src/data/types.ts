export type Occasion = 'mariage' | 'gala' | 'bapteme' | 'noel' | 'anniversaire' | 'shooting';
export type Gamme = 'accessoires' | 'cocktail' | 'gala' | 'haute-couture';
export type Taille = 'XXS' | 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
export type TypeProduit = 'smokings' | 'robes' | 'capes' | 'chemises' | 'accessoires';
export type CouleurPop = 'bordeaux' | 'rose' | 'jaune' | 'bleu' | 'orange' | 'vert';
export type Teinte =
  | 'bordeaux' | 'noir' | 'bleu' | 'rose' | 'jaune' | 'ivoire' | 'vert' | 'or' | 'rouge' | 'gris' | 'blanc' | 'pastel';

export interface Product {
  id: string;
  slug: string;
  nom: string;
  gamme: Gamme;
  type: TypeProduit;
  occasions: Occasion[];
  prix: number;
  caution: number;
  tailles: Taille[] | ('S' | 'M' | 'L')[];
  taillesIndisponibles: string[];
  coloris: string[];
  /** Teintes normalisées, utilisées par le filtre couleur du catalogue. */
  teintes: Teinte[];
  couleurFond: CouleurPop;
  accroche: string;
  descriptionCourte: string;
  descriptionLongue: string;
  matieres: string;
  porteePar: string;
  /** Description de la photo, pour le texte alternatif. */
  alt: string;
  images: string[];
  badge?: 'nouveau' | 'coup-de-coeur' | 'derniere-taille';
  note: number;
  nbAvis: number;
  completerLeLook: string[];
  dateAjout: string;
}

export interface CartItem {
  /** Identifiant de ligne (produit + taille + date). */
  key: string;
  productId: string;
  taille: string;
  dateEvenement: string;
  joursSupp: number;
  assurance: boolean;
  deuxiemeTaille: boolean;
  express: boolean;
}

export interface Review {
  id: string;
  client: string;
  ville: string;
  chien: string;
  race: string;
  note: 1 | 2 | 3 | 4 | 5;
  occasion: Occasion;
  productId?: string;
  tenueLibre?: string;
  taille?: string;
  texte: string;
  date: string;
  photo?: string;
  reponseMarque?: string;
  utile: number;
}
