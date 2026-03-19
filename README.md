# matcha-app

Application mobile React Native/Expo pour Matcha, basée sur TypeScript et connectée à l'API Matcha.

## Prerequisites

- Node.js 22.16.0
- Yarn Classic 1.22.x

## Installation

```bash
yarn install
cp .env.example .env.local
```

## Development

Lancer l'application avec Expo :

```bash
yarn dev
```

Raccourcis utiles :

```bash
yarn android
yarn ios
yarn web
```

## Scripts

| Script                 | Description                              |
| ---------------------- | ---------------------------------------- |
| `yarn dev`             | Démarre Expo                             |
| `yarn android`         | Lance Expo sur Android                   |
| `yarn ios`             | Lance Expo sur iOS                       |
| `yarn web`             | Lance Expo sur le web                    |
| `yarn lint`            | Vérifie ESLint                           |
| `yarn lint:fix`        | Corrige automatiquement ESLint           |
| `yarn format`          | Formate le projet avec Prettier          |
| `yarn test`            | Exécute les tests Jest                   |
| `yarn test:coverage`   | Exécute les tests avec couverture        |
| `yarn typecheck`       | Vérifie TypeScript sans émettre de build |
| `yarn storybook`       | Lance Storybook                          |
| `yarn build-storybook` | Génère le build statique Storybook       |

## Environment variables

Créer un fichier `.env.local` à partir de [`.env.example`](/Users/etienne-rch/Documents/ETNA/MASTER/GPE/matcha-app/.env.example).

Exemple minimal :

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_google_web_client_id_here
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your_google_android_client_id_here
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your_google_ios_client_id_here
```

Les variables publiques sont injectées par Expo via [app.config.js](/Users/etienne-rch/Documents/ETNA/MASTER/GPE/matcha-app/app.config.js).

## Quality

Le repo est autonome et inclut :

- Husky + `lint-staged` pour les hooks Git
- une CI GitHub Actions pour `lint`, `test:coverage` et `typecheck`
- un résumé de couverture publié dans les PR

## Notes

- L'alias `@/` pointe sur `src/`.
- Le client utilise l'API définie par `EXPO_PUBLIC_API_URL`.
