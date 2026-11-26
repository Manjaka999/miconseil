import type { Besoin, SituationDef, SituationId, Theme } from "../types";

export const themes: [Theme, string][] = [
  ["rupture", "Rupture du contrat"],
  ["salaire", "Salaire et durée du travail"],
  ["conges", "Congés et absences"],
  ["sante", "Santé, maternité, sécurité"],
  ["discipline", "Discipline et droits"],
  ["contrats", "Contrats"],
];

const oui = { v: "oui", label: "Oui" }, non = { v: "non", label: "Non" }, nsp = { v: "nsp", label: "Je ne sais pas" };

export const situations: SituationDef[] = [
  { id: "licencier", theme: "rupture", label: "Licenciement / rupture décidée par l'employeur", motsCles: ["renvoi", "renvoyé", "virer", "congédier", "lettre de licenciement", "faute"] },
  {
    id: "eco", theme: "rupture", label: "Licenciement pour motif économique", motsCles: ["difficultés", "compression", "restructuration", "fermeture", "réduction du personnel"],
    questions: [{ id: "nombre", label: "Combien de salariés sont concernés ?", options: [{ v: "un", label: "Un seul salarié" }, { v: "plusieurs", label: "Plusieurs salariés" }] }],
  },
  { id: "cdd_rupture", theme: "rupture", label: "Rupture ou fin d'un CDD", motsCles: ["terme", "fin de contrat", "non renouvellement", "contrat déterminé"] },
  { id: "demission", theme: "rupture", label: "Démission", motsCles: ["partir", "quitter", "démissionner", "lettre de démission"] },
  { id: "demission_forcee", theme: "rupture", label: "On me pousse à démissionner", motsCles: ["forcée", "pression", "obligé", "signer", "rupture amiable", "accord", "prestataire", "facture", "indépendant", "freelance", "convoqué", "choix imposé"] },
  { id: "statut_impose", theme: "rupture", label: "On m'impose un autre statut (prestataire, indépendant) ou de démissionner", motsCles: ["prestataire", "indépendant", "freelance", "auto-entrepreneur", "facture", "faux indépendant", "changer de statut", "contrat de prestation", "démission imposée", "signer une démission", "subordination"] },
  { id: "convocation_surprise", theme: "rupture", label: "Convoqué à l'improviste (entretien ou licenciement sans prévenir)", motsCles: ["convocation", "convoqué", "improviste", "surprise", "sans prévenir", "entretien préalable", "du jour au lendemain", "sur le champ", "immédiatement"] },
  { id: "preavis", theme: "rupture", label: "Préavis non respecté ou non payé", motsCles: ["délai de prévenance", "sans préavis", "indemnité de préavis"] },
  { id: "essai", theme: "rupture", label: "Période d'essai (durée, rupture)", motsCles: ["essai", "renouveler l'essai", "stage", "rupture d'essai"], questions: [{ id: "ecrit", label: "L'essai est-il prévu par écrit (poste, durée, salaire, catégorie) ?", options: [oui, non, nsp] }] },
  { id: "certificat", theme: "rupture", label: "Certificat de travail / solde de tout compte non remis", motsCles: ["attestation", "documents de fin de contrat", "solde", "papiers", "reçu pour solde"] },

  {
    id: "retard_salaire", theme: "salaire", label: "Retard ou non-paiement du salaire", motsCles: ["impayé", "salaire en retard", "pas payé", "paie", "mois sans salaire", "payé en retard"],
    questions: [{ id: "duree", label: "Depuis combien de temps le salaire est-il en retard ?", options: [{ v: "moins1", label: "Moins d'1 mois" }, { v: "1a2", label: "1 à 2 mois" }, { v: "plus2", label: "Plus de 2 mois" }, { v: "repete", label: "Plusieurs fois (retards répétés)" }] }],
  },
  { id: "salaire_minimum", theme: "salaire", label: "Salaire inférieur au minimum", motsCles: ["SME", "smig", "trop bas", "salaire minimum", "égalité de salaire"] },
  {
    id: "heures_sup", theme: "salaire", label: "Heures supplémentaires non payées", motsCles: ["heures sup", "majoration", "dépassement", "travail en plus", "week-end"],
    questions: [{ id: "preuve", label: "Avez-vous une trace écrite des heures faites (relevé, messages, registre) ?", options: [oui, non] }],
  },
  { id: "duree_repos", theme: "salaire", label: "Durée du travail, repos hebdomadaire, travail de nuit", motsCles: ["horaires", "dimanche", "173", "nuit", "repos", "pause"] },
  { id: "feries", theme: "salaire", label: "Jours fériés travaillés ou non payés", motsCles: ["férié", "pont", "jour de fête", "1er mai"] },

  {
    id: "conges", theme: "conges", label: "Congés refusés ou non payés", motsCles: ["vacances", "congé payé", "refus de congé", "reliquat", "solde de congés"],
    questions: [{ id: "type", label: "Quel est le problème ?", options: [{ v: "refus", label: "Congé refusé ou dates imposées" }, { v: "paye", label: "Congé non payé ou mal payé" }, { v: "fin", label: "Congés non pris à la fin du contrat" }] }],
  },
  { id: "absence", theme: "conges", label: "Absence injustifiée ou abandon de poste", motsCles: ["absent", "retard", "ne vient plus", "disparu", "abandon", "retenue sur salaire"] },
  { id: "maladie_certif", theme: "conges", label: "Congé maladie / certificat médical", motsCles: ["arrêt maladie", "médecin", "malade", "arrêt de travail", "certificat médical"] },

  {
    id: "maladie_licenciement", theme: "sante", label: "Licenciement pendant une maladie ou un accident", motsCles: ["arrêt", "malade", "accident", "licencié malade", "longue maladie"],
    questions: [{ id: "cas", label: "Quelle est la situation ?", options: [{ v: "moins6", label: "Maladie constatée par un médecin, depuis moins de 6 mois" }, { v: "plus6", label: "Maladie constatée par un médecin, depuis plus de 6 mois" }, { v: "accident", label: "Accident du travail ou maladie professionnelle" }, { v: "aucun", label: "Pas de constat médical" }] }],
  },
  {
    id: "enceinte", theme: "sante", label: "Grossesse, maternité, allaitement", motsCles: ["enceinte", "grossesse", "maternité", "bébé", "accouchement", "allaiter"],
    questions: [{ id: "constat", label: "La grossesse est-elle constatée médicalement ?", options: [oui, non] }],
  },
  { id: "paternite", theme: "sante", label: "Congé de paternité (naissance)", motsCles: ["père", "naissance", "paternité", "3 jours", "bébé"] },
  { id: "droit_retrait", theme: "sante", label: "Danger au travail : droit d'alerte et de retrait", motsCles: ["danger", "retrait", "alerte", "péril", "machine", "incendie", "risque"] },
  { id: "accident", theme: "sante", label: "Accident du travail / sécurité au poste", motsCles: ["blessure", "blessé", "équipement", "protection", "danger", "maladie professionnelle"] },
  { id: "enfants", theme: "sante", label: "Travail des enfants et des mineurs", motsCles: ["mineur", "moins de 18 ans", "enfant", "apprenti", "15 ans"], questions: [{ id: "age", label: "Quel est l'âge de la personne ?", options: [{ v: "moins15", label: "Moins de 15 ans" }, { v: "15a17", label: "15 à 17 ans" }] }] },

  { id: "harcelement", theme: "discipline", label: "Harcèlement moral ou discrimination", motsCles: ["harcèlement", "discrimination", "humiliation", "menaces", "moral", "égalité", "violence"] },
  { id: "harcelement_sexuel", theme: "discipline", label: "Harcèlement sexuel", motsCles: ["harcèlement sexuel", "avances", "chantage", "faveurs", "sexuel", "dignité"] },
  { id: "greve", theme: "discipline", label: "Grève", motsCles: ["grève", "gréviste", "arrêt de travail collectif", "service minimum", "revendications"] },
  { id: "saisir_inspection", theme: "discipline", label: "Saisir l'inspection du travail ou le tribunal", motsCles: ["inspecteur", "tribunal", "plainte", "conciliation", "litige", "recours", "procès-verbal"] },
  {
    id: "sanction", theme: "discipline", label: "Sanction disciplinaire / mise à pied", motsCles: ["avertissement", "blâme", "mise à pied", "punition", "règlement intérieur"],
    questions: [{ id: "reglement", label: "Existe-t-il un règlement intérieur écrit ?", options: [oui, non, nsp] }],
  },
  {
    id: "delegue", theme: "discipline", label: "Délégué du personnel / liberté syndicale", motsCles: ["syndicat", "syndiqué", "représentant", "grève", "élu"],
    questions: [{ id: "statut", label: "Qui est concerné ?", options: [{ v: "delegue", label: "Un délégué du personnel en fonction" }, { v: "ancien", label: "Un ancien délégué ou un candidat" }, { v: "syndique", label: "Un salarié syndiqué (sans mandat)" }] }],
  },

  {
    id: "cdd_requalif", theme: "contrats", label: "CDD renouvelé plusieurs fois (devient-il un CDI ?)", motsCles: ["requalification", "renouvellement", "cdd à répétition", "enchaîner", "cdi"],
    questions: [
      { id: "renouv", label: "Combien de fois le CDD a-t-il été renouvelé (ou le salarié réembauché au même poste après une interruption de 3 mois au plus) ?", options: [{ v: "0", label: "Jamais" }, { v: "1", label: "1 fois" }, { v: "2", label: "2 fois ou plus" }] },
    ],
  },
  { id: "teletravail", theme: "contrats", label: "Télétravail (travail à distance)", motsCles: ["télétravail", "travail à distance", "domicile", "matériel", "épidémie", "internet"] },
  { id: "modification_contrat", theme: "contrats", label: "Modification du contrat (salaire, poste, classification)", motsCles: ["baisse de salaire", "changement de poste", "rétrogradation", "avenant", "mutation", "prise d'acte"] },
  { id: "chomage_technique", theme: "contrats", label: "Chômage technique", motsCles: ["arrêt d'activité", "panne", "sinistre", "pénurie", "mise en chômage", "suspension collective"] },
];

/** Profil utile par situation : le type de contrat ou l'ancienneté ne sont demandés que si le diagnostic en dépend. */
export const besoins: Partial<Record<SituationId, Besoin>> = {
  licencier: { contrat: true }, eco: { contrat: true }, demission: { contrat: true }, enceinte: { contrat: true },
  conges: { anciennete: true }, essai: { contratImplicite: "essai", anciennete: true }, cdd_requalif: { contratImplicite: "cdd", anciennete: true },
};

/** Raccourcis de la page d'accueil : les cas les plus fréquents. */
export const raccourcis: { id: SituationId; label: string; aide: string }[] = [
  { id: "licencier", label: "Licenciement", aide: "On me renvoie, ou je veux licencier" },
  { id: "retard_salaire", label: "Salaire impayé", aide: "Retard ou non-paiement" },
  { id: "conges", label: "Congés", aide: "Refusés, non payés ou non pris" },
  { id: "demission", label: "Démission", aide: "Partir ou recevoir une démission" },
  { id: "harcelement", label: "Harcèlement", aide: "Moral ou discrimination" },
  { id: "enceinte", label: "Grossesse", aide: "Maternité, allaitement" },
];
