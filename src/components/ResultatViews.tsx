import { useEffect, useRef } from "react";
import { BadgeCheck, BookOpen, Calculator, CalendarClock, CircleAlert, FilePenLine, Printer, Info, ListChecks, ShieldCheck, TriangleAlert, Zap } from "lucide-react";
import type { Diagnostic, ModeleId, SituationId } from "../types";
import { articleParId, libelleArticle } from "../data/articles";
import { situations } from "../data/situations";
import { cleEtape, useCases } from "../lib/etat";
import { enBref, verdictTexte, type Synthese, type Verdict } from "../lib/synthese";
import { Segments, useAnnote } from "./Glose";

const icones = { conforme: ShieldCheck, risque: TriangleAlert, illegal: CircleAlert, info: Info } as const;
export const nomModele: Record<ModeleId, string> = { convocation: "Convocation à un entretien", mise_en_demeure: "Mise en demeure de paiement", demande_certificat: "Demande de certificat de travail", contestation: "Lettre de contestation" };
const labelSit = (id: SituationId) => situations.find((s) => s.id === id)?.label ?? id;

/** Situations pour lesquelles le simulateur de fin de contrat est utile. */
const AVEC_SIMU: SituationId[] = ["licencier", "eco", "cdd_rupture", "demission", "demission_forcee", "preavis", "retard_salaire", "conges", "certificat", "maladie_licenciement", "enceinte", "cdd_requalif", "heures_sup", "modification_contrat"];

interface PropsCommunes { onDocuments: (m?: ModeleId) => void; onArticle: (id: string) => void; onSimulateur: () => void }

