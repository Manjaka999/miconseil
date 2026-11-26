# MiConseil

PWA (Vite + React + TypeScript) : recherche dans le Code du travail malgache, diagnostic de litige, simulateur d'indemnités, modèles de courriers.

```bash
npm install
npm run dev      # développement
npm run build    # vérification TypeScript + production (dist/)
```

## Avant la mise en production — contenu juridique
- `src/data/articles.ts` : tous les articles sont `verifie: false` ; les numéros `null` sont à confirmer et le champ `texte` est à recopier depuis le texte officiel (loi n° 2003-044). Une loi n° 2024-014 existe : vérifier laquelle est en vigueur.
- `src/data/bareme.ts` : préavis et indemnités par défaut tirés de sources secondaires contradictoires ; à valider (l'utilisateur peut les modifier dans le simulateur).
- Faire relire par un juriste / l'inspection du travail.
