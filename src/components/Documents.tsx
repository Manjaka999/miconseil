import { useEffect, useState } from "react";
import { Check, Copy, Download, FileText, Pencil, Printer, RotateCcw } from "lucide-react";
import { champsVides, genererDocument, type Champs, type ModeleId } from "../lib/documents";
import { useProfil } from "../lib/etat";

const modeles: [ModeleId, string][] = [["convocation", "Convocation à un entretien"], ["mise_en_demeure", "Mise en demeure de paiement"], ["demande_certificat", "Demande de certificat de travail"], ["contestation", "Lettre de contestation"]];

export default function Documents({ initial = "convocation", motif }: { initial?: ModeleId; motif?: string }) {
  const [pr, setPr] = useProfil();
  const [modele, setModele] = useState<ModeleId>(initial);
  const [c, setC] = useState<Champs>(() => ({ ...champsVides(), employeur: pr.employeur, salarie: pr.salarie, lieu: pr.lieu, motif: motif ?? "" }));
  /** Texte corrigé à la main (null = texte généré à partir des champs). */
  const [manuel, setManuel] = useState<string | null>(null);
  const [copie, setCopie] = useState(false);
  // Arrivée depuis un diagnostic : le motif est prérempli avec le sujet du diagnostic.
  useEffect(() => { if (motif) setC((x) => ({ ...x, motif })); }, [motif]);
  const genere = genererDocument(modele, c);
  const texte = manuel ?? genere;
  const maj = (k: keyof Champs, v: string) => {
    setC((x) => ({ ...x, [k]: v }));
    if (k === "employeur" || k === "salarie" || k === "lieu") setPr({ [k]: v });
  };
  const f = (k: keyof Champs, label: string, area = false) => (
    <label className="lab">{label}{area
      ? <textarea className="champ" rows={3} value={c[k]} onChange={(e) => maj(k, e.target.value)} />
      : <input className="champ" value={c[k]} onChange={(e) => maj(k, e.target.value)} />}</label>
  );
  const copier = async () => {
    try { await navigator.clipboard.writeText(texte); setCopie(true); setTimeout(() => setCopie(false), 2000); } catch { /* copie manuelle possible */ }
  };
  const telecharger = () => {
    const url = URL.createObjectURL(new Blob([texte], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url; a.download = `${modele}.txt`; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <section className="duo docs">
      <h2><FileText size={22} aria-hidden /> Documents prêts à l'emploi</h2>
      <div className="grille">{modeles.map(([id, l]) => <button key={id} className={"choix" + (modele === id ? " on" : "")} onClick={() => { setModele(id); setManuel(null); }} aria-pressed={modele === id}>{l}</button>)}</div>
      {f("employeur", "Employeur")}{f("salarie", "Salarié")}{f("lieu", "Lieu")}{f("date", "Date")}
      {modele === "convocation" && f("rdv", "Date et heure de l'entretien")}
      {modele === "contestation" && f("rdv", "Date de la décision contestée")}
      {f("motif", { convocation: "Faits reprochés", mise_en_demeure: "Objet du manquement", demande_certificat: "Circonstances de la fin du contrat (facultatif)", contestation: "Décision contestée et vos arguments" }[modele], true)}
      {(modele === "mise_en_demeure" || modele === "demande_certificat") && f("montant", modele === "mise_en_demeure" ? "Montant dû (Ar)" : "Montant estimé dû (Ar, facultatif)")}
      <label className="lab doc-lab"><span><Pencil size={14} aria-hidden /> Texte du document : vous pouvez le modifier directement</span>
        <textarea className="champ doc" rows={16} value={texte} onChange={(e) => setManuel(e.target.value)} aria-label="Document généré, modifiable" />
      </label>
      {manuel !== null && manuel !== genere && (
        <p className="muted no-print">Vous avez modifié le texte à la main : les champs ci-dessus ne le changent plus. <button className="lien" onClick={() => setManuel(null)}><RotateCcw size={13} aria-hidden /> Régénérer depuis les champs</button></p>
      )}
      <div className="actions no-print">
        <button className="btn" onClick={copier}>{copie ? <Check size={18} aria-hidden /> : <Copy size={18} aria-hidden />} {copie ? "Copié" : "Copier"}</button>
        <button className="btn sec" onClick={telecharger}><Download size={18} aria-hidden /> Télécharger (.txt)</button>
        <button className="btn sec" onClick={() => window.print()}><Printer size={18} aria-hidden /> Imprimer / PDF</button>
      </div>
      <pre className="print-zone lettre">{texte}</pre>
    </section>
  );
}