/** Étapes numérotées avec cases à cocher conservées sur l'appareil. */
export function Plan({ etapes }: { etapes: { texte: string; sids?: SituationId[]; liste?: string[] }[] }) {
  const [{ faits }, set] = useCases();
  const segs = useAnnote(etapes.map((e) => e.texte));
  const n = etapes.filter((e) => faits[cleEtape(e.texte)]).length;
  return (
    <div className="plan">
      <h4><ListChecks size={16} aria-hidden style={{ verticalAlign: "-3px" }} /> Plan d'action <span className="compteur" aria-live="polite">{n}/{etapes.length} faites</span></h4>
      <ol className="cases">
        {etapes.map((e, i) => {
          const k = cleEtape(e.texte), id = "etape-" + k;
          return (
            <li key={k} className={faits[k] ? "fait" : ""}>
              <input id={id} type="checkbox" checked={!!faits[k]} onChange={(ev) => set((v) => ({ faits: { ...v.faits, [k]: ev.target.checked } }))} />
              <label htmlFor={id}>
                <span className="num" aria-hidden>{i + 1}</span>
                <span><span className="sr">Étape {i + 1} : </span><Segments segs={segs[i]} />
                  {e.liste && <ul className="sous-liste">{e.liste.map((x) => <li key={x}>{x}</li>)}</ul>}
                  {e.sids && e.sids.length > 0 && <span className="etiquettes">{e.sids.map((s) => <small key={s} className="etiquette">{labelSit(s)}</small>)}</span>}
                </span>
              </label>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function ListeArticles({ ids, onArticle }: { ids: string[]; onArticle: (id: string) => void }) {
  return (
    <ul className="arts">{ids.map((id) => { const a = articleParId(id); return a && (
      <li key={id}>
        <button className="lien" onClick={() => onArticle(id)} aria-label={`Lire ${libelleArticle(a)} dans la recherche`}><BookOpen size={14} aria-hidden /> {libelleArticle(a)}</button>{" "}
        {a.verifie && <BadgeCheck size={14} aria-label="vérifié sur le texte officiel" style={{ verticalAlign: "-2px", color: "var(--ok)" }} />}
      </li>); })}</ul>
  );
}

function Boutons({ documents, sids, onDocuments, onSimulateur }: { documents: ModeleId[]; sids: SituationId[] } & Pick<PropsCommunes, "onDocuments" | "onSimulateur">) {
  return (
    <div className="actions">
      {documents.map((m) => <button key={m} className="btn sec" onClick={() => onDocuments(m)}><FilePenLine size={18} aria-hidden /> {nomModele[m]}</button>)}
      {sids.some((s) => AVEC_SIMU.includes(s)) && <button className="btn sec" onClick={onSimulateur}><Calculator size={18} aria-hidden /> Estimer mes droits</button>}
    </div>
  );
}

function Delai({ textes }: { textes: string[] }) {
  if (textes.length === 0) return null;
  return <div className="delai" role="note"><p className="enbref-tag"><CalendarClock size={16} aria-hidden /> Délai à ne pas dépasser</p>{textes.map((x) => <p key={x}>{x}</p>)}</div>;
}

/** Imprime le résultat : les parties repliées sont d'abord dépliées pour apparaître sur la feuille. */
function Imprimer() {
  const go = () => { document.querySelectorAll<HTMLDetailsElement>("details.detail").forEach((d) => { d.open = true; }); window.print(); };
  return <button className="btn sec no-print" onClick={go}><Printer size={18} aria-hidden /> Imprimer ou enregistrer en PDF</button>;
}

function EnBrefCarte({ verdict, phrase, actions, titre }: { verdict: Verdict; phrase: string; actions: string[]; titre: string }) {
  const titreRef = useFocusTitre();
  const Icone = icones[verdict];
  const [p, a0, a1] = useAnnote([phrase, actions[0] ?? "", actions[1] ?? ""]);
  return (
    <div className={"enbref " + verdict} role="region" aria-label="En bref">
      <p className="enbref-tag"><Icone size={18} aria-hidden /> En bref</p>
      <h3 tabIndex={-1} ref={titreRef}>{titre}</h3>
      <p><span className="v">{verdictTexte[verdict]}.</span> <Segments segs={p} /></p>
      {actions.length > 0 && (<><p className="enbref-tag"><Zap size={16} aria-hidden /> À faire maintenant</p>
        <ul className="maintenant">{actions[0] && <li><Segments segs={a0} /></li>}{actions[1] && <li><Segments segs={a1} /></li>}</ul></>)}
    </div>
  );
}

export function Resultat({ d, sid, hypothese, ...p }: { d: Diagnostic; sid: SituationId; hypothese?: string } & PropsCommunes) {
  const b = enBref(d);
  // « En bref » : la phrase est celle de l'explication sans son préfixe de verdict (le verdict est affiché à part).
  const phrase = b.phrase.slice(verdictTexte[d.verdict].length + 2);
  const [expl, cons] = useAnnote([d.explication, d.conseil]);
  return (
    <div className={"resultat " + d.verdict}>
      <EnBrefCarte verdict={d.verdict} phrase={phrase} actions={b.actions} titre={d.titre} />
      {hypothese && <p className="muted hypothese" role="note"><Info size={14} aria-hidden /> {hypothese}</p>}
      <Delai textes={d.delai ? [d.delai] : []} />
      <Plan etapes={d.etapes.map((texte) => ({ texte }))} />
      <details className="detail">
        <summary>Voir le détail : explication, articles, points non précisés</summary>
        <h4>Explication</h4><p><Segments segs={expl} /></p>
        <h4>Conseil pratique</h4><p><Segments segs={cons} /></p>
        <h4>Articles concernés</h4><ListeArticles ids={d.articles} onArticle={p.onArticle} />
        {d.nonPrecise && <p className="muted"><strong>Non précisé par le Code :</strong> {d.nonPrecise}</p>}
      </details>
      <Boutons documents={d.documents} sids={[sid]} onDocuments={p.onDocuments} onSimulateur={p.onSimulateur} />
      <Imprimer />
    </div>
  );
}

export function SyntheseView({ s, hypothese, ...p }: { s: Synthese; hypothese?: string } & PropsCommunes) {
  const titreRef = useFocusTitre();
  const Icone = icones[s.verdict];
  const [resume, a0, a1] = useAnnote([s.resume, s.actions[0] ?? "", s.actions[1] ?? ""]);
  return (
    <div className={"resultat synthese " + s.verdict}>
      <div className={"enbref " + s.verdict} role="region" aria-label="En bref">
        <p className="enbref-tag"><Icone size={18} aria-hidden /> En bref : vue d'ensemble</p>
        <h3 tabIndex={-1} ref={titreRef}>Synthèse de vos situations</h3>
        <p><Segments segs={resume} /></p>
        <p className="enbref-tag"><Zap size={16} aria-hidden /> À faire maintenant</p>
        <ul className="maintenant">{s.actions[0] && <li><Segments segs={a0} /></li>}{s.actions[1] && <li><Segments segs={a1} /></li>}</ul>
      </div>
      {hypothese && <p className="muted hypothese" role="note"><Info size={14} aria-hidden /> {hypothese}</p>}
      <Delai textes={s.delais} />
      <Plan etapes={s.plan.map((e) => ({ texte: e.texte, liste: e.liste, sids: e.sids.length > 1 || s.points.length > 1 ? e.sids : undefined }))} />
      <details className="detail">
        <summary>Voir le détail : points par situation, protections, articles</summary>
        <h4>Points par situation</h4>
        <ul className="points">{s.points.map((x) => (
          <li key={x.sid} className={x.verdict}><strong>{x.label}</strong> <span className="badge">{verdictTexte[x.verdict]}</span><br /><span className="muted">{x.titre}.</span> {x.phrase}</li>
        ))}</ul>
        {s.protections.length > 0 && (<><h4>Protections et règles cumulées</h4>
          <ul>{s.protections.map((x) => <li key={x.sid}><strong>{x.label} :</strong> {x.texte}</li>)}</ul></>)}
        <h4>Articles cités ({s.articles.length})</h4><ListeArticles ids={s.articles} onArticle={p.onArticle} />
        {s.nonPrecise.length > 0 && (<><h4>Non précisé par le Code</h4>
          <ul>{s.nonPrecise.map((x) => <li key={x.label} className="muted"><strong>{x.label} :</strong> {x.texte}</li>)}</ul></>)}
      </details>
      {s.documents.length > 0 && <><h4>Documents à produire</h4></>}
      <Boutons documents={s.documents} sids={s.points.map((x) => x.sid)} onDocuments={p.onDocuments} onSimulateur={p.onSimulateur} />
      <Imprimer />
    </div>
  );
}

/** À l'affichage du résultat, le focus clavier / lecteur d'écran se place sur son titre. */
function useFocusTitre() {
  const r = useRef<HTMLHeadingElement>(null);
  useEffect(() => { r.current?.focus({ preventScroll: true }); }, []);
  return r;
}
