import type { Bareme, Categorie } from "../types";

export interface Entree { salaireMensuel: number; ancienneteMois: number; categorie: Categorie; moisDommages: number }
export interface Resultat { preavis: number; indemniteLicenciement: number; dommages: number; total: number; moisPreavis: number }

/** Indemnité de licenciement par tranches d'ancienneté (jours de salaire par année, base 30 jours/mois). */
export function calculer(e: Entree, b: Bareme): Resultat {
  const moisPreavis = b.preavisMois[e.categorie];
  const preavis = Math.round(e.salaireMensuel * moisPreavis);
  const annees = e.ancienneteMois / 12;
  let jours = 0, debut = 0;
  for (const t of b.indemnite) {
    jours += Math.max(0, Math.min(annees, t.jusqua) - debut) * t.joursParAn;
    debut = t.jusqua;
  }
  const indemniteLicenciement = Math.round((e.salaireMensuel / 30) * jours);
  const dommages = Math.round(e.salaireMensuel * Math.max(0, e.moisDommages));
  return { preavis, indemniteLicenciement, dommages, total: preavis + indemniteLicenciement + dommages, moisPreavis };
}

export const ar = (n: number) => new Intl.NumberFormat("fr-FR").format(Math.round(n)) + " Ar";
