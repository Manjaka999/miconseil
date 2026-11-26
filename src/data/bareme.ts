import type { Bareme } from "../types";

/** Hypothèses PAR DÉFAUT (sources secondaires, parfois contradictoires) : à valider sur le texte officiel. */
export const baremeParDefaut: Bareme = {
  preavisMois: { ouvrier: 1, employe: 1, maitrise: 2, cadre: 3 },
  indemnite: [{ jusqua: 5, joursParAn: 10 }, { jusqua: 10, joursParAn: 15 }, { jusqua: 99, joursParAn: 20 }],
};
