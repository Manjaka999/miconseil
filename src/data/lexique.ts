/**
 * Lexique : définitions simples, rédigées à partir du texte de la loi n° 2024-014 (Code du travail).
 * Quand le Code ne définit pas un mot, la définition le dit : aucune définition n'est inventée.
 * `arts` = numéros d'articles de la loi 2024-014 sur lesquels repose la définition.
 */
export interface Terme {
  id: string;
  terme: string;
  /** Formes repérées dans les textes (insensible à la casse et aux accents). */
  alias: string[];
  def: string;
  arts: string[];
}

export const lexique: Terme[] = [
  { id: "faute-lourde", terme: "Faute lourde", alias: ["faute lourde"], arts: ["36", "37"],
    def: "Le Code ne la définit pas. Elle est « prévue dans le règlement intérieur ou, à défaut, laissée à l'appréciation de la juridiction compétente ». Elle peut permettre une rupture sans préavis (CDI) ou avant le terme (CDD)." },
  { id: "preavis", terme: "Préavis", alias: ["préavis"], arts: ["37", "38"],
    def: "Délai que doit donner la partie qui rompt un CDI. Sauf faute lourde, sans préavis (ou préavis non respecté en entier), la partie fautive verse l'équivalent de la rémunération et des avantages de la période non respectée. La durée n'est pas fixée par le Code : convention collective plus favorable, sinon décret." },
  { id: "cdi", terme: "CDI", alias: ["CDI", "contrat à durée indéterminée"], arts: ["27", "35"],
    def: "Contrat à durée indéterminée : sans date de fin. Il prend fin par licenciement, démission, accord des parties ou force majeure (art. 35). Certains contrats sont considérés comme CDI, par exemple un CDD qui ne remplit pas ses conditions ou une relation de travail prouvée sans écrit (art. 27)." },
  { id: "cdd", terme: "CDD", alias: ["CDD", "contrat à durée déterminée"], arts: ["25", "36"],
    def: "Contrat à durée déterminée : de 1 mois à 2 ans, renouvelable deux fois, 6 ans au plus au total (art. 25). Il cesse de plein droit à son terme ; avant le terme, une seule partie ne peut le rompre que dans les cas prévus au contrat, en cas de faute lourde ou de force majeure (art. 36)." },
  { id: "periode-essai", terme: "Période d'essai", alias: ["période d'essai", "periode d'essai", "contrat d'essai", "engagement à l'essai", "essai"], arts: ["52", "53"],
    def: "L'essai doit être constaté par un accord écrit précisant au moins le poste, la durée, le salaire et la catégorie ; sans écrit, il est réputé inexistant (art. 52). Il ne peut pas dépasser 6 mois, renouvelable une fois ; un décret en fixe la forme et la durée selon la catégorie (art. 53)." },
  { id: "licenciement-eco", terme: "Licenciement économique", alias: ["licenciement pour motif économique", "licenciement économique", "motif économique"], arts: ["44", "48"],
    def: "Licenciement provoqué par des difficultés économiques, des mutations technologiques ou des motifs d'organisation entraînant une suppression de poste. Il peut être collectif ou individuel (art. 44). Il ouvre droit à l'indemnité de l'art. 48." },
  { id: "mise-a-pied", terme: "Mise à pied", alias: ["mise à pied", "suspension conservatoire"], arts: ["240"],
    def: "Le Code ne définit pas la « mise à pied ». Il encadre la « suspension conservatoire » d'un travailleur en instance disciplinaire : elle est limitée au temps nécessaire à la procédure et le travailleur conserve au moins sa rémunération principale (art. 240)." },
  { id: "prescription", terme: "Prescription", alias: ["prescription", "se prescrit", "prescrit"], arts: ["105", "129"],
    def: "Délai passé lequel on ne peut plus agir. L'action en paiement des salaires et accessoires, des indemnités de préavis et de licenciement se prescrit par 12 mois (art. 105). Le droit au congé payé se prescrit par 3 ans, la preuve contraire restant possible (art. 129)." },
  { id: "inspecteur", terme: "Inspection / inspecteur du travail", alias: ["inspecteur du travail", "inspection du travail"], arts: ["262", "263", "264"],
    def: "Tout travailleur ou employeur peut lui demander de régler un différend à l'amiable (art. 262). Sa saisine est obligatoire avant celle du tribunal si le travailleur est encore sous contrat (art. 263) ; elle est facultative une fois la relation de travail rompue (art. 264)." },
  { id: "solde", terme: "Solde de tout compte", alias: ["solde de tout compte"], arts: ["264", "96"],
    def: "Le Code ne le définit pas. Il vise le « refus de paiement du solde de tout compte » (art. 264). Aucune convention ni transaction ne peut valoir renonciation aux droits tirés du contrat, de la convention collective ou de la loi (art. 96)." },
  { id: "certificat", terme: "Certificat de travail", alias: ["certificat de travail"], arts: ["50"],
    def: "Document que l'employeur doit remettre à la fin du contrat, sous peine de dommages-intérêts. Il indique uniquement la date d'entrée, la date de départ, les emplois occupés, les périodes et les catégories professionnelles. Pendant le préavis, une attestation provisoire d'emploi doit être remise (art. 50)." },
  { id: "delegue", terme: "Délégué du personnel", alias: ["délégué du personnel", "délégués du personnel"], arts: ["215", "221"],
    def: "Représentant élu du personnel, obligatoire dans les établissements de plus de 11 salariés (art. 215). Son licenciement doit être soumis à la décision de l'inspecteur du travail, de même que celui d'un ancien délégué (6 mois après le mandat) ou d'un candidat (art. 221)." },
  { id: "retrait", terme: "Droit d'alerte et de retrait", alias: ["droit de retrait", "droit d'alerte et de retrait", "droit d'alerte"], arts: ["173"],
    def: "En cas de danger menaçant sa santé ou sa sécurité, le travailleur peut quitter temporairement son poste jusqu'à ce que l'employeur ait pris des mesures. L'employeur ne peut pas exiger la reprise tant qu'un péril imminent et grave persiste (art. 173). Un décret fixe les modalités." },
  { id: "chomage-technique", terme: "Chômage technique", alias: ["chômage technique"], arts: ["31"],
    def: "Interruption collective du travail due à des causes techniques, économiques ou accidentelles (panne, sinistre, pénurie…). Il suspend le contrat pour 6 mois consécutifs au plus et se déclare à l'avance à l'inspection du travail (art. 31)." },
  { id: "requalification", terme: "Requalification d'un CDD", alias: ["requalification"], arts: ["25", "27"],
    def: "Le Code n'emploie pas ce mot, mais prévoit qu'un CDD devient automatiquement CDI après deux renouvellements successifs (art. 25) et liste des contrats réputés CDI (art. 27)." },
  { id: "convention-collective", terme: "Convention collective", alias: ["convention collective", "conventions collectives"], arts: ["241"],
    def: "Contrat écrit relatif aux conditions de travail, conclu au niveau d'une entreprise ou au-delà (art. 241). Ses dispositions plus favorables priment sur le Code pour plusieurs points, par exemple le préavis (art. 38)." },
  { id: "harcelement-moral", terme: "Harcèlement moral", alias: ["harcèlement moral"], arts: ["12"],
    def: "Gestes, paroles, écrits, comportements ou attitudes répétés ou systématiques et abusifs, qui dégradent les conditions de travail, portent atteinte aux droits et à la dignité, altèrent la santé ou compromettent l'avenir professionnel (art. 12)." },
  { id: "harcelement-sexuel", terme: "Harcèlement sexuel", alias: ["harcèlement sexuel"], arts: ["10"],
    def: "Le Code protège le salarié : aucune sanction, discrimination ni licenciement ne peut frapper celui qui a résisté à des agissements de harcèlement exercés par une personne abusant de l'autorité de ses fonctions (art. 10)." },
  { id: "greve", terme: "Grève", alias: ["grève"], arts: ["296"],
    def: "Arrêt complet, concerté et collectif du travail décidé par des salariés pour faire aboutir des revendications professionnelles non satisfaites (art. 296)." },
  { id: "sme", terme: "Salaire minimum (SME)", alias: ["SME", "salaire minimum d'embauche", "salaire minimum"], arts: ["85"],
    def: "Salaire minimum d'embauche, agricole et non agricole. Le Code n'en donne pas le montant : un décret le fixe par catégorie professionnelle et le révise périodiquement (art. 85)." },
  { id: "heures-sup", terme: "Heures supplémentaires", alias: ["heures supplémentaires", "heure supplémentaire"], arts: ["109", "110"],
    def: "Heures effectuées au-delà de la durée hebdomadaire légale (40 h par semaine ou 173,33 h par mois, art. 109). Leur taux de majoration est fixé par décret (art. 110) : il n'est pas dans le Code." },
  { id: "suspension", terme: "Suspension du contrat", alias: ["suspendu", "suspension du contrat"], arts: ["31"],
    def: "Le contrat continue d'exister mais le travail s'arrête (maladie constatée, service militaire, chômage technique…). L'employeur ne peut pas rompre un contrat suspendu (art. 31)." },
  { id: "force-majeure", terme: "Force majeure", alias: ["force majeure"], arts: ["36"],
    def: "Événement extérieur qui peut justifier la rupture d'un CDD avant son terme. Le Code précise qu'elle n'inclut pas les difficultés économiques ni les mutations technologiques (art. 36). Son appréciation revient à la juridiction compétente (art. 35)." },
  { id: "reglement-interieur", terme: "Règlement intérieur", alias: ["règlement intérieur"], arts: ["234", "235"],
    def: "Document écrit de l'employeur fixant l'organisation technique, la discipline générale, la nature et le degré des sanctions et les garanties de la défense (art. 234). Obligatoire dans les entreprises de plus de 11 travailleurs (art. 235)." },
  { id: "conge-paye", terme: "Congé payé", alias: ["congé payé", "congés payés"], arts: ["125"],
    def: "Le travailleur acquiert 2,5 jours calendaires de congé par mois de service effectif, sauf dispositions plus favorables de la convention collective ou du contrat (art. 125)." },
  { id: "indemnite-licenciement", terme: "Indemnité de licenciement", alias: ["indemnité de licenciement"], arts: ["48"],
    def: "Prévue pour le licenciement économique ou la cessation d'activité : 10 jours de salaire par année complète de service, plafonnée à 6 mois de salaire (art. 48)." },
  { id: "dommages-interets", terme: "Dommages-intérêts", alias: ["dommages-intérêts", "dommages intérêts"], arts: ["39"],
    def: "Somme versée en réparation d'une rupture abusive. Le Code ne la chiffre pas : c'est la juridiction compétente qui l'apprécie (art. 39)." },
];
