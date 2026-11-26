import type { Bareme } from "../types";

export interface Entree {
  salaireMensuel: number; ancienneteMois: number; moisDommages: number;
  /** Licenciement pour motif économique (ou cessation d'activité) ? Seul cas où le Code (art. 48 de la loi 2024-014) prévoit une indemnité de licenciement. */
  economique: boolean;
  /** Jours de congé acquis et non pris (indemnisés à la fin du contrat, art. 133). */
  joursConges: number;
  /** Mois de salaire impayés. */
  moisImpayes: number;
  /** CDD rompu avant terme sans cas prévu : mois de salaire restant à courir (art. 36). */
  moisCddRestants: number;
}
export interface Resultat {
  preavis: number; indemniteLicenciement: number; conges: number; impayes: number; dommages: number; cddRestant: number; total: number; moisPreavis: number;
}

/**
 * Loi n° 2024-014 :
 * - art. 48 : 10 jours de salaire par année COMPLÈTE de service, plafonné à 6 mois de salaire, licenciement économique ou cessation d'activité uniquement ;
 * - art. 125 et 133 : congés non pris indemnisés à la fin du contrat (2,5 jours calendaires par mois de service effectif) : estimation à 1/30 du salaire mensuel par jour ;
 * - art. 36 : rupture anticipée d'un CDD hors cas prévus -> indemnité = salaires et avantages de la période restant à courir ;
 * - art. 37-38 : préavis non fixé par le Code (décret ou convention collective) -> valeur à saisir.
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
  const cddRestant = Math.round(e.salaireMensuel * Math.max(0, e.moisCddRestants));
  return { preavis, indemniteLicenciement, conges, impayes, dommages, cddRestant, total: preavis + indemniteLicenciement + conges + impayes + dommages + cddRestant, moisPreavis };
}

export const ar = (n: number) => new Intl.NumberFormat("fr-FR").format(Math.round(n)) + " Ar";
