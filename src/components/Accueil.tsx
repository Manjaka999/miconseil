import { useEffect, useMemo, useState } from "react";
import { BookA, BookOpen, Compass, Layers, RotateCcw, Search } from "lucide-react";
import type { Article, SituationId } from "../types";
import { lexique } from "../data/lexique";
import { raccourcis, situations } from "../data/situations";
import { lancerDiagnostic, lancerMulti, useDiag, type Nav } from "../lib/etat";
import ProfilToggle from "./ProfilToggle";

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/** Barre unique « Que cherchez-vous ? » : situations, articles du Code et mots du lexique. */
function BarreGlobale({ aller }: { aller: (n: Nav) => void }) {
  const [q, setQ] = useState("");
  const [arts, setArts] = useState<Article[]>([]);
  const mots = useMemo(() => norm(q).split(/\s+/).filter((m) => m.length > 1), [q]);
  const sits = useMemo(() => !mots.length ? [] : situations
    .map((s) => ({ s, n: mots.filter((m) => norm(s.label + " " + s.motsCles.join(" ")).includes(m)).length }))
    .filter((x) => x.n > 0).sort((a, b) => b.n - a.n).slice(0, 4).map((x) => x.s), [mots]);
  const lex = useMemo(() => !mots.length ? [] : lexique.filter((t) => mots.every((m) => norm(t.terme + " " + t.alias.join(" ")).includes(m))).slice(0, 3), [mots]);
  // Le corpus des articles n'est chargé qu'à la première recherche.
  useEffect(() => {
    let vivant = true;
    if (!q.trim()) { setArts([]); return; }
    import("../lib/search").then((m) => { if (vivant) setArts(m.rechercher(q, "2024-014").slice(0, 4)); });
    return () => { vivant = false; };
  }, [q]);
  const vide = q.trim() && !sits.length && !lex.length && !arts.length;
  return (
    <div className="globale">
      <div className="recherche">
        <Search size={18} aria-hidden />
        <input className="champ" type="search" placeholder="Que cherchez-vous ? Ex. salaire impayé, préavis, 48…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Que cherchez-vous ? Recherche dans les situations, les articles et le lexique" />
      </div>
      {q.trim() && (
        <div className="resultats-globaux" aria-live="polite">
          {sits.length > 0 && <><h4>Situations</h4><ul>{sits.map((s) => <li key={s.id}><button className="lien" onClick={() => { lancerDiagnostic(s.id); aller({ onglet: "diagnostic" }); }}><Compass size={14} aria-hidden /> {s.label}</button></li>)}</ul></>}
          {arts.length > 0 && <><h4>Articles du Code</h4><ul>{arts.map((a) => <li key={a.id}><button className="lien" onClick={() => aller({ onglet: "recherche", article: a.id })}><BookOpen size={14} aria-hidden /> Art. {a.numero} : {a.titre}</button></li>)}</ul></>}
          {lex.length > 0 && <><h4>Lexique</h4><ul>{lex.map((t) => <li key={t.id}><button className="lien" onClick={() => aller({ onglet: "lexique", terme: t.id })}><BookA size={14} aria-hidden /> {t.terme}</button></li>)}</ul></>}
          {vide && <p className="muted">Rien trouvé. Essayez un autre mot, ou parcourez les situations dans l'onglet Diagnostic.</p>}
        </div>
      )}
    </div>
  );
}

export default function Accueil({ aller }: { aller: (n: Nav) => void }) {
  const [d] = useDiag();
  const enCours = d.etage === "resultat" && d.sids.length > 0;
  const nom = (id: SituationId) => situations.find((s) => s.id === id)?.label ?? id;
  return (
    <section className="accueil">
      <h2>Que puis-je faire pour vous ?</h2>
      <BarreGlobale aller={aller} />
      <ProfilToggle />
      {enCours && (
        <button className="reprise" onClick={() => aller({ onglet: "diagnostic" })}>
          <RotateCcw size={18} aria-hidden /> <span><strong>Reprendre mon diagnostic</strong><br /><small>{d.sids.map(nom).join(" · ")}</small></span>
        </button>
      )}
      <h3>Les cas les plus fréquents</h3>
      <div className="raccourcis">
        {raccourcis.map((r) => (
          <button key={r.id} className="tuile" onClick={() => { lancerDiagnostic(r.id); aller({ onglet: "diagnostic" }); }}>
            <strong>{r.label}</strong><span>{r.aide}</span>
          </button>
        ))}
      </div>
      <div className="raccourcis secondaires">
        <button className="tuile multi" onClick={() => { lancerMulti(); aller({ onglet: "diagnostic" }); }}><strong><Layers size={16} aria-hidden /> Plusieurs problèmes à la fois</strong><span>Un seul plan d'action pour tout</span></button>
        <button className="tuile" onClick={() => aller({ onglet: "diagnostic" })}><strong><Compass size={16} aria-hidden /> Autre situation</strong><span>Toute la liste, par thème</span></button>
        <button className="tuile" onClick={() => aller({ onglet: "lexique" })}><strong><BookA size={16} aria-hidden /> Lexique</strong><span>Comprendre les mots du Code</span></button>
      </div>
    </section>
  );
}
