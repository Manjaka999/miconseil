import { useEffect, useMemo, useState } from "react";
import { BadgeCheck, ChevronDown, SearchX, TriangleAlert, Search, BookOpen, Archive, ArrowLeftRight } from "lucide-react";
import { rechercher, type Filtre } from "../lib/search";
import { articleParId, libelleArticle } from "../data/articles";
import BandeauLoi from "./BandeauLoi";

const PAGE = 20;
const onglets: { v: Filtre; label: string }[] = [
  { v: "2024-014", label: "Loi 2024-014 (en vigueur)" },
  { v: "2003-044", label: "Loi 2003-044 (ancienne)" },
  { v: "tous", label: "Les deux" },
];

export default function Recherche({ focus }: { focus?: string }) {
  const [q, setQ] = useState("");
  const [filtre, setFiltre] = useState<Filtre>("2024-014");
  const [ouvert, setOuvert] = useState<string | null>(focus ?? null);
  const [cible, setCible] = useState<string | undefined>(focus);
  const [max, setMax] = useState(PAGE);
  useEffect(() => {
    setOuvert(focus ?? null); setCible(focus);
    if (focus) { const a = articleParId(focus); if (a) setFiltre(a.loi); window.scrollTo({ top: 0 }); }
  }, [focus]);

  const res = useMemo(() => {
    const r = rechercher(q, filtre);
    // Article demandé (depuis un diagnostic ou un lien « équivalent ») : affiché en premier.
    return cible && !q ? [...r.filter((a) => a.id === cible), ...r.filter((a) => a.id !== cible)] : r;
  }, [q, filtre, cible]);
  const visibles = res.slice(0, max);

  const choisir = (f: Filtre) => { setFiltre(f); setMax(PAGE); setCible(undefined); setOuvert(null); };
  const versEquivalent = (id: string) => {
    const e = articleParId(id);
    if (!e) return;
    setQ(""); setFiltre(e.loi); setCible(e.id); setOuvert(e.id); setMax(PAGE);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section>
      <h2><BookOpen size={22} aria-hidden /> Rechercher dans le Code du travail</h2>
      <BandeauLoi />
      <div className="grille onglets-loi" role="group" aria-label="Loi à consulter">
        {onglets.map((o) => <button key={o.v} className={"choix" + (filtre === o.v ? " on" : "")} aria-pressed={filtre === o.v} onClick={() => choisir(o.v)}>{o.label}</button>)}
      </div>
      <div className="recherche">
        <Search size={18} aria-hidden />
        <input className="champ" type="search" placeholder="Ex. licenciement, préavis, congés payés, télétravail, 48…" value={q} onChange={(e) => { setQ(e.target.value); setMax(PAGE); setCible(undefined); }} aria-label="Recherche" />
      </div>
      <p className="muted" aria-live="polite">{res.length} résultat{res.length > 1 ? "s" : ""}{res.length > visibles.length ? ` (${visibles.length} affichés)` : ""}</p>
      <div className="liste">
      {visibles.map((a, i) => {
        const eq = a.equivalent ? articleParId(a.equivalent) : undefined;
        const ancien = a.loi === "2003-044";
        return (
          <article key={a.id} className={"carte" + (ancien ? " ancien" : "")} style={{ ["--i" as string]: Math.min(i, 8) }}>
            <button className="titre" onClick={() => setOuvert(ouvert === a.id ? null : a.id)} aria-expanded={ouvert === a.id}>
              <span>{libelleArticle(a)}</span><ChevronDown size={20} aria-hidden />
            </button>
            <p>{a.resume}</p>
            <div className="badges">
              {ancien
                ? <span className="badge ancienne"><Archive size={14} aria-hidden /> Ancienne loi 2003-044 (abrogée en principe)</span>
                : <span className="badge loi"><BadgeCheck size={14} aria-hidden /> Loi 2024-014 (en vigueur)</span>}
              {a.verifie
                ? <span className="badge ok"><BadgeCheck size={14} aria-hidden /> Texte officiel vérifié</span>
                : <span className="badge warn"><TriangleAlert size={14} aria-hidden /> À vérifier sur le texte officiel</span>}
              {a.theme && <span className="badge theme">{a.theme}</span>}
            </div>
            {eq && <button className="lien" onClick={() => versEquivalent(eq.id)}><ArrowLeftRight size={14} aria-hidden /> {ancien ? `Équivalent dans la loi 2024-014 : art. ${eq.numero}` : `Équivalent dans l'ancienne loi : art. ${eq.numero}`}</button>}
            <div className={"deplie" + (ouvert === a.id ? " ouvert" : "")}>
              <div><p className="texte">{a.texte || "Texte intégral à insérer depuis le texte officiel."}</p>{a.source && <p className="muted">Source : {a.source}</p>}</div>
            </div>
          </article>
        );
      })}
      </div>
      {res.length > visibles.length && <div className="actions"><button className="btn sec" onClick={() => setMax(max + PAGE)}>Afficher plus ({res.length - visibles.length} restants)</button></div>}
      {!res.length && <p className="muted" style={{ textAlign: "center", padding: "24px 0" }}><SearchX size={32} aria-hidden /><br />Aucun article trouvé. Essayez un autre mot{filtre !== "tous" ? " ou l'option « Les deux »" : ""}.</p>}
    </section>
  );
}
