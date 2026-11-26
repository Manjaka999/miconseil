import { lazy, Suspense, useEffect, useMemo } from "react";
import { ArrowLeft, ArrowRight, Check, Compass, Layers, RotateCcw, Search } from "lucide-react";
import type { Contrat, Diagnostic, ModeleId, SituationDef, SituationId } from "../types";
import { diagnostiquer } from "../lib/diagnostic";
import { synthetiser, type Item } from "../lib/synthese";
import { besoins, situations, themes } from "../data/situations";
import { besoinsDe, diagInit, etageApres, useDiag, useProfil } from "../lib/etat";
import BandeauLoi from "./BandeauLoi";
import ProfilToggle from "./ProfilToggle";

const ResultatUnique = lazy(() => import("./ResultatViews").then((m) => ({ default: m.Resultat })));
const SyntheseView = lazy(() => import("./ResultatViews").then((m) => ({ default: m.SyntheseView })));
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

interface Props { onDocuments: (modele?: ModeleId, motif?: string) => void; onArticle: (id: string) => void; onSimulateur: () => void }
const CONTRATS: [Contrat | null, string][] = [["cdi", "CDI"], ["cdd", "CDD"], ["essai", "Période d'essai"], [null, "Je ne sais pas"]];

export default function DiagnosticWizard({ onDocuments, onArticle, onSimulateur }: Props) {
  const [e, setE] = useDiag();
  const [pr, setPr] = useProfil();
  const { etage, multi, sids, reponses, q } = e;
  const b = useMemo(() => besoinsDe(sids), [sids]);
  const complet = b.questions.every((d) => d.questions!.every((x) => reponses[d.id]?.[x.id]));
  const aDesQuestions = !!(b.questions.length || b.contrat || b.anciennete);

  // Après chaque changement d'écran, le clavier et le lecteur d'écran reprennent au titre.
  useEffect(() => { document.querySelector<HTMLElement>("[data-focus]")?.focus(); }, [etage]);

  const liste = useMemo(() => {
    const mots = norm(q).split(/\s+/).filter((m) => m.length > 1);
    if (!mots.length) return situations;
    return situations
      .map((s) => ({ s, n: mots.filter((m) => norm(s.label + " " + s.motsCles.join(" ")).includes(m)).length }))
      .filter((x) => x.n > 0).sort((a, c) => c.n - a.n).map((x) => x.s);
  }, [q]);

  // Résolution du profil : ce que l'utilisateur ne sait pas reste « non précisé » (contrat supposé CDI, ancienneté inconnue).
  const items = useMemo<Item[]>(() => etage !== "resultat" ? [] : sids.map((sid) => {
    const def = situations.find((s) => s.id === sid)!;
    const diag: Diagnostic = diagnostiquer({ profil: pr.profil, contrat: besoins[sid]?.contratImplicite ?? pr.contrat ?? "cdi", anciennete: pr.anciennete ?? -1, situation: sid, reponses: reponses[sid] ?? {} });
    return { sid, label: def.label, diag };
  }), [etage, sids, reponses, pr.profil, pr.contrat, pr.anciennete]);
  const synthese = useMemo(() => (etage === "resultat" && multi && items.length ? synthetiser(items) : null), [etage, multi, items]);
  const hypotheses = [b.contrat && pr.contrat === null ? "Type de contrat non précisé : le résultat suppose un CDI." : "", b.anciennete && pr.anciennete === null ? "Ancienneté non précisée." : ""].filter(Boolean).join(" ");
  const hypothese = hypotheses ? hypotheses + " Revenez en arrière pour l'indiquer si vous le connaissez." : undefined;
  const motifDoc = items.map((i) => i.diag.titre).join(" ; ");

  const choisir = (id: SituationId) => setE({ sids: [id], reponses: {}, etage: etageApres([id]) });
  const basculer = (id: SituationId) => setE({ sids: sids.includes(id) ? sids.filter((x) => x !== id) : [...sids, id] });
  const retour = () => setE({ etage: etage === "resultat" && aDesQuestions ? "questions" : "choix" });
  const autre = () => setE({ ...diagInit, multi, q: "" });
  const recommencer = () => { setE({ ...diagInit }); setPr({ contrat: null, anciennete: null }); };
  const total = aDesQuestions ? 3 : 2;
  const num = etage === "choix" ? 1 : etage === "questions" ? 2 : total;
  const bouton = (s: SituationDef) => {
    const on = sids.includes(s.id);
    return multi
      ? <button key={s.id} className={"choix" + (on ? " on" : "")} aria-pressed={on} onClick={() => basculer(s.id)}>{on && <Check size={16} aria-hidden style={{ verticalAlign: "-3px" }} />} {s.label}</button>
      : <button key={s.id} className="choix" onClick={() => choisir(s.id)}>{s.label}</button>;
  };

  return (
    <section className="diag">
      <h2><Compass size={22} aria-hidden /> Diagnostic de litige</h2>
      <BandeauLoi />
      <div className="barre-profil"><ProfilToggle /></div>
      <div className="etapes" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={num} aria-label="Progression">
        {Array.from({ length: total }, (_, i) => <span key={i} className={num >= i + 1 ? "fait" : ""} />)}
      </div>
      <p className="muted">{etage === "resultat" ? "Résultat" : `Étape ${num} sur ${total}`}</p>
      <div key={etage} className="etape">
        {etage === "choix" && (
          <>
            <h3 data-focus tabIndex={-1}>{multi ? "Cochez toutes vos situations" : "Quelle est votre situation ?"}</h3>
            <div className="grille mode" role="group" aria-label="Nombre de problèmes">
              <button className={"choix" + (!multi ? " on" : "")} aria-pressed={!multi} onClick={() => setE({ multi: false, sids: sids.slice(0, 1) })}>Un seul problème</button>
              <button className={"choix" + (multi ? " on" : "")} aria-pressed={multi} onClick={() => setE({ multi: true })}><Layers size={16} aria-hidden style={{ verticalAlign: "-3px" }} /> Plusieurs problèmes à la fois</button>
            </div>
            {multi && <p className="muted">Exemple : harcèlement + heures supplémentaires impayées + licenciement pendant une maladie. Vous obtiendrez un seul plan d'action.</p>}
            <div className="recherche">
              <Search size={18} aria-hidden />
              <input className="champ" type="search" placeholder="Chercher : enceinte, heures sup, congés…" value={q} onChange={(ev) => setE({ q: ev.target.value })} aria-label="Chercher une situation" />
            </div>
            <p className="muted" aria-live="polite">{liste.length} situation{liste.length > 1 ? "s" : ""}{multi ? ` · ${sids.length} choisie${sids.length > 1 ? "s" : ""}` : ""}</p>
            {q.trim()
              ? <div className="grille">{liste.map(bouton)}</div>
              : themes.map(([t, nom]) => (
                <div key={t}><h4 className="theme">{nom}</h4><div className="grille">{situations.filter((s) => s.theme === t).map(bouton)}</div></div>
              ))}
            {!liste.length && <p className="muted">Aucune situation trouvée. Essayez un autre mot ou utilisez l'onglet « Articles ».</p>}
          </>
        )}
        {etage === "questions" && (
          <>
            <h3 data-focus tabIndex={-1}>{sids.length > 1 ? "Quelques précisions" : b.defs[0]?.label}</h3>
            {b.questions.map((d) => (
              <div key={d.id}>
                {sids.length > 1 && <h4 className="theme">{d.label}</h4>}
                {d.questions!.map((x) => (
                  <fieldset key={x.id} className="question">
                    <legend>{x.label}</legend>
                    <div className="grille">{x.options.map((o) => { const on = reponses[d.id]?.[x.id] === o.v; return <button key={o.v} className={"choix" + (on ? " on" : "")} aria-pressed={on} onClick={() => setE({ reponses: { ...reponses, [d.id]: { ...reponses[d.id], [x.id]: o.v } } })}>{o.label}</button>; })}</div>
                  </fieldset>
                ))}
              </div>
            ))}
            {b.contrat && (
              <fieldset className="question">
                <legend>Type de contrat <span className="muted">(facultatif)</span></legend>
                <div className="grille">{CONTRATS.map(([v, l]) => <button key={l} className={"choix" + (pr.contrat === v ? " on" : "")} aria-pressed={pr.contrat === v} onClick={() => setPr({ contrat: v })}>{l}</button>)}</div>
              </fieldset>
            )}
            {b.anciennete && (
              <fieldset className="question">
                <legend>Ancienneté en mois <span className="muted">(facultatif)</span></legend>
                <div className="ligne-champ">
                  <input className="champ" type="number" inputMode="numeric" min={0} aria-label="Ancienneté en mois" value={pr.anciennete ?? ""} placeholder="Ex. 18" onChange={(ev) => setPr({ anciennete: ev.target.value === "" ? null : Math.max(0, Number(ev.target.value)) })} />
                  <button className={"choix" + (pr.anciennete === null ? " on" : "")} aria-pressed={pr.anciennete === null} onClick={() => setPr({ anciennete: null })}>Je ne sais pas</button>
                </div>
              </fieldset>
            )}
          </>
        )}
        {etage === "resultat" && (
          <Suspense fallback={<p className="muted" role="status">Calcul du diagnostic…</p>}>
            {synthese
              ? <SyntheseView s={synthese} hypothese={hypothese} onDocuments={(m) => onDocuments(m, motifDoc)} onArticle={onArticle} onSimulateur={onSimulateur} />
              : items[0] && <ResultatUnique d={items[0].diag} sid={items[0].sid} hypothese={hypothese} onDocuments={(m) => onDocuments(m, motifDoc)} onArticle={onArticle} onSimulateur={onSimulateur} />}
          </Suspense>
        )}
      </div>
      <div className="actions barre-actions">
        {etage !== "choix" && <button className="btn sec" onClick={retour}><ArrowLeft size={18} aria-hidden /> Retour</button>}
        {etage === "choix" && multi && <button className="btn" disabled={sids.length < 2} onClick={() => setE({ etage: etageApres(sids) })}>{sids.length < 2 ? "Cochez au moins 2 situations" : <>Continuer avec {sids.length} situations <ArrowRight size={18} aria-hidden /></>}</button>}
        {etage === "questions" && <button className="btn" disabled={!complet} onClick={() => setE({ etage: "resultat" })}>Voir le diagnostic <ArrowRight size={18} aria-hidden /></button>}
        {etage === "resultat" && <button className="btn" onClick={autre}>Autre problème</button>}
        {etage === "resultat" && !multi && <button className="btn sec" onClick={() => setE({ multi: true, etage: "choix", q: "" })}><Layers size={18} aria-hidden /> Combiner avec d'autres problèmes</button>}
        {etage === "resultat" && <button className="btn sec" onClick={recommencer}><RotateCcw size={18} aria-hidden /> Recommencer</button>}
      </div>
      {etage === "resultat" && <p className="muted">Votre profil ({pr.profil === "salarie" ? "salarié" : "employeur"}) est conservé. « Recommencer » efface seulement le contrat et l'ancienneté saisis.</p>}
    </section>
  );
}
