import { useState } from "react";
import type { Bareme, Categorie } from "../types";
import { baremeParDefaut } from "../data/bareme";
import { ar, calculer } from "../lib/calcul";

const cats: [Categorie, string][] = [["ouvrier", "Ouvrier"], ["employe", "Employé"], ["maitrise", "Agent de maîtrise"], ["cadre", "Cadre"]];

export default function Simulateur() {
  const [salaire, setSalaire] = useState(400000);
  const [anc, setAnc] = useState(36);
  const [cat, setCat] = useState<Categorie>("employe");
  const [dom, setDom] = useState(3);
  const [bareme, setBareme] = useState<Bareme>(baremeParDefaut);
  const r = calculer({ salaireMensuel: salaire, ancienneteMois: anc, categorie: cat, moisDommages: dom }, bareme);
  const num = (v: string) => Math.max(0, Number(v) || 0);
  return (
    <section>
      <h2>Simulateur de rupture</h2>
      <label className="lab">Salaire mensuel (Ar)<input className="champ" type="number" min={0} value={salaire} onChange={(e) => setSalaire(num(e.target.value))} /></label>
      <label className="lab">Ancienneté (mois)<input className="champ" type="number" min={0} value={anc} onChange={(e) => setAnc(num(e.target.value))} /></label>
      <label className="lab">Catégorie<select className="champ" value={cat} onChange={(e) => setCat(e.target.value as Categorie)}>{cats.map(([id, l]) => <option key={id} value={id}>{l}</option>)}</select></label>
      <label className="lab">Dommages-intérêts éventuels (mois de salaire, fixés par le juge)<input className="champ" type="number" min={0} value={dom} onChange={(e) => setDom(num(e.target.value))} /></label>
      <div className="resultat info">
        <p>Préavis ({r.moisPreavis} mois) : <b>{ar(r.preavis)}</b></p>
        <p>Indemnité de licenciement : <b>{ar(r.indemniteLicenciement)}</b></p>
        <p>Dommages-intérêts (hypothèse) : <b>{ar(r.dommages)}</b></p>
        <p className="total">Total estimé : {ar(r.total)}</p>
      </div>
      <details>
        <summary>Hypothèses de calcul (modifiables)</summary>
        <p className="muted">Valeurs par défaut issues de sources secondaires, parfois contradictoires : validez-les sur le texte officiel.</p>
        {cats.map(([id, l]) => (
          <label key={id} className="lab">Préavis {l} (mois)<input className="champ" type="number" min={0} value={bareme.preavisMois[id]} onChange={(e) => setBareme({ ...bareme, preavisMois: { ...bareme.preavisMois, [id]: num(e.target.value) } })} /></label>
        ))}
        {bareme.indemnite.map((t, i) => (
          <label key={i} className="lab">Indemnité : jours de salaire par année {i === 0 ? "jusqu'à 5 ans" : i === 1 ? "de 5 à 10 ans" : "au-delà de 10 ans"}
            <input className="champ" type="number" min={0} value={t.joursParAn} onChange={(e) => setBareme({ ...bareme, indemnite: bareme.indemnite.map((x, j) => (j === i ? { ...x, joursParAn: num(e.target.value) } : x)) })} />
          </label>
        ))}
        <button className="btn sec" onClick={() => setBareme(baremeParDefaut)}>Réinitialiser</button>
      </details>
    </section>
  );
}
