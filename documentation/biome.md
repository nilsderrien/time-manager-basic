# Biome

Biome est utilisé pour le lint et le formatage du code TypeScript.

## Installation

Depuis le dossier `backend` :

```powershell
npm install --save-dev @biomejs/biome
npx biome init
```

## Commandes utiles

```powershell
# Vérifier le lint
npm run lint

# Vérifier le typage TypeScript
npm run typecheck

# Vérifier le formatage
npm run format:check

# Formater les fichiers
npm run format

# Lancer toutes les vérifications
npm run check
```

## Commandes Biome directes

```powershell
# Vérifier le lint et le formatage
npx biome check .

# Corriger le lint et le formatage automatiquement
npx biome check --write .

# Afficher l'aide
npx biome --help
```

La configuration se trouve dans `backend/biome.json`.
