export type Loi = "2024-014" | "2003-044";

export interface Article {
  id: string;
  /** Loi d'origine : 2024-014 = Code du travail en vigueur ; 2003-044 = ancienne loi (abrogée en principe, art. 394 de la loi 2024-014). */
  loi: Loi;
  /** Thème de regroupement (Code 2024). */
  theme?: string;
  /** Référence de la source (loi, date, article). */
  source?: string;
  /** Id de l'article équivalent dans l'autre loi (même sujet, équivalence certaine). */
  equivalent?: string;
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
export type SituationId =
  | "licencier" | "eco" | "cdd_rupture" | "demission" | "demission_forcee" | "preavis" | "absence" | "essai" | "cdd_requalif"
  | "maladie_licenciement" | "enceinte" | "accident" | "maladie_certif" | "harcelement"
  | "harcelement_sexuel" | "paternite" | "teletravail" | "modification_contrat" | "chomage_technique" | "droit_retrait" | "greve" | "saisir_inspection"
  | "retard_salaire" | "salaire_minimum" | "heures_sup" | "duree_repos" | "feries"
  | "conges" | "certificat" | "sanction" | "delegue" | "enfants";

export type Theme = "rupture" | "salaire" | "conges" | "sante" | "discipline" | "contrats";
export type ModeleId = "convocation" | "mise_en_demeure" | "demande_certificat" | "contestation";

export interface Option { v: string; label: string }
/** Question complémentaire, posée seulement si la situation en a besoin. */
export interface Question { id: string; label: string; options: Option[] }

export interface SituationDef {
  id: SituationId;
  theme: Theme;
  label: string;
  /** Mots que les gens utilisent pour décrire leur problème (recherche dans la liste). */
  motsCles: string[];
  /** Profil concerné (absent = les deux). */
  pour?: Profil;
  questions?: Question[];
}

export interface Diagnostic {
  verdict: "conforme" | "risque" | "illegal" | "info";
  titre: string;
  explication: string;
  articles: string[]; // ids d'articles
  conseil: string;
  /** Prochaines étapes concrètes, dans l'ordre. */
  etapes: string[];
  /** Modèles du module Documents à utiliser. */
  documents: ModeleId[];
  /** Points que le Code ne précise pas : à demander à l'inspection du travail (aucune règle inventée). */
  nonPrecise?: string;
}

/** Hypothèses de calcul, modifiables par l'utilisateur. À valider sur le texte officiel / avec l'inspection du travail. */
export interface Bareme {
  /** Durée du préavis en mois : non fixée par le Code (art. 38 de la loi 2024-014), à saisir. */
  preavisMois: number;
  /** Jours de salaire par année complète de service (art. 48 : 10). */
  indemniteJoursParAn: number;
}
