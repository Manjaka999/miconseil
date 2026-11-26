import { articles } from "../data/articles";
import type { Article } from "../types";

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/** Recherche par mots-clés avec score (titre > mots-clés > résumé/texte). */
export function rechercher(requete: string): Article[] {
  const mots = norm(requete).split(/\s+/).filter((m) => m.length > 1);
  if (!mots.length) return articles;
  return articles
    .map((a) => {
      const titre = norm(a.titre), cles = norm(a.motsCles.join(" ")), corps = norm(a.resume + " " + a.texte);
      let score = 0;
      for (const m of mots) {
        if (titre.includes(m)) score += 5;
        if (cles.includes(m)) score += 3;
        if (corps.includes(m)) score += 1;
      }
      return { a, score };
    })
    .filter((x) => x.score > 0)
    .sort((x, y) => y.score - x.score)
    .map((x) => x.a);
}
