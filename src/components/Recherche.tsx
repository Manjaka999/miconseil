import { useMemo, useState } from "react";
import { rechercher } from "../lib/search";
import { libelleArticle } from "../data/articles";

export default function Recherche() {
  const [q, setQ] = useState("");
  const [ouvert, setOuvert] = useState<string | null>(null);
  const res = useMemo(() => rechercher(q), [q]);
  return (
    <section>
      <h2>Rechercher dans le Code du travail</h2>
      <input className="champ" type="search" placeholder="Ex. licenciement, préavis, faute lourde, congés payés…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Recherche" />
      <p className="muted">{res.length} résultat{res.length > 1 ? "s" : ""}</p>
      {res.map((a) => (
        <article key={a.id} className="carte">
          <button className="titre" onClick={() => setOuvert(ouvert === a.id ? null : a.id)} aria-expanded={ouvert === a.id}>{libelleArticle(a)}</button>
          <p>{a.resume}</p>
          {!a.verifie && <span className="badge">À vérifier sur le texte officiel</span>}
          {ouvert === a.id && <p className="texte">{a.texte || "Texte intégral à insérer depuis le texte officiel de la loi n° 2003-044."}</p>}
        </article>
      ))}
      {!res.length && <p>Aucun article trouvé. Essayez un autre mot.</p>}
    </section>
  );
}
