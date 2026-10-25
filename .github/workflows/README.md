# Workflows GitHub Actions

Ce dossier contient les workflows déclenchés par des événements GitHub et les workflows réutilisables qu'ils appellent.

## CI

[`ci.yml`](ci.yml) est le point d'entrée de la validation. Il se lance sur les pull requests et les pushs vers `dev` ou `main`, ainsi que manuellement avec `workflow_dispatch`. Il appelle les workflows backend, frontend et audit en parallèle. Le build des images Docker commence après la réussite des validations backend et frontend; l'audit reste indépendant et n'est pas une dépendance du build Docker.

Les workflows suivants sont réutilisables (`workflow_call`) et sont normalement lancés par `ci.yml` :

- [`backend-ci.yml`](backend-ci.yml) vérifie le backend avec le typecheck et Biome, exécute les tests avec PostgreSQL 16 et produit un rapport de couverture LCOV. Le script `backend/scripts/report-coverage.js` écrit le résumé GitHub; sous 80 %, il émet un avertissement sans faire échouer les tests. Le rapport LCOV est téléversé comme artefact. Un job distinct construit le backend.
- [`frontend-ci.yml`](frontend-ci.yml) exécute Biome sur le frontend et construit l'application avec Node.js 22.
- [`dependency-audit.yml`](dependency-audit.yml) lance `npm audit --omit=dev --audit-level=high` pour les dépendances de production du backend et du frontend.
- [`docker-build.yml`](docker-build.yml) construit les images backend et frontend avec Buildx et le cache GitHub Actions. Les images ne sont pas publiées.

Les workflows réutilisables ne définissent pas de déclencheur manuel direct : utiliser `workflow_dispatch` sur `ci.yml` pour lancer toute la CI.

## Gouvernance et synchronisations

- [`enforce-dev-to-main.yml`](enforce-dev-to-main.yml) s'exécute sur les pull requests vers `main` et échoue si la branche source n'est pas `dev`.
- [`jira-sync.yml`](jira-sync.yml) réagit à la création d'une branche et aux événements de pull request. Il extrait une clé `KAN-xx` du nom de branche ou du titre de PR, met à jour l'état Jira et ajoute le lien de la PR au ticket. Il requiert les secrets `JIRA_BASE_URL`, `JIRA_USER_EMAIL` et `JIRA_API_TOKEN`.
- [`sync-school.yml`](sync-school.yml) pousse `main` ou `dev` vers le dépôt scolaire après un push, ou sur déclenchement manuel. Il requiert le secret `SCHOOL_REPO_TOKEN` et la variable de dépôt `SCHOOL_REPO_URL`.