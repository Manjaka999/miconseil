import { useState } from "react";
import { ArrowLeft, ArrowRight, BadgeCheck, CircleAlert, Compass, FilePenLine, Info, RotateCcw, ShieldCheck, TriangleAlert } from "lucide-react";
import type { Contrat, Probleme, Profil } from "../types";
import { diagnostiquer } from "../lib/diagnostic";
import { articleParId, libelleArticle } from "../data/articles";

const problemes: [Probleme, string][] = [["licencier", "Licenciement / rupture"], ["absence", "Absence injustifiée"], ["retard_salaire", "Retard de salaire"], ["demission", "Démission"]];
const icones = { conforme: ShieldCheck, risque: TriangleAlert, illegal: CircleAlert, info: Info } as const;

export default function DiagnosticWizard({ onDocuments }: { onDocuments: () => void }) {
  const [etape, setEtape] = useState(1);
  const [profil, setProfil] = useState<Profil>("employeur");
  const [contrat, setContrat] = useState<Contrat>("cdi");
  const [anciennete, setAnciennete] = useState(12);
  const [probleme, setProbleme] = useState<Probleme>("licencier");
  const d = etape === 4 ? diagnostiquer({ profil, contrat, anciennete, probleme }) : null;
  const Icone = d ? icones[d.verdict] : Info;
  const choix = (actif: boolean, onClick: () => void, label: string) => <button key={label} className={"choix" + (actif ? " on" : "")} onClick={onClick} aria-pressed={actif}>{label}</button>;

  return (
    <section>
      <h2><Compass size={22} aria-hidden /> Diagnostic de litige</h2>
      <div className="etapes" role="progressbar" aria-valuemin={1} aria-valuemax={3} aria-valuenow={Math.min(etape, 3)} aria-label="Progression">
        {[1, 2, 3].map((n) => <span key={n} className={etape >= n ? "fait" : ""} />)}
      </div>
      <p className="muted">{etape === 4 ? "Résultat" : `Étape ${etape} sur 3`}</p>
      <div key={etape} className="etape">
        {etape === 1 && (<><h3>Vous êtes…</h3><div className="grille">{choix(profil === "employeur", () => setProfil("employeur"), "Employeur")}{choix(profil === "salarie", () => setProfil("salarie"), "Salarié")}</div></>)}
        {etape === 2 && (
          <>
            <h3>Type de contrat</h3>
            <div className="grille">{(["cdi", "cdd", "essai"] as Contrat[]).map((c) => choix(contrat === c, () => setContrat(c), c === "essai" ? "Période d'essai" : c.toUpperCase()))}</div>
            <label className="lab">Ancienneté (en mois)<input className="champ" type="number" min={0} value={anciennete} onChange={(e) => setAnciennete(Math.max(0, Number(e.target.value)))} /></label>
          </>
        )}
        {etape === 3 && (<><h3>Quel est le problème ?</h3><div className="grille">{problemes.map(([id, l]) => choix(probleme === id, () => setProbleme(id), l))}</div></>)}
        {d && (
          <div className={"resultat " + d.verdict}>
            <h3><Icone size={22} aria-hidden /> {d.titre}</h3>
            <p>{d.explication}</p>
            <h4>Articles concernés</h4>
            <ul>{d.articles.map((id) => { const a = articleParId(id); return a && <li key={id}>{libelleArticle(a)} {a.verifie && <BadgeCheck size={14} aria-label="vérifié" style={{ verticalAlign: "-2px", color: "var(--ok)" }} />}</li>; })}</ul>
            <h4>Conseil pratique</h4>
            <p>{d.conseil}</p>
            <button className="btn" onClick={onDocuments}><FilePenLine size={18} aria-hidden /> Préparer un courrier</button>
          </div>
        )}
      </div>
      <div className="actions">
        {etape > 1 && etape < 4 && <button className="btn sec" onClick={() => setEtape(etape - 1)}><ArrowLeft size={18} aria-hidden /> Retour</button>}
        {etape < 3 && <button className="btn" onClick={() => setEtape(etape + 1)}>Suivant <ArrowRight size={18} aria-hidden /></button>}
        {etape === 3 && <button className="btn" onClick={() => setEtape(4)}>Voir le diagnostic <ArrowRight size={18} aria-hidden /></button>}
        {etape === 4 && <button className="btn sec" onClick={() => setEtape(1)}><RotateCcw size={18} aria-hidden /> Recommencer</button>}
      </div>
    </section>
  );
}
