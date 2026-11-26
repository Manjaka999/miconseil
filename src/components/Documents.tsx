import { useState } from "react";
import { champsVides, genererDocument, type Champs, type ModeleId } from "../lib/documents";

const modeles: [ModeleId, string][] = [["convocation", "Convocation à un entretien"], ["mise_en_demeure", "Mise en demeure de paiement"]];

export default function Documents() {
  const [modele, setModele] = useState<ModeleId>("convocation");
  const [c, setC] = useState<Champs>(champsVides());
  const [copie, setCopie] = useState(false);
  const texte = genererDocument(modele, c);
  const f = (k: keyof Champs, label: string, area = false) => (
    <label className="lab">{label}{area
      ? <textarea className="champ" rows={3} value={c[k]} onChange={(e) => setC({ ...c, [k]: e.target.value })} />
      : <input className="champ" value={c[k]} onChange={(e) => setC({ ...c, [k]: e.target.value })} />}</label>
  );
  const copier = async () => {
    try { await navigator.clipboard.writeText(texte); setCopie(true); setTimeout(() => setCopie(false), 2000); } catch { /* copie manuelle possible */ }
  };
  return (
    <section>
      <h2>Documents prêts à l'emploi</h2>
      <div className="grille">{modeles.map(([id, l]) => <button key={id} className={"choix" + (modele === id ? " on" : "")} onClick={() => setModele(id)}>{l}</button>)}</div>
      {f("employeur", "Employeur")}{f("salarie", "Salarié")}{f("lieu", "Lieu")}{f("date", "Date")}
      {modele === "convocation" && f("rdv", "Date et heure de l'entretien")}
      {f("motif", modele === "convocation" ? "Faits reprochés" : "Objet du manquement", true)}
      {modele === "mise_en_demeure" && f("montant", "Montant dû (Ar)")}
      <textarea className="champ doc" readOnly rows={14} value={texte} aria-label="Document généré" />
      <button className="btn" onClick={copier}>{copie ? "Copié ✓" : "Copier le texte"}</button>
    </section>
  );
}
