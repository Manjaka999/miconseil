import type { Diagnostic, ModeleId, SituationId } from "../types";

export type Verdict = Diagnostic["verdict"];
export const verdictTexte: Record<Verdict, string> = { conforme: "Situation en règle", risque: "Attention : risque", illegal: "Pratique contraire au Code", info: "Information" };
const gravite: Record<Verdict, number> = { illegal: 3, risque: 2, info: 1, conforme: 0 };
export const plusGrave = (vs: Verdict[]): Verdict => vs.reduce((a, b) => (gravite[b] > gravite[a] ? b : a), "conforme" as Verdict);

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/** Première phrase (« art. 39 » ne coupe pas la phrase), raccourcie si besoin. */
export function premierePhrase(t: string, max = 240): string {
  const m = t.match(/^[\s\S]*?[.!?](?=\s+[A-ZÉÈÀÂÎÔÛÇ«]|$)/);
  let p = (m ? m[0] : t).trim();
  if (/\b(art|n°|al)\.$/.test(p)) p = t.trim();
  if (p.length > max) p = p.slice(0, max).replace(/\s+\S*$/, "") + "…";
  return p;
}

export interface EnBref { verdict: Verdict; phrase: string; actions: string[] }
export function enBref(d: Diagnostic): EnBref {
  return { verdict: d.verdict, phrase: `${verdictTexte[d.verdict]}. ${premierePhrase(d.explication)}`, actions: d.etapes.slice(0, 2) };
}

export interface Item { sid: SituationId; label: string; diag: Diagnostic }
export interface Etape { texte: string; sids: SituationId[]; rang: number }
export interface Synthese {
  verdict: Verdict;
  resume: string;
  actions: string[];
  points: { sid: SituationId; label: string; verdict: Verdict; titre: string; phrase: string; conseil: string }[];
  protections: { sid: SituationId; label: string; texte: string }[];
  plan: Etape[];
  documents: ModeleId[];
  articles: string[];
  nonPrecise: { label: string; texte: string }[];
}

/** Situations dont l'explication décrit une protection ou une règle impérative (on reprend la première phrase du diagnostic, déjà adossée aux articles). */
const PROTECTION: SituationId[] = ["maladie_licenciement", "enceinte", "accident", "harcelement", "harcelement_sexuel", "delegue", "greve", "droit_retrait", "paternite", "demission_forcee", "enfants", "conges", "certificat"];

const RANG = [
  { n: 0, re: /^(gard|conserv|photograph|notez|archiv|relev|sauvegard|rassembl|datez|ne signez|faites constater|consultez un medecin|prenez note|faites une copie)/ },
  { n: 4, re: /(inspect|tribunal|juridiction|conciliation|plainte|saisi)/ },
  { n: 3, re: /(ecri|courrier|mise en demeure|modele|reclam|conteste|demandez|notifi|convoqu|informe|signal|adress|envoy|proposez|exigez|remettez|reponde|faites parvenir)/ },
];
/** Urgence : 0 preuves et protection immédiate, 1 délais, 2 vérifications, 3 courriers, 4 inspection / tribunal. */
export function rang(texte: string): number {
  const n = norm(texte);
  for (const r of RANG) if (r.re.test(n)) return r.n;
  return 2;
}

const mots = (s: string) => new Set(norm(s).split(/[^a-z0-9]+/).filter((w) => w.length > 3));
function proches(a: string, b: string): boolean {
  if (norm(a) === norm(b)) return true;
  const x = mots(a), y = mots(b);
  if (x.size < 4 || y.size < 4) return false;
  let c = 0;
  x.forEach((w) => { if (y.has(w)) c++; });
  return c / Math.min(x.size, y.size) >= 0.75;
}

export function synthetiser(items: Item[]): Synthese {
  const verdict = plusGrave(items.map((i) => i.diag.verdict));
  const premier = items.find((i) => i.diag.verdict === verdict)!;

  // Articles dédoublonnés, les plus partagés d'abord, puis par ordre d'apparition.
  const freq = new Map<string, number>(), ordre: string[] = [];
  for (const it of items) for (const id of new Set(it.diag.articles)) { if (!freq.has(id)) ordre.push(id); freq.set(id, (freq.get(id) ?? 0) + 1); }
  const articles = ordre.map((id, i) => ({ id, i })).sort((a, b) => (freq.get(b.id)! - freq.get(a.id)!) || a.i - b.i).map((x) => x.id);

  // Plan dédoublonné et trié par urgence (ordre d'origine conservé à rang égal).
  const plan: Etape[] = [];
  for (const it of items) for (const t of it.diag.etapes) {
    const ex = plan.find((p) => proches(p.texte, t));
    if (ex) { if (!ex.sids.includes(it.sid)) ex.sids.push(it.sid); } else plan.push({ texte: t, sids: [it.sid], rang: rang(t) });
  }
  // Délais : seulement ceux que fixent les articles 105 et 129 de la loi 2024-014, si le diagnostic les cite.
  const sidsCitant = (a: string) => items.filter((i) => i.diag.articles.includes(a)).map((i) => i.sid);
  if (articles.includes("l24-105")) plan.push({ texte: "Agissez vite : l'action en paiement des salaires et accessoires de salaires, des indemnités de préavis et de licenciement se prescrit par 12 mois (art. 105).", sids: sidsCitant("l24-105"), rang: 1 });
  if (articles.includes("l24-129") && items.some((i) => i.sid === "conges")) plan.push({ texte: "Le droit au congé payé se prescrit par 3 ans, la preuve contraire restant possible (art. 129).", sids: sidsCitant("l24-129"), rang: 1 });
  const trie = plan.map((p, i) => ({ p, i })).sort((a, b) => (a.p.rang - b.p.rang) || a.i - b.i).map((x) => x.p);

  const documents = [...new Set(items.flatMap((i) => i.diag.documents))];
  const nonPrecise: Synthese["nonPrecise"] = [];
  for (const it of items) if (it.diag.nonPrecise && !nonPrecise.some((n) => proches(n.texte, it.diag.nonPrecise!))) nonPrecise.push({ label: it.label, texte: it.diag.nonPrecise });

  const nb = items.length;
  const resume = `${nb} situation${nb > 1 ? "s" : ""} analysée${nb > 1 ? "s" : ""}. ${verdictTexte[verdict]}. Point le plus sensible : « ${premier.diag.titre} ». ${premierePhrase(premier.diag.explication, 200)}`;
  return {
    verdict, resume,
    actions: trie.slice(0, 2).map((e) => e.texte),
    points: items.map((i) => ({ sid: i.sid, label: i.label, verdict: i.diag.verdict, titre: i.diag.titre, phrase: premierePhrase(i.diag.explication), conseil: i.diag.conseil })),
    protections: items.filter((i) => PROTECTION.includes(i.sid)).map((i) => ({ sid: i.sid, label: i.label, texte: premierePhrase(i.diag.explication, 320) })),
    plan: trie, documents, articles, nonPrecise,
  };
}
