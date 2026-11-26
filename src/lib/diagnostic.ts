import { bref } from "./bref";
import type { Contrat, Diagnostic, ModeleId, Profil, SituationId } from "../types";

/** Ancienneté en mois (-1 = inconnue). `reponses` : réponses aux questions complémentaires (voir data/situations.ts). */
export interface Situation { profil: Profil; contrat: Contrat; anciennete: number; situation: SituationId; reponses: Record<string, string> }

const INSPECTION = "En cas de doute, demandez conseil à l'inspection du travail.";
type Corps = Omit<Diagnostic, "documents"> & { documents?: ModeleId[] };
const fin = (c: Corps): Diagnostic => ({ documents: [], ...c });
/** Ids des articles de la loi n° 2024-014 (data/articles2024.ts). */
const L = (...n: number[]) => n.map((x) => "l24-" + x);

/**
 * Règles tirées uniquement du texte de la loi n° 2024-014 du 14 août 2024 portant Code du travail (articles liés dans chaque résultat).
 * Quand le Code renvoie à un décret, à un arrêté ou à une convention collective, le résultat le dit (champ « nonPrecise ») : aucune règle inventée.
 * Date d'entrée en vigueur : non précisée par le texte (voir BandeauLoi). Orientation générale, pas un avis juridique.
 */
