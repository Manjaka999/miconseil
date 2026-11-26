import { useEffect, useMemo, useState } from "react";
import { BadgeCheck, ChevronDown, SearchX, TriangleAlert, Search, BookOpen } from "lucide-react";
import { rechercher } from "../lib/search";
import { libelleArticle } from "../data/articles";

export default function Recherche({ focus }: { focus?: string }) {
  const [q, setQ] = useState("");
  const [ouvert, setOuvert] = useState<string | null>(focus ?? null);
  const res = useMemo(() => {
    const r = rechercher(q);
    // Article demandé depuis un diagnostic : affiché en premier.
    return focus && !q ? [...r.filter((a) => a.id === focus), ...r.filter((a) => a.id !== focus)] : r;
  }, [q, focus]);
  useEffect(() => { if (focus) window.scrollTo({ top: 0 }); }, [focus]);
  return (
    <section>
      <h2><BookOpen size={22} aria-hidden /> Rechercher dans le Code du travail</h2>
      <div className="recherche">
        <Search size={18} aria-hidden />
        <input className="champ" type="search" placeholder="Ex. licenciement, préavis, congés payés…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Recherche" />
      </div>
      <p className="muted" aria-live="polite">{res.length} résultat{res.length > 1 ? "s" : ""}</p>
      <div className="liste">
      {res.map((a, i) => (
        <article key={a.id} className="carte" style={{ ["--i" as string]: Math.min(i, 8) }}>
          <button className="titre" onClick={() => setOuvert(ouvert === a.id ? null : a.id)} aria-expanded={ouvert === a.id}>
            <span>{libelleArticle(a)}</span><ChevronDown size={20} aria-hidden />
          </button>
          <p>{a.resume}</p>
          {a.verifie
            ? <span className="badge ok"><BadgeCheck size={14} aria-hidden /> Texte officiel vérifié</span>
            : <span className="badge warn"><TriangleAlert size={14} aria-hidden /> À vérifier sur le texte officiel</span>}
          <div className={"deplie" + (ouvert === a.id ? " ouvert" : "")}>
            <div><p className="texte">{a.texte || "Texte intégral à insérer depuis le texte officiel."}</p></div>
          </div>
        </article>
      ))}
      </div>
      {!res.length && <p className="muted" style={{ textAlign: "center", padding: "24px 0" }}><SearchX size={32} aria-hidden /><br />Aucun article trouvé. Essayez un autre mot.</p>}
    </section>
  );
}
