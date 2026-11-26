import { useCallback, useSyncExternalStore } from "react";
import type { Contrat, ModeleId, Profil, SituationId } from "../types";
import { besoins, situations } from "../data/situations";

/* ---------- Petit magasin d'état partagé entre les onglets (survit au changement d'onglet) ---------- */
type Stockage = "local" | "session";
const cache = new Map<string, unknown>();
const abonnes = new Map<string, Set<() => void>>();
const dispo = (t: Stockage): Storage | null => { try { return t === "local" ? localStorage : sessionStorage; } catch { return null; } };

function lire<T extends object>(cle: string, init: T, t: Stockage): T {
  if (!cache.has(cle)) {
    let v = init;
    try { const s = dispo(t)?.getItem("mic:" + cle); if (s) v = { ...init, ...JSON.parse(s) }; } catch { /* données illisibles : valeurs par défaut */ }
    cache.set(cle, v);
  }
  return cache.get(cle) as T;
}
function ecrire<T extends object>(cle: string, v: T, t: Stockage) {
  cache.set(cle, v);
  try { dispo(t)?.setItem("mic:" + cle, JSON.stringify(v)); } catch { /* stockage indisponible : l'état reste en mémoire */ }
  abonnes.get(cle)?.forEach((f) => f());
}

export function useMagasin<T extends object>(cle: string, init: T, t: Stockage = "local"): [T, (p: Partial<T> | ((v: T) => Partial<T>)) => void] {
  const sub = useCallback((f: () => void) => { if (!abonnes.has(cle)) abonnes.set(cle, new Set()); abonnes.get(cle)!.add(f); return () => { abonnes.get(cle)!.delete(f); }; }, [cle]);
  const val = useSyncExternalStore(sub, () => lire(cle, init, t), () => init);
  const set = useCallback((p: Partial<T> | ((v: T) => Partial<T>)) => { const cur = lire(cle, init, t); ecrire(cle, { ...cur, ...(typeof p === "function" ? p(cur) : p) }, t); }, [cle, t]); // eslint-disable-line react-hooks/exhaustive-deps
  return [val, set];
}
/** Accès hors composant (ex. lancer un diagnostic depuis l'accueil). */
export function majMagasin<T extends object>(cle: string, init: T, p: Partial<T>, t: Stockage = "local") { ecrire(cle, { ...lire(cle, init, t), ...p }, t); }

/* ---------- Profil de l'utilisateur (réutilisé par le diagnostic, le simulateur et les documents) ---------- */
export interface ProfilUtilisateur {
  profil: Profil;
  /** null = non précisé (« Je ne sais pas »). */
  contrat: Contrat | null;
  /** Ancienneté en mois ; null = non précisée. */
  anciennete: number | null;
  /** Salaire mensuel en Ar ; null = non saisi. */
  salaire: number | null;
  employeur: string; salarie: string; lieu: string;
}
export const profilInit: ProfilUtilisateur = { profil: "salarie", contrat: null, anciennete: null, salaire: null, employeur: "", salarie: "", lieu: "" };
export const useProfil = () => useMagasin<ProfilUtilisateur>("profil", profilInit, "local");

/* ---------- État du diagnostic (conservé pendant la session, même si on lit un article puis qu'on revient) ---------- */
export type Etage = "choix" | "questions" | "resultat";
export interface EtatDiag {
  etage: Etage;
  multi: boolean;
  sids: SituationId[];
  reponses: Record<string, Record<string, string>>;
  q: string;
}
export const diagInit: EtatDiag = { etage: "choix", multi: false, sids: [], reponses: {}, q: "" };
export const useDiag = () => useMagasin<EtatDiag>("diag", diagInit, "session");

/** Ce qu'il faut encore demander pour les situations choisies : questions propres, contrat, ancienneté. */
export function besoinsDe(sids: SituationId[]) {
  const defs = situations.filter((s) => sids.includes(s.id));
  const contratImplicite = sids.some((id) => besoins[id]?.contratImplicite);
  return {
    defs,
    questions: defs.filter((d) => d.questions?.length),
    contrat: sids.some((id) => besoins[id]?.contrat) && !contratImplicite,
    anciennete: sids.some((id) => besoins[id]?.anciennete),
  };
}
export const etageApres = (sids: SituationId[]): Etage => {
  const b = besoinsDe(sids);
  return b.questions.length || b.contrat || b.anciennete ? "questions" : "resultat";
};

/** Lance un diagnostic sur une situation (depuis l'accueil, la recherche ou un article). Le profil est conservé. */
export function lancerDiagnostic(sid: SituationId) {
  majMagasin<EtatDiag>("diag", diagInit, { sids: [sid], multi: false, reponses: {}, q: "", etage: etageApres([sid]) }, "session");
}
export function lancerMulti() { majMagasin<EtatDiag>("diag", diagInit, { sids: [], multi: true, reponses: {}, q: "", etage: "choix" }, "session"); }

/* ---------- Cases à cocher du plan d'action (persistantes) ---------- */
export const cleEtape = (t: string) => { let h = 5381; for (let i = 0; i < t.length; i++) h = ((h << 5) + h + t.charCodeAt(i)) | 0; return "e" + (h >>> 0).toString(36); };
export const useCases = () => useMagasin<{ faits: Record<string, boolean> }>("cases", { faits: {} }, "local");

/* ---------- Navigation ---------- */
export type Onglet = "accueil" | "diagnostic" | "recherche" | "simulateur" | "documents" | "lexique";
export interface Nav { onglet: Onglet; article?: string; modele?: ModeleId; motif?: string; terme?: string; retour?: Onglet }
