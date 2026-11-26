import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { BookA, X } from "lucide-react";
import type { Terme } from "../data/lexique";
import { annoter, type Segment } from "../lib/glose";

interface Ctx { ouvrir: (t: Terme, el: HTMLElement) => void; actif: string | null; versLexique: (id: string) => void }
const GloseCtx = createContext<Ctx | null>(null);

/** Fournit le panneau de définition (accessible : rôle dialog, Échap pour fermer, retour du focus sur le mot). */
export function GloseProvider({ children, onLexique }: { children: ReactNode; onLexique: (id: string) => void }) {
  const [t, setT] = useState<Terme | null>(null);
  const retour = useRef<HTMLElement | null>(null);
  const fermer = useCallback(() => { setT(null); retour.current?.focus(); }, []);
  useEffect(() => {
    if (!t) return;
    const f = (e: KeyboardEvent) => { if (e.key === "Escape") fermer(); };
    document.addEventListener("keydown", f);
    return () => document.removeEventListener("keydown", f);
  }, [t, fermer]);
  const ctx = useMemo<Ctx>(() => ({ ouvrir: (x, el) => { retour.current = el; setT((c) => (c?.id === x.id ? null : x)); }, actif: t?.id ?? null, versLexique: onLexique }), [t, onLexique]);
  return (
    <GloseCtx.Provider value={ctx}>
      {children}
      {t && (
        <div className="popover" role="dialog" aria-labelledby="pop-titre" aria-describedby="pop-def">
          <div className="pop-tete"><strong id="pop-titre"><BookA size={16} aria-hidden /> {t.terme}</strong><button className="pop-x" onClick={fermer} aria-label="Fermer la définition"><X size={18} aria-hidden /></button></div>
          <p id="pop-def">{t.def}</p>
          <button className="lien" onClick={() => { const id = t.id; setT(null); onLexique(id); }}>Voir dans le lexique</button>
        </div>
      )}
    </GloseCtx.Provider>
  );
}

function Mot({ t, texte }: { t: Terme; texte: string }) {
  const c = useContext(GloseCtx);
  if (!c) return <>{texte}</>;
  return <button type="button" className="terme" aria-haspopup="dialog" aria-expanded={c.actif === t.id} onClick={(e) => c.ouvrir(t, e.currentTarget)}>{texte}</button>;
}

export function Segments({ segs }: { segs: Segment[] }) {
  return <>{segs.map((s, i) => (typeof s === "string" ? <span key={i}>{s}</span> : <Mot key={i} t={s.terme} texte={s.texte} />))}</>;
}

/** Annote une série de textes ; chaque terme du lexique n'est signalé qu'une fois. Usage : const [a, b] = useAnnote([x, y]). */
export function useAnnote(blocs: string[]): Segment[][] {
  const cle = blocs.join("\u0001");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => annoter(blocs), [cle]);
}
