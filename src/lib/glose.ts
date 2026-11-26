import { lexique, type Terme } from "../data/lexique";

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const lettre = /\p{L}/u;

/** Formes à repérer, les plus longues d'abord (« licenciement économique » avant « économique »). */
const formes = lexique
  .flatMap((t) => t.alias.map((a) => ({ t, a: norm(a) })))
  .sort((x, y) => y.a.length - x.a.length);

export type Segment = string | { terme: Terme; texte: string };

/**
 * Découpe une série de paragraphes en segments texte / terme du lexique.
 * Chaque terme n'est signalé qu'à sa première apparition dans l'ensemble des blocs (lecture moins chargée).
 */
export function annoter(blocs: string[]): Segment[][] {
  const vus = new Set<string>();
  return blocs.map((texte) => {
    const n = norm(texte);
    const trouves: { i: number; j: number; t: Terme }[] = [];
    for (const f of formes) {
      let from = 0;
      for (;;) {
        const i = n.indexOf(f.a, from);
        if (i < 0) break;
        from = i + 1;
        const j = i + f.a.length;
        if ((i > 0 && lettre.test(n[i - 1])) || (j < n.length && lettre.test(n[j]))) continue;
        if (trouves.some((x) => i < x.j && j > x.i)) continue;
        trouves.push({ i, j, t: f.t });
      }
    }
    trouves.sort((x, y) => x.i - y.i);
    const segs: Segment[] = [];
    let pos = 0;
    for (const x of trouves) {
      if (vus.has(x.t.id)) continue;
      vus.add(x.t.id);
      if (x.i > pos) segs.push(texte.slice(pos, x.i));
      segs.push({ terme: x.t, texte: texte.slice(x.i, x.j) });
      pos = x.j;
    }
    if (pos < texte.length) segs.push(texte.slice(pos));
    return segs;
  });
}
