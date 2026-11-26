import { useState } from "react";
import { Compass, Calculator, FileText, Scale, Search, ShieldAlert } from "lucide-react";
import Recherche from "./components/Recherche";
import DiagnosticWizard from "./components/DiagnosticWizard";
import Simulateur from "./components/Simulateur";
import Documents from "./components/Documents";
import type { ModeleId } from "./types";

const onglets = [
  { id: "recherche", label: "Rechercher", Icon: Search },
  { id: "diagnostic", label: "Diagnostic", Icon: Compass },
  { id: "simulateur", label: "Simulateur", Icon: Calculator },
  { id: "documents", label: "Documents", Icon: FileText },
] as const;
type Onglet = (typeof onglets)[number]["id"];

export default function App() {
  const [onglet, setOnglet] = useState<Onglet>("recherche");
  const [modele, setModele] = useState<ModeleId>("convocation");
  const [article, setArticle] = useState<string | undefined>();
  const index = onglets.findIndex((o) => o.id === onglet);
  return (
    <div className="app">
      <aside className="side">
      <header className="hero">
        <div className="hero-inner">
          <span className="logo" aria-hidden><Scale size={26} strokeWidth={2.2} /></span>
          <div>
            <h1>MiConseil</h1>
            <p>Le Code du travail malgache, expliqué simplement</p>
          </div>
        </div>
      </header>
      <nav className="tabs" aria-label="Navigation principale" style={{ ["--i" as string]: index }}>
        <span className="indicateur" aria-hidden />
        {onglets.map(({ id, label, Icon }) => (
          <button key={id} className={id === onglet ? "on" : ""} onClick={() => { setArticle(undefined); setOnglet(id); }} aria-current={id === onglet ? "page" : undefined}>
            <Icon size={22} strokeWidth={id === onglet ? 2.4 : 1.9} aria-hidden />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      </aside>
      <main key={onglet} className="page">
        {onglet === "recherche" && <Recherche focus={article} />}
        {onglet === "diagnostic" && <DiagnosticWizard onDocuments={(m) => { setModele(m ?? "convocation"); setOnglet("documents"); }} onArticle={(id) => { setArticle(id); setOnglet("recherche"); }} />}
        {onglet === "simulateur" && <Simulateur />}
        {onglet === "documents" && <Documents initial={modele} />}
        <p className="avertissement" role="note">
          <ShieldAlert size={16} aria-hidden />
          <span>Outil d'information générale : il ne remplace pas un avis juridique. Vérifiez toujours le texte en vigueur auprès de l'inspection du travail.</span>
        </p>
      </main>
    </div>
  );
}
