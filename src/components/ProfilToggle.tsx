import { User } from "lucide-react";
import { useProfil } from "../lib/etat";

/** « Je suis : Salarié / Employeur », mémorisé sur l'appareil et partagé par tous les onglets. */
export default function ProfilToggle() {
  const [p, set] = useProfil();
  return (
    <div className="segment" role="group" aria-label="Vous êtes">
      <span className="segment-lab"><User size={16} aria-hidden /> Je suis</span>
      {(["salarie", "employeur"] as const).map((v) => (
        <button key={v} className={"seg" + (p.profil === v ? " on" : "")} aria-pressed={p.profil === v} onClick={() => set({ profil: v })}>{v === "salarie" ? "Salarié" : "Employeur"}</button>
      ))}
    </div>
  );
}
