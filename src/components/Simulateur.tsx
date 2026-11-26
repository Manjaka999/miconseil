import { useState } from "react";
import { baremeParDefaut } from "../data/bareme";
import { ar, calculer } from "../lib/calcul";
import { useProfil } from "../lib/etat";
import { Calculator, Check, Copy, Printer } from "lucide-react";

const num = (v: string) => Math.max(0, Number(v) || 0);

export default function Simulateur() {
  const [pr, setPr] = useProfil();
  const [eco, setEco] = useState(false);
  const [preavis, setPreavis] = useState("");
  const [conges, setConges] = useState(0);
  const [impayes, setImpayes] = useState(0);
  const [dom, setDom] = useState(0);
  const [cddRest, setCddRest] = useState(0);
  const [copie, setCopie] = useState(false);
  const salaire = pr.salaire ?? 0, anc = pr.anciennete ?? 0;
  const preavisSaisi = preavis.trim() !== "";
  const mp = preavisSaisi ? num(preavis) : 0;
  const r = calculer({ salaireMensuel: salaire, ancienneteMois: anc, moisDommages: dom, economique: eco, joursConges: conges, moisImpayes: impayes, moisCddRestants: cddRest }, { ...baremeParDefaut, preavisMois: mp });
  const annees = Math.floor(anc / 12), jours = Math.min(annees * baremeParDefaut.indemniteJoursParAn, 180);

  // Chaque ligne : montant, explication du calcul et article de la loi n° 2024-014.
  const lignes: { label: string; montant: number; expl: string; art: string; actif: boolean }[] = [
    { label: "Préavis non respecté", montant: r.preavis, art: "art. 37 et 38", actif: preavisSaisi && mp > 0,
      expl: preavisSaisi ? `${mp} mois de rémunération (durée saisie par vous). Sauf faute lourde, un préavis non respecté donne droit à l'équivalent de la rémunération de la période manquante.` : "Durée du préavis à saisir : le Code ne la fixe pas (convention collective ou décret)." },
    { label: "Indemnité de licenciement économique", montant: r.indemniteLicenciement, art: "art. 48", actif: eco,
      expl: eco ? `${annees} année(s) complète(s) × 10 jours = ${jours} jours (plafond : 6 mois de salaire), à 1/30 du salaire par jour.` : "Non applicable : le Code ne la prévoit que pour un licenciement économique ou une cessation d'activité." },
    { label: "Congés non pris (estimation)", montant: r.conges, art: "art. 125 et 133", actif: conges > 0,
      expl: `${conges} jour(s) × 1/30 du salaire mensuel. Les jours s'acquièrent à raison de 2,5 jours calendaires par mois de service ; la valeur d'un jour est une estimation.` },
    { label: "Salaires impayés", montant: r.impayes, art: "art. 94, 105", actif: impayes > 0,
      expl: `${impayes} mois × salaire mensuel. Les majorations pour retard ne sont pas calculées. Attention : l'action en paiement se prescrit par 12 mois (art. 105).` },
    { label: "CDD rompu avant terme : salaires restants", montant: r.cddRestant, art: "art. 36", actif: cddRest > 0,
      expl: `${cddRest} mois × salaire mensuel : salaires et avantages de la période restant à courir.` },
    { label: "Dommages-intérêts (hypothèse)", montant: r.dommages, art: "art. 39", actif: dom > 0,
      expl: `${dom} mois de salaire, valeur que vous choisissez : le Code ne fixe aucun barème, c'est le juge qui apprécie.` },
  ];
  const recap = () => [
    "RÉCAPITULATIF - MiConseil (estimation indicative, loi n° 2024-014)",
    `Salaire mensuel : ${ar(salaire)} | Ancienneté : ${anc} mois | Motif : ${eco ? "économique" : "autre"}`,
    "",
    ...lignes.filter((l) => l.actif || l.montant > 0).map((l) => `- ${l.label} : ${ar(l.montant)} (${l.art})\n    ${l.expl}`),
    "",
    `TOTAL ESTIMÉ : ${ar(r.total)}`,
    "",
    "Information générale, pas un avis juridique. Les taux et durées fixés par décret ou convention collective ne sont pas inclus sauf s'ils ont été saisis. Vérifiez auprès de l'inspection du travail.",
  ].join("\n");
  const copier = async () => { try { await navigator.clipboard.writeText(recap()); setCopie(true); setTimeout(() => setCopie(false), 2000); } catch { /* copie manuelle possible */ } };

  return (
    <section className="duo sim">
      <h2><Calculator size={22} aria-hidden /> Simulateur de fin de contrat</h2>
      <label className="lab">Salaire mensuel (Ar)<input className="champ" type="number" inputMode="numeric" min={0} placeholder="Ex. 400000" value={pr.salaire ?? ""} onChange={(e) => setPr({ salaire: e.target.value === "" ? null : num(e.target.value) })} /></label>
      <label className="lab">Ancienneté (mois){pr.anciennete !== null && <span className="muted"> · reprise de votre diagnostic</span>}<input className="champ" type="number" inputMode="numeric" min={0} placeholder="Ex. 36" value={pr.anciennete ?? ""} onChange={(e) => setPr({ anciennete: e.target.value === "" ? null : num(e.target.value) })} /></label>
      <label className="lab">Motif de la rupture
        <select className="champ" value={eco ? "eco" : "autre"} onChange={(e) => setEco(e.target.value === "eco")}>
          <option value="autre">Autre motif (faute, démission, fin de contrat…)</option>
          <option value="eco">Licenciement pour motif économique ou cessation d'activité</option>
        </select>
      </label>
      <label className="lab">Durée du préavis, en mois <b className="oblig">(à saisir)</b>
        <input className="champ" type="number" inputMode="decimal" min={0} step="0.5" placeholder="Ex. 1 si votre contrat prévoit 1 mois" value={preavis} onChange={(e) => setPreavis(e.target.value)} aria-describedby="aide-preavis" />
        <small id="aide-preavis" className="aide">La durée du préavis n'est pas fixée par le Code (art. 38) : saisissez celle de votre contrat, de votre convention collective ou du décret. Laissez vide si vous ne la connaissez pas : le préavis ne sera pas compté.</small>
      </label>
      <label className="lab">Jours de congé acquis et non pris<input className="champ" type="number" inputMode="numeric" min={0} value={conges || ""} placeholder="0" onChange={(e) => setConges(num(e.target.value))} /></label>
      <label className="lab">Mois de salaire impayés<input className="champ" type="number" inputMode="numeric" min={0} value={impayes || ""} placeholder="0" onChange={(e) => setImpayes(num(e.target.value))} /></label>
      <label className="lab">CDD rompu avant terme sans cas prévu : mois de salaire restant à courir (art. 36)<input className="champ" type="number" inputMode="decimal" min={0} value={cddRest || ""} placeholder="0" onChange={(e) => setCddRest(num(e.target.value))} /></label>
      <label className="lab">Dommages-intérêts éventuels (en mois de salaire ; fixés par le juge, aucun barème dans le Code)<input className="champ" type="number" inputMode="decimal" min={0} value={dom || ""} placeholder="0" onChange={(e) => setDom(num(e.target.value))} /></label>
      <div className="resultat info" aria-live="polite">
        {!salaire && <p className="muted">Saisissez d'abord le salaire mensuel pour obtenir des montants.</p>}
        {lignes.map((l) => (
          <div key={l.label} className={"ligne2" + (l.actif ? "" : " inactive")}>
            <div className="ligne"><span>{l.label}</span><b>{l.label.startsWith("Préavis") && !preavisSaisi ? "à saisir" : ar(l.montant)}</b></div>
            <small className="aide">{l.expl} <em>({l.art})</em></small>
          </div>
        ))}
        <div className="ligne"><span>Total estimé</span><span className="total">{ar(r.total)}</span></div>
        <div className="actions no-print">
          <button className="btn sec" onClick={copier}>{copie ? <Check size={18} aria-hidden /> : <Copy size={18} aria-hidden />} {copie ? "Copié" : "Copier le récapitulatif"}</button>
          <button className="btn sec" onClick={() => window.print()}><Printer size={18} aria-hidden /> Imprimer / PDF</button>
        </div>
      </div>
      <pre className="print-zone">{recap()}</pre>
      <details>
        <summary>Comment c'est calculé</summary>
        <p className="muted">Loi n° 2024-014. Indemnité économique (art. 48) : 10 jours de salaire par année complète de service, plafonnée à 6 mois de salaire. Préavis (art. 37) : la rémunération de la durée de préavis non respectée. Congés (art. 133) : estimation à 1/30 du salaire mensuel par jour acquis non pris (art. 125 : 2,5 jours calendaires par mois). CDD rompu avant terme (art. 36) : salaires et avantages de la période restant à courir. Commissions et primes : moyenne des 12 derniers mois (art. 88). Majoration légale des retards de salaire (art. 94) et heures supplémentaires : non calculées, les taux ne sont pas dans le Code.</p>
      </details>
    </section>
  );
}
