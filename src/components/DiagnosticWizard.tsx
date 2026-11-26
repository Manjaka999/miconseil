import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, BadgeCheck, BookOpen, CircleAlert, Compass, FilePenLine, Info, ListChecks, RotateCcw, Search, ShieldCheck, TriangleAlert } from "lucide-react";
import type { Contrat, ModeleId, Profil, SituationDef, SituationId } from "../types";
import { diagnostiquer } from "../lib/diagnostic";
import { articleParId, libelleArticle } from "../data/articles";
import { situations, themes } from "../data/situations";

const icones = { conforme: ShieldCheck, risque: TriangleAlert, illegal: CircleAlert, info: Info } as const;
const verdictTexte = { conforme: "Situation en règle", risque: "Attention : risque", illegal: "Pratique contraire au Code", info: "Information" } as const;
const nomModele: Record<ModeleId, string> = { convocation: "Convocation à un entretien", mise_en_demeure: "Mise en demeure de paiement", demande_certificat: "Demande de certificat de travail", contestation: "Lettre de contestation" };
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

interface Props { onDocuments: (modele?: ModeleId) => void; onArticle: (id: string) => void }

export default function DiagnosticWizard({ onDocuments, onArticle }: Props) {
  const [etape, setEtape] = useState(1);
  const [profil, setProfil] = useState<Profil>("employeur");
  const [contrat, setContrat] = useState<Contrat>("cdi");
  const [anciennete, setAnciennete] = useState(12);
  const [sid, setSid] = useState<SituationId>("licencier");
  const [reponses, setReponses] = useState<Record<string, string>>({});
  const [q, setQ] = useState("");
  const titre = useRef<HTMLHeadingElement>(null);
  const def = situations.find((s) => s.id === sid)!;
  const questions = def.questions ?? [];
  const total = etape >= 4 && questions.length ? 4 : 3;
  const complet = questions.every((x) => reponses[x.id]);
  const d = etape === 5 ? diagnostiquer({ profil, contrat, anciennete, situation: sid, reponses }) : null;
  const Icone = d ? icones[d.verdict] : Info;

  // Après chaque changement d'écran, le clavier et le lecteur d'écran reprennent au titre.
  useEffect(() => { titre.current?.focus(); }, [etape]);

  const liste = useMemo(() => {
    const mots = norm(q).split(/\s+/).filter((m) => m.length > 1);
    if (!mots.length) return situations;
    // Au moins un mot trouvé ; les situations qui en contiennent le plus viennent d'abord.
    return situations
      .map((s) => ({ s, n: mots.filter((m) => norm(s.label + " " + s.motsCles.join(" ")).includes(m)).length }))
      .filter((x) => x.n > 0).sort((a, b) => b.n - a.n).map((x) => x.s);
  }, [q]);

  const choix = (actif: boolean, onClick: () => void, label: string) => <button key={label} className={"choix" + (actif ? " on" : "")} onClick={onClick} aria-pressed={actif}>{label}</button>;
  const choisir = (id: SituationId) => { setSid(id); setReponses({}); setEtape(situations.find((s) => s.id === id)!.questions?.length ? 4 : 5); };
  const retour = () => setEtape(etape === 5 ? (questions.length ? 4 : 3) : etape - 1);
  const bouton = (s: SituationDef) => <button key={s.id} className="choix" onClick={() => choisir(s.id)}>{s.label}</button>;

  return (
    <section>
      <h2><Compass size={22} aria-hidden /> Diagnostic de litige</h2>
      <div className="etapes" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={Math.min(etape, total)} aria-label="Progression">
        {Array.from({ length: total }, (_, i) => <span key={i} className={etape >= i + 1 ? "fait" : ""} />)}
      </div>
      <p className="muted">{etape === 5 ? "Résultat" : `Étape ${etape} sur ${total}`}</p>
      <div key={etape} className="etape">
        {etape === 1 && (<><h3 ref={titre} tabIndex={-1}>Vous êtes…</h3><div className="grille">{choix(profil === "employeur", () => { setProfil("employeur"); setEtape(2); }, "Employeur")}{choix(profil === "salarie", () => { setProfil("salarie"); setEtape(2); }, "Salarié")}</div></>)}
        {etape === 2 && (
          <>
            <h3 ref={titre} tabIndex={-1}>Type de contrat</h3>
            <div className="grille">{(["cdi", "cdd", "essai"] as Contrat[]).map((c) => choix(contrat === c, () => setContrat(c), c === "essai" ? "Période d'essai" : c.toUpperCase()))}</div>
            <label className="lab">Ancienneté (en mois)<input className="champ" type="number" inputMode="numeric" min={0} value={anciennete} onChange={(e) => setAnciennete(Math.max(0, Number(e.target.value)))} /></label>
          </>
        )}
        {etape === 3 && (
          <>
            <h3 ref={titre} tabIndex={-1}>Quelle est votre situation ?</h3>
            <div className="recherche">
              <Search size={18} aria-hidden />
              <input className="champ" type="search" placeholder="Chercher : enceinte, heures sup, congés…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Chercher une situation" />
            </div>
            <p className="muted" aria-live="polite">{liste.length} situation{liste.length > 1 ? "s" : ""}</p>
            {q.trim()
              ? <div className="grille">{liste.map(bouton)}</div>
              : themes.map(([t, nom]) => (
                <div key={t}><h4 className="theme">{nom}</h4><div className="grille">{situations.filter((s) => s.theme === t).map(bouton)}</div></div>
              ))}
            {!liste.length && <p className="muted">Aucune situation trouvée. Essayez un autre mot ou utilisez l'onglet « Rechercher ».</p>}
          </>
        )}
        {etape === 4 && (
          <>
            <h3 ref={titre} tabIndex={-1}>{def.label}</h3>
            {questions.map((x) => (
              <fieldset key={x.id} className="question">
                <legend>{x.label}</legend>
                <div className="grille">{x.options.map((o) => choix(reponses[x.id] === o.v, () => setReponses({ ...reponses, [x.id]: o.v }), o.label))}</div>
              </fieldset>
            ))}
          </>
        )}
        {d && (
          <div className={"resultat " + d.verdict}>
            <h3 ref={titre} tabIndex={-1}><Icone size={22} aria-hidden /> {d.titre}</h3>
            <p><strong>{verdictTexte[d.verdict]}.</strong> {d.explication}</p>
            <h4>Articles concernés</h4>
            <ul>{d.articles.map((id) => { const a = articleParId(id); return a && (
              <li key={id}>
                <button className="lien" onClick={() => onArticle(id)} aria-label={`Lire ${libelleArticle(a)} dans la recherche`}><BookOpen size={14} aria-hidden /> {libelleArticle(a)}</button>{" "}
                {a.verifie && <BadgeCheck size={14} aria-label="vérifié sur le texte officiel" style={{ verticalAlign: "-2px", color: "var(--ok)" }} />}
              </li>); })}</ul>
            <h4>Conseil pratique</h4>
            <p>{d.conseil}</p>
            <h4><ListChecks size={16} aria-hidden style={{ verticalAlign: "-3px" }} /> Prochaines étapes</h4>
            <ol>{d.etapes.map((e, i) => <li key={i}>{e}</li>)}</ol>
            {d.nonPrecise && <p className="muted"><strong>Non précisé par le Code :</strong> {d.nonPrecise}</p>}
            {d.documents.length > 0 && (
              <div className="actions">{d.documents.map((m) => <button key={m} className="btn" onClick={() => onDocuments(m)}><FilePenLine size={18} aria-hidden /> {nomModele[m]}</button>)}</div>
            )}
          </div>
        )}
      </div>
      <div className="actions">
        {etape > 1 && <button className="btn sec" onClick={retour}><ArrowLeft size={18} aria-hidden /> Retour</button>}
        {etape === 2 && <button className="btn" onClick={() => setEtape(3)}>Suivant <ArrowRight size={18} aria-hidden /></button>}
        {etape === 4 && <button className="btn" disabled={!complet} onClick={() => setEtape(5)}>Voir le diagnostic <ArrowRight size={18} aria-hidden /></button>}
        {etape === 5 && <button className="btn" onClick={() => { setEtape(3); setQ(""); }}>Autre problème (mêmes réponses)</button>}
        {etape === 5 && <button className="btn sec" onClick={() => { setEtape(1); setQ(""); }}><RotateCcw size={18} aria-hidden /> Recommencer</button>}
      </div>
    </section>
  );
}
