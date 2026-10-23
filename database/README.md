# Alimenter la base de données

Ce dossier contient les scripts SQL de la base de données :

- `init.sql` crée le schéma lors de la première initialisation du conteneur
  PostgreSQL ;
- `populate.sql` ajoute les données de développement.

En environnement `development`, le backend charge automatiquement
`populate.sql` au démarrage si la table `users` est vide. Le fichier `.env`
racine est la configuration de référence utilisée par Docker Compose ; il doit
contenir `NODE_ENV=development` pour activer ce comportement.

Les commandes ci-dessous doivent être exécutées depuis la racine du projet,
avec Docker Desktop (Windows) ou Docker Engine (Linux) démarré.

Avec `NODE_ENV=development` dans le `.env` racine, le backend lance
automatiquement le chargement de `populate.sql`. La commande manuelle reste
disponible si le backend n'est pas démarré ou si les données doivent être
chargées explicitement.


## Linux

Depuis la racine du projet, charger les variables du fichier `.env`, puis
exécuter `populate.sql` dans le conteneur PostgreSQL :

```bash
set -a
source .env
set +a
docker compose exec -T db psql -U "$DB_USER" -d "$DB_NAME" < database/populate.sql
```

## Windows PowerShell

PowerShell ne transforme pas automatiquement les variables de `.env` en
variables d'environnement. Les charger d'abord dans la session courante :

```powershell
Get-Content .env |
  Where-Object { $_ -and -not $_.StartsWith('#') } |
  ForEach-Object {
    $name, $value = $_ -split '=', 2
    Set-Item -Path "Env:$name" -Value $value
  }

Get-Content database/populate.sql -Raw |
  docker compose exec -T db psql -U $env:DB_USER -d $env:DB_NAME
```

Le chargement des variables ne concerne que la fenêtre PowerShell courante.

## Windows avec Git Bash

Si Git Bash est installé, utiliser directement la procédure Linux depuis la
racine du projet :

```bash
set -a
source .env
set +a
docker compose exec -T db psql -U "$DB_USER" -d "$DB_NAME" < database/populate.sql
```

## Vérifier le résultat

Pour ouvrir une session PostgreSQL dans le conteneur :

```bash
docker compose exec db psql -U "$DB_USER" -d "$DB_NAME"
```

Sous PowerShell, utiliser les variables de session :

```powershell
docker compose exec db psql -U $env:DB_USER -d $env:DB_NAME
```

Puis, dans `psql`, par exemple :

```sql
SELECT COUNT(*) FROM users;
\q
```

`populate.sql` est un jeu de données de développement et n'est pas prévu pour
être exécuté plusieurs fois sur la même base : cela peut créer des doublons ou
provoquer des erreurs de contrainte. Pour repartir d'une base vide, supprimer
le volume Docker **uniquement si cela est intentionnel**, puis recréer le
service :

```bash
docker compose down -v
docker compose up -d db
```
