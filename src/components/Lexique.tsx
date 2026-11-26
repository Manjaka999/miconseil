import { useEffect, useMemo, useState } from "react";
import { BookA, BookOpen, Search } from "lucide-react";
import { lexique } from "../data/lexique";

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export default function Lexique({ focus, onArticle }: { focus?: string; onArticle: (id: string) => void }) {
  const [q, setQ] = useState("");
  const [ouvert, setOuvert] = useState<string | null>(focus ?? null);
  const [presents, setPresents] = useState<Set<string>>(new Set());
  // Le corpus d'articles est chargé à la demande : on ne propose un lien que pour les articles qu'il contient.
  useEffect(() => { import("../data/articles2024").then((m) => setPresents(new Set(m.articles2024.map((a) => a.numero ?? "")))); }, []);
  useEffect(() => {
    if (!focus) return;
    setOuvert(focus); setQ("");
    setTimeout(() => document.getElementById("terme-" + focus)?.scrollIntoView({ block: "center" }), 60);
  }, [focus]);
  const liste = useMemo(() => {
    const mots = norm(q).split(/\s+/).filter(Boolean);
    return lexique.filter((t) => { const c = norm(t.terme + " " + t.alias.join(" ") + " " + t.def); return mots.every((m) => c.includes(m)); }).sort((a, b) => a.terme.localeCompare(b.terme, "fr"));
  }, [q]);
  return (
    <section>
      <h2><BookA size={22} aria-hidden /> Lexique du droit du travail</h2>
      <p className="muted">Définitions simples, rédigées à partir de la loi n° 2024-014. Quand le Code ne définit pas un mot, c'est écrit.</p>
      <div className="recherche">
        <Search size={18} aria-hidden />
        <input className="champ" type="search" placeholder="Chercher un mot : préavis, CDD, prescription…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Chercher dans le lexique" />
      </div>
      <p className="muted" aria-live="polite">{liste.length} terme{liste.length > 1 ? "s" : ""}</p>
      <div className="liste lex">
        {liste.map((t) => (
          <article key={t.id} id={"terme-" + t.id} className="carte">
            <button className="titre" aria-expanded={ouvert === t.id} onClick={() => setOuvert(ouvert === t.id ? null : t.id)}><span>{t.terme}</span></button>
            <div className={"deplie" + (ouvert === t.id ? " ouvert" : "")}>
              <div>
                <p>{t.def}</p>
                <p className="muted">Articles :{" "}
                  {t.arts.map((n) => presents.has(n)
                    ? <button key={n} className="lien lien-art" onClick={() => onArticle("l24-" + n)}><BookOpen size={13} aria-hidden /> art. {n}</button>
                    : <span key={n} className="lien-art">art. {n} </span>)}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
