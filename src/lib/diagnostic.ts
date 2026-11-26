import type { Contrat, Diagnostic, ModeleId, Profil, SituationId } from "../types";

/** Ancienneté en mois. `reponses` : réponses aux questions complémentaires (voir data/situations.ts). */
export interface Situation { profil: Profil; contrat: Contrat; anciennete: number; situation: SituationId; reponses: Record<string, string> }

const INSPECTION = "En cas de doute, demandez conseil à l'inspection du travail.";
type Corps = Omit<Diagnostic, "documents"> & { documents?: ModeleId[] };
const fin = (c: Corps): Diagnostic => ({ documents: [], ...c });

/**
 * Règles tirées uniquement du texte de la loi n° 2003-044 (articles liés dans chaque résultat).
 * Quand le Code renvoie à un décret ou à une convention collective, le résultat le dit (champ « nonPrecise ») : aucune règle inventée.
 * Orientation générale, pas un avis juridique.
 */
export function diagnostiquer(s: Situation): Diagnostic {
  const emp = s.profil === "employeur";
  const r = s.reponses;
  switch (s.situation) {
    case "licencier":
      if (s.contrat === "essai") return diagnostiquer({ ...s, situation: "essai" });
      if (s.contrat === "cdd") return diagnostiquer({ ...s, situation: "cdd_rupture" });
      return fin({
        verdict: "risque", titre: "Licenciement d'un salarié en CDI",
        explication: "Le licenciement doit être notifié par écrit avec ses motifs (art. 21). Avant, le salarié doit être informé par écrit des motifs et pouvoir se défendre, assisté d'une personne de son choix (art. 22). Un licenciement sans motif légitime ou sans respect de la procédure est abusif ; c'est à celui qui rompt de prouver que sa décision est légitime (art. 20). Le salarié a droit au solde de son salaire, à l'indemnité de congés non pris, au préavis (sauf faute lourde) et au certificat de travail (art. 22).",
        articles: ["licenciement-formalites", "notification-rupture", "licenciement-abusif", "preavis-indemnite", "preavis-duree", "certificat-travail"],
        conseil: emp ? "Ne licenciez jamais sans avoir informé le salarié par écrit et l'avoir écouté. Si le motif est économique, choisissez plutôt la situation « motif économique »." : "Demandez les motifs et le dossier par écrit, et gardez la lettre de licenciement (le préavis court à sa réception).",
        etapes: emp
          ? ["Écrivez au salarié pour lui indiquer les motifs envisagés et le convoquer (modèle « Convocation »).", "Écoutez-le ; il peut être assisté d'une personne de son choix.", "Notifiez le licenciement par écrit, avec les motifs, par un moyen qui prouve la réception.", "Payez le solde, les congés non pris et le préavis, et remettez le certificat de travail."]
          : ["Demandez par écrit les motifs et le dossier des faits reprochés.", "Préparez votre défense et venez avec la personne de votre choix.", "Gardez la lettre de licenciement, vos bulletins de paie et votre contrat.", "Si le licenciement vous semble abusif, contestez par écrit (modèle « Contestation ») puis saisissez l'inspection du travail ou le tribunal."],
        documents: emp ? ["convocation"] : ["contestation", "demande_certificat"],
        nonPrecise: "Le montant des dommages-intérêts n'est pas fixé par le Code : il est laissé au juge (art. 20). La durée du préavis dépend d'une convention collective ou d'un décret (art. 19).",
      });

    case "eco": {
      const collectif = r.nombre === "plusieurs";
      return fin({
        verdict: "risque", titre: collectif ? "Licenciement économique collectif" : "Licenciement économique individuel",
        explication: (s.contrat === "cdd" ? "Attention, CDD : un CDD ne peut être rompu avant son terme que dans les cas prévus au contrat ou en cas de faute lourde (art. 17) ; le Code ne cite pas le motif économique parmi ces cas. Si le CDD est en réalité devenu un CDI (art. 8 et 9), les règles ci-dessous s'appliquent. " : "") + "Rappel : aucun licenciement n'est possible pendant la suspension du contrat (maladie constatée, accident du travail : art. 13) ni pour une salariée dont la grossesse est constatée médicalement (art. 95), même pour motif économique. " + (collectif
          ? "L'employeur doit d'abord consulter le comité d'entreprise ou les délégués du personnel (qui répondent sous 20 jours), puis saisir obligatoirement l'inspecteur du travail, qui donne son avis sous 15 jours (art. 25). La liste des salariés touchés est établie avec les délégués, selon l'ancienneté, les compétences et les charges de famille (art. 26). Chaque salarié licencié pour motif économique a droit à une indemnité de 10 jours de salaire par année complète, plafonnée à 6 mois de salaire (art. 28)."
          : "Le motif doit être de vraies difficultés économiques ou une mutation technologique (art. 24). Un licenciement économique individuel suit la procédure des articles 21 et 22 : information écrite des motifs, droit de défense, notification écrite (art. 27). Si l'employeur propose de modifier le contrat, le salarié a 15 jours pour répondre ; en cas de refus, la rupture est imputée à l'employeur avec les droits du licenciement économique. L'indemnité est de 10 jours de salaire par année complète, plafonnée à 6 mois (art. 28)."),
        articles: [...(collectif ? ["eco-definition", "eco-procedure", "eco-liste"] : ["eco-definition", "eco-individuel", "licenciement-formalites"]), "indemnite-licenciement", "licenciement-abusif", "preavis-duree", "grossesse-licenciement", "suspension-contrat", ...(s.contrat === "cdd" ? ["cdd-rupture", "cdd-duree", "cdd-requalification"] : [])],
        conseil: emp ? "Conservez les preuves des difficultés économiques : en cas de contestation, c'est à vous de prouver que le motif est légitime (art. 20)." : "Vérifiez que le motif est réel et que la procédure a été suivie ; sinon le licenciement peut être jugé abusif (art. 20).",
        etapes: emp
          ? collectif
            ? ["Réunissez le comité d'entreprise ou les délégués du personnel et donnez-leur motifs, situation financière, plan de redressement et liste du personnel concerné.", "Affichez le procès-verbal de la réunion.", "Saisissez l'inspecteur du travail avec le procès-verbal et la liste du personnel.", "Notifiez ensuite chaque licenciement par écrit avec les motifs, puis payez préavis, congés et indemnité (voir Simulateur)."]
            : ["Informez le salarié par écrit des motifs économiques (modèle « Convocation »).", "Laissez-le se défendre, puis notifiez par écrit.", "Calculez préavis, congés et indemnité de licenciement dans le Simulateur.", "Remettez le certificat de travail."]
          : ["Demandez par écrit les motifs précis et les justificatifs.", "Vérifiez que la procédure a été suivie (consultation, inspecteur du travail pour un licenciement collectif).", "Estimez vos droits dans le Simulateur (choisissez « motif économique »).", "Contestez par écrit si le motif ou la procédure paraît irrégulier (modèle « Contestation »)."],
        documents: emp ? ["convocation"] : ["contestation", "demande_certificat"],
        nonPrecise: "La durée du préavis n'est pas dans le Code (art. 19). " + INSPECTION,
      });
    }

    case "cdd_rupture":
      return fin({
        verdict: "risque", titre: "Rupture anticipée d'un CDD",
        explication: "Un CDD ne peut être rompu avant son terme par une seule des parties que dans les cas prévus au contrat ou en cas de faute lourde (art. 17). Sinon la rupture peut être abusive et donner lieu à des dommages-intérêts fixés par le juge (art. 20). Un CDD ne peut pas excéder 2 ans et, s'il est renouvelé deux fois (6 mois minimum), il devient un CDI (art. 8) : si c'est votre cas, utilisez plutôt la situation « CDD renouvelé plusieurs fois ». À la fin du contrat, les congés non pris sont indemnisés (art. 90) et le certificat de travail est dû (art. 30).",
        articles: ["cdd-rupture", "licenciement-abusif", "cdd-duree", "conges-rupture", "certificat-travail"],
        conseil: emp ? "Ne rompez pas avant le terme sans cas prévu au contrat ou faute lourde que vous pouvez prouver ; sinon proposez un accord écrit." : "Si on vous renvoie avant le terme sans faute, gardez votre contrat et contestez par écrit.",
        etapes: emp ? ["Relisez le contrat : prévoit-il des cas de rupture anticipée ?", "Sans cas prévu ni faute lourde prouvée, proposez un accord de fin de contrat écrit.", "À la fin, payez le solde et les congés non pris et remettez le certificat de travail."]
          : ["Gardez le contrat et les bulletins de paie.", "Demandez par écrit les motifs de la rupture.", "Contestez par écrit (modèle « Contestation »), puis saisissez l'inspection du travail."],
        documents: emp ? [] : ["contestation", "demande_certificat"],
        nonPrecise: "Le Code ne fixe pas le montant des dommages-intérêts (art. 20). " + INSPECTION,
      });

    case "demission":
      if (s.contrat === "cdi")
        return fin({
          verdict: "conforme", titre: "Démission",
          explication: "Le salarié peut démissionner librement, mais il doit indiquer le motif par écrit et faire la passation si l'employeur l'exige (art. 22). La date de réception de la lettre fait partir le préavis (art. 21). Sans préavis, l'indemnité du préavis non respecté est due (art. 18). La durée du préavis dépend de la convention collective ou d'un décret (art. 19).",
          articles: ["demission", "licenciement-formalites", "notification-rupture", "preavis-indemnite", "preavis-duree"],
          conseil: emp ? "Prenez acte par écrit, fixez la fin du préavis et préparez le solde (congés non pris inclus)." : "Remettez une lettre datée avec le motif, gardez une copie signée ou un accusé de réception.",
          etapes: emp ? ["Accusez réception de la lettre en notant la date.", "Organisez la passation.", "Payez le solde, les congés non pris et remettez le certificat de travail."] : ["Rédigez une lettre datée avec le motif.", "Remettez-la contre signature ou par un moyen qui prouve la réception.", "Faites la passation, puis réclamez le certificat de travail (modèle « Demande de certificat »)."],
          documents: emp ? [] : ["demande_certificat"],
          nonPrecise: "La durée exacte du préavis n'est pas dans le Code. Regardez votre contrat ou la convention collective.",
        });
      return fin({
        verdict: "risque", titre: "Démission en CDD ou pendant l'essai",
        explication: "En CDD, la rupture avant le terme par une seule partie n'est possible que dans les cas prévus au contrat ou en cas de faute lourde (art. 17). Pendant l'essai, les règles du préavis et de la rupture du CDI ne s'appliquent pas, sauf convention contraire (art. 39).",
        articles: ["cdd-rupture", "essai-rupture", "demission"],
        conseil: "Vérifiez les clauses de votre contrat et privilégiez un accord écrit avec l'autre partie.",
        etapes: ["Relisez le contrat.", "Écrivez votre décision avec le motif (art. 21).", "Si besoin, proposez un accord écrit de fin de contrat."],
      });

    case "demission_forcee":
      return fin({
        verdict: emp ? "risque" : "info", titre: "Pression pour démissionner",
        explication: "Une démission doit être écrite et indiquer le motif (art. 21). Une rupture imposée peut être jugée abusive : c'est le juge qui apprécie (art. 20), et c'est à l'auteur de la rupture de prouver qu'elle est légitime. Un accord ou une transaction ne peut pas faire renoncer le salarié à ses droits légaux (art. 65). Si la pression est un harcèlement, la rupture est imputée à son auteur (art. 23).",
        articles: ["notification-rupture", "licenciement-abusif", "renonciation", "harcelement-rupture"],
        conseil: emp ? "Évitez toute pression : si vous voulez mettre fin au contrat, utilisez la procédure de licenciement ou un accord écrit et libre." : "Ne signez rien sous pression. Notez dates, paroles et messages, et demandez toute décision de l'employeur par écrit.",
        etapes: emp ? ["Renoncez à toute pression orale.", "Choisissez la voie régulière : licenciement avec procédure (modèle « Convocation ») ou accord écrit."] : ["Ne signez pas de démission ni de « solde de tout compte » sous pression.", "Gardez les preuves (messages, témoins, dates).", "Écrivez à l'employeur pour contester (modèle « Contestation »).", "Saisissez l'inspection du travail si cela continue."],
        documents: emp ? ["convocation"] : ["contestation"],
        nonPrecise: "Le Code n'emploie pas le terme « démission forcée » : c'est le juge qui qualifie les faits (art. 20).",
      });

    case "preavis":
      return fin({
        verdict: "risque", titre: "Préavis non respecté ou non payé",
        explication: "Sauf faute lourde, toute rupture d'un CDI sans préavis, ou sans préavis complet, oblige la partie responsable à verser l'équivalent de la rémunération et des avantages du préavis non respecté (art. 18). Le préavis part de la réception de la lettre (art. 21). L'action en paiement des indemnités de préavis se prescrit par 12 mois (art. 72).",
        articles: ["preavis-indemnite", "preavis-duree", "notification-rupture", "faute-lourde", "prescription-salaire"],
        conseil: emp ? "Payez l'indemnité de préavis non effectué, sauf faute lourde que vous pouvez prouver." : "Réclamez l'indemnité par écrit et agissez dans les 12 mois.",
        etapes: emp ? ["Calculez la rémunération du préavis non respecté (Simulateur).", "Payez-la avec le solde."] : ["Relevez la date de réception de la lettre et la durée du préavis dans votre contrat.", "Réclamez l'indemnité par écrit (modèle « Mise en demeure »).", "Saisissez l'inspecteur du travail si elle n'est pas payée."],
        documents: emp ? [] : ["mise_en_demeure"],
        nonPrecise: "La durée du préavis n'est pas fixée par le Code mais par la convention collective ou un décret (art. 19).",
      });

    case "absence":
      return fin({
        verdict: "risque", titre: "Absence injustifiée ou abandon de poste",
        explication: "L'absence n'est en principe pas payée (art. 54). Elle peut devenir une faute, mais l'employeur qui veut licencier doit informer le salarié par écrit et le laisser se défendre (art. 22), puis notifier par écrit avec les motifs (art. 21). La rupture sans préavis n'est possible que pour faute lourde prévue au règlement intérieur ou appréciée par le juge (art. 18). Une absence pour maladie constatée ou pour accident du travail est une suspension du contrat (art. 13), pas un abandon.",
        articles: ["absence-salaire", "licenciement-formalites", "notification-rupture", "faute-lourde", "suspension-contrat"],
        conseil: emp ? "Demandez d'abord des explications par écrit ; n'invoquez pas un « abandon de poste » sans procédure." : "Justifiez chaque absence par écrit (certificat, message) dès que possible.",
        etapes: emp ? ["Demandez des explications écrites et fixez une date pour entendre le salarié (modèle « Convocation »).", "Les jours d'absence ne sont en principe pas payés (art. 54), sauf cas prévus par la réglementation (maladie constatée, accident du travail…).", "Si vous licenciez, notifiez par écrit avec les motifs."] : ["Envoyez un justificatif écrit (certificat médical, message).", "Gardez la preuve de l'envoi.", "En cas de convocation, présentez vos explications et venez assisté."],
        documents: emp ? ["convocation"] : ["contestation"],
        nonPrecise: "Le Code ne définit pas l'« abandon de poste » ni le nombre de jours d'absence qui constitue une faute : voir le règlement intérieur ou l'inspection du travail.",
      });

    case "essai": {
      const ecrit = r.ecrit;
      const long = s.contrat === "essai" && s.anciennete > 6;
      return fin({
        verdict: ecrit === "non" || long ? "risque" : "info", titre: "Période d'essai",
        explication: `L'essai doit être écrit, avec le poste, la durée, le salaire et la catégorie ; sans écrit il est considéré comme inexistant (art. 35). Il ne peut pas dépasser 6 mois et n'est renouvelable qu'une fois (art. 36). Pendant l'essai, les règles du CDI sur le préavis ne s'appliquent pas, sauf convention contraire, et aucune indemnité n'est due du seul fait de la rupture (art. 39). Une grossesse ne peut pas justifier la fin de l'essai (art. 94).${ecrit === "non" ? " Ici, l'essai n'est pas écrit : il est donc réputé inexistant (art. 35) et le contrat suit les règles ordinaires." : ""}${long ? " L'ancienneté indiquée dépasse 6 mois : si l'essai se poursuit sans que personne n'ait manifesté sa volonté d'y mettre fin, le contrat est considéré comme un CDI (art. 9)." : ""}`,
        articles: ["essai-ecrit", "periode-essai", "essai-decret", "essai-rupture", "grossesse-essai", "essai-abus", "cdd-requalification"],
        conseil: emp ? "Faites signer l'essai avant le début du travail et notez les dates de fin et de renouvellement." : "Relisez votre contrat : l'essai y est-il écrit avec durée et salaire ?",
        etapes: emp ? ["Vérifiez que l'écrit d'essai contient poste, durée, salaire, catégorie.", "Notifiez la rupture par écrit, datée, avec accusé de réception."] : ["Cherchez dans votre contrat la mention de l'essai.", "S'il est trop long ou non écrit, signalez-le à l'inspecteur du travail (qui peut constater les abus d'essai, art. 40).", "Gardez vos bulletins de paie."],
        nonPrecise: "Les durées précises d'essai sont fixées par décret (art. 37), pas par le Code lui-même.",
      });
    }

    case "certificat":
      return fin({
        verdict: emp ? "risque" : "info", titre: "Certificat de travail et solde de tout compte",
        explication: "À la fin du contrat, l'employeur doit obligatoirement remettre un certificat de travail (dates d'entrée et de départ, emplois, catégories), sous peine de dommages-intérêts (art. 30). Un licenciement ouvre droit au solde de salaire, aux congés non pris, au préavis et au certificat (art. 22). Signer « pour solde de tout compte » n'enlève pas vos droits (art. 64). Vous pouvez saisir l'inspecteur du travail si le certificat ou les sommes ne sont pas remis (art. 204) ; les salaires et indemnités se réclament dans les 12 mois (art. 72).",
        articles: ["certificat-travail", "licenciement-formalites", "bulletin-paie", "inspection-pouvoirs", "prescription-salaire"],
        conseil: emp ? "Préparez le certificat dès la fin du contrat : il ne doit contenir que les mentions prévues." : "Réclamez le certificat par écrit et gardez la preuve de votre demande.",
        etapes: emp ? ["Rédigez le certificat avec uniquement les mentions prévues par l'art. 30.", "Remettez-le avec le solde de tout compte contre signature."] : ["Envoyez la demande de certificat (modèle « Demande de certificat »).", "Sans réponse, envoyez une mise en demeure.", "Saisissez l'inspecteur du travail (art. 204), dans les 12 mois pour les sommes dues."],
        documents: emp ? [] : ["demande_certificat", "mise_en_demeure"],
      });

    case "retard_salaire":
      return fin({
        verdict: emp ? "illegal" : "info", titre: "Retard de paiement du salaire",
        explication: "Le salaire mensuel doit être payé au plus tard 8 jours après la fin du mois travaillé. Les retards doivent être justifiés par la force majeure ; sinon ils donnent lieu à majoration au taux d'intérêt légal (art. 63). Le paiement est constaté par un bulletin de paie (art. 64). L'action en paiement se prescrit par 12 mois (art. 72). L'inspecteur du travail peut ordonner le paiement d'un salaire dû (art. 204).",
        articles: ["salaire-paiement", "bulletin-paie", "prescription-salaire", "inspection-pouvoirs"],
        conseil: emp ? "Régularisez vite et gardez la preuve du paiement et du bulletin." : "Réclamez par écrit, puis saisissez l'inspecteur du travail sans attendre 12 mois.",
        etapes: emp ? ["Payez les mois dus avec la majoration au taux d'intérêt légal.", "Remettez les bulletins de paie."] : ["Listez les mois impayés et les montants.", "Envoyez une mise en demeure écrite (modèle « Mise en demeure »).", "Saisissez l'inspecteur du travail si rien ne change.", "Agissez dans les 12 mois."],
        documents: emp ? [] : ["mise_en_demeure"],
        nonPrecise: "Le taux d'intérêt légal n'est pas indiqué dans le Code du travail.",
      });

    case "salaire_minimum":
      return fin({
        verdict: emp ? "risque" : "info", titre: "Salaire inférieur au minimum",
        explication: "Un salaire minimum d'embauche (SME) existe, agricole et non agricole, par catégorie professionnelle (art. 55). À poste et travail de valeur égale, le salaire est égal pour tous, sans distinction d'origine, de sexe, d'âge ou d'opinion (art. 53). Le montant du SME est fixé par décret et n'est pas dans le Code.",
        articles: ["salaire-minimum", "salaire-egal", "prescription-salaire"],
        conseil: emp ? "Vérifiez le SME en vigueur pour la catégorie de chaque salarié." : "Demandez le montant du SME de votre catégorie à l'inspection du travail et comparez-le à votre bulletin de paie.",
        etapes: emp ? ["Demandez le décret du SME à l'inspection du travail.", "Comparez-le à chaque salaire et régularisez."] : ["Notez votre catégorie professionnelle.", "Demandez le SME à l'inspection du travail.", "Si votre salaire est plus bas, réclamez la différence par écrit (modèle « Mise en demeure »), dans les 12 mois (art. 72)."],
        documents: emp ? [] : ["mise_en_demeure"],
        nonPrecise: "Le montant du SME n'est pas précisé par le Code : à demander à l'inspection du travail.",
      });

    case "heures_sup": {
      const preuve = r.preuve === "oui";
      return fin({
        verdict: emp ? "risque" : "info", titre: "Heures supplémentaires",
        explication: "La durée légale est de 173,33 heures par mois. Les heures au-delà sont des heures supplémentaires et donnent lieu à une majoration (art. 75). Le taux de majoration, la durée maximale et les autorisations sont fixés par décret selon la branche d'activité (art. 76). L'action en paiement des salaires se prescrit par 12 mois (art. 72)." + (preuve ? "" : " Sans trace écrite, il sera plus difficile de prouver les heures faites."),
        articles: ["duree-travail", "hs-decret", "prescription-salaire"],
        conseil: emp ? "Tenez un relevé des heures et payez les heures supplémentaires avec la majoration." : "Reconstituez dès maintenant vos heures (dates, heures, messages, témoins) et réclamez par écrit.",
        etapes: emp ? ["Faites le relevé des heures au-delà de 173,33 h par mois.", "Calculez la majoration prévue par le décret de votre branche.", "Payez-les avec le bulletin de paie."] : ["Notez chaque jour les heures faites en plus.", "Réclamez le paiement par écrit (modèle « Mise en demeure »).", "Agissez dans les 12 mois."],
        documents: emp ? [] : ["mise_en_demeure"],
        nonPrecise: "Le taux de majoration des heures supplémentaires n'est pas dans le Code : il est fixé par décret (art. 76). Demandez-le à l'inspection du travail.",
      });
    }

    case "duree_repos":
      return fin({
        verdict: "info", titre: "Durée du travail, repos et nuit",
        explication: "La durée légale est de 173,33 heures par mois (art. 75). Le repos hebdomadaire est obligatoire : 24 heures consécutives au minimum, en principe le dimanche, avec des exceptions fixées par décret (art. 80). Le travail entre 22 h et 5 h est du travail de nuit, avec une majoration fixée par décret (art. 83). Les temps d'habillage, de déshabillage et de restauration ne comptent pas dans le travail effectif (art. 79).",
        articles: ["duree-travail", "temps-effectif", "repos-hebdo", "travail-nuit", "hs-decret"],
        conseil: emp ? "Organisez les plannings pour garantir 24 h de repos par semaine et comptez les heures au-delà de 173,33 h par mois comme supplémentaires." : "Notez vos horaires réels : ils servent de preuve en cas de désaccord.",
        etapes: ["Comparez vos horaires du mois à 173,33 heures.", "Vérifiez que vous avez au moins 24 heures de repos consécutives par semaine.", "En cas de désaccord, voir « Heures supplémentaires » ou l'inspection du travail."],
        nonPrecise: "Les pauses, les exceptions au repos du dimanche et les majorations dépendent de décrets ou d'accords négociés.",
      });

    case "feries":
      return fin({
        verdict: "info", titre: "Jours fériés",
        explication: "Les jours fériés sont chômés et payés (art. 81). La liste des jours fériés et des « ponts » est fixée chaque année par décret.",
        articles: ["jours-feries", "duree-travail"],
        conseil: emp ? "Payez les jours fériés non travaillés comme des jours normaux." : "Si un jour férié n'est pas payé, vérifiez-le sur votre bulletin de paie et réclamez par écrit.",
        etapes: ["Consultez la liste officielle des jours fériés de l'année.", "Vérifiez le bulletin de paie.", "Réclamez la régularisation par écrit si besoin (modèle « Mise en demeure »)."],
        documents: emp ? [] : ["mise_en_demeure"],
        nonPrecise: "Le Code ne précise pas ici la rémunération d'un jour férié travaillé : demandez à l'inspection du travail ou voyez votre convention collective.",
      });

    case "conges": {
      const t = r.type;
      const base = "Le salarié acquiert 2,5 jours de congé par mois de service effectif (art. 86). Le droit de jouissance s'ouvre après 12 mois de service effectif (art. 88).";
      const detail = t === "refus"
        ? " Les dates sont fixées à l'avance par les parties ; sinon l'employeur les fixe après avoir consulté le salarié (art. 88). L'employeur doit planifier les départs en début d'année (art. 86). Le droit au congé se prescrit par 3 ans (art. 86)."
        : t === "paye"
          ? " Pendant le congé, l'allocation est au moins égale à 1/12 des salaires des 12 derniers mois et doit être versée avant le départ, sauf accord écrit contraire (art. 89)."
          : " Si le contrat prend fin avant que les congés aient été pris, une indemnité calculée sur les droits acquis est due (art. 90).";
      const ouvert = s.anciennete >= 12 ? "" : " Avec moins de 12 mois d'ancienneté, le congé ne peut pas encore être exigé, mais les jours s'acquièrent déjà.";
      return fin({
        verdict: emp ? "info" : "risque", titre: "Congés payés",
        explication: base + detail + ouvert,
        articles: ["conges-payes", "conges-prise", ...(t === "paye" ? ["conges-allocation"] : []), ...(t === "fin" ? ["conges-rupture", "inspection-pouvoirs"] : []), "conges-assimiles"],
        conseil: emp ? "Planifiez les congés en début d'année et conservez la preuve des dates accordées." : "Faites votre demande de congé par écrit et gardez la réponse.",
        etapes: t === "fin"
          ? [emp ? "Calculez les jours acquis non pris et payez l'indemnité avec le solde (Simulateur)." : "Calculez vos jours acquis non pris (Simulateur) et réclamez par écrit.", emp ? "Remettez le certificat de travail." : "Si rien n'est payé, saisissez l'inspecteur du travail (art. 204)."]
          : [emp ? "Fixez les dates avec le salarié, par écrit." : "Demandez les dates par écrit, avec un délai raisonnable.", emp ? "Versez l'allocation avant le départ." : "Gardez la réponse de l'employeur.", "En cas de blocage, contactez l'inspection du travail."],
        documents: emp ? [] : ["mise_en_demeure"],
        nonPrecise: "Le Code n'indique pas de délai de prévenance précis pour la demande de congé.",
      });
    }

    case "maladie_certif":
      return fin({
        verdict: "info", titre: "Congé maladie et certificat médical",
        explication: "Le contrat est suspendu pendant une maladie dûment constatée par un médecin d'un service médical interentreprise ou d'entreprise ou, à défaut, d'un médecin agréé, pendant 6 mois au plus ; l'employeur ne peut pas rompre le contrat pendant ce temps (art. 13). L'employeur verse alors une « indemnité de suspension » (dans la limite d'un mois ou de la durée du préavis, modalités par décret, art. 14). Ces absences comptent comme du service effectif pour les congés dans la limite de 6 mois (art. 87).",
        articles: ["suspension-contrat", "indemnite-suspension", "conges-assimiles", "absence-salaire"],
        conseil: emp ? "Ne sanctionnez pas une absence couverte par un certificat d'un médecin habilité." : "Faites constater votre maladie par un médecin du service médical ou agréé et remettez le certificat à l'employeur, en gardant une copie.",
        etapes: emp ? ["Demandez le certificat et classez-le.", "Ne licenciez pas pendant la suspension."] : ["Consultez un médecin habilité.", "Remettez le certificat (gardez la preuve de remise).", "Prévenez l'employeur par écrit."],
        nonPrecise: "Le Code ne fixe pas ici de délai pour remettre le certificat ni le détail de l'indemnité (décret). " + INSPECTION,
      });

    case "maladie_licenciement": {
      const c = r.cas;
      const phrase: Record<string, string> = {
        moins6: "Le contrat est suspendu pendant une maladie constatée par un médecin habilité, dans la limite de 6 mois : l'employeur ne peut pas le rompre (art. 13) et doit verser l'indemnité de suspension (art. 14).",
        plus6: "Après 6 mois d'absence pour maladie, l'employeur peut rompre le contrat, mais il doit régler tous les droits du travailleur, notamment le préavis (art. 13). La procédure de licenciement reste obligatoire (art. 21, 22).",
        accident: "Pendant l'arrêt consécutif à un accident du travail ou à une maladie professionnelle, le contrat est suspendu et l'employeur ne peut pas le rompre (art. 13, cas n° 8).",
        aucun: "La protection de l'article 13 vise une maladie « dûment constatée » par un médecin habilité. Sans constat médical, elle ne s'applique pas ; faites constater l'arrêt.",
      };
      const protege = c === "moins6" || c === "accident";
      return fin({
        verdict: emp ? (protege ? "illegal" : "risque") : "info", titre: "Licenciement pendant une maladie ou un accident",
        explication: (phrase[c] ?? phrase.aucun) + " Une rupture sans respecter la procédure ou sans motif légitime reste abusive (art. 20).",
        articles: ["suspension-contrat", "indemnite-suspension", "licenciement-abusif", "licenciement-formalites", "notification-rupture"],
        conseil: emp ? (protege ? "Ne rompez pas le contrat pendant la suspension." : "Même si vous pouvez rompre, respectez la procédure et réglez tous les droits, préavis compris.") : "Gardez tous vos certificats et envoyez-les à l'employeur avec preuve de remise.",
        etapes: emp ? ["Vérifiez la nature et la durée de l'arrêt.", "N'engagez aucune rupture pendant la suspension.", "Après 6 mois de maladie, si vous rompez, suivez la procédure et payez préavis et congés."] : ["Rassemblez certificats médicaux et lettre de l'employeur.", "Contestez par écrit (modèle « Contestation »).", "Saisissez l'inspecteur du travail ; le tribunal fixe les dommages-intérêts."],
        documents: emp ? ["convocation"] : ["contestation"],
        nonPrecise: "Le Code renvoie à un décret pour les modalités de l'indemnité de suspension (art. 14).",
      });
    }

    case "enceinte": {
      const constat = r.constat === "oui";
      return fin({
        verdict: emp ? (constat && s.contrat !== "cdd" ? "illegal" : "risque") : "info", titre: "Grossesse et maternité",
        explication: `Un employeur ne peut pas rompre le contrat d'une salariée dont la grossesse est constatée médicalement, sauf faute professionnelle sans lien avec la grossesse (art. 95).${constat ? "" : " Ici, la grossesse n'est pas encore constatée médicalement : faites-la constater par un certificat pour bénéficier de cette protection."} La protection n'empêche pas un CDD d'arriver à son terme (art. 95) ; mais un CDD renouvelé deux fois peut être devenu un CDI (art. 8). Le congé de maternité dure 14 semaines consécutives (dont 8 après l'accouchement), l'employeur ne peut pas lui donner congé pendant cette période (art. 97). Après la naissance, repos d'allaitement payés jusqu'à 1 heure par jour pendant 15 mois (art. 98). Pendant l'essai, la grossesse ne peut pas justifier la rupture (art. 94). Le traitement discriminatoire est puni pénalement (art. 261).`,
        articles: ["grossesse-licenciement", "maternite", "allaitement", "grossesse-essai", "cdd-duree", "discrimination-penal"],
        conseil: emp ? "Ne rompez pas le contrat à cause de la grossesse. Vérifiez si un CDD n'est pas déjà devenu CDI." : "Faites constater la grossesse par un médecin, informez l'employeur par écrit, gardez une copie.",
        etapes: emp ? ["Demandez le certificat médical et classez-le.", "Ne notifiez aucune rupture liée à la grossesse.", "Préparez le congé de maternité (14 semaines) et le versement de votre part du salaire (art. 97)."] : ["Obtenez le certificat médical.", "Envoyez-le à l'employeur avec preuve de remise.", "En cas de licenciement ou de non-renouvellement, contestez par écrit (modèle « Contestation ») puis saisissez l'inspection du travail."],
        documents: emp ? [] : ["contestation"],
        nonPrecise: "Le détail des prestations de la CNaPS relève du Code de protection sociale, pas du Code du travail.",
      });
    }

    case "accident":
      return fin({
        verdict: "info", titre: "Accident du travail et sécurité",
        explication: "Pendant l'arrêt consécutif à un accident du travail ou à une maladie professionnelle, le contrat est suspendu et ne peut pas être rompu par l'employeur (art. 13). Ces absences comptent comme du service effectif pour les congés (art. 87). L'employeur doit fournir les équipements de protection adaptés (art. 110) et informer et former les salariés sur la sécurité de leur poste (art. 123).",
        articles: ["suspension-contrat", "conges-assimiles", "securite-equipements", "securite-formation"],
        conseil: emp ? "Fournissez les équipements, formez le personnel et déclarez l'accident selon la réglementation de protection sociale." : "Faites constater la blessure par un médecin et prévenez l'employeur par écrit le plus tôt possible.",
        etapes: emp ? ["Faites soigner le salarié.", "Déclarez l'accident aux organismes compétents.", "Corrigez la cause : équipement, formation."] : ["Consultez un médecin.", "Prévenez l'employeur par écrit et gardez une copie.", "Contactez l'inspection du travail si l'équipement de sécurité manque."],
        nonPrecise: "L'indemnisation de l'accident du travail relève du Code de protection sociale (CNaPS), non précisé par le Code du travail : s'adresser à la CNaPS ou à l'inspection du travail.",
      });

    case "enfants": {
      const jeune = r.age === "moins15";
      return fin({
        verdict: emp ? (jeune ? "illegal" : "risque") : "info", titre: "Travail des enfants et des mineurs",
        explication: `L'âge minimum d'accès à l'emploi est de 15 ans (art. 100).${jeune ? " Avant 15 ans, un enfant ne peut être employé, même comme apprenti, qu'avec l'autorisation de l'inspecteur du travail et pour des travaux non nuisibles à sa santé (art. 102)." : ""} Avant 18 ans : 8 heures par jour et 40 heures par semaine au maximum, ni travail de nuit ni heures supplémentaires, 12 heures de repos consécutives par jour (art. 101). Des décrets listent les travaux interdits aux enfants (art. 100).`,
        articles: ["age-minimum", "enfants-autorisation", "mineurs-duree"],
        conseil: emp ? "N'employez pas de personne de moins de 15 ans sans autorisation de l'inspecteur du travail." : "Signalez toute situation de travail d'enfant à l'inspection du travail.",
        etapes: ["Vérifiez l'âge sur un acte de naissance.", "Vérifiez les horaires (8 h/jour, 40 h/semaine, pas de nuit).", "Contactez l'inspecteur du travail en cas de doute ou d'autorisation à demander."],
        nonPrecise: "La liste des travaux interdits aux enfants est dans des décrets, pas dans le Code.",
      });
    }

    case "harcelement":
      return fin({
        verdict: emp ? "illegal" : "info", titre: "Harcèlement ou discrimination",
        explication: "Tout salarié a droit au respect de sa dignité ; il ne peut être sanctionné, discriminé ni licencié pour avoir résisté à un harcèlement ou pour l'avoir raconté ou en avoir témoigné (art. 5). Une rupture causée par un harcèlement sexuel ou moral est imputée à son auteur ; la victime doit apporter les preuves, par tous moyens, et peut obtenir des dommages-intérêts fixés par le juge (art. 23). Un licenciement motivé par les opinions ou l'appartenance syndicale est abusif (art. 20). La discrimination à l'embauche, aux conditions de travail, à la rémunération ou au licenciement est punie d'une amende et de prison (art. 261).",
        articles: ["dignite-harcelement", "harcelement-rupture", "licenciement-abusif", "salaire-egal", "handicap-discrimination", "discrimination-penal"],
        conseil: emp ? "Prenez toute plainte au sérieux : faites cesser les faits et écoutez chacun avant de décider." : "Gardez toutes les preuves (messages, témoins, dates) et écrivez à l'employeur.",
        etapes: emp ? ["Écoutez la personne et les personnes mises en cause (droit de défense).", "Faites cesser les faits.", "Ne sanctionnez jamais la personne qui a signalé les faits."] : ["Notez les faits : dates, lieux, paroles, témoins.", "Gardez messages et captures.", "Écrivez à l'employeur (modèle « Contestation »).", "Saisissez l'inspection du travail ou la justice."],
        documents: emp ? ["convocation"] : ["contestation"],
      });

    case "sanction": {
      const reg = r.reglement;
      return fin({
        verdict: "risque", titre: "Sanction disciplinaire / mise à pied",
        explication: `Les sanctions possibles et la procédure de défense sont fixées par le règlement intérieur (art. 168), obligatoire à partir de 11 travailleurs (art. 169).${reg === "non" ? " Ici il n'existe pas : si l'entreprise a au moins 11 travailleurs, il est obligatoire." : ""} Un salarié ne peut pas être sanctionné pour avoir résisté à un harcèlement ou en avoir témoigné (art. 5). Pour un licenciement, le droit de défense s'applique (art. 22). Le salaire d'un jour non travaillé n'est pas dû, sauf cas prévus (art. 54).`,
        articles: ["reglement-interieur", "reglement-obligatoire", "licenciement-formalites", "dignite-harcelement", "absence-salaire"],
        conseil: emp ? "N'appliquez que les sanctions prévues par votre règlement intérieur, après avoir écouté le salarié." : "Demandez la sanction et ses motifs par écrit et comparez avec le règlement intérieur.",
        etapes: emp ? ["Relisez les sanctions prévues au règlement intérieur.", "Convoquez le salarié et recueillez ses explications (modèle « Convocation »).", "Notifiez la sanction par écrit avec les motifs."] : ["Demandez le règlement intérieur et la sanction par écrit.", "Répondez par écrit si elle ne respecte pas le règlement (modèle « Contestation »).", "Saisissez l'inspection du travail."],
        documents: emp ? ["convocation"] : ["contestation"],
        nonPrecise: "Le Code ne dit pas ce qu'est une « mise à pied » ni sa durée maximale : voir le règlement intérieur.",
      });
    }

    case "delegue": {
      const st = r.statut;
      return fin({
        verdict: emp ? (st === "syndique" ? "illegal" : "risque") : "info", titre: "Délégué du personnel et liberté syndicale",
        explication: st === "syndique"
          ? "Il est interdit de renvoyer un salarié ou de lui nuire à cause de son affiliation ou de ses activités syndicales ; la mesure est nulle de plein droit et donne lieu à des dommages-intérêts (art. 141). Un tel licenciement est abusif (art. 20)."
          : "Tout licenciement d'un délégué du personnel doit être soumis à la décision de l'inspecteur du travail, qui se prononce sous 45 jours (le silence vaut autorisation). La même règle vaut pour les anciens délégués pendant 6 mois et les candidats, dès le dépôt de la candidature et 3 mois après le vote (art. 156). Si le licenciement est refusé, la décision de l'employeur est nulle. Des délégués sont obligatoires dans les établissements de plus de 11 salariés (art. 153).",
        articles: st === "syndique" ? ["syndical-discrimination", "licenciement-abusif"] : ["delegue-licenciement", "delegues-election", "syndical-discrimination"],
        conseil: emp ? "Ne licenciez pas un délégué sans la décision de l'inspecteur du travail." : "Si vous êtes licencié sans cette autorisation, gardez la lettre et contestez tout de suite.",
        etapes: emp ? ["Saisissez l'inspecteur du travail avant toute rupture.", "Attendez sa décision."] : ["Gardez la lettre de licenciement.", "Contestez par écrit (modèle « Contestation »).", "Saisissez l'inspecteur du travail."],
        documents: emp ? [] : ["contestation"],
      });
    }

    case "cdd_requalif": {
      const ren2 = r.renouv === "2", six = r.six === "oui";
      const depasse = s.anciennete > 24;
      const cdi = (ren2 && six) || depasse;
      return fin({
        verdict: cdi ? (emp ? "risque" : "info") : "info", titre: cdi ? "Ce CDD est probablement devenu un CDI" : "Renouvellements de CDD",
        explication: `Un CDD ne peut pas dépasser 2 ans (art. 8). S'il dure au moins 6 mois, il devient automatiquement un CDI après deux renouvellements ; une réembauche au même poste après une pause d'un mois au plus compte comme un renouvellement (art. 8). Quand les conditions du CDD ne sont pas remplies, le contrat est réputé à durée indéterminée (art. 9).${ren2 && six ? " Ici : deux renouvellements ou plus sur un CDD d'au moins 6 mois." : ""}${depasse ? " Ici : l'ancienneté dépasse 24 mois (2 ans)." : ""}${cdi ? " Le salarié relève donc des règles du CDI : le non-renouvellement devient un licenciement qui exige motif, procédure écrite et préavis (art. 18 à 22). Seul un juge tranche en cas de désaccord." : " Les conditions de transformation automatique ne semblent pas réunies, sauf si le contrat a continué après son terme sans que personne n'ait manifesté sa volonté d'y mettre fin (art. 9)."}`,
        articles: ["cdd-duree", "cdd-requalification", "licenciement-formalites", "preavis-indemnite"],
        conseil: emp ? (cdi ? "Ne considérez pas le contrat comme terminé : traitez-le comme un CDI et suivez la procédure de licenciement." : "Comptez les renouvellements avant d'en proposer un nouveau.") : (cdi ? "Si on vous annonce la fin du CDD, contestez par écrit en invoquant les renouvellements." : "Gardez tous les avenants et contrats successifs."),
        etapes: emp ? ["Faites la liste des contrats et des dates de renouvellement.", "Si le CDD est devenu un CDI, utilisez la situation « Licenciement » ou « Motif économique »."] : ["Rassemblez tous vos contrats, avenants et bulletins de paie.", "Écrivez à l'employeur pour demander la reconnaissance d'un CDI (modèle « Contestation »).", "Saisissez l'inspecteur du travail ou le tribunal."],
        documents: emp ? [] : ["contestation"],
        nonPrecise: "Seul le juge peut reconnaître officiellement la transformation en CDI en cas de désaccord.",
      });
    }
  }
}
