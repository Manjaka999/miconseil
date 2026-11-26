import { useState } from "react";
import Recherche from "./components/Recherche";
import DiagnosticWizard from "./components/DiagnosticWizard";
import Simulateur from "./components/Simulateur";
import Documents from "./components/Documents";

const onglets = [
  { id: "recherche", label: "Rechercher", icon: "🔎" },
  { id: "diagnostic", label: "Diagnostic", icon: "🧭" },
  { id: "simulateur", label: "Simulateur", icon: "🧮" },
  { id: "documents", label: "Documents", icon: "📄" },
] as const;
type Onglet = (typeof onglets)[number]["id"];

export default function App() {
  const [onglet, setOnglet] = useState<Onglet>("recherche");
  return (
    <div className="app">
      <header className="top">
        <h1>MiConseil</h1>
        <p>Le Code du travail malgache, expliqué simplement</p>
      </header>
      <main>
        {onglet === "recherche" && <Recherche />}
        {onglet === "diagnostic" && <DiagnosticWizard onDocuments={() => setOnglet("documents")} />}
        {onglet === "simulateur" && <Simulateur />}
        {onglet === "documents" && <Documents />}
        <p className="avertissement" role="note">
          Outil d'information générale : il ne remplace pas un avis juridique. Les articles et barèmes sont à vérifier sur le texte officiel
          (loi n° 2003-044). En cas de doute, contactez l'inspection du travail.
        </p>
      </main>
      <nav className="tabs" aria-label="Navigation principale">
        {onglets.map((o) => (
          <button key={o.id} className={o.id === onglet ? "on" : ""} onClick={() => setOnglet(o.id)} aria-current={o.id === onglet}>
            <span aria-hidden>{o.icon}</span>{o.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
