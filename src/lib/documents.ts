export type ModeleId = "convocation" | "mise_en_demeure";
export interface Champs { employeur: string; salarie: string; lieu: string; date: string; motif: string; rdv: string; montant: string }

export const champsVides = (): Champs => ({ employeur: "", salarie: "", lieu: "", date: new Date().toLocaleDateString("fr-FR"), motif: "", rdv: "", montant: "" });
const v = (s: string, d: string) => s.trim() || d;

export function genererDocument(id: ModeleId, c: Champs): string {
  if (id === "convocation")
    return `${v(c.employeur, "[Employeur]")}\n${v(c.lieu, "[Lieu]")}, le ${v(c.date, "[date]")}\n\nÀ l'attention de ${v(c.salarie, "[Nom du salarié]")}\n\nObjet : Convocation à un entretien préalable\n\nMadame, Monsieur,\n\nNous vous convoquons à un entretien le ${v(c.rdv, "[date et heure]")} afin de recueillir vos explications au sujet des faits suivants : ${v(c.motif, "[exposé précis des faits]")}.\n\nVous pouvez vous faire assister par une personne de votre choix.\n\nVeuillez agréer, Madame, Monsieur, nos salutations distinguées.\n\n${v(c.employeur, "[Employeur]")}\nSignature :`;
  return `${v(c.salarie, "[Nom du salarié]")}\n${v(c.lieu, "[Lieu]")}, le ${v(c.date, "[date]")}\n\nÀ l'attention de ${v(c.employeur, "[Employeur]")}\n\nObjet : Mise en demeure de paiement\n\nMadame, Monsieur,\n\nJe constate que ${v(c.motif, "[objet du manquement : salaire non payé, etc.]")}. La somme due s'élève à ${v(c.montant, "[montant]")} Ar.\n\nJe vous mets en demeure de régulariser cette situation sous huit (8) jours à compter de la réception de ce courrier. À défaut, je saisirai l'inspection du travail et, si nécessaire, le tribunal compétent.\n\nVeuillez agréer, Madame, Monsieur, mes salutations distinguées.\n\n${v(c.salarie, "[Nom du salarié]")}\nSignature :`;
}
