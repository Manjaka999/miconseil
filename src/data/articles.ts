import type { Article } from "../types";

/**
 * Source : loi n° 2003-044 du 28 juillet 2004 portant Code du travail (texte officiel, copie FAOLEX
 * https://faolex.fao.org/docs/pdf/mad208109.pdf). Numéros et extraits vérifiés sur ce texte.
 * ATTENTION : la loi n° 2024-014 portant nouveau Code du travail (promulguée en août 2024) abroge en principe
 * la loi 2003-044 : confirmer la date d'entrée en vigueur et les décrets d'application avant mise en production.
 */
export const articles: Article[] = [
  {
    id: "preavis-indemnite", numero: "18", titre: "Préavis et indemnité compensatrice de préavis (CDI)",
    texte: "Le contrat à durée indéterminée peut cesser par la volonté de l'une des parties. Cette résiliation est subordonnée à un préavis donné par la partie qui prend l'initiative de la rupture. … Sauf en cas de faute lourde, toute rupture de contrat à durée indéterminée sans préavis ou sans que le délai de préavis ait été intégralement observé, emporte obligation pour la partie responsable de la rupture de verser à l'autre partie une indemnité dont le montant correspond à la rémunération et aux avantages de toute nature dont aurait bénéficié le travailleur durant le délai de préavis qui n'aura pas été effectivement respecté. (Art. 19 : en l'absence de convention collective, un décret détermine les conditions et la durée du préavis.)",
    verifie: true,
    resume: "Le CDI se rompt avec un préavis. Sans préavis (ou préavis incomplet), la partie responsable verse l'équivalent de la rémunération du préavis non respecté. La durée du préavis n'est pas dans le Code : elle dépend de la convention collective ou d'un décret.",
    motsCles: ["préavis", "indemnité", "licenciement", "rupture"],
  },
  {
    id: "licenciement-abusif", numero: "20", titre: "Rupture abusive et dommages-intérêts",
    texte: "La rupture est abusive lorsqu'elle est effectuée sans motif légitime, sans cause réelle et sérieuse. Sont particulièrement abusifs les licenciements : non conformes aux procédures définies par le Code, la convention collective et les règlements intérieurs ; effectués sans raisons professionnelles valables ou assortis de motifs fallacieux ; motivés par les opinions du travailleur ou son appartenance à un syndicat. … Toute rupture abusive du contrat de travail peut donner lieu à des dommages intérêts laissés à l'appréciation de la juridiction compétente. Il appartient à la partie auteur de la rupture d'établir que celle-ci est légitime.",
    verifie: true,
    resume: "Un licenciement sans motif réel et sérieux ou sans respect de la procédure est abusif. Le juge fixe les dommages-intérêts, et c'est à celui qui rompt de prouver que la rupture est légitime.",
    motsCles: ["licenciement", "abusif", "dommages", "intérêts", "tribunal", "motif"],
  },
  {
    id: "licenciement-formalites", numero: "22", titre: "Droit de défense avant le licenciement",
    texte: "L'employeur envisageant de licencier un travailleur, en l'absence d'un Conseil de Discipline au sein de l'entreprise, doit respecter le droit à la défense de celui-ci, notamment par l'information écrite préalable de l'intéressé sur les motifs de licenciement, par la communication du dossier des faits reprochés s'il en fait la demande ainsi que par la présentation de ses moyens de défense et son assistance par une personne de son choix. … (Art. 21 : la décision de rupture est notifiée par écrit avec indication des motifs ; est irrecevable tout nouveau motif présenté après la notification.)",
    verifie: true,
    resume: "Avant de licencier, l'employeur informe le salarié par écrit des motifs, lui communique le dossier s'il le demande et le laisse se défendre, assisté d'une personne de son choix. Le licenciement est ensuite notifié par écrit, motifs indiqués.",
    motsCles: ["licenciement", "procédure", "convocation", "faute", "défense", "formalités"],
  },
  {
    id: "faute-lourde", numero: "18", titre: "Faute lourde : rupture sans préavis (CDI)",
    texte: "La rupture d'un contrat à durée indéterminée peut intervenir sans préavis en cas de faute lourde prévue dans le règlement intérieur ou, à défaut, laissée à l'appréciation de la juridiction compétente. (Art. 22 : le licenciement ouvre droit à un préavis, sauf en cas de faute lourde.)",
    verifie: true,
    resume: "Le Code ne définit pas la faute lourde : elle est prévue par le règlement intérieur ou appréciée par le juge. Elle permet une rupture sans préavis, mais l'employeur doit pouvoir la prouver et respecter le droit de défense.",
    motsCles: ["faute lourde", "faute grave", "absence", "abandon", "vol", "licenciement"],
  },
  {
    id: "conges-payes", numero: "86", titre: "Congés payés",
    texte: "Sauf dispositions plus favorables des conventions collectives ou du contrat individuel de travail, le travailleur acquiert droit au congé payé à la charge de l'employeur, à raison de deux jours et demi (02,5 jours) par mois calendaire de service effectif. Le droit se prescrit par trois (03) ans. … (Art. 90 : en cas de rupture ou d'expiration du contrat avant que le travailleur ait exercé ses droits au congé, une indemnité calculée sur la base des droits acquis doit être accordée aux lieux et place du congé.)",
    verifie: true,
    resume: "2,5 jours de congé payé par mois de service effectif (30 jours par an). Le droit de jouissance s'ouvre après 12 mois de service ; les congés non pris à la fin du contrat sont indemnisés (art. 90).",
    motsCles: ["congés payés", "congé", "vacances", "indemnité"],
  },
  {
    id: "salaire-paiement", numero: "63", titre: "Paiement du salaire",
    texte: "La paie est faite à intervalles réguliers, pendant les heures de travail … Les paiements mensuels doivent être effectués, au plus tard huit jours après la fin du mois de travail qui donne droit au salaire. Les retards de paiement doivent être justifiés par la force majeure. Les retards non justifiés du paiement du salaire donnent lieu à majoration selon le taux d'intérêt légal en vigueur.",
    verifie: true,
    resume: "Le salaire mensuel doit être payé au plus tard 8 jours après la fin du mois travaillé. Un retard non justifié par la force majeure donne lieu à majoration au taux d'intérêt légal. L'action en paiement se prescrit par 12 mois (art. 72).",
    motsCles: ["salaire", "retard", "paiement", "impayé", "inspection"],
  },
  {
    id: "periode-essai", numero: "36", titre: "Période d'essai : durée maximale",
    texte: "Le contrat d'engagement à l'essai ne peut pas excéder six (06) mois. Il est renouvelable une seule fois. … (Art. 35 : l'essai doit être stipulé par écrit ; l'essai non stipulé par écrit est réputé inexistant.)",
    verifie: true,
    resume: "L'essai doit être écrit (poste, durée, salaire, catégorie), ne peut pas dépasser 6 mois et n'est renouvelable qu'une fois. Les durées précises relèvent d'un décret (art. 37).",
    motsCles: ["essai", "période d'essai", "rupture", "contrat"],
  },
  {
    id: "demission", numero: "21", titre: "Démission : notification écrite et préavis",
    texte: "La partie qui prend l'initiative de rompre le contrat de travail doit notifier à l'autre partie sa décision écrite avec indication des motifs sur lesquels elle se fonde et la transmettre par tous les moyens probants à celle-ci. La date de réception de la lettre de licenciement ou de démission fixe le point de départ du préavis. … (Art. 22 : Le salarié peut librement démissionner. Toutefois, il est tenu d'indiquer le motif de sa décision et de procéder préalablement à la passation si l'employeur l'exige.)",
    verifie: true,
    resume: "Le salarié peut démissionner librement, par écrit, en indiquant le motif et en faisant la passation si l'employeur l'exige. Le préavis court à partir de la réception de la lettre.",
    motsCles: ["démission", "préavis", "salarié", "départ"],
  },
  {
    id: "cdd-rupture", numero: "17", titre: "Rupture anticipée d'un CDD",
    texte: "Le contrat de travail à durée déterminée ne peut cesser avant terme par la volonté d'une seule des parties, que dans les cas prévus au contrat et dans les cas de faute lourde prévus dans le Règlement Intérieur ou, à défaut, laissés à l'appréciation de la juridiction compétente.",
    verifie: true,
    resume: "Un CDD ne peut être rompu avant son terme par une seule des parties que dans les cas prévus au contrat ou en cas de faute lourde. Sinon la rupture peut être jugée abusive (art. 20).",
    motsCles: ["cdd", "durée déterminée", "rupture anticipée", "terme"],
  },
  {
    id: "indemnite-licenciement", numero: "28", titre: "Indemnité de licenciement (motif économique)",
    texte: "Sauf dispositions plus favorables du contrat individuel ou des conventions collectives, tout travailleur licencié pour motif économique ou pour cessation d'activité de l'entreprise bénéficie d'une indemnité de licenciement calculée à raison de dix jours de salaire par année complète de service, sans que le total puisse excéder six (06) mois de salaire.",
    verifie: true,
    resume: "Pour un licenciement économique ou une cessation d'activité : 10 jours de salaire par année complète, plafonnés à 6 mois de salaire. Elle s'ajoute au préavis et aux congés (le Code ne la prévoit pas expressément pour les autres licenciements).",
    motsCles: ["indemnité", "licenciement", "économique", "ancienneté"],
  },
  {
    id: "essai-rupture", numero: "39", titre: "Rupture pendant l'essai",
    texte: "Les dispositions des articles 10, 11, 15, 16 et 18 du présent Code ne s'appliquent pas à l'engagement à l'essai, sauf convention contraire et sans que l'une ou l'autre des parties puisse prétendre à une indemnité.",
    verifie: true,
    resume: "Pendant l'essai, les règles de rupture du CDI (dont le préavis, art. 18) ne s'appliquent pas, sauf convention contraire : aucune indemnité n'est due du seul fait de la rupture.",
    motsCles: ["essai", "rupture", "préavis", "indemnité"],
  },
];

export const articleParId = (id: string) => articles.find((a) => a.id === id);
export const libelleArticle = (a: Article) => (a.numero ? `Art. ${a.numero}` : "Art. (n° à confirmer)") + " — " + a.titre;
