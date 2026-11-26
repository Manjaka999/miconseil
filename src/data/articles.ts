import type { Article } from "../types";

/**
 * Base d'exemple (MVP). ATTENTION : les numéros `null` et tous les articles `verifie: false`
 * doivent être contrôlés sur le texte officiel de la loi n° 2003-044 avant toute mise en production
 * (ILO : https://www.ilo.org/dyn/travail/docs/695/Mada%20-%20Code%20du%20travail.pdf).
 * Une loi n° 2024-014 portant nouveau Code du travail existe : vérifier laquelle est en vigueur.
 */
export const articles: Article[] = [
  {
    id: "preavis-indemnite", numero: "18", titre: "Indemnité compensatrice de préavis", texte: "", verifie: false,
    resume: "Si l'employeur met fin au contrat sans laisser le salarié travailler pendant le préavis, il doit payer une indemnité équivalente au salaire du préavis.",
    motsCles: ["préavis", "indemnité", "licenciement", "rupture"],
  },
  {
    id: "licenciement-abusif", numero: "31", titre: "Licenciement abusif et dommages-intérêts", texte: "", verifie: false,
    resume: "Un licenciement sans motif réel et sérieux peut être jugé abusif. Le juge peut alors accorder des dommages-intérêts au salarié.",
    motsCles: ["licenciement", "abusif", "dommages", "intérêts", "tribunal", "motif"],
  },
  {
    id: "licenciement-formalites", numero: "32", titre: "Formalités préalables au licenciement", texte: "", verifie: false,
    resume: "Avant de licencier, l'employeur doit respecter une procédure : informer le salarié du motif et lui permettre de se défendre.",
    motsCles: ["licenciement", "procédure", "convocation", "faute", "défense", "formalités"],
  },
  {
    id: "faute-lourde", numero: null, titre: "Faute lourde et faute grave", texte: "", verifie: false,
    resume: "Une faute très grave (vol, violence, abandon de poste prolongé…) peut justifier une rupture immédiate, mais l'employeur doit pouvoir la prouver.",
    motsCles: ["faute lourde", "faute grave", "absence", "abandon", "vol", "licenciement"],
  },
  {
    id: "conges-payes", numero: null, titre: "Congés payés", texte: "", verifie: false,
    resume: "Le salarié acquiert des jours de congé payé chaque mois travaillé. Les congés non pris à la fin du contrat donnent lieu à une indemnité.",
    motsCles: ["congés payés", "congé", "vacances", "indemnité"],
  },
  {
    id: "salaire-paiement", numero: null, titre: "Paiement du salaire", texte: "", verifie: false,
    resume: "Le salaire doit être payé régulièrement, aux échéances prévues. Un retard répété peut être signalé à l'inspection du travail et justifier une action en justice.",
    motsCles: ["salaire", "retard", "paiement", "impayé", "inspection"],
  },
  {
    id: "periode-essai", numero: null, titre: "Période d'essai", texte: "", verifie: false,
    resume: "Pendant l'essai, le contrat peut être rompu plus simplement, mais la durée d'essai doit être écrite et respecter le maximum légal.",
    motsCles: ["essai", "période d'essai", "rupture", "contrat"],
  },
  {
    id: "demission", numero: null, titre: "Démission et préavis du salarié", texte: "", verifie: false,
    resume: "Le salarié en CDI peut démissionner en respectant le préavis. Il doit le dire clairement, de préférence par écrit.",
    motsCles: ["démission", "préavis", "salarié", "départ"],
  },
];

export const articleParId = (id: string) => articles.find((a) => a.id === id);
export const libelleArticle = (a: Article) => (a.numero ? `Art. ${a.numero}` : "Art. (n° à confirmer)") + " — " + a.titre;
