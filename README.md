# matcha-app

Application mobile React Native pour Matcha, application d'aide à la reconversion professionnelle.

## Stack technique

- **Framework** : React Native 0.81.5 (Expo 54)
- **Langage** : TypeScript
- **Navigation** : React Navigation (bottom-tabs, native-stack)
- **UI** : React Native Paper, Reanimated, Expo Linear Gradient
- **HTTP** : Axios
- **Validation** : Zod
- **Authentification** : JWT (jwt-decode)
- **Stockage local** : AsyncStorage, Expo Secure Store
- **Design system** : Storybook
- **Polices** : Google Fonts (Manrope, Outfit)

## Prérequis

- [Node.js](https://nodejs.org/) 22.16.0
- [Yarn](https://classic.yarnpkg.com/) 1.22.x
- [EAS CLI](https://docs.expo.dev/eas/) >= 18.0.5 (pour les builds)
- Un émulateur Android/iOS ou l'application [Expo Go](https://expo.dev/go)

## Installation

```bash
git clone git@github.com:joinmatcha/matcha-app.git
cd matcha-app
yarn install
cp .env.example .env
```

Remplacer les valeurs placeholder par les vraies valeurs disponibles sur le **Bitwarden de l'organisation Matcha** (compte `matcha.api.gpe@gmail.com`).

## Lancement en local

Démarrer l'application avec Expo :

```bash
yarn dev
```

Lancer sur une plateforme spécifique :

```bash
yarn android
yarn ios
yarn web
```

L'API doit être accessible à l'URL définie dans `EXPO_PUBLIC_API_URL` (par défaut `http://localhost:3000`).

## Variables d'environnement

| Variable              | Description         | Valeur par défaut       |
| --------------------- | ------------------- | ----------------------- |
| `EXPO_PUBLIC_API_URL` | URL de l'API Matcha | `http://localhost:3000` |

Les variables sont injectées dans l'application via `app.config.js` (objet `extra`).

## Build APK (EAS)

L'application est buildée via [EAS Build](https://docs.expo.dev/build/introduction/) (Expo Application Services).

### Profils de build

| Profil        | Format     | Distribution | Usage                            |
| ------------- | ---------- | ------------ | -------------------------------- |
| `development` | Dev client | Interne      | Développement avec hot reload    |
| `preview`     | APK        | Interne      | Test interne, partage à l'équipe |
| `production`  | APK        | Store-ready  | Version finale                   |

### Générer un APK (profil preview)

```bash
eas build --platform android --profile preview
```

Le build est lancé sur les serveurs Expo. Une fois terminé, l'APK est téléchargeable depuis le dashboard Expo ou via le lien fourni dans le terminal.

### Keystore Android

Le keystore est généré et stocké automatiquement sur Expo (compte `matcha-gpe`). Ne pas le supprimer — il est nécessaire pour signer les futures mises à jour.

### Publier l'APK sur GitHub Release

1. **Builder l'APK** via EAS :
   ```bash
   eas build --platform android --profile preview
   ```
2. **Télécharger l'APK** depuis le dashboard [Expo](https://expo.dev) ou via le lien fourni dans le terminal
3. **Créer une release** sur GitHub :
   - Aller sur https://github.com/joinmatcha/matcha-app/releases/new
   - Créer un nouveau tag (ex : `v1.0.0-preview`, `v1.1.0-preview`, etc.)
   - Target : `develop1` (ou la branche concernée)
   - Ajouter un titre et une description des changements
   - Glisser-déposer le fichier APK dans la zone "Attach binaries"
   - Cocher "Set as a pre-release" si ce n'est pas une version finale
   - Publier

## Scripts

| Script                 | Description                                  |
| ---------------------- | -------------------------------------------- |
| `yarn dev`             | Démarre Expo                                 |
| `yarn android`         | Lance Expo sur Android                       |
| `yarn ios`             | Lance Expo sur iOS                           |
| `yarn web`             | Lance Expo sur le web                        |
| `yarn lint`            | Vérifie le code avec ESLint                  |
| `yarn lint:fix`        | Corrige automatiquement les erreurs ESLint   |
| `yarn format`          | Formate le code avec Prettier                |
| `yarn test`            | Exécute les tests Jest                       |
| `yarn test:coverage`   | Exécute les tests avec rapport de couverture |
| `yarn typecheck`       | Vérifie les types TypeScript (sans build)    |
| `yarn storybook:dev`   | Lance Storybook (composants UI)              |
| `yarn storybook:build` | Génère le build statique Storybook           |

## Tests

Le projet utilise **Jest** avec **@testing-library/react-native** pour les tests unitaires et d'intégration.

### Lancer les tests

```bash
yarn test                # exécute tous les tests
yarn test:coverage       # exécute les tests avec rapport de couverture
```

Pour un fichier ou dossier spécifique :

```bash
npx jest --config jest.config.cjs src/__tests__/hooks/useAuth.test.tsx
```

### Couverture

| Metric     | Objectif | Actuel |
| ---------- | -------- | ------ |
| Statements | 80%      | ~87%   |
| Branches   | —        | ~71%   |
| Functions  | 80%      | ~84%   |
| Lines      | 80%      | ~87%   |

Le rapport HTML est généré dans `coverage/` après un `yarn test:coverage`.

### Organisation des tests

Les tests suivent la structure source dans `src/__tests__/` :

```
src/__tests__/
├── api/                # Tests des appels API (axios mocks)
├── components/         # Tests des composants UI (modals, layout, ui)
├── config/             # Tests de la configuration (toastConfig)
├── contexts/           # Tests des React Contexts (AuthContext)
├── features/           # Tests des composants et forms par feature
│   ├── auth/
│   ├── home/
│   ├── jobs/
│   ├── personality/
│   └── profile/
├── hooks/              # Tests des hooks (useAuth, useBilan, etc.)
├── navigation/         # Tests de navigation (AppNavigator)
├── schemas/            # Tests des schémas Zod
├── screens/            # Tests de rendu des écrans
│   ├── auth/
│   ├── bilan/
│   ├── home/
│   ├── jobs/
│   ├── personality/
│   ├── profile/
│   └── swipe/
├── services/           # Tests des services (draftStorage)
└── utils/              # Tests des utilitaires
```

### Conventions

- Descriptions de tests en **français** (`it('se rend sans erreur', ...)`)
- Mocks manuels par fichier (pas de setup global)
- Les dépendances natives (`AsyncStorage`, `SecureStore`, `react-native-paper`) sont mockées dans chaque fichier de test

## Qualité de code

- **Husky + lint-staged** : lint et format automatiques sur chaque commit
- **ESLint** : règles TypeScript + React + React Native
- **Prettier** : formatage uniforme (avec plugin Tailwind pour l'ordre des classes)
- **TypeScript** : mode strict activé

## Architecture du projet

```
src/
├── App.tsx           # Point d'entrée de l'application
├── api/              # Client HTTP (Axios), intercepteurs
├── assets/           # Images, icônes, polices
├── components/       # Composants réutilisables
├── config/           # Configuration
├── constants/        # Constantes de l'application
├── contexts/         # React Contexts (auth, theme, etc.)
├── features/         # Modules métier (écrans + logique par feature)
├── hooks/            # Hooks React personnalisés
├── navigation/       # Configuration React Navigation
├── schemas/          # Schémas de validation Zod
├── services/         # Services métier
├── themes/           # Thème UI (couleurs, typographie)
├── types/            # Types TypeScript partagés
└── utils/            # Fonctions utilitaires
```

## Configuration technique

### Alias de chemins

L'alias `@/` pointe sur `src/`. Exemple :

```typescript
import { Button } from '@/components/Button';
```

### SVG

Les fichiers SVG sont importés comme des composants React Native grâce à `react-native-svg-transformer` (configuré dans `metro.config.js`).

```typescript
import Logo from '@/assets/icons/logo.svg';
```

## Accès aux services

| Service                  | URL                                      | Connexion                                    |
| ------------------------ | ---------------------------------------- | -------------------------------------------- |
| **Expo** (builds)        | https://expo.dev                         | Identifiants sur Bitwarden                   |
| **GitHub** (code source) | https://github.com/joinmatcha/matcha-app | Compte personnel (organisation `joinmatcha`) |
| **Bitwarden** (secrets)  | https://vault.bitwarden.eu               | Google (`matcha.api.gpe@gmail.com`)          |
