export interface Article {
  id: string;
  /** Numéro officiel. null = à confirmer dans le texte officiel. */
  numero: string | null;
  titre: string;
  /** Texte intégral : à recopier depuis le texte officiel (voir README). Vide tant que non vérifié. */
  texte: string;
  /** Résumé vulgarisé pour non-juriste. */
  resume: string;
  motsCles: string[];
  /** false tant que le numéro et le contenu n'ont pas été contrôlés sur le texte officiel. */
  verifie: boolean;
}

export type Profil = "employeur" | "salarie";
export type Contrat = "cdi" | "cdd" | "essai";
export type Probleme = "absence" | "licencier" | "retard_salaire" | "demission";

export interface Diagnostic {
  verdict: "conforme" | "risque" | "illegal" | "info";
  titre: string;
  explication: string;
  articles: string[]; // ids d'articles
  conseil: string;
}

export type Categorie = "ouvrier" | "employe" | "maitrise" | "cadre";

/** Hypothèses de calcul, modifiables par l'utilisateur. À valider sur le texte officiel / avec l'inspection du travail. */
export interface Bareme {
  preavisMois: Record<Categorie, number>;
  /** Jours de salaire par année d'ancienneté, par tranche. */
  indemnite: { jusqua: number; joursParAn: number }[];
}
