import type { Bareme } from "../types";

/**
 * Indemnité de licenciement : art. 28 de la loi 2003-044 (10 jours de salaire par année complète, plafond 6 mois,
 * licenciement économique ; le plafond est appliqué dans lib/calcul.ts).
 * Préavis : NON fixé par le Code (art. 19 : convention collective ou décret) -> 0 par défaut, à saisir par l'utilisateur.
 */
export const baremeParDefaut: Bareme = {
  preavisMois: 0,
  indemniteJoursParAn: 10,
};
