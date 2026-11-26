import type { Bareme } from "../types";

/**
 * Indemnité de licenciement : art. 28 de la loi 2003-044 (10 jours de salaire par année complète, plafond 6 mois,
 * licenciement économique ; le plafond est appliqué dans lib/calcul.ts).
 * Préavis : NON fixé par le Code (art. 19 : convention collective ou décret) ; valeurs ci-dessous = hypothèses modifiables.
 */
export const baremeParDefaut: Bareme = {
  preavisMois: { ouvrier: 1, employe: 1, maitrise: 2, cadre: 3 },
  indemnite: [{ jusqua: 5, joursParAn: 10 }, { jusqua: 10, joursParAn: 10 }, { jusqua: 99, joursParAn: 10 }],
};
