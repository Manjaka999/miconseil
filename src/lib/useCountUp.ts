import { useEffect, useRef, useState } from "react";

/** Anime un nombre vers sa nouvelle valeur (désactivé si l'utilisateur réduit les animations). */
export function useCountUp(cible: number, duree = 600) {
  const [valeur, setValeur] = useState(cible);
  const depart = useRef(cible);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setValeur(cible); depart.current = cible; return; }
    const de = depart.current, t0 = performance.now();
    let raf = 0;
    const pas = (t: number) => {
      const p = Math.min(1, (t - t0) / duree), e = 1 - Math.pow(1 - p, 3);
      const v = de + (cible - de) * e;
      setValeur(v); depart.current = v;
      if (p < 1) raf = requestAnimationFrame(pas);
    };
    raf = requestAnimationFrame(pas);
    return () => cancelAnimationFrame(raf);
  }, [cible, duree]);
  return valeur;
}