function calcul(s: Situation): Diagnostic {
  const emp = s.profil === "employeur";
  const r = s.reponses;
  switch (s.situation) {
    case "licencier":
      if (s.contrat === "essai") return calcul({ ...s, situation: "essai" });
      if (s.contrat === "cdd") return calcul({ ...s, situation: "cdd_rupture" });
      return fin({
        verdict: "risque", titre: "Licenciement d'un salarié en CDI",
        explication: "Avant tout licenciement, l'employeur informe le salarié par écrit des motifs et le convoque à un entretien préalable, par écrit probant, au moins 3 jours ouvrables à l'avance ; le salarié peut se faire assister par une personne de son choix et obtenir le dossier des faits reprochés (art. 42). S'il refuse la convocation ou ne vient pas sans motif sérieux, il est réputé renoncer à sa défense (art. 42). Le licenciement est ensuite notifié par écrit avec ses motifs ; aucun nouveau motif ne peut être ajouté après la notification (art. 41). Il ouvre droit au solde de salaire, à l'indemnité de congés non pris, au préavis (sauf faute lourde) et au certificat de travail, à payer dès la cessation du travail (art. 42). Un licenciement sans motif légitime ou sans respecter la procédure est abusif, et c'est à celui qui rompt de prouver que sa décision est légitime (art. 39). L'employeur conserve les documents du licenciement au moins 5 ans (art. 42). Attention aux protections cumulables : pas de licenciement pendant la suspension du contrat pour maladie constatée ou accident du travail (art. 31), ni pour une salariée dont la grossesse est constatée (art. 140) ; le licenciement d'un délégué du personnel doit être soumis à l'inspecteur du travail (art. 221) ; un licenciement lié à un harcèlement est imputable à son auteur (art. 40). Si l'un de ces cas vous concerne, consultez aussi la situation correspondante.",
        articles: L(42, 41, 39, 37, 38, 50, 35, 238, 240, 31, 140, 221, 40),
        conseil: emp ? "Ne licenciez jamais sans avoir informé le salarié par écrit, l'avoir convoqué 3 jours ouvrables à l'avance et l'avoir écouté. Si le motif est économique, choisissez plutôt la situation « motif économique »." : "Demandez les motifs et le dossier par écrit, et gardez la lettre de licenciement (le préavis court à sa réception, art. 41).",
        etapes: emp
          ? ["Écrivez au salarié pour lui indiquer les motifs envisagés et le convoquer à un entretien préalable au moins 3 jours ouvrables à l'avance (modèle « Convocation »).", "Écoutez-le ; il peut être assisté d'une personne de son choix.", "Notifiez le licenciement par écrit, avec les motifs, par un moyen qui prouve la réception.", "Payez le solde, les congés non pris et le préavis, remettez le certificat de travail et conservez le dossier 5 ans."]
          : ["Demandez par écrit les motifs et le dossier des faits reprochés.", "Préparez votre défense et venez avec la personne de votre choix (convocation reçue au moins 3 jours ouvrables avant).", "Gardez la lettre de licenciement, vos bulletins de paie et votre contrat.", "Si le licenciement vous semble abusif, contestez par écrit (modèle « Contestation ») puis saisissez l'inspection du travail ou le tribunal."],
        documents: emp ? ["convocation"] : ["contestation", "demande_certificat"],
        nonPrecise: "Le montant des dommages-intérêts n'est pas fixé par le Code : il est laissé au juge (art. 39). La durée du préavis dépend d'un décret ou de la convention collective (art. 38). Le Code ne définit pas la faute lourde : règlement intérieur ou juge (art. 37).",
      });

    case "eco": {
      const collectif = r.nombre === "plusieurs";
      return fin({
        verdict: "risque", titre: collectif ? "Licenciement économique collectif" : "Licenciement économique individuel",
        explication: (s.contrat === "cdd" ? "Attention, CDD : un CDD ne peut être rompu avant son terme que dans les cas prévus au contrat, en cas de faute lourde ou de force majeure, et la force majeure n'inclut pas les difficultés économiques (art. 36). Si le CDD est en réalité devenu un CDI (art. 25 et 27), les règles ci-dessous s'appliquent. " : "") + "Rappel : aucun licenciement n'est possible pendant la suspension du contrat (maladie constatée, accident du travail : art. 31) ni pour une salariée dont la grossesse est constatée médicalement, sauf motif sans lien avec la grossesse (art. 140). Le licenciement économique est provoqué par des difficultés économiques, des mutations technologiques ou des motifs d'organisation entraînant une suppression de poste ; il peut être collectif ou individuel (art. 44). La même procédure s'applique aux deux (art. 45) : l'employeur consulte d'abord le comité d'entreprise ou, à défaut, les délégués du personnel et leur fournit motifs, situation financière, plan de redressement, liste du personnel concerné et priorité de réembauche ; le procès-verbal est affiché ; ils donnent leur avis sous 20 jours ; puis l'inspecteur du travail est obligatoirement saisi et rend son avis sous 15 jours ouvrables (même sans comité ni délégués). " + (collectif ? "La liste des salariés touchés est établie avec les délégués selon le plan social ou, à défaut, l'ancienneté, les compétences et les charges de famille ; en cas de désaccord l'inspecteur décide sous 15 jours ouvrables, son silence valant approbation (art. 46). " : "Si l'employeur propose seulement de modifier le contrat, le salarié répond par écrit sous 15 jours (son silence vaut acceptation) ; s'il refuse, la rupture est imputée à l'employeur avec les droits du licenciement économique (art. 47). ") + "Chaque salarié licencié pour motif économique (ou pour cessation d'activité) a droit à une indemnité de 10 jours de salaire par année complète de service, plafonnée à 6 mois de salaire, en plus du préavis et des congés (art. 48).",
        articles: L(44, 45, ...(collectif ? [46] : [47]), 48, 42, 41, 39, 38, 140, 31, ...(s.contrat === "cdd" ? [36, 25, 27] : [])),
        conseil: emp ? "Conservez les preuves des difficultés économiques et suivez la consultation puis la saisine de l'inspecteur du travail : en cas de contestation, c'est à vous de prouver que le motif est légitime (art. 39)." : "Vérifiez que le motif est réel et que la procédure a été suivie (consultation, avis de l'inspecteur) ; sinon le licenciement peut être jugé abusif (art. 39).",
        etapes: emp
          ? ["Réunissez le comité d'entreprise ou les délégués du personnel et donnez-leur motifs, situation financière, plan de redressement et liste du personnel concerné.", "Affichez le procès-verbal ; ils donnent leur avis sous 20 jours.", "Saisissez l'inspecteur du travail avec le procès-verbal, l'avis et la liste du personnel (même sans délégués).", "Notifiez ensuite chaque licenciement par écrit avec les motifs (modèle « Convocation » pour l'entretien préalable), puis payez préavis, congés et indemnité (voir Simulateur)."]
          : ["Demandez par écrit les motifs précis et les justificatifs.", "Vérifiez que la procédure a été suivie (consultation, avis de l'inspecteur du travail).", "Estimez vos droits dans le Simulateur (choisissez « motif économique »).", "Contestez par écrit si le motif ou la procédure paraît irrégulier (modèle « Contestation »)."],
        documents: emp ? ["convocation"] : ["contestation", "demande_certificat"],
        nonPrecise: "La durée du préavis n'est pas dans le Code : décret ou convention collective (art. 38). Le Code ne précise pas la sanction exacte d'un licenciement économique sans avis de l'inspecteur : c'est le juge qui apprécie (art. 39). " + INSPECTION,
      });
    }

    case "cdd_rupture":
      return fin({
        verdict: "risque", titre: "Rupture anticipée ou fin d'un CDD",
        explication: "Un CDD cesse de plein droit à son terme. Avant le terme, une seule partie ne peut le rompre que dans les cas prévus au contrat, en cas de faute lourde (règlement intérieur ou appréciation du juge) ou de force majeure, laquelle n'inclut pas les difficultés économiques ni les mutations technologiques (art. 36). Hors de ces cas, l'auteur de la rupture doit payer à l'autre une indemnité égale aux salaires et avantages de la période restant à courir (art. 36) ; le Simulateur la calcule. Un CDD dure de 1 mois à 2 ans, peut être renouvelé deux fois (6 ans au plus au total) et se transforme en CDI après deux renouvellements successifs (art. 25) : si c'est votre cas, utilisez plutôt la situation « CDD renouvelé plusieurs fois ». À la fin du contrat, les congés non pris sont indemnisés (art. 133) et le certificat de travail est dû (art. 50).",
        articles: L(36, 39, 25, 27, 133, 50),
        conseil: emp ? "Ne rompez pas avant le terme sans cas prévu au contrat ou faute lourde que vous pouvez prouver ; sinon vous devrez les salaires restant à courir. Proposez plutôt un accord écrit." : "Si on vous renvoie avant le terme sans faute, gardez votre contrat et réclamez par écrit l'indemnité des salaires restant à courir.",
        etapes: emp ? ["Relisez le contrat : prévoit-il des cas de rupture anticipée ?", "Sans cas prévu ni faute lourde prouvée, proposez un accord de fin de contrat écrit.", "À la fin, payez le solde et les congés non pris et remettez le certificat de travail."]
          : ["Gardez le contrat et les bulletins de paie.", "Demandez par écrit les motifs de la rupture.", "Réclamez par écrit les salaires restant à courir (modèle « Contestation »), puis saisissez l'inspection du travail."],
        documents: emp ? [] : ["contestation", "demande_certificat"],
        nonPrecise: "Le Code ne définit pas la faute lourde : règlement intérieur ou juge (art. 36). Les dommages-intérêts pour rupture abusive ne sont pas chiffrés (art. 39). " + INSPECTION,
      });

    case "demission":
      if (s.contrat === "cdi")
        return fin({
          verdict: "conforme", titre: "Démission",
          explication: "Le salarié peut librement démissionner, mais il doit indiquer le motif de sa décision (art. 43). La démission est notifiée par écrit avec ses motifs, par un moyen probant ; la date de réception de la lettre fait partir le préavis (art. 41). Sans préavis, ou avec un préavis incomplet, la partie qui ne le respecte pas verse à l'autre la rémunération et les avantages du préavis non effectué ; le salarié peut demander à l'employeur d'être dispensé de tout ou partie du préavis (art. 37). À la fin du contrat, le salarié doit faire la passation à la date indiquée par l'employeur, au plus tard le dernier jour de travail (art. 51). La salariée enceinte (art. 142) et la mère qui allaite (art. 144) peuvent rompre sans préavis ni indemnité.",
          articles: L(43, 41, 37, 38, 51, 50, 142, 144),
          conseil: emp ? "Prenez acte par écrit, fixez la fin du préavis et préparez le solde (congés non pris inclus) et le certificat de travail." : "Remettez une lettre datée avec le motif, gardez une copie signée ou un accusé de réception.",
          etapes: emp ? ["Accusez réception de la lettre en notant la date.", "Organisez la passation.", "Payez le solde, les congés non pris et remettez le certificat de travail."] : ["Rédigez une lettre datée avec le motif.", "Remettez-la contre signature ou par un moyen qui prouve la réception.", "Faites la passation, puis réclamez le certificat de travail (modèle « Demande de certificat »)."],
          documents: emp ? [] : ["demande_certificat"],
          nonPrecise: "La durée exacte du préavis n'est pas dans le Code : décret ou convention collective (art. 38). Regardez votre contrat ou la convention collective.",
        });
      return fin({
        verdict: "risque", titre: "Démission en CDD ou pendant l'essai",
        explication: "En CDD, la rupture avant le terme par une seule partie n'est possible que dans les cas prévus au contrat, en cas de faute lourde ou de force majeure ; sinon l'auteur doit les salaires restant à courir (art. 36). Pendant l'essai, les articles 29, 33, 35 et 37 ne s'appliquent pas, sauf convention contraire, et aucune indemnité n'est due (art. 55).",
        articles: L(36, 55, 43, 41, 29, 33, 35, 37),
        conseil: "Vérifiez les clauses de votre contrat et privilégiez un accord écrit avec l'autre partie.",
        etapes: ["Relisez le contrat.", "Écrivez votre décision avec le motif (art. 41 et 43).", "Si besoin, proposez un accord écrit de fin de contrat."],
      });

    case "demission_forcee":
      return fin({
        verdict: emp ? "risque" : "info", titre: "Pression pour démissionner",
        explication: "Une démission est notifiée par écrit et doit indiquer le motif (art. 41 et 43). Une rupture imposée peut être jugée abusive : le juge apprécie et c'est à l'auteur de la rupture de prouver qu'elle est légitime (art. 39). Un accord ou une transaction ne peut pas faire renoncer le salarié à ses droits légaux (art. 96). Si l'employeur modifie unilatéralement et moins favorablement la classification, la rémunération ou le poste et que le salarié écrit qu'il prend acte de la rupture, celle-ci est imputée à l'employeur (art. 29). Si la pression est un harcèlement, la rupture est imputable à son auteur (art. 40). Si on vous propose de continuer comme « prestataire » : le Code définit le travailleur comme la personne qui met son activité professionnelle, contre rémunération, sous la direction et l'autorité d'une autre (art. 2), et ne s'applique pas aux travailleurs indépendants (art. 1) ; aucune convention ne peut vous faire renoncer à vos droits (art. 96).",
        articles: L(41, 43, 39, 96, 29, 40, 2, 1),
        conseil: emp ? "Évitez toute pression : si vous voulez mettre fin au contrat, utilisez la procédure de licenciement ou un accord écrit et libre." : "Ne signez rien sous pression. Notez dates, paroles et messages, et demandez toute décision de l'employeur par écrit.",
        etapes: emp ? ["Renoncez à toute pression orale.", "Choisissez la voie régulière : licenciement avec procédure (modèle « Convocation ») ou accord écrit."] : ["Ne signez pas de démission ni de « solde de tout compte » sous pression.", "Gardez les preuves (messages, témoins, dates).", "Écrivez à l'employeur pour contester (modèle « Contestation »).", "Saisissez l'inspection du travail si cela continue."],
        documents: emp ? ["convocation"] : ["contestation"],
        nonPrecise: "Le Code n'emploie pas le terme « démission forcée » et ne traite pas expressément du passage de salarié à « prestataire » : c'est le juge qui qualifie les faits (art. 39).",
      });

    case "statut_impose":
      return fin({
        verdict: "risque", titre: "Changement de statut imposé (prestataire, indépendant) ou démission imposée",
        explication: "Le Code définit le travailleur comme toute personne qui s'engage à mettre son activité professionnelle, moyennant rémunération, sous la direction et l'autorité d'une autre personne ; il vise aussi les personnes qui exécutent habituellement pour le compte et sous l'autorité d'une autre personne le travail par elles-mêmes, quels que soient le mode de rémunération et la durée de travail (art. 2). Il ne s'applique pas aux travailleurs indépendants (art. 1). Aucune convention ou transaction ne peut valoir renonciation du travailleur aux droits qu'il tient de son contrat, de la convention collective et de la loi (art. 96). Une démission est notifiée par écrit avec ses motifs (art. 41 et 43). Une rupture imposée peut être abusive ; c'est à son auteur d'établir qu'elle est légitime, le juge appréciant (art. 39). Un licenciement doit respecter la procédure de défense (art. 42). La saisine de l'inspection du travail est obligatoire avant le tribunal pour un travailleur encore sous contrat (art. 263).",
        articles: L(2, 1, 96, 39, 41, 43, 42, 29, 263, 262),
        conseil: emp ? "Ne changez pas le statut d'un travailleur qui travaille sous votre direction et votre autorité : l'art. 2 le définit par cette subordination. Si vous voulez mettre fin au contrat, suivez la procédure de licenciement ou un accord écrit et libre." : "Ne signez rien tout de suite et gardez les preuves de votre situation de travail (horaires, ordres, outils, lieu). La qualification (salarié ou indépendant) relève de l'inspecteur du travail ou du juge, pas de l'étiquette posée sur le contrat.",
        etapes: emp
          ? ["Vérifiez si la personne travaille sous votre direction et votre autorité (art. 2) : si oui, elle relève du Code.", "Ne lui faites signer aucune renonciation à ses droits (art. 96).", "Pour mettre fin au contrat, utilisez la procédure de licenciement (modèle « Convocation ») ou un accord écrit et libre (art. 42)."]
          : ["Ne signez rien (contrat de prestation, démission, accord, reçu pour solde) avant d'avoir demandé un délai et un écrit.", "Gardez les preuves de subordination : horaires imposés, ordres et consignes (messages, e-mails), outils et matériel fournis, lieu de travail, personne qui contrôle votre travail, bulletins de paie ou paiements reçus.", "Demandez à l'employeur de confirmer par écrit sa décision et ses motifs (art. 41).", "Écrivez pour contester le changement de statut ou la démission demandée (modèle « Contestation »).", "Saisissez l'inspection du travail : elle est obligatoire avant le tribunal tant que vous êtes sous contrat (art. 263)."],
        documents: emp ? ["convocation"] : ["contestation"],
        nonPrecise: "Le Code ne traite pas expressément du passage d'un salarié au statut de « prestataire » ni de la démission imposée, et ne liste pas les critères qui distinguent un indépendant d'un travailleur : c'est l'inspecteur du travail ou le juge qui qualifie les faits. Aucun délai pour contester cette qualification n'est précisé. " + INSPECTION,
      });

    case "convocation_surprise":
      return fin({
        verdict: "risque", titre: "Entretien imposé sans information préalable",
        explication: "Quand l'employeur envisage un licenciement, il doit informer le travailleur par écrit des motifs et le convoquer à un entretien préalable par tout écrit probant, au moins 3 jours ouvrables à l'avance ; le dossier des faits est communiqué sur demande et le travailleur peut se faire assister par une personne de son choix. S'il refuse de recevoir la convocation ou ne se présente pas sans motif sérieux, il est réputé avoir renoncé à son droit de défense ; l'employeur garde les documents au moins 5 ans (art. 42). Un licenciement non conforme aux procédures est particulièrement abusif (art. 39). Pour une sanction autre que le licenciement, le règlement intérieur fixe les garanties de la défense et les délais (art. 234 et 239). Aucune convention ou transaction ne vaut renonciation aux droits du travailleur (art. 96).",
        articles: L(42, 39, 41, 234, 239, 96, 262, 263),
        conseil: emp ? "Convoquez toujours par écrit probant, au moins 3 jours ouvrables avant, en indiquant les motifs ; gardez la preuve de la remise." : "Mieux vaut vous présenter ou prévenir par écrit avec un motif sérieux, car l'absence peut vous faire perdre votre droit de défense. Ne signez rien sur place.",
        etapes: emp
          ? ["Informez le travailleur par écrit des motifs envisagés et convoquez-le par écrit probant, au moins 3 jours ouvrables à l'avance (modèle « Convocation »).", "Communiquez-lui le dossier des faits s'il le demande et laissez-le se faire assister.", "Conservez les documents de la procédure au moins 5 ans (art. 42)."]
          : ["Ne signez rien sur place (accord, démission, reconnaissance des faits, reçu).", "Notez la date, l'heure, le lieu, les personnes présentes et ce qui est dit.", "Demandez par écrit les motifs de l'entretien, le dossier des faits reprochés et un délai d'au moins 3 jours ouvrables pour préparer votre défense (art. 42).", "Demandez à être assisté par une personne de votre choix.", "Écrivez ensuite à l'employeur pour contester la procédure si elle n'a pas été respectée (modèle « Contestation »).", "Saisissez l'inspection du travail si la pression continue (art. 263)."],
        documents: emp ? ["convocation"] : ["contestation"],
        nonPrecise: "L'art. 42 vise le licenciement. Le Code ne dit pas expressément ce qu'il advient d'un entretien tenu le jour même, ni que le travailleur peut refuser d'y assister, ni la valeur d'une signature donnée sur place : c'est l'inspecteur du travail ou le juge qui apprécie. " + INSPECTION,
      });

    case "preavis":
      return fin({
        verdict: "risque", titre: "Préavis non respecté ou non payé",
        explication: "Sauf faute lourde (prévue au règlement intérieur ou appréciée par le juge), toute rupture d'un CDI sans préavis, ou sans préavis complet, oblige la partie qui ne l'a pas respecté à verser à l'autre la rémunération et les avantages du préavis non effectué (art. 37). Le préavis part de la réception de la lettre (art. 41). Pendant le préavis, l'employeur doit remettre dès la notification une attestation provisoire d'emploi, sous peine de dommages-intérêts (art. 38). L'action en paiement des indemnités de préavis se prescrit par 12 mois (art. 105). L'inspecteur du travail peut ordonner le paiement d'une indemnité de préavis due (art. 271).",
        articles: L(37, 38, 41, 105, 271),
        conseil: emp ? "Payez l'indemnité de préavis non effectué, sauf faute lourde que vous pouvez prouver." : "Réclamez l'indemnité par écrit et agissez dans les 12 mois.",
        etapes: emp ? ["Calculez la rémunération du préavis non respecté (Simulateur).", "Payez-la avec le solde."] : ["Relevez la date de réception de la lettre et la durée du préavis dans votre contrat.", "Réclamez l'indemnité par écrit (modèle « Mise en demeure »).", "Saisissez l'inspecteur du travail si elle n'est pas payée (art. 271)."],
        documents: emp ? [] : ["mise_en_demeure"],
        nonPrecise: "La durée du préavis n'est pas fixée par le Code mais par la convention collective ou un décret (art. 38).",
      });

    case "absence":
      return fin({
        verdict: "risque", titre: "Absence injustifiée ou abandon de poste",
        explication: "Le salaire est la contrepartie du travail : aucun salaire n'est dû en cas d'absence, sauf cas prévus par la réglementation ou accord écrit (art. 84). L'absence peut devenir une faute, mais l'employeur ne peut ni infliger d'amende ni de sanction pécuniaire (art. 238). S'il veut licencier, il doit convoquer le salarié par écrit, au moins 3 jours ouvrables à l'avance, et le laisser se défendre (art. 42), puis notifier par écrit avec les motifs (art. 41). La rupture sans préavis n'est possible que pour faute lourde prévue au règlement intérieur ou appréciée par le juge (art. 37). Le règlement intérieur doit fixer un délai raisonnable pour engager la procédure disciplinaire après la constatation des faits (art. 239). Une absence pour maladie constatée ou pour accident du travail est une suspension du contrat (art. 31), pas un abandon.",
        articles: L(84, 42, 41, 37, 238, 239, 31),
        conseil: emp ? "Demandez d'abord des explications par écrit ; n'invoquez pas un « abandon de poste » sans procédure." : "Justifiez chaque absence par écrit (certificat, message) dès que possible.",
        etapes: emp ? ["Demandez des explications écrites et convoquez le salarié au moins 3 jours ouvrables à l'avance (modèle « Convocation »).", "Les jours d'absence ne sont en principe pas payés (art. 84), sauf cas prévus par la réglementation (maladie constatée, accident du travail…).", "Si vous licenciez, notifiez par écrit avec les motifs."] : ["Envoyez un justificatif écrit (certificat médical, message).", "Gardez la preuve de l'envoi.", "En cas de convocation, présentez vos explications et venez assisté."],
        documents: emp ? ["convocation"] : ["contestation"],
        nonPrecise: "Le Code ne définit pas l'« abandon de poste » ni le nombre de jours d'absence qui constitue une faute : voir le règlement intérieur ou l'inspection du travail.",
      });

    case "essai": {
      const ecrit = r.ecrit;
      const long = s.contrat === "essai" && s.anciennete > 6;
      return fin({
        verdict: ecrit === "non" || long ? "risque" : "info", titre: "Période d'essai",
        explication: `L'engagement à l'essai et son renouvellement doivent être constatés par un accord écrit précisant au moins le poste, la durée, le salaire et la catégorie professionnelle ; dans tout contrat (CDD ou CDI), l'essai non écrit est réputé inexistant (art. 52). L'essai ne peut pas excéder 6 mois, renouvelable une fois ; un décret fixe la forme et la durée selon la catégorie professionnelle (art. 53). Le travailleur à l'essai a les mêmes conditions de travail et de protection sociale que les travailleurs confirmés (art. 54). Les articles 29, 33, 35 et 37 ne s'appliquent pas à l'essai, sauf convention contraire, et aucune partie ne peut prétendre à une indemnité (art. 55). Une maladie constatée suspend l'essai, qui est ensuite prorogé (art. 56). La grossesse ne peut pas justifier la rupture (art. 141).${ecrit === "non" ? " Ici, l'essai n'est pas écrit : il est donc réputé inexistant (art. 52) et le contrat suit les règles ordinaires." : ""}${long ? " L'ancienneté indiquée dépasse 6 mois : vérifiez que le renouvellement est bien écrit (art. 52) ; si, à la fin de l'essai, personne n'a manifesté sa volonté de cesser la relation, le contrat est réputé à durée indéterminée (art. 27)." : ""}`,
        articles: L(52, 53, 54, 55, 56, 57, 141, 27, 29, 33, 35, 37),
        conseil: emp ? "Faites signer l'essai avant le début du travail et notez les dates de fin et de renouvellement (le renouvellement aussi doit être écrit)." : "Relisez votre contrat : l'essai y est-il écrit avec durée, poste, salaire et catégorie ?",
        etapes: emp ? ["Vérifiez que l'écrit d'essai contient poste, durée, salaire, catégorie.", "Notifiez la rupture par écrit, datée, avec accusé de réception."] : ["Cherchez dans votre contrat la mention de l'essai.", "S'il est trop long ou non écrit, signalez-le à l'inspecteur du travail (qui peut constater les abus d'essai, art. 57).", "Gardez vos bulletins de paie."],
        nonPrecise: "Les durées précises d'essai par catégorie sont fixées par décret (art. 53), pas par le Code lui-même. Le texte ne dit pas clairement si les 6 mois incluent le renouvellement : " + INSPECTION,
      });
    }

    case "certificat":
      return fin({
        verdict: emp ? "risque" : "info", titre: "Certificat de travail et solde de tout compte",
        explication: "À la fin du contrat, l'employeur doit remettre un certificat de travail indiquant uniquement la date d'entrée, la date de départ, les emplois occupés, les périodes et les catégories professionnelles, sous peine de dommages-intérêts ; pendant le préavis, une attestation provisoire d'emploi est due (art. 50 et 38). Un licenciement ouvre droit au solde de salaire, aux congés non pris, au préavis (sauf faute lourde) et au certificat, à régler dès la cessation du travail (art. 42). Accepter un bulletin de paie sans réserve ne vaut pas renonciation à ce qui est dû (art. 95) et aucune transaction ne fait perdre ses droits légaux (art. 96). Après la rupture, la saisine de l'inspecteur du travail est facultative, notamment en cas de refus de paiement du solde de tout compte (art. 264) ; il peut ordonner la remise du certificat et le paiement des sommes dues (art. 271). Les salaires et indemnités de préavis et de licenciement se réclament dans les 12 mois (art. 105).",
        articles: L(50, 38, 42, 95, 96, 264, 271, 105),
        conseil: emp ? "Préparez le certificat dès la fin du contrat : il ne doit contenir que les mentions prévues." : "Réclamez le certificat par écrit et gardez la preuve de votre demande.",
        etapes: emp ? ["Rédigez le certificat avec uniquement les mentions prévues par l'art. 50.", "Remettez-le avec le solde de tout compte contre signature."] : ["Envoyez la demande de certificat (modèle « Demande de certificat »).", "Sans réponse, envoyez une mise en demeure.", "Saisissez l'inspecteur du travail (art. 271), dans les 12 mois pour les sommes dues."],
        documents: emp ? [] : ["demande_certificat", "mise_en_demeure"],
      });

    case "retard_salaire": {
      const du = r.duree ?? "moins1";
      const dur = ({ moins1: "moins d'un mois", "1a2": "1 à 2 mois", plus2: "plus de 2 mois", repete: "plusieurs fois" } as Record<string, string>)[du] ?? "moins d'un mois";
      const grave = du !== "moins1";
      const preuves = "Gardez les preuves : bulletins de paie (art. 95), relevés bancaires ou reçus montrant les dates réelles de paiement, messages de l'employeur sur le retard.";
      const reserve = "Si on vous fait signer un bulletin ou un reçu, ajoutez « sous toutes réserves » : l'acceptation sans réserve ne vaut pas renonciation à votre salaire (art. 95). Ne signez aucun papier qui renonce à vos droits (art. 96).";
      const delaiTxt = "Le droit de réclamer les salaires se prescrit par 12 mois (art. 105). Le Code ne précise pas à partir de quand ces 12 mois courent : n'attendez pas.";
      return fin({
        verdict: grave ? "illegal" : emp ? "risque" : "info", titre: "Retard de paiement du salaire (" + dur + ")",
        explication: "Le salaire est payé à intervalles réguliers (jour, semaine, quinzaine ou mois). Les retards doivent être justifiés par la force majeure ; même alors, le salaire doit être payé au plus tard le 8e jour pour un salaire à la journée ou à la semaine, le 20e jour pour une quinzaine, et 8 jours après l'échéance mensuelle pour un salaire mensuel. Un retard d'un mois ou plus dépasse donc ces limites. Tout retard non justifié donne lieu à majoration au taux d'intérêt légal, sans préjudice des sanctions pénales (art. 94). Le paiement est constaté par un bulletin de paie (art. 95). L'action en paiement se prescrit par 12 mois (art. 105). Tant que le contrat est en cours, la saisine de l'inspection du travail est obligatoire avant le tribunal (art. 263) ; l'inspecteur peut ordonner le paiement d'un salaire dû (art. 271).",
        articles: L(94, 95, 96, 105, 263, 271, 369),
        conseil: emp ? "Régularisez vite et gardez la preuve du paiement et du bulletin." : grave ? "Réclamez par écrit sans attendre et saisissez l'inspecteur du travail ; ne dépassez pas 12 mois." : "Rappelez la date prévue à l'employeur par écrit et gardez vos preuves ; passez à la mise en demeure si le retard continue.",
        etapes: emp
          ? [grave ? "Payez sans attendre les mois dus, avec la majoration au taux d'intérêt légal (art. 94)." : "Payez le salaire dû ; si le retard n'est pas justifié par la force majeure, ajoutez la majoration au taux d'intérêt légal (art. 94).", "Remettez les bulletins de paie (art. 95).", "Gardez la preuve du paiement (relevé bancaire ou reçu).", ...(grave ? ["Présentez-vous à la convocation de l'inspection du travail si vous en recevez une (art. 263)."] : [])]
          : du === "moins1"
            ? ["Comparez la date de paiement avec la date prévue : au plus tard le 8e jour (salaire à la journée ou à la semaine), le 20e jour (quinzaine) ou 8 jours après l'échéance (mois), même en cas de force majeure (art. 94).", preuves, "Rappelez par écrit à l'employeur la date prévue et demandez le paiement.", reserve, "Envoyez une mise en demeure écrite (modèle « Mise en demeure ») si le retard continue."]
            : [preuves, "Listez les mois impayés, les montants et les dates prévues de paiement.", "Envoyez une mise en demeure écrite (modèle « Mise en demeure »).", du === "1a2" ? "Saisissez l'inspecteur du travail si le salaire n'est pas payé après la mise en demeure : c'est obligatoire avant le tribunal tant que le contrat est en cours (art. 263)." : "Saisissez l'inspecteur du travail sans attendre longtemps après la mise en demeure : il peut ordonner le paiement du salaire dû (art. 263 et 271).", reserve, "Agissez dans les 12 mois (art. 105)."],
        documents: emp ? [] : ["mise_en_demeure"],
        delai: delaiTxt,
        nonPrecise: "Le taux d'intérêt légal n'est pas indiqué dans le Code du travail. Un arrêté du Ministre du Travail fixe les formes et modalités de paiement du salaire (art. 94)." + (du === "repete" ? " Le Code ne précise pas la conséquence de retards répétés (par exemple le droit de rompre le contrat aux torts de l'employeur) : demandez à l'inspection du travail." : " Le Code ne précise pas non plus si un retard de salaire permet à lui seul de rompre le contrat aux torts de l'employeur.") + " Le point de départ des 12 mois n'est pas précisé.",
      });
    }

    case "salaire_minimum":
      return fin({
        verdict: emp ? "risque" : "info", titre: "Salaire inférieur au minimum",
        explication: "Un salaire minimum d'embauche (SME), agricole et non agricole, est institué ; un décret le fixe par catégorie professionnelle, avec les indices, la valeur du point et les minima d'ancienneté, et le révise périodiquement (art. 85). À travail égal ou de valeur égale, la rémunération est égale pour tous, sans discrimination ; seules des différences de compétences ou de performances objectivement mesurées sont admises (art. 83). Pour le travail à la tâche, aux pièces ou au rendement, le salaire d'un travailleur de capacité moyenne doit être au moins égal à celui d'un travailleur payé au temps pour un travail analogue (art. 87). Les travailleurs payés à l'heure ou à la journée sont payés au mois après 6 mois de service continu (art. 86). Le montant du SME est fixé par décret et n'est pas dans le Code.",
        articles: L(85, 83, 87, 86, 105),
        conseil: emp ? "Vérifiez le SME en vigueur pour la catégorie de chaque salarié." : "Demandez le montant du SME de votre catégorie à l'inspection du travail et comparez-le à votre bulletin de paie.",
        etapes: emp ? ["Demandez le décret du SME à l'inspection du travail.", "Comparez-le à chaque salaire et régularisez."] : ["Notez votre catégorie professionnelle.", "Demandez le SME à l'inspection du travail.", "Si votre salaire est plus bas, réclamez la différence par écrit (modèle « Mise en demeure »), dans les 12 mois (art. 105)."],
        documents: emp ? [] : ["mise_en_demeure"],
        nonPrecise: "Le montant du SME n'est pas précisé par le Code : à demander à l'inspection du travail.",
      });

    case "heures_sup": {
      const preuve = r.preuve === "oui";
      return fin({
        verdict: emp ? "risque" : "info", titre: "Heures supplémentaires",
        explication: "La durée légale du travail est de 173,33 heures par mois ou de 40 heures par semaine. Quel que soit le mode de rémunération, les heures effectuées au-delà de la durée hebdomadaire sont des heures supplémentaires (art. 109). Dans l'agriculture, la base est de 2 200 heures par an, avec des modalités fixées par voie réglementaire (art. 109). Des décrets fixent par branche et catégorie la nature et la durée maximale des heures supplémentaires (avec ou sans autorisation préalable) ainsi que leur taux de majoration (art. 110). Les heures d'équivalence jouent en matière d'heures supplémentaires (art. 112). Les temps d'habillage, de déshabillage et de restauration ne comptent pas dans le travail effectif (art. 108). L'action en paiement des salaires se prescrit par 12 mois (art. 105)." + (preuve ? "" : " Sans trace écrite, il sera plus difficile de prouver les heures faites."),
        articles: L(109, 110, 112, 108, 105),
        conseil: emp ? "Tenez un relevé des heures et payez les heures supplémentaires avec la majoration." : "Reconstituez dès maintenant vos heures (dates, heures, messages, témoins) et réclamez par écrit.",
        etapes: emp ? ["Faites le relevé des heures au-delà de 40 h par semaine.", "Calculez la majoration prévue par le décret de votre branche.", "Payez-les avec le bulletin de paie."] : ["Notez chaque jour les heures faites en plus (au-delà de 40 h par semaine).", "Réclamez le paiement par écrit (modèle « Mise en demeure »).", "Agissez dans les 12 mois."],
        documents: emp ? [] : ["mise_en_demeure"],
        nonPrecise: "Le taux de majoration des heures supplémentaires et leur durée maximale ne sont pas dans le Code : ils sont fixés par décret (art. 110). Demandez-les à l'inspection du travail.",
      });
    }

    case "duree_repos":
      return fin({
        verdict: "info", titre: "Durée du travail, repos et nuit",
        explication: "La durée légale est de 173,33 heures par mois ou 40 heures par semaine (art. 109). Le repos journalier continu est d'au moins 12 heures (art. 113). Le repos hebdomadaire est obligatoire : 24 heures consécutives au minimum, en principe le dimanche, avec des exceptions fixées par décret (art. 114). Le travail entre 22 h et 5 h est du travail de nuit (art. 118), avec une majoration de salaire dont les taux sont fixés par décret (art. 123). Les temps d'habillage, de déshabillage et de restauration ne comptent pas dans le travail effectif (art. 108). Le refus du repos journalier ou hebdomadaire est puni d'une amende après mise en demeure de l'inspecteur (art. 370).",
        articles: L(109, 108, 113, 114, 118, 123, 110, 370),
        conseil: emp ? "Organisez les plannings pour garantir 12 h de repos par jour et 24 h par semaine, et comptez les heures au-delà de 40 h par semaine comme supplémentaires." : "Notez vos horaires réels : ils servent de preuve en cas de désaccord.",
        etapes: ["Comparez vos horaires de la semaine à 40 heures.", "Vérifiez que vous avez au moins 12 heures de repos par jour et 24 heures consécutives par semaine.", "En cas de désaccord, voir « Heures supplémentaires » ou l'inspection du travail."],
        nonPrecise: "Les pauses, les exceptions au repos du dimanche et les majorations dépendent de décrets ou d'accords négociés (art. 108, 110, 114, 123).",
      });

    case "feries":
      return fin({
        verdict: "info", titre: "Jours fériés",
        explication: "Les jours fériés et les jours « ponts » sont chômés et payés ; la liste annuelle limitative est fixée par décret en début d'année (art. 115). Un décret fixe aussi le taux de majoration du travail du dimanche et des jours fériés (art. 116). Employer un travailleur un jour férié en dehors des dérogations du décret annuel est puni d'une amende, après mise en demeure de l'inspecteur (art. 370).",
        articles: L(115, 116, 370),
        conseil: emp ? "Payez les jours fériés non travaillés comme des jours normaux." : "Si un jour férié n'est pas payé, vérifiez-le sur votre bulletin de paie et réclamez par écrit.",
        etapes: ["Consultez la liste officielle des jours fériés de l'année.", "Vérifiez le bulletin de paie.", "Réclamez la régularisation par écrit si besoin (modèle « Mise en demeure »)."],
        documents: emp ? [] : ["mise_en_demeure"],
        nonPrecise: "Le taux de majoration du travail un jour férié ou le dimanche est fixé par décret (art. 116), pas par le Code : demandez-le à l'inspection du travail.",
      });

    case "conges": {
      const t = r.type;
      const base = "Le salarié acquiert 2,5 jours calendaires de congé par mois de service effectif (art. 125). La jouissance du congé est acquise après 12 mois de service effectif (art. 130).";
      const detail = t === "refus"
        ? " Les dates de début et de fin sont déterminées à l'avance par les parties ; la première fraction de 15 jours est prise sans interruption dans les 3 mois suivant l'ouverture du droit, la seconde peut être fractionnée avant la fin de l'année ou cumulée sur 3 ans (art. 130). Si l'établissement n'a pas de fermeture périodique, l'employeur fixe l'époque après consultation des délégués ou des salariés, dans le cadre du planning de début d'année qu'il doit établir (art. 128 et 130). Le droit au congé se prescrit par 3 ans, sauf preuve que l'employeur a empêché d'en jouir (art. 129). Toute renonciation au congé est nulle, et tant que le contrat dure, une indemnité à la place du congé aussi (art. 132). Refuser tout ou partie du congé annuel est puni d'une amende après mise en demeure (art. 370)."
        : t === "paye"
          ? " Pendant le congé, l'allocation est au moins égale au douzième des rémunérations des 12 derniers mois (hors remboursements de frais) et doit être versée avant le départ, sauf accord écrit contraire (art. 131). Les commissions et primes entrent dans le calcul sur la moyenne des 12 derniers mois (art. 88)."
          : " Si le contrat prend fin avant que les congés aient été pris, une indemnité compensatrice calculée sur les droits acquis est due en lieu et place du congé (art. 133) ; elle fait partie des sommes que l'inspecteur du travail peut faire payer (art. 271).";
      const ouvert = s.anciennete < 0 || s.anciennete >= 12 ? "" : " Avec moins de 12 mois d'ancienneté, le congé ne peut pas encore être exigé (art. 130), mais les jours s'acquièrent déjà (art. 125).";
      return fin({
        verdict: emp ? "info" : "risque", titre: "Congés payés",
        explication: base + detail + ouvert + " Les jours fériés et les absences régulières ou suspensions légales pour maladie ou accident ne sont pas décomptés du congé (art. 127) ; maladie certifiée (6 mois au plus), accident du travail, maternité et paternité comptent comme du service effectif (art. 126).",
        articles: L(125, 130, ...(t === "paye" ? [131, 88] : []), ...(t === "fin" ? [133, 271] : [128, 129, 132]), 126, 127, 370),
        conseil: emp ? "Planifiez les congés en début d'année et conservez la preuve des dates accordées." : "Faites votre demande de congé par écrit et gardez la réponse.",
        etapes: t === "fin"
          ? [emp ? "Calculez les jours acquis non pris et payez l'indemnité avec le solde (Simulateur)." : "Calculez vos jours acquis non pris (Simulateur) et réclamez par écrit.", emp ? "Remettez le certificat de travail." : "Si rien n'est payé, saisissez l'inspecteur du travail (art. 271)."]
          : [emp ? "Fixez les dates avec le salarié, par écrit." : "Demandez les dates par écrit, avec un délai raisonnable.", emp ? "Versez l'allocation avant le départ." : "Gardez la réponse de l'employeur.", "En cas de blocage, contactez l'inspection du travail."],
        documents: emp ? [] : ["mise_en_demeure"],
        nonPrecise: "Le Code n'indique pas de délai de prévenance précis pour la demande de congé.",
      });
    }

    case "maladie_certif":
      return fin({
        verdict: "info", titre: "Congé maladie et certificat médical",
        explication: "Le contrat est suspendu pendant une absence pour maladie nécessitant un arrêt prolongé, dûment constatée par le service médical du travail ou, à défaut, par un médecin agréé, dans la limite de 6 mois consécutifs ; l'employeur ne peut pas rompre un contrat suspendu (art. 31). Passé 6 mois, il peut rompre mais doit régler tous les droits du travailleur, notamment le préavis (art. 31). Pendant la suspension, l'employeur verse une « indemnité de suspension » égale à la rémunération, dans la limite d'un mois si le préavis normal est plus court, et dans la limite du préavis normal dans les autres cas (art. 32). Pour la maladie d'un enfant (hospitalisation ou arrêt justifié par certificat) la suspension est limitée à 2 mois, et à 15 jours pour l'hospitalisation du conjoint (art. 31). Ces absences comptent comme du service effectif pour les congés (6 mois au plus pour la maladie, art. 126). Pour une maladie de longue durée (plus de 6 mois, liste par arrêté), l'indemnité relève du Code de protection sociale (art. 33).",
        articles: L(31, 32, 33, 126, 84),
        conseil: emp ? "Ne sanctionnez pas une absence couverte par un certificat d'un médecin habilité." : "Faites constater votre maladie par un médecin du service médical du travail ou agréé et remettez le certificat à l'employeur, en gardant une copie.",
        etapes: emp ? ["Demandez le certificat et classez-le.", "Ne licenciez pas pendant la suspension."] : ["Consultez un médecin habilité.", "Remettez le certificat (gardez la preuve de remise).", "Prévenez l'employeur par écrit."],
        nonPrecise: "Le Code ne fixe pas de délai pour remettre le certificat. La liste des maladies de longue durée est fixée par arrêté (art. 33). " + INSPECTION,
      });

    case "maladie_licenciement": {
      const c = r.cas;
      const phrase: Record<string, string> = {
        moins6: "Le contrat est suspendu pendant une maladie constatée par le service médical du travail ou un médecin agréé, dans la limite de 6 mois consécutifs : l'employeur ne peut pas le rompre (art. 31) et doit verser l'indemnité de suspension (art. 32).",
        plus6: "Après 6 mois consécutifs d'absence pour maladie, l'employeur peut rompre le contrat, mais il doit régler tous les droits du travailleur, notamment le préavis (art. 31). La procédure de licenciement (convocation, entretien, notification écrite) reste obligatoire (art. 41 et 42).",
        accident: "Pendant l'arrêt de travail consécutif à un accident du travail ou à une maladie professionnelle, le contrat est suspendu et l'employeur ne peut pas le rompre (art. 31, cas n° 9). Le texte ne fixe pas de limite de durée pour cette suspension.",
        aucun: "La protection de l'article 31 vise une maladie « dûment constatée » par le service médical du travail ou un médecin agréé. Sans constat médical, elle ne s'applique pas ; faites constater l'arrêt.",
      };
      const protege = c === "moins6" || c === "accident";
      return fin({
        verdict: emp ? (protege ? "illegal" : "risque") : "info", titre: "Licenciement pendant une maladie ou un accident",
        explication: (phrase[c] ?? phrase.aucun) + " Une rupture sans respecter la procédure ou sans motif légitime reste abusive (art. 39). Un travailleur certifié inapte au travail de nuit ne peut être licencié que si son transfert à un poste de jour similaire n'est pas possible (art. 121 et 122).",
        articles: L(31, 32, 33, 39, 42, 41, 121, 122),
        conseil: emp ? (protege ? "Ne rompez pas le contrat pendant la suspension." : "Même si vous pouvez rompre, respectez la procédure et réglez tous les droits, préavis compris.") : "Gardez tous vos certificats et envoyez-les à l'employeur avec preuve de remise.",
        etapes: emp ? ["Vérifiez la nature et la durée de l'arrêt.", "N'engagez aucune rupture pendant la suspension.", "Après 6 mois de maladie, si vous rompez, suivez la procédure et payez préavis et congés."] : ["Rassemblez certificats médicaux et lettre de l'employeur.", "Contestez par écrit (modèle « Contestation »).", "Saisissez l'inspecteur du travail ; le tribunal fixe les dommages-intérêts."],
        documents: emp ? ["convocation"] : ["contestation"],
        nonPrecise: "Le montant des dommages-intérêts est laissé au juge (art. 39).",
      });
    }

    case "enceinte": {
      const constat = r.constat === "oui";
      return fin({
        verdict: emp ? (constat && s.contrat !== "cdd" ? "illegal" : "risque") : "info", titre: "Grossesse et maternité",
        explication: `Un employeur ne peut pas rompre le contrat d'une salariée dont la grossesse est constatée médicalement, sauf pour des motifs légitimes, causes réelles et sérieuses non liés à la grossesse (art. 140).${constat ? "" : " Ici, la grossesse n'est pas encore constatée médicalement : faites-la constater pour bénéficier de cette protection."} La protection n'empêche pas un CDD d'arriver à son terme (art. 140) ; mais un CDD renouvelé deux fois peut être devenu un CDI (art. 25). La grossesse ne peut pas justifier la fin d'un essai (art. 141). Une candidate à l'emploi n'est pas tenue de déclarer sa grossesse, sauf pour les travaux interdits ou à risque (art. 138). La femme enceinte peut rompre son contrat sans préavis ni indemnité (art. 142). Si son emploi présente un risque, elle est affectée à un emploi adapté en gardant son salaire fixe (art. 139) ; elle ne doit pas travailler la nuit pendant au moins 16 semaines autour de la naissance (art. 146). Le congé de maternité est de 14 semaines consécutives dont 8 après l'accouchement, prolongeable de 4 semaines au plus sur constat médical ; la salariée perçoit la totalité de son salaire, moitié par la CNaPS, moitié par l'employeur (art. 143). Après la naissance, repos d'allaitement payés jusqu'à 1 heure par jour pendant 15 mois (art. 144). La discrimination fondée sur la grossesse est punie d'une amende (art. 356).`,
        articles: L(140, 143, 144, 141, 142, 138, 139, 146, 25, 356),
        conseil: emp ? "Ne rompez pas le contrat à cause de la grossesse. Vérifiez si un CDD n'est pas déjà devenu CDI." : "Faites constater la grossesse par un médecin, informez l'employeur par écrit, gardez une copie.",
        etapes: emp ? ["Demandez le certificat médical et classez-le.", "Ne notifiez aucune rupture liée à la grossesse.", "Préparez le congé de maternité (14 semaines) et le versement de votre moitié du salaire (art. 143)."] : ["Obtenez le certificat médical.", "Envoyez-le à l'employeur avec preuve de remise.", "En cas de licenciement ou de non-renouvellement, contestez par écrit (modèle « Contestation ») puis saisissez l'inspection du travail."],
        documents: emp ? [] : ["contestation"],
        nonPrecise: "Le détail des prestations de la CNaPS relève du Code de protection sociale, pas du Code du travail. Le décret listant les travaux interdits aux femmes enceintes n'est pas dans le Code (art. 137).",
      });
    }

    case "accident":
      return fin({
        verdict: "info", titre: "Accident du travail et sécurité",
        explication: "Pendant l'arrêt consécutif à un accident du travail ou à une maladie professionnelle, le contrat est suspendu et ne peut pas être rompu par l'employeur (art. 31). Ces absences comptent comme du service effectif pour les congés (art. 126). L'employeur doit assurer la sécurité et la santé des travailleurs (art. 163), évaluer les risques (document unique d'évaluation des risques, DUER) et établir chaque année un plan d'action de prévention (art. 164), fournir gratuitement les équipements de protection (art. 165), prévoir les mesures d'urgence et les premiers secours (art. 167), informer et former les travailleurs gratuitement (art. 168 et 169). Les mesures de sécurité ne doivent entraîner aucune dépense pour les travailleurs (art. 174). Dès 50 travailleurs, un comité sécurité et santé au travail est obligatoire (art. 171). Un lieu de travail à risques certains sans protection, malgré mise en demeure, est puni de prison et/ou d'amende (art. 363).",
        articles: L(31, 126, 163, 164, 165, 167, 168, 169, 174, 171, 363),
        conseil: emp ? "Fournissez les équipements, formez le personnel et déclarez l'accident selon la réglementation de protection sociale." : "Faites constater la blessure par un médecin et prévenez l'employeur par écrit le plus tôt possible.",
        etapes: emp ? ["Faites soigner le salarié.", "Déclarez l'accident aux organismes compétents.", "Corrigez la cause : équipement, formation, évaluation des risques."] : ["Consultez un médecin.", "Prévenez l'employeur par écrit et gardez une copie.", "Contactez l'inspection du travail si l'équipement de sécurité manque."],
        nonPrecise: "L'indemnisation de l'accident du travail relève du Code de protection sociale (CNaPS), non précisé par le Code du travail. Les modalités du DUER et du PAP sont fixées par décret (art. 164).",
      });

    case "enfants": {
      const jeune = r.age === "moins15";
      return fin({
        verdict: emp ? (jeune ? "illegal" : "risque") : "info", titre: "Travail des enfants et des mineurs",
        explication: `L'âge minimum d'accès à l'emploi est de 15 ans, sans pouvoir être inférieur à l'âge de fin de scolarité obligatoire ; l'autorisation expresse d'un parent ou du tuteur est obligatoire pour employer un mineur (art. 147).${jeune ? " Avant 15 ans, un enfant ne peut être employé, même comme apprenti, qu'avec l'autorisation de l'inspecteur du travail et pour des travaux non nuisibles à sa santé et à son développement (art. 150)." : ""} Avant 18 ans : 8 heures par jour et 40 heures par semaine au maximum, ni travail de nuit ni heures supplémentaires, 12 heures de repos consécutives par jour (art. 149). Les enfants et adolescents ne sont admis à un emploi qu'après examen médical (art. 151). Des décrets listent les travaux interdits aux enfants (art. 148). Employer un enfant de moins de 15 ans en violation de ces règles est puni de 3 mois à 1 an de prison et d'une amende de 1 à 4 millions d'Ariary (art. 360).`,
        articles: L(147, 150, 149, 151, 148, 360),
        conseil: emp ? "N'employez pas de personne de moins de 15 ans sans autorisation de l'inspecteur du travail, et jamais sans l'accord d'un parent ou du tuteur." : "Signalez toute situation de travail d'enfant à l'inspection du travail.",
        etapes: ["Vérifiez l'âge sur un acte de naissance.", "Vérifiez les horaires (8 h/jour, 40 h/semaine, pas de nuit).", "Contactez l'inspecteur du travail en cas de doute ou d'autorisation à demander."],
        nonPrecise: "La liste des travaux interdits aux enfants est dans des décrets, pas dans le Code (art. 148).",
      });
    }

    case "harcelement":
      return fin({
        verdict: emp ? "illegal" : "info", titre: "Harcèlement moral ou discrimination",
        explication: "Le harcèlement moral est constitué par des gestes, paroles, écrits, comportements ou attitudes répétés ou systématiques et abusifs qui dégradent les conditions de travail, portent atteinte aux droits et à la dignité, altèrent la santé ou compromettent l'avenir professionnel, de la victime, qu'elle soit travailleur ou employeur (art. 12). Toute victime peut demander des dommages-intérêts à la juridiction compétente, et nul ne peut être sanctionné, discriminé ou licencié pour avoir résisté, dénoncé ou témoigné (art. 15). L'employeur doit prévenir la violence et le harcèlement (art. 13), mettre en place une procédure de signalement sans représailles (art. 14) et engage sa responsabilité s'il n'a pas pris de mesures appropriées après avoir été informé (art. 16). Une rupture causée par le harcèlement est imputable à son auteur ; la victime apporte les preuves par tous moyens (art. 40). Le harcèlement moral est puni de 3 mois à 1 an de prison et d'une amende de 1 à 4 millions d'Ariary, ou de l'une de ces peines (art. 358). Toute discrimination (race, sexe, religion, opinion, origine, santé, handicap, syndicat, âge, grossesse…) est interdite (art. 6 et 7) et punie d'une amende (art. 356). Un licenciement motivé par les opinions ou l'appartenance syndicale est abusif (art. 39).",
        articles: L(12, 13, 14, 15, 16, 40, 358, 6, 7, 83, 153, 356, 39),
        conseil: emp ? "Prenez toute plainte au sérieux : faites cesser les faits et écoutez chacun avant de décider." : "Gardez toutes les preuves (messages, témoins, dates) et écrivez à l'employeur.",
        etapes: emp ? ["Écoutez la personne et les personnes mises en cause (droit de défense).", "Faites cesser les faits.", "Ne sanctionnez jamais la personne qui a signalé les faits."] : ["Notez les faits : dates, lieux, paroles, témoins.", "Gardez messages et captures.", "Écrivez à l'employeur (modèle « Contestation »).", "Saisissez l'inspection du travail ou la justice."],
        documents: emp ? ["convocation"] : ["contestation"],
        nonPrecise: "Le montant des dommages-intérêts est fixé par le juge (art. 15 et 40).",
      });

    case "harcelement_sexuel":
      return fin({
        verdict: emp ? "illegal" : "info", titre: "Harcèlement sexuel au travail",
        explication: "Est considérée comme harcèlement sexuel toute conduite non souhaitée de nature sexuelle qui interfère avec le travail, conditionne l'emploi ou le déroulement normal de la carrière ou crée un environnement de travail intimidant ; sont visés les instructions, menaces, contraintes ou pressions exercées pour obtenir des faveurs de nature sexuelle (art. 10). Aucun salarié ne peut être sanctionné, discriminé ni licencié pour y avoir résisté, l'avoir relaté ou en avoir témoigné (art. 10 et 15). L'employeur doit prévenir la violence et le harcèlement (art. 13), organiser un signalement sans représailles (art. 14) et engage sa responsabilité s'il n'a pas agi après avoir été informé (art. 16). Une rupture causée par le harcèlement sexuel est imputable à son auteur, la victime apportant les preuves par tous moyens, et elle peut obtenir des dommages-intérêts (art. 40). Le harcèlement sexuel est sanctionné conformément au Code pénal (art. 357).",
        articles: L(10, 13, 14, 15, 16, 40, 357),
        conseil: emp ? "Réagissez dès le signalement : protégez la victime, écoutez les parties et faites cesser les faits." : "Notez les faits (dates, lieux, messages, témoins), prévenez l'employeur par écrit et, si rien ne change, saisissez l'inspection du travail ou la justice.",
        etapes: emp ? ["Recevez le signalement sans représailles contre la victime ni les témoins.", "Écoutez les personnes concernées (droit de défense).", "Prenez des mesures pour faire cesser les faits et sanctionner l'auteur."] : ["Notez les faits et gardez toutes les preuves.", "Signalez-les par écrit à l'employeur (modèle « Contestation »).", "Saisissez l'inspection du travail ou la justice si les faits continuent."],
        documents: emp ? ["convocation"] : ["contestation"],
        nonPrecise: "La peine applicable est celle du Code pénal, qui n'est pas reproduit dans le Code du travail (art. 357). L'art. 357 renvoie à une définition « à l'article 11 » alors que la définition figure à l'art. 10 : point à confirmer.",
      });

    case "sanction": {
      const reg = r.reglement;
      return fin({
        verdict: "risque", titre: "Sanction disciplinaire / mise à pied",
        explication: `Le règlement intérieur fixe la discipline générale, la nature et le degré des sanctions et les garanties de la défense ; toute autre clause, notamment sur la rémunération, est nulle (art. 234). Il est obligatoire dans les entreprises employant habituellement plus de 11 travailleurs (art. 235).${reg === "non" ? " Ici il n'existe pas : si l'entreprise emploie plus de 11 travailleurs, il est obligatoire." : ""} Les amendes et sanctions pécuniaires sont interdites sous toute forme (art. 238). Le règlement doit prévoir des délais raisonnables pour engager la procédure, pour décider après l'entretien (au-delà, plus de sanction pour les mêmes faits) et au-delà desquels une ancienne sanction ne compte plus (art. 239). Une suspension conservatoire doit être limitée au temps de la procédure, avec maintien au moins de la rémunération principale (art. 240). Un salarié ne peut pas être sanctionné pour avoir résisté à un harcèlement ou en avoir témoigné (art. 10 et 15). Pour un licenciement, le droit de défense s'applique (art. 42). Le salaire d'un jour non travaillé n'est pas dû, sauf cas prévus (art. 84).`,
        articles: L(234, 235, 236, 238, 239, 240, 42, 10, 15, 84),
        conseil: emp ? "N'appliquez que les sanctions prévues par votre règlement intérieur, après avoir écouté le salarié, et jamais d'amende." : "Demandez la sanction et ses motifs par écrit et comparez avec le règlement intérieur.",
        etapes: emp ? ["Relisez les sanctions et les délais prévus au règlement intérieur.", "Convoquez le salarié et recueillez ses explications (modèle « Convocation »).", "Notifiez la sanction par écrit avec les motifs."] : ["Demandez le règlement intérieur et la sanction par écrit.", "Répondez par écrit si elle ne respecte pas le règlement (modèle « Contestation »).", "Saisissez l'inspection du travail."],
        documents: emp ? ["convocation"] : ["contestation"],
        nonPrecise: "Le Code ne définit pas la « mise à pied » ni sa durée maximale : voir le règlement intérieur. Les délais maximums de la procédure disciplinaire sont fixés par décret (art. 239).",
      });
    }

    case "delegue": {
      const st = r.statut;
      return fin({
        verdict: emp ? (st === "syndique" ? "illegal" : "risque") : "info", titre: "Délégué du personnel et liberté syndicale",
        explication: st === "syndique"
          ? "Il est interdit de subordonner l'emploi à l'affiliation syndicale, de congédier un travailleur ou de lui nuire à cause de son affiliation ou de ses activités syndicales (art. 200). La mesure est nulle de plein droit et donne lieu à des dommages-intérêts (art. 203). Un licenciement motivé par l'appartenance syndicale est abusif (art. 39). Entraver la liberté syndicale est puni d'une amende de 1 à 4 millions d'Ariary (art. 353)."
          : "Tout licenciement d'un délégué du personnel doit être soumis à la décision de l'inspecteur du travail, rendue dans un délai de 60 jours ouvrables. La même règle vaut pour les anciens délégués pendant 6 mois après leur mandat et pour les candidats, dès le dépôt de la candidature et 3 mois après le scrutin (art. 221). En cas de faute lourde, l'employeur peut suspendre à titre conservatoire après en avoir informé par écrit l'inspecteur ; si le licenciement est refusé, la suspension est nulle et le délégué est immédiatement réintégré (art. 221). Les délégués syndicaux ont la même protection (art. 213). Des délégués sont obligatoirement élus dans les établissements de plus de 11 salariés (art. 215) ; chaque titulaire a 15 heures par mois payées (art. 224).",
        articles: st === "syndique" ? L(200, 203, 39, 353) : L(221, 213, 215, 224, 200),
        conseil: emp ? "Ne licenciez pas un délégué sans la décision de l'inspecteur du travail." : "Si vous êtes licencié sans cette autorisation, gardez la lettre et contestez tout de suite.",
        etapes: emp ? ["Saisissez l'inspecteur du travail avant toute rupture.", "Attendez sa décision."] : ["Gardez la lettre de licenciement.", "Contestez par écrit (modèle « Contestation »).", "Saisissez l'inspecteur du travail."],
        documents: emp ? [] : ["contestation"],
      });
    }

    case "cdd_requalif": {
      const ren2 = r.renouv === "2";
      const depasse = s.contrat === "cdd" && s.anciennete > 72;
      const cdi = ren2 || depasse;
      return fin({
        verdict: cdi ? (emp ? "risque" : "info") : "info", titre: cdi ? "Ce CDD est probablement devenu un CDI" : "Renouvellements de CDD",
        explication: `Un CDD dure de 1 mois à 2 ans. Il peut être renouvelé deux fois, sans que la durée totale, renouvellements compris, dépasse 6 ans, et il se transforme automatiquement en CDI après deux renouvellements successifs. La réembauche au même poste après une interruption d'au plus 3 mois est considérée comme un renouvellement (art. 25). Sont aussi réputés CDI : le CDD dont les conditions ne sont pas remplies, et le CDD au terme duquel aucune des parties n'a manifesté sa volonté de cesser la relation (art. 27). Le CDD n'est autorisé que pour des travaux qui n'entrent pas dans l'activité normale et permanente de l'établissement, ou pour un surcroît extraordinaire d'activité ou des travaux urgents de sécurité (art. 24).${ren2 ? " Ici : deux renouvellements ou plus (réembauches au même poste après 3 mois d'interruption au plus incluses)." : ""}${depasse ? " Ici : l'ancienneté dépasse 6 ans (72 mois)." : ""}${cdi ? " Le salarié relève donc des règles du CDI : le non-renouvellement devient un licenciement qui exige convocation, motif écrit et préavis (art. 37, 41, 42). Seul un juge tranche en cas de désaccord." : " Les conditions de transformation automatique ne semblent pas réunies, sauf si le contrat a continué après son terme sans que personne n'ait manifesté sa volonté d'y mettre fin (art. 27)."}`,
        articles: L(25, 27, 24, 42, 41, 37),
        conseil: emp ? (cdi ? "Ne considérez pas le contrat comme terminé : traitez-le comme un CDI et suivez la procédure de licenciement." : "Comptez les renouvellements (et les réembauches après 3 mois d'interruption au plus) avant d'en proposer un nouveau.") : (cdi ? "Si on vous annonce la fin du CDD, contestez par écrit en invoquant les renouvellements." : "Gardez tous les avenants et contrats successifs."),
        etapes: emp ? ["Faites la liste des contrats et des dates de renouvellement.", "Si le CDD est devenu un CDI, utilisez la situation « Licenciement » ou « Motif économique »."] : ["Rassemblez tous vos contrats, avenants et bulletins de paie.", "Écrivez à l'employeur pour demander la reconnaissance d'un CDI (modèle « Contestation »).", "Saisissez l'inspecteur du travail ou le tribunal."],
        documents: emp ? [] : ["contestation"],
        nonPrecise: "Le texte dit que le CDD se transforme en CDI « après deux renouvellements successifs » : la lecture exacte (dès le 2e renouvellement ou à son terme) peut être discutée ; seul le juge tranche. Les modalités du CDD seront fixées par voie réglementaire (art. 26).",
      });
    }

    case "paternite":
      return fin({
        verdict: "info", titre: "Congé de paternité",
        explication: "Sauf accord plus favorable des parties, le salarié conjoint légitime d'une femme qui accouche a droit à 3 jours de congé de paternité, payés par l'employeur comme des jours de travail effectif (art. 134). Ces jours comptent comme du service effectif pour l'acquisition des congés payés (art. 126). Pour la mère, voir la situation « Grossesse, maternité » (14 semaines, art. 143).",
        articles: L(134, 126, 143),
        conseil: emp ? "Accordez les 3 jours et payez-les comme des jours de travail normal." : "Prévenez l'employeur par écrit de la naissance et demandez les 3 jours ; gardez une copie.",
        etapes: emp ? ["Demandez un justificatif de la naissance.", "Accordez 3 jours payés."] : ["Prévenez l'employeur par écrit.", "Gardez l'acte ou le certificat de naissance.", "Si les jours sont refusés ou non payés, réclamez par écrit (modèle « Mise en demeure »)."],
        documents: emp ? [] : ["mise_en_demeure"],
        nonPrecise: "Le Code ne fixe pas de délai pour demander le congé, ni de justificatif précis. Il vise le « conjoint légitime » : le texte ne dit rien d'autre sur d'autres situations familiales. " + INSPECTION,
      });

    case "teletravail":
      return fin({
        verdict: "info", titre: "Télétravail",
        explication: "Le télétravail, permanent ou ponctuel, est l'exécution du travail hors des locaux de l'employeur grâce aux technologies de l'information et de la communication ; il peut être prévu dès l'embauche ou en cours de contrat (art. 70). Il est prévu par la convention collective ou l'accord d'établissement ou, à défaut, par le contrat de travail ou un avenant (art. 71). Les parties fixent par accord les conditions d'acceptation par le salarié, la mise à disposition du matériel, le contrôle du temps de travail ou de la charge de travail et les plages horaires de contact (art. 72). L'employeur informe le salarié des règles d'usage du matériel et des sanctions, et organise un entretien régulier sur ses conditions d'activité et sa charge de travail (art. 73). En situation exceptionnelle (épidémie, par exemple), l'employeur peut décider le télétravail ; les conditions du passage et du retour sont fixées par accord et le télétravailleur a priorité pour revenir au travail sur site (art. 74).",
        articles: L(70, 71, 72, 73, 74, 29),
        conseil: emp ? "Prévoyez le télétravail par écrit (contrat ou avenant) : matériel, contrôle du temps, plages de contact." : "Faites préciser par écrit le matériel fourni, les horaires de contact et le contrôle du temps de travail.",
        etapes: emp ? ["Rédigez un avenant au contrat qui fixe matériel, contrôle du temps et plages de contact.", "Informez le salarié des règles d'usage du matériel.", "Organisez un entretien périodique."] : ["Demandez un écrit (contrat ou avenant).", "Faites préciser qui fournit le matériel et les horaires de contact.", "Demandez un entretien périodique sur votre charge de travail."],
        nonPrecise: "Le Code ne dit pas qui paie les frais de télétravail (électricité, connexion) : cela relève de l'accord entre les parties (art. 72). La périodicité de l'entretien est « raisonnable », sans durée fixe (art. 73).",
      });

    case "modification_contrat":
      return fin({
        verdict: "risque", titre: "Modification du contrat (salaire, poste, classification)",
        explication: "Les clauses substantielles du contrat (classification professionnelle, rémunération, poste) ne peuvent pas faire l'objet d'une modification unilatérale moins favorable au travailleur. Si le travailleur fait savoir par écrit qu'il prend acte de la rupture causée par une telle modification, la rupture est imputable à l'employeur (art. 29). Pour motif économique, la modification est notifiée par écrit ; le travailleur répond par écrit sous 15 jours et son silence vaut acceptation ; s'il refuse, la rupture est imputée à l'employeur, avec les droits du licenciement économique (art. 47). Tout travailleur qui accède à un poste de niveau supérieur perçoit la rémunération correspondante (art. 90). Le Code s'applique de plein droit aux contrats en cours et toute clause non conforme est modifiée de plein droit (art. 392).",
        articles: L(29, 47, 48, 90, 392),
        conseil: emp ? "Ne baissez pas le salaire, le poste ou la classification sans accord écrit du salarié ; en cas de motif économique, suivez la procédure écrite." : "Refusez par écrit toute baisse imposée ; si vous prenez acte de la rupture, faites-le par écrit en citant la modification.",
        etapes: emp ? ["Proposez la modification par écrit.", "Laissez 15 jours au salarié pour répondre (motif économique).", "Ne l'appliquez pas sans accord."] : ["Gardez la preuve de l'ancienne situation (contrat, bulletins).", "Répondez par écrit dans les 15 jours en cas de motif économique.", "Contestez par écrit (modèle « Contestation ») ou saisissez l'inspecteur du travail."],
        documents: emp ? [] : ["contestation"],
        nonPrecise: "Le texte ne définit pas la liste complète des « clauses substantielles » au-delà de la classification, de la rémunération et du poste. " + INSPECTION,
      });

    case "chomage_technique":
      return fin({
        verdict: "info", titre: "Chômage technique",
        explication: "Le chômage technique est une interruption collective du travail résultant de causes conjoncturelles de nature technique, économique ou accidentelle (accident de matériel, interruption de la force motrice, sinistre, pénurie accidentelle de matières premières…). Il suspend le contrat pour 6 mois consécutifs au plus. La déclaration se fait au préalable auprès de l'inspection du travail (sauf force majeure), en précisant le motif, la durée et la liste du personnel touché, et l'employeur informe la CNaPS. Sauf motifs accidentels, un ordre de priorité est respecté pour désigner les travailleurs touchés (l'art. 31 le renvoie à l'« article 48 » ; l'ordre de priorité du licenciement économique figure à l'art. 46 : renvoi à confirmer) ; en cas de désaccord, l'inspecteur donne son avis sous 3 jours ouvrables. Le travailleur peut rompre le contrat sans préavis après 3 mois. Passé 6 mois sans réintégration, le contrat est considéré comme rompu et l'employeur doit régler les droits du travailleur, notamment le préavis et l'indemnité de licenciement (art. 31). En cas de crise nationale ou régionale aiguë, le Ministre du Travail peut prolonger exceptionnellement de 6 mois au plus par arrêté (art. 31).",
        articles: L(31, 32, 46, 48, 45),
        conseil: emp ? "Déclarez le chômage technique à l'inspection du travail avant sa mise en œuvre et informez la CNaPS." : "Demandez par écrit la durée et le motif du chômage technique, et gardez la preuve de la déclaration faite à l'inspection.",
        etapes: emp ? ["Déclarez le chômage technique à l'inspecteur du travail (motif, durée, liste du personnel).", "Informez la CNaPS.", "Ne dépassez pas 6 mois sans réintégration (sinon contrat rompu avec préavis et indemnité)."] : ["Demandez la durée prévue et la liste du personnel concerné.", "Après 3 mois, vous pouvez rompre sans préavis.", "Après 6 mois sans réintégration, le contrat est rompu et vos droits (préavis, indemnité) sont dus."],
        nonPrecise: "Le Code ne prévoit pas de rémunération pendant le chômage technique : l'indemnité de suspension de l'art. 32 vise les six premiers cas de l'art. 31 (le chômage technique est le 8e cas). " + INSPECTION,
      });

    case "droit_retrait":
      return fin({
        verdict: "info", titre: "Danger au travail : droit d'alerte et de retrait",
        explication: "En cas de danger menaçant sa santé ou sa sécurité, le travailleur peut exercer son droit d'alerte et de retrait temporaire du poste de travail, jusqu'à ce que l'employeur ait pris des mesures pour y remédier ; l'employeur ne peut pas lui demander de reprendre le travail tant qu'un péril imminent et grave persiste (art. 173). L'employeur doit assurer la sécurité et la santé des travailleurs (art. 163), évaluer les risques et fournir gratuitement les équipements de protection (art. 164 et 165). L'employeur qui, malgré une mise en demeure de l'inspecteur du travail, emploie des travailleurs dans un lieu présentant des risques certains sans protection s'expose à une peine de 3 mois à 1 an de prison et/ou à une amende de 1 à 4 millions d'Ariary (art. 363).",
        articles: L(173, 163, 164, 165, 174, 363),
        conseil: emp ? "Corrigez le danger signalé avant de demander la reprise du travail." : "Signalez le danger par écrit (message, lettre) avant ou pendant le retrait, et gardez la preuve.",
        etapes: emp ? ["Écoutez le signalement.", "Prenez les mesures de protection nécessaires.", "Ne demandez la reprise que lorsque le péril a cessé."] : ["Prévenez l'employeur par écrit du danger.", "Retirez-vous du poste dangereux (droit de retrait, art. 173).", "Contactez l'inspection du travail si l'employeur n'agit pas."],
        nonPrecise: "Les modalités du droit de retrait sont fixées par décret (art. 173), non reproduites dans le Code.",
      });

    case "greve":
      return fin({
        verdict: "info", titre: "Grève",
        explication: "Le droit de grève est garanti par la Constitution ; la grève est un arrêt complet, concerté et collectif du travail pour faire aboutir des revendications professionnelles non satisfaites. La réquisition ne peut le limiter qu'en cas de crise nationale aiguë ou de danger pour la vie, la sécurité ou la santé de la population (art. 296). Dans les entreprises assurant un service public, un service minimum est assuré (art. 297). La grève licite suspend le contrat : le salarié est dispensé de travailler et l'employeur de le payer ; le salarié retrouve son emploi à la fin de la grève et ne peut être sanctionné pour y avoir participé (art. 298). Empêcher par sanction, licenciement ou menace la participation à une grève licite est puni d'une amende de 1 à 4 millions d'Ariary (art. 353). Le droit de grève est acquis à la date où l'inspection du travail constate l'échec total ou partiel de la négociation, sous réserve d'un préavis de 2 jours ouvrables adressé par lettre recommandée à l'autre partie (art. 283).",
        articles: L(296, 297, 298, 283, 353, 31),
        conseil: emp ? "Ne sanctionnez pas la participation à une grève licite et respectez la procédure de négociation et de médiation." : "Vérifiez que la procédure de négociation et de médiation a été suivie pour que la grève soit licite.",
        etapes: emp ? ["Ouvrez la négociation avec les représentants.", "Assurez le service minimum si vous êtes en service public.", "Ne retenez pas de sanction contre les grévistes licites."] : ["Faites-vous représenter lors de la négociation.", "Respectez les étapes de négociation et de médiation.", "Reprenez votre emploi à la fin de la grève."],
        nonPrecise: "Les étapes détaillées (négociation, médiation, arbitrage) et leurs délais sont aux art. 276 à 295 du Code, non détaillés ici.",
      });

    case "saisir_inspection":
      return fin({
        verdict: "info", titre: "Saisir l'inspection du travail ou le tribunal",
        explication: "Tout travailleur ou employeur peut demander à l'inspection du travail de régler un différend à l'amiable (art. 262). La saisine de l'inspection est obligatoire avant celle du tribunal tant que le travailleur est encore sous contrat, et les parties doivent se présenter à la convocation (art. 263) ; elle est facultative une fois la relation de travail rompue, notamment en cas de refus de paiement du solde de tout compte (art. 264). L'inspecteur dresse un procès-verbal (conciliation, conciliation partielle, non-conciliation, non-exécution, carence) remis à chaque partie dans un délai d'un mois (art. 267). Il peut ordonner le paiement des sommes dues en cas de non-délivrance de la lettre de licenciement, de non-paiement du salaire, des congés, du préavis, de l'indemnité de licenciement, ou de non-délivrance du certificat de travail ; à défaut d'exécution, action directe devant le tribunal (art. 271). Le tribunal du travail connaît des différends individuels (art. 272) ; il est compétent au lieu de travail, ou après la rupture au domicile du travailleur ou de l'employeur (art. 275). L'action en paiement des salaires et des indemnités de préavis et de licenciement se prescrit par 12 mois (art. 105).",
        articles: L(262, 263, 264, 267, 271, 272, 275, 105),
        conseil: emp ? "Répondez aux convocations de l'inspection : l'absence sans raison valable est sanctionnée." : "Rassemblez vos preuves et envoyez d'abord une lettre écrite à l'employeur ; gardez le procès-verbal remis par l'inspecteur.",
        etapes: ["Écrivez d'abord à l'employeur (modèle « Mise en demeure » ou « Contestation »).", "Saisissez l'inspection du travail de votre lieu de travail.", "Présentez-vous à la convocation avec vos preuves.", "Avec le procès-verbal de non-conciliation ou de non-exécution, saisissez le tribunal du travail dans le délai de prescription."],
        documents: emp ? [] : ["mise_en_demeure", "contestation"],
        nonPrecise: "La composition et la procédure du tribunal du travail sont fixées par des textes à part (art. 273). Le Code ne chiffre pas les frais éventuels d'une procédure judiciaire.",
      });
  }
}

/** Diagnostic complet : calcul des règles puis « En bref » en langage courant (voir bref.ts). */
export function diagnostiquer(s: Situation): Diagnostic {
  const d = calcul(s);
  const sid = s.situation === "licencier" ? (s.contrat === "essai" ? "essai" : s.contrat === "cdd" ? "cdd_rupture" : "licencier") : s.situation;
  const b = bref(sid, s.profil, s.reponses);
  return b ? { ...d, bref: b } : d;
}
