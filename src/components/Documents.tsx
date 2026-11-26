import { useState } from "react";
import { Check, Copy, FileText } from "lucide-react";
import { champsVides, genererDocument, type Champs, type ModeleId } from "../lib/documents";

const modeles: [ModeleId, string][] = [["convocation", "Convocation à un entretien"], ["mise_en_demeure", "Mise en demeure de paiement"], ["demande_certificat", "Demande de certificat de travail"], ["contestation", "Lettre de contestation"]];

export default function Documents({ initial = "convocation" }: { initial?: ModeleId }) {
  const [modele, setModele] = useState<ModeleId>(initial);
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
    <section className="duo docs">
      <h2><FileText size={22} aria-hidden /> Documents prêts à l'emploi</h2>
      <div className="grille">{modeles.map(([id, l]) => <button key={id} className={"choix" + (modele === id ? " on" : "")} onClick={() => setModele(id)} aria-pressed={modele === id}>{l}</button>)}</div>
      {f("employeur", "Employeur")}{f("salarie", "Salarié")}{f("lieu", "Lieu")}{f("date", "Date")}
      {modele === "convocation" && f("rdv", "Date et heure de l'entretien")}
      {modele === "contestation" && f("rdv", "Date de la décision contestée")}
      {f("motif", { convocation: "Faits reprochés", mise_en_demeure: "Objet du manquement", demande_certificat: "Circonstances de la fin du contrat (facultatif)", contestation: "Décision contestée et vos arguments" }[modele], true)}
      {(modele === "mise_en_demeure" || modele === "demande_certificat") && f("montant", modele === "mise_en_demeure" ? "Montant dû (Ar)" : "Montant estimé dû (Ar, facultatif)")}
      <textarea className="champ doc" readOnly rows={14} value={texte} aria-label="Document généré" />
      <button className="btn" onClick={copier}>{copie ? <Check size={18} aria-hidden /> : <Copy size={18} aria-hidden />} {copie ? "Copié" : "Copier le texte"}</button>
    </section>
  );
}
