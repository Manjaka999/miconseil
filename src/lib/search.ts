import { articles } from "../data/articles";
import type { Article, Loi } from "../types";

export const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/** Index calculé une seule fois : la recherche plein texte reste rapide même avec 150+ articles. */
const index = articles.map((a) => ({
  a,
  num: String(a.numero ?? ""),
  titre: norm(a.titre),
  cles: norm(a.motsCles.join(" ")),
  corps: norm(a.resume + " " + a.texte),
}));

export type Filtre = Loi | "tous";

/** Recherche par mots-clés avec score (titre > mots-clés > résumé/texte) ; un numéro seul (ex. « 48 ») met l'article correspondant en tête. */
export function rechercher(requete: string, filtre: Filtre = "2024-014"): Article[] {
  const mots = norm(requete).split(/\s+/).filter((m) => m.length > 1 || /^\d$/.test(m));
  const base = index.filter((x) => filtre === "tous" || x.a.loi === filtre);
  if (!mots.length) return base.map((x) => x.a);
  return base
    .map((x) => {
      let score = 0;
      for (const m of mots) {
        if (/^\d+$/.test(m)) { if (x.num === m) score += 20; else if (x.corps.includes(m)) score += 1; continue; }
        if (x.titre.includes(m)) score += 5;
        if (x.cles.includes(m)) score += 3;
        if (x.corps.includes(m)) score += 1;
      }
      return { a: x.a, score };
    })
    .filter((x) => x.score > 0)
    .sort((x, y) => y.score - x.score)
    .map((x) => x.a);
}
