import type { Bareme } from "../types";

export interface Entree {
  salaireMensuel: number; ancienneteMois: number; moisDommages: number;
  /** Licenciement pour motif économique ? Seul cas où le Code (art. 28) prévoit une indemnité de licenciement. */
  economique: boolean;
  /** Jours de congé acquis et non pris (indemnisés à la fin du contrat, art. 90). */
  joursConges: number;
  /** Mois de salaire impayés. */
  moisImpayes: number;
}
export interface Resultat {
  preavis: number; indemniteLicenciement: number; conges: number; impayes: number; dommages: number; total: number; moisPreavis: number;
}

/**
 * Art. 28 : 10 jours de salaire par année COMPLÈTE de service, plafonné à 6 mois de salaire, licenciement économique uniquement.
 * Congés non pris (art. 90) : estimation à 1/30 du salaire mensuel par jour (30 jours = 12 x 2,5 jours par an, art. 86 et 89).
 * Le préavis n'est pas fixé par le Code (art. 19) : valeur à saisir.
 */
export function calculer(e: Entree, b: Bareme): Resultat {
  const moisPreavis = b.preavisMois;
  const preavis = Math.round(e.salaireMensuel * moisPreavis);
  const annees = Math.floor(e.ancienneteMois / 12);
  const jours = Math.min(annees * b.indemniteJoursParAn, 180); // plafond : 6 mois de salaire
  const indemniteLicenciement = e.economique ? Math.round((e.salaireMensuel / 30) * jours) : 0;
  const conges = Math.round((e.salaireMensuel / 30) * Math.max(0, e.joursConges));
  const impayes = Math.round(e.salaireMensuel * Math.max(0, e.moisImpayes));
  const dommages = Math.round(e.salaireMensuel * Math.max(0, e.moisDommages));
  return { preavis, indemniteLicenciement, conges, impayes, dommages, total: preavis + indemniteLicenciement + conges + impayes + dommages, moisPreavis };
}

export const ar = (n: number) => new Intl.NumberFormat("fr-FR").format(Math.round(n)) + " Ar";
