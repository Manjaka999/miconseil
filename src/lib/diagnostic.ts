import type { Contrat, Diagnostic, Probleme, Profil } from "../types";

/** Ancienneté en mois. */
export interface Situation { profil: Profil; contrat: Contrat; anciennete: number; probleme: Probleme }

/** Règles volontairement prudentes : orientation générale, pas un avis juridique. */
export function diagnostiquer(s: Situation): Diagnostic {
  const emp = s.profil === "employeur";
  if (s.probleme === "licencier") {
    if (s.contrat === "essai")
      return {
        verdict: "info", titre: "Rupture pendant l'essai",
        explication: "Pendant la période d'essai, la rupture est en principe plus souple, mais l'essai doit avoir été prévu par écrit et ne pas dépasser le maximum légal.",
        articles: ["periode-essai", "essai-rupture"],
        conseil: emp ? "Notifiez la rupture par écrit, datée et signée, et conservez l'accusé de réception." : "Demandez la rupture par écrit et vérifiez que votre contrat prévoit bien un essai.",
      };
    if (s.contrat === "cdd")
      return {
        verdict: "risque", titre: "Rupture anticipée d'un CDD",
        explication: "Un CDD ne peut être rompu avant son terme par une seule des parties que dans les cas prévus au contrat ou en cas de faute lourde. Sinon la rupture peut être jugée abusive et donner lieu à des dommages-intérêts.",
        articles: ["cdd-rupture", "licenciement-abusif"],
        conseil: emp ? "Évitez la rupture anticipée sans faute prouvée ; privilégiez un accord écrit." : "Si on vous renvoie avant le terme sans faute, conservez le contrat et contactez l'inspection du travail.",
      };
    return {
      verdict: "risque", titre: "Licenciement d'un salarié en CDI",
      explication: `Le licenciement doit reposer sur un motif réel et sérieux, respecter la procédure (information du motif, possibilité de se défendre) et le préavis, sinon il peut être jugé abusif.${s.anciennete < 6 ? " Avec moins de 6 mois d'ancienneté, les règles d'indemnisation peuvent différer : vérifiez le texte officiel." : ""}`,
      articles: ["licenciement-formalites", "licenciement-abusif", "preavis-indemnite", "indemnite-licenciement"],
      conseil: emp ? "Convoquez par écrit, écoutez le salarié, notifiez le motif, respectez le préavis (ou payez-le) et estimez les indemnités dans le simulateur." : "Demandez le motif par écrit, notez les dates et gardez vos bulletins de paie. Vous pouvez saisir l'inspection du travail.",
    };
  }
  if (s.probleme === "absence")
    return {
      verdict: "risque", titre: "Absence injustifiée",
      explication: "Une absence répétée ou prolongée peut constituer une faute, mais l'employeur doit d'abord demander des explications par écrit et suivre la procédure avant de sanctionner.",
      articles: ["faute-lourde", "licenciement-formalites"],
      conseil: emp ? "Envoyez une demande d'explication, puis une convocation (modèle dans « Documents ») avant toute sanction." : "Justifiez votre absence par écrit (certificat, message) dès que possible.",
    };
  if (s.probleme === "retard_salaire")
    return {
      verdict: emp ? "illegal" : "info", titre: "Retard de paiement du salaire",
      explication: "Le salaire mensuel doit être payé au plus tard 8 jours après la fin du mois travaillé ; un retard non justifié par la force majeure donne lieu à majoration au taux d'intérêt légal. Un retard répété est un manquement de l'employeur et peut donner lieu à réclamation.",
      articles: ["salaire-paiement"],
      conseil: emp ? "Régularisez rapidement et gardez la preuve du paiement." : "Envoyez une mise en demeure écrite (modèle dans « Documents »), puis saisissez l'inspection du travail si rien ne change.",
    };
  return s.contrat === "cdi"
    ? {
        verdict: "conforme", titre: "Démission",
        explication: "Un salarié en CDI peut démissionner en respectant le préavis. La démission doit être notifiée par écrit, avec le motif, et la passation faite si l'employeur l'exige.",
        articles: ["demission", "preavis-indemnite"],
        conseil: emp ? "Prenez acte par écrit, fixez la fin du préavis et préparez le solde de tout compte (congés restants inclus)." : "Remettez une lettre datée, gardez une copie signée et vérifiez le préavis à respecter.",
      }
    : {
        verdict: "risque", titre: "Démission en CDD ou pendant l'essai",
        explication: "En CDD, quitter avant le terme n'est possible que dans les cas prévus au contrat ou en cas de faute lourde, sinon des dommages-intérêts peuvent être dus ; pendant l'essai, la sortie est plus souple (sans indemnité).",
        articles: ["cdd-rupture", "essai-rupture", "demission"],
        conseil: "Vérifiez les clauses de votre contrat et privilégiez un accord écrit avec l'autre partie.",
      };
}
