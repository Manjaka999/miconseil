import type { SituationId } from "../types";
import { situations } from "../data/situations";

/**
 * Pour chaque article, la situation du diagnostic où il est le plus central (position la plus haute dans la liste des articles citée).
 * Calculé à la demande à partir des diagnostics eux-mêmes : aucun lien n'est saisi à la main.
 */
export async function carteArticles(): Promise<Record<string, SituationId>> {
  const { diagnostiquer } = await import("./diagnostic");
  const meilleur: Record<string, { sid: SituationId; pos: number }> = {};
  for (const s of situations) {
    const reponses: Record<string, string> = {};
    for (const q of s.questions ?? []) reponses[q.id] = q.options[0].v;
    for (const profil of ["salarie", "employeur"] as const) {
      const d = diagnostiquer({ profil, contrat: "cdi", anciennete: 12, situation: s.id, reponses });
      d.articles.forEach((id, pos) => { if (!meilleur[id] || pos < meilleur[id].pos) meilleur[id] = { sid: s.id, pos }; });
    }
  }
  return Object.fromEntries(Object.entries(meilleur).map(([id, m]) => [id, m.sid]));
}
