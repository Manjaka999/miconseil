import type { Bareme } from "../types";

/**
 * Indemnité de licenciement : art. 48 de la loi 2024-014 (10 jours de salaire par année complète de service, plafond 6 mois,
 * licenciement économique ou cessation d'activité ; le plafond est appliqué dans lib/calcul.ts).
 * Préavis : NON fixé par le Code (art. 38 : convention collective ou décret) -> 0 par défaut, à saisir par l'utilisateur.
 */
export const baremeParDefaut: Bareme = {
  preavisMois: 0,
  indemniteJoursParAn: 10,
};
