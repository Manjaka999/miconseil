import type { ModeleId } from "../types";
export type { ModeleId };
export interface Champs { employeur: string; salarie: string; lieu: string; date: string; motif: string; rdv: string; montant: string }

export const champsVides = (): Champs => ({ employeur: "", salarie: "", lieu: "", date: new Date().toLocaleDateString("fr-FR"), motif: "", rdv: "", montant: "" });
const v = (s: string, d: string) => s.trim() || d;
/** Montant saisi sans « Ar » final : le modèle l'ajoute lui-même. */
const sansAr = (s: string) => s.trim().replace(/\s*(ar|ariary)\.?$/i, "");

export function genererDocument(id: ModeleId, c: Champs): string {
  if (id === "convocation")
    return `${v(c.employeur, "[Employeur]")}\n${v(c.lieu, "[Lieu]")}, le ${v(c.date, "[date]")}\n\nÀ l'attention de ${v(c.salarie, "[Nom du salarié]")}\n\nObjet : Convocation à un entretien préalable\n\nMadame, Monsieur,\n\nNous vous convoquons à un entretien le ${v(c.rdv, "[date et heure]")} afin de recueillir vos explications au sujet des faits suivants : ${v(c.motif, "[exposé précis des faits]")}.\n\nConformément à l'article 42 de la loi n° 2024-014, cette convocation vous est notifiée au moins trois (3) jours ouvrables avant la date de l'entretien, et vous pouvez vous faire assister par une personne de votre choix.\n\nVeuillez agréer, Madame, Monsieur, nos salutations distinguées.\n\n${v(c.employeur, "[Employeur]")}\nSignature :`;
  const entete = `${v(c.salarie, "[Nom du salarié]")}\n${v(c.lieu, "[Lieu]")}, le ${v(c.date, "[date]")}\n\nÀ l'attention de ${v(c.employeur, "[Employeur]")}\n\n`;
  const pied = `\n\nVeuillez agréer, Madame, Monsieur, mes salutations distinguées.\n\n${v(c.salarie, "[Nom du salarié]")}\nSignature :`;
  if (id === "demande_certificat")
    return `${entete}Objet : Demande de certificat de travail et du solde dû\n\nMadame, Monsieur,\n\nMon contrat de travail a pris fin${c.motif.trim() ? " (" + c.motif.trim() + ")" : ""}. Conformément à l'article 50 de la loi n° 2024-014, je vous demande de me remettre mon certificat de travail, indiquant la date de mon entrée, celle de mon départ, les emplois occupés et leur catégorie professionnelle.\n\nJe vous demande aussi de me remettre le détail de ce qui m'est dû à la fin du contrat (solde de salaire, indemnité de congés non pris, préavis s'il y a lieu)${c.montant.trim() ? ", que j'estime à " + sansAr(c.montant) + " Ar" : ""}. Je ne renonce à aucun de mes droits (art. 95 et 96).\n\nÀ défaut de réponse sous huit (8) jours, je saisirai l'inspecteur du travail.${pied}`;
  if (id === "contestation")
    return `${entete}Objet : Contestation de la décision du ${v(c.rdv, "[date de la décision]")}\n\nMadame, Monsieur,\n\nJe conteste la décision suivante : ${v(c.motif, "[décrire la décision : licenciement, sanction, non-renouvellement, etc.]")}.\n\nJe demande que les motifs me soient communiqués par écrit et que je puisse présenter mes explications (art. 41 et 42 de la loi n° 2024-014). Je rappelle que la charge de prouver que la rupture est légitime appartient à son auteur (art. 39) et que je ne renonce à aucun de mes droits (art. 96).\n\nJe me réserve le droit de saisir l'inspecteur du travail et la juridiction compétente.${pied}`;
  return `${v(c.salarie, "[Nom du salarié]")}\n${v(c.lieu, "[Lieu]")}, le ${v(c.date, "[date]")}\n\nÀ l'attention de ${v(c.employeur, "[Employeur]")}\n\nObjet : Mise en demeure de paiement\n\nMadame, Monsieur,\n\nJe constate le manquement suivant : ${v(c.motif, "[objet du manquement : salaire non payé, etc.]")}. La somme due s'élève à ${v(sansAr(c.montant), "[montant]")} Ar.\n\nJe vous mets en demeure de régulariser cette situation sous huit (8) jours à compter de la réception de ce courrier. À défaut, je saisirai l'inspection du travail et, si nécessaire, le tribunal compétent.\n\nVeuillez agréer, Madame, Monsieur, mes salutations distinguées.\n\n${v(c.salarie, "[Nom du salarié]")}\nSignature :`;
}
