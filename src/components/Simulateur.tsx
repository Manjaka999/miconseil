import { useState } from "react";
import { baremeParDefaut } from "../data/bareme";
import { ar, calculer } from "../lib/calcul";
import { useCountUp } from "../lib/useCountUp";
import { Calculator } from "lucide-react";

const num = (v: string) => Math.max(0, Number(v) || 0);

export default function Simulateur() {
  const [salaire, setSalaire] = useState(400000);
  const [anc, setAnc] = useState(36);
  const [eco, setEco] = useState(false);
  const [preavis, setPreavis] = useState(baremeParDefaut.preavisMois);
  const [conges, setConges] = useState(0);
  const [impayes, setImpayes] = useState(0);
  const [dom, setDom] = useState(0);
  const [cddRest, setCddRest] = useState(0);
  const r = calculer({ salaireMensuel: salaire, ancienneteMois: anc, moisDommages: dom, economique: eco, joursConges: conges, moisImpayes: impayes, moisCddRestants: cddRest }, { ...baremeParDefaut, preavisMois: preavis });
  const aPreavis = useCountUp(r.preavis), aIndem = useCountUp(r.indemniteLicenciement), aConges = useCountUp(r.conges), aImp = useCountUp(r.impayes), aDom = useCountUp(r.dommages), aCdd = useCountUp(r.cddRestant), aTotal = useCountUp(r.total);
  return (
    <section className="duo sim">
      <h2><Calculator size={22} aria-hidden /> Simulateur de fin de contrat</h2>
      <label className="lab">Salaire mensuel (Ar)<input className="champ" type="number" inputMode="numeric" min={0} value={salaire} onChange={(e) => setSalaire(num(e.target.value))} /></label>
      <label className="lab">Ancienneté (mois)<input className="champ" type="number" inputMode="numeric" min={0} value={anc} onChange={(e) => setAnc(num(e.target.value))} /></label>
      <label className="lab">Motif de la rupture
        <select className="champ" value={eco ? "eco" : "autre"} onChange={(e) => setEco(e.target.value === "eco")}>
          <option value="autre">Autre motif (faute, démission, fin de contrat…)</option>
          <option value="eco">Licenciement pour motif économique ou cessation d'activité</option>
        </select>
      </label>
      <label className="lab">Durée du préavis (mois), selon votre contrat ou convention collective<input className="champ" type="number" inputMode="decimal" min={0} value={preavis} onChange={(e) => setPreavis(num(e.target.value))} /></label>
      <label className="lab">Jours de congé acquis et non pris<input className="champ" type="number" inputMode="numeric" min={0} value={conges} onChange={(e) => setConges(num(e.target.value))} /></label>
      <label className="lab">Mois de salaire impayés<input className="champ" type="number" inputMode="numeric" min={0} value={impayes} onChange={(e) => setImpayes(num(e.target.value))} /></label>
      <label className="lab">CDD rompu avant terme sans cas prévu : mois de salaire restant à courir (art. 36)<input className="champ" type="number" inputMode="decimal" min={0} value={cddRest} onChange={(e) => setCddRest(num(e.target.value))} /></label>
      <label className="lab">Dommages-intérêts éventuels (en mois de salaire ; fixés par le juge, aucun barème dans le Code)<input className="champ" type="number" inputMode="decimal" min={0} value={dom} onChange={(e) => setDom(num(e.target.value))} /></label>
      <div className="resultat info" aria-live="polite">
        <div className="ligne"><span>Préavis ({r.moisPreavis} mois)</span><b>{ar(aPreavis)}</b></div>
        <div className="ligne"><span>Indemnité de licenciement économique</span><b>{ar(aIndem)}</b></div>
        <div className="ligne"><span>Congés non pris (estimation)</span><b>{ar(aConges)}</b></div>
        <div className="ligne"><span>Salaires impayés</span><b>{ar(aImp)}</b></div>
        <div className="ligne"><span>CDD rompu avant terme : salaires restants</span><b>{ar(aCdd)}</b></div>
        <div className="ligne"><span>Dommages-intérêts (hypothèse)</span><b>{ar(aDom)}</b></div>
        <div className="ligne"><span>Total estimé</span><span className="total">{ar(aTotal)}</span></div>
        {!eco && <p className="muted">Pas d'indemnité de licenciement ici : l'article 48 de la loi 2024-014 la prévoit seulement pour le motif économique ou la cessation d'activité.</p>}
        {preavis === 0 && <p className="muted">Préavis à 0 : saisissez la durée prévue par votre contrat ou votre convention collective (le Code ne la fixe pas : décret ou convention collective, art. 38).</p>}
      </div>
      <details>
        <summary>Comment c'est calculé</summary>
        <p className="muted">Loi n° 2024-014. Indemnité économique (art. 48) : 10 jours de salaire par année complète de service, plafonnée à 6 mois de salaire. Préavis (art. 37) : la rémunération de la durée de préavis non respectée. Congés (art. 133) : estimation à 1/30 du salaire mensuel par jour acquis non pris (art. 125 : 2,5 jours calendaires par mois). CDD rompu avant terme (art. 36) : salaires et avantages de la période restant à courir. Commissions et primes : moyenne des 12 derniers mois (art. 88). Majoration légale des retards de salaire (art. 94) et heures supplémentaires : non calculées, les taux ne sont pas dans le Code.</p>
      </details>
    </section>
  );
}
