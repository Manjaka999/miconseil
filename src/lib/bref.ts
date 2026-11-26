import type { Profil, SituationId } from "../types";

/**
 * « En bref » en langage courant : 2 phrases au plus, sans rien ajouter à ce que dit le Code (les articles cités restent dans le détail).
 * Une entrée peut être une phrase unique ou { e: employeur, s: salarié }.
 */
type Texte = string | { e: string; s: string };

const B: Partial<Record<SituationId, Texte>> = {
  licencier: { e: "Avant de licencier, vous devez prévenir le salarié par écrit, le convoquer au moins 3 jours ouvrables avant et l'écouter (art. 42). Sans cela, le licenciement risque d'être jugé abusif (art. 39).", s: "Votre employeur doit vous dire par écrit pourquoi il veut vous licencier et vous convoquer au moins 3 jours ouvrables avant, pour que vous puissiez vous défendre (art. 42). S'il ne le fait pas, le licenciement peut être jugé abusif (art. 39)." },
  eco: "Un licenciement pour motif économique a ses propres règles (art. 44 et suivants) et ne peut pas viser une personne protégée (art. 31). Demandez toujours les motifs par écrit.",
  cdd_rupture: "Un CDD s'arrête à sa date de fin ; avant, on ne peut le rompre que dans des cas limités (prévus au contrat, faute lourde, force majeure). Sinon, la rupture coûte une indemnité (art. 36).",
  demission: "On peut démissionner librement, mais par écrit et en indiquant le motif (art. 43). Gardez une copie datée de la lettre.",
  demission_forcee: { e: "Ne poussez pas un salarié à partir : utilisez une procédure régulière (licenciement avec convocation ou accord écrit libre). Une rupture imposée peut être jugée abusive et c'est à vous de prouver qu'elle est légitime (art. 39).", s: "Ne signez rien sous pression. Une rupture imposée peut être jugée abusive, et c'est à celui qui rompt de prouver qu'il avait une bonne raison (art. 39 et 96)." },
  statut_impose: { e: "Si la personne travaille sous votre direction et votre autorité, le Code du travail la protège, quel que soit le nom donné au contrat (art. 2). Ne lui faites pas renoncer à ses droits (art. 96).", s: "Si vous travaillez sous les ordres et le contrôle de quelqu'un, le Code peut s'appliquer à vous (art. 2), alors qu'il ne couvre pas les vrais indépendants (art. 1). Ne signez rien, gardez vos preuves : c'est l'inspecteur ou le juge qui tranche." },
  convocation_surprise: { e: "Pour un licenciement, convoquez par écrit au moins 3 jours ouvrables avant, en indiquant les motifs (art. 42). Un entretien surprise vous expose à un licenciement jugé abusif (art. 39).", s: "Un entretien sans prévenir ne respecte pas ce que prévoit l'art. 42 pour un licenciement (écrit, 3 jours ouvrables avant). Ne signez rien, notez tout, demandez un écrit et un délai." },
  preavis: { e: "Sauf faute lourde, si le préavis n'est pas fait, il faut payer la rémunération correspondante à l'autre partie (art. 37).", s: "Sauf faute lourde, si votre préavis n'est pas respecté ou payé, vous pouvez réclamer l'équivalent de sa rémunération (art. 37). Agissez dans les 12 mois (art. 105)." },
  essai: "L'essai doit être écrit, avec le poste, la durée, le salaire et la catégorie (art. 52 et suivants). Vérifiez ce qui est écrit dans votre contrat.",
  certificat: { e: "À la fin du contrat, remettez le certificat de travail et payez ce qui est dû (art. 42).", s: "À la fin du contrat, l'employeur doit vous remettre un certificat de travail et vous payer ce qui vous est dû (art. 42). Demandez-le par écrit." },
  retard_salaire: { e: "Le salaire doit être payé à date fixe ; au-delà du délai légal, il faut ajouter une majoration au taux d'intérêt légal (art. 94). Payez vite et gardez la preuve.", s: "Votre salaire doit être payé à date fixe ; un retard doit rester exceptionnel et très court (art. 94). Gardez vos preuves, réclamez par écrit et agissez dans les 12 mois (art. 105)." },
  salaire_minimum: "Le salaire ne peut pas être inférieur au minimum fixé par décret pour votre catégorie (art. 83 et suivants). Comparez avec le décret en vigueur.",
  heures_sup: "Au-delà de 40 heures par semaine, les heures de travail sont des heures supplémentaires, payées avec majoration (art. 109 et suivants). Notez chaque jour vos heures.",
  duree_repos: "La durée légale est de 40 heures par semaine, avec des repos obligatoires (art. 109 et suivants). Comparez vos horaires à ces règles.",
  feries: "Les jours fériés sont chômés et payés (art. 115). La liste est fixée chaque année.",
  conges: "Le salarié gagne 2,5 jours de congé par mois de travail (art. 125). Les dates et le paiement doivent être réglés à l'avance et par écrit.",
  absence: { e: "Une absence peut justifier une sanction, mais jamais une amende (art. 238) ; pour licencier, la procédure doit être respectée (art. 42).", s: "Si vous êtes absent, envoyez un justificatif écrit. L'employeur peut ne pas vous payer les jours non travaillés (art. 84), mais pas vous infliger d'amende (art. 238)." },
  maladie_certif: "Une maladie constatée par un médecin habilité suspend le contrat (art. 31). Envoyez le certificat à l'employeur et gardez une copie.",
  maladie_licenciement: { e: "Vous ne pouvez pas licencier un salarié pendant une maladie constatée ou un accident du travail dans les limites du Code (art. 31).", s: "Pendant une maladie constatée ou un accident du travail, votre contrat est suspendu et ne peut pas être rompu par l'employeur dans les limites du Code (art. 31). Gardez vos certificats." },
  enceinte: { e: "Vous ne pouvez pas rompre le contrat d'une salariée dont la grossesse est constatée médicalement, sauf motif légitime sans lien avec la grossesse (art. 143 et suivants).", s: "Votre employeur ne peut pas rompre votre contrat à cause d'une grossesse constatée médicalement. Gardez le certificat médical (art. 143 et suivants)." },
  paternite: "Le père a droit à 3 jours de congé à la naissance, payés par l'employeur (art. 134). Prévenez-le par écrit.",
  droit_retrait: "En cas de danger grave pour la santé ou la sécurité, le travailleur peut quitter son poste jusqu'à ce que l'employeur prenne des mesures (art. 173). Prévenez l'employeur par écrit.",
  accident: "Après un accident du travail, le contrat est suspendu et ne peut pas être rompu par l'employeur (art. 31). L'employeur doit protéger la sécurité des travailleurs.",
  enfants: "L'âge minimum pour travailler est de 15 ans, avec l'autorisation d'un parent ou du tuteur (art. 147 et suivants). Vérifiez l'âge sur l'acte de naissance.",
  harcelement: "Le harcèlement moral et la discrimination sont interdits et punis (art. 12, 356 et 358). Notez les faits, gardez les preuves et prévenez l'employeur ou l'inspection.",
  harcelement_sexuel: "Le harcèlement sexuel est interdit et sanctionné (art. 10 et 357). Notez les faits, gardez les preuves et signalez-les ; personne ne peut vous sanctionner pour l'avoir fait (art. 15).",
  greve: "La grève est un droit, mais elle suit une procédure de négociation et de préavis (art. 283 et suivants). Personne ne peut être sanctionné pour avoir fait une grève licite (art. 298).",
  saisir_inspection: "Vous pouvez demander à l'inspection du travail de régler un différend à l'amiable (art. 262). Elle est obligatoire avant le tribunal quand le travailleur est encore sous contrat (art. 263).",
  sanction: { e: "N'appliquez que les sanctions prévues par votre règlement intérieur, après avoir écouté le salarié, et jamais d'amende (art. 234 et 238).", s: "Seules les sanctions prévues au règlement intérieur sont possibles, et jamais d'amende sur le salaire (art. 234 et 238). Demandez la sanction et ses motifs par écrit." },
  delegue: "Un délégué du personnel est protégé : son licenciement doit être autorisé par l'inspecteur du travail (art. 213 et 215).",
  cdd_requalif: "Un CDD peut être renouvelé deux fois ; après cela, il devient automatiquement un CDI (art. 25).",
  teletravail: "Le télétravail doit être prévu par un accord, le contrat ou un avenant, avec des règles claires sur le matériel et les horaires (art. 70 et suivants).",
  modification_contrat: "L'employeur ne peut pas baisser votre salaire, changer votre poste ou votre classification sans votre accord (art. 29). Si c'est le cas, vous pouvez écrire que vous prenez acte de la rupture.",
  chomage_technique: "Le chômage technique est une interruption collective du travail (panne, sinistre, pénurie). Il se déclare à l'avance à l'inspection du travail (art. 31).",
};

/** « En bref » en langage courant, ou undefined si aucun n'est prévu pour la situation (le diagnostic prend alors la première phrase de l'explication). */
export function bref(sid: SituationId, profil: Profil, rep?: Record<string, string>): string | undefined {
  if (sid === "delegue" && rep?.statut === "syndique") return "Un licenciement motivé par l'appartenance à un syndicat est abusif (art. 39) et sanctionné (art. 353).";
  const t = B[sid];
  if (!t) return undefined;
  return typeof t === "string" ? t : profil === "employeur" ? t.e : t.s;
}
