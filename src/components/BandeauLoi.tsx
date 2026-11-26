import { Info } from "lucide-react";

/** Encart d'information sur le texte appliqué (affiché dans Rechercher et Diagnostic). */
export default function BandeauLoi() {
  return (
    <aside className="bandeau" aria-label="Texte de loi appliqué">
      <Info size={18} aria-hidden />
      <div>
        <p><strong>Texte appliqué : loi n° 2024-014 du 14 août 2024 portant Code du travail</strong> (promulguée à Antananarivo le 14 août 2024). La loi n° 2003-044 est l'<strong>ancienne loi</strong>, abrogée en principe (art. 394).</p>
        <p className="muted">Date d'entrée en vigueur à confirmer : le texte ne fixe pas de date spécifique (art. 395 : publication au Journal officiel). Il s'applique de plein droit aux contrats en cours (art. 392) ; les textes d'application antérieurs restent applicables tant qu'ils ne sont pas remplacés et s'ils ne sont pas contraires (art. 391) ; les conventions collectives restent en vigueur dans leurs dispositions non contraires (art. 393). Les décrets d'application (préavis, essai, heures supplémentaires, SME…) sont à vérifier auprès de l'inspection du travail.</p>
      </div>
    </aside>
  );
}
