import { lazy, Suspense, useCallback, useState } from "react";
import { BookA, Compass, Calculator, FileText, Home, Library, Scale, ShieldAlert } from "lucide-react";
import Accueil from "./components/Accueil";
import { GloseProvider } from "./components/Glose";
import { lancerDiagnostic, type Nav, type Onglet } from "./lib/etat";

// Chaque page est chargée à la demande : le corpus d'articles et le lexique ne pèsent pas sur le premier affichage.
const Recherche = lazy(() => import("./components/Recherche"));
const DiagnosticWizard = lazy(() => import("./components/DiagnosticWizard"));
const Simulateur = lazy(() => import("./components/Simulateur"));
const Documents = lazy(() => import("./components/Documents"));
const Lexique = lazy(() => import("./components/Lexique"));

const onglets: { id: Onglet; label: string; court: string; Icon: typeof Home }[] = [
  { id: "accueil", label: "Accueil", court: "Accueil", Icon: Home },
  { id: "diagnostic", label: "Diagnostic", court: "Mon cas", Icon: Compass },
  { id: "recherche", label: "Articles", court: "Articles", Icon: Library },
  { id: "simulateur", label: "Simuler", court: "Calcul", Icon: Calculator },
  { id: "documents", label: "Documents", court: "Lettres", Icon: FileText },
  { id: "lexique", label: "Lexique", court: "Mots", Icon: BookA },
];

export default function App() {
  const [nav, setNav] = useState<Nav>({ onglet: "accueil" });
  const aller = useCallback((n: Nav) => { setNav(n); window.scrollTo({ top: 0 }); }, []);
  const onglet = nav.onglet;
  const index = onglets.findIndex((o) => o.id === onglet);
  const versArticle = (id: string, depuis: Onglet) => aller({ onglet: "recherche", article: id, retour: depuis });
  const versLexique = useCallback((id: string) => aller({ onglet: "lexique", terme: id }), [aller]);
  return (
    <GloseProvider onLexique={versLexique}>
      <a className="skip" href="#contenu">Aller au contenu</a>
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
          <nav className={"tabs" + (index < 0 ? " sans-actif" : "")} aria-label="Navigation principale" style={{ ["--i" as string]: Math.max(index, 0), ["--n" as string]: onglets.length }}>
            <span className="indicateur" aria-hidden />
            {onglets.map(({ id, label, court, Icon }) => (
              <button key={id} className={id === onglet ? "on" : ""} onClick={() => aller({ onglet: id })} aria-current={id === onglet ? "page" : undefined} aria-label={label}>
                <Icon size={22} strokeWidth={id === onglet ? 2.4 : 1.9} aria-hidden />
                <span aria-hidden><span className="long">{label}</span><span className="court">{court}</span></span>
              </button>
            ))}
          </nav>
        </aside>
        <main id="contenu" key={onglet} className="page" tabIndex={-1}>
          <Suspense fallback={<section><p className="muted" role="status">Chargement…</p></section>}>
            {onglet === "accueil" && <Accueil aller={aller} />}
            {onglet === "recherche" && <Recherche focus={nav.article} onDiagnostic={(sid) => { lancerDiagnostic(sid); aller({ onglet: "diagnostic" }); }} retour={nav.retour ? () => aller({ onglet: nav.retour! }) : undefined} />}
            {onglet === "diagnostic" && <DiagnosticWizard onDocuments={(m, motif) => aller({ onglet: "documents", modele: m ?? "convocation", motif })} onArticle={(id) => versArticle(id, "diagnostic")} onSimulateur={() => aller({ onglet: "simulateur" })} />}
            {onglet === "simulateur" && <Simulateur />}
            {onglet === "documents" && <Documents initial={nav.modele} motif={nav.motif} />}
            {onglet === "lexique" && <Lexique focus={nav.terme} onArticle={(id) => versArticle(id, "lexique")} />}
          </Suspense>
          <p className="avertissement" role="note">
            <ShieldAlert size={16} aria-hidden />
            <span>Outil d'information générale : il ne remplace pas un avis juridique. Vérifiez toujours le texte en vigueur auprès de l'inspection du travail.</span>
          </p>
        </main>
      </div>
    </GloseProvider>
  );
}
