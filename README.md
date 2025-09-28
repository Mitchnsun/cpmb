# Chœur des Pays du Mont-Blanc

Ce projet contient le code source du site web officiel du **Chœur des Pays du Mont-Blanc**, accessible à l'adresse : [https://choeurdespaysdumontblanc.fr/](https://choeurdespaysdumontblanc.fr/)

![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/Mitchnsun/cpmb?utm_source=oss&utm_medium=github&utm_campaign=Mitchnsun%2Fcpmb&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)

## 📖 Description

Site web moderne développé avec Next.js pour présenter le Chœur des Pays du Mont-Blanc, ses activités, concerts, et permettre aux visiteurs de découvrir l'ensemble vocal.

## 🚀 Technologies utilisées

- **Framework** : [Next.js 15.5.3](https://nextjs.org/) avec Turbopack
- **Langage** : TypeScript
- **Styling** : [Tailwind CSS 4.1.13](https://tailwindcss.com/)
- **Composants UI** : [shadcn/ui](https://ui.shadcn.com/) avec [Radix UI](https://www.radix-ui.com/)
- **Runtime** : React 19.1.1
- **Gestionnaire de paquets** : Yarn 4.9.4
- **Tests** : [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/)
- **Linting** : ESLint avec configuration Next.js + plugins avancés
- **Formatage** : Prettier avec support TailwindCSS

## 🛠️ Installation et développement

### Prérequis

- Node.js (version 18+ recommandée)
- Yarn 4.9.4

### Installation des dépendances

```bash
yarn install
```

### Lancement du serveur de développement

```bash
yarn dev
```

Le site sera accessible sur [http://localhost:3000](http://localhost:3000)

### Scripts disponibles

- `yarn dev` - Lance le serveur de développement avec Turbopack
- `yarn build` - Compile l'application pour la production
- `yarn start` - Lance l'application en mode production
- `yarn lint` - Vérifie le code avec ESLint
- `yarn lint:fix` - Corrige automatiquement les erreurs ESLint
- `yarn format` - Formate le code avec Prettier
- `yarn format:check` - Vérifie si le code est formaté selon Prettier
- `yarn type-check` - Vérifie les types TypeScript
- `yarn test` - Lance les tests en mode watch
- `yarn test:run` - Exécute tous les tests une fois
- `yarn test:coverage` - Génère le rapport de couverture de code
- `yarn test:ui` - Ouvre l'interface utilisateur Vitest
- `yarn test:ci` - Exécute les tests en mode CI (sans watch)
- `yarn validate:concerts` - Valide les données des concerts et l'existence des médias
- `yarn validate` - Alias pour la validation des données

## 📁 Structure du projet

```
├── app/                    # Pages et layouts Next.js (App Router)
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Page d'accueil
│   └── globals.css        # Styles globaux
├── components/             # Composants React réutilisables
│   └── ui/                # Composants shadcn/ui (drawer, button, etc.)
├── assets/                 # Assets locaux (images, icônes, contenus)
├── scripts/                # Scripts utilitaires
│   └── validate-concerts.js # Script de validation des données
├── docs/                   # Documentation du projet
│   └── VALIDATION.md      # Documentation du système de validation
├── __tests__/              # Tests unitaires et d'intégration
│   ├── setup.ts           # Configuration globale des tests
│   ├── Header.test.tsx    # Tests du composant Header
│   ├── Footer.test.tsx    # Tests du composant Footer
│   └── Carrousel.test.tsx # Tests du composant Carrousel
├── public/                # Assets statiques
├── coverage/              # Rapports de couverture de code (généré)
├── .vscode/               # Configuration VS Code
├── .prettierrc            # Configuration Prettier
├── components.json        # Configuration shadcn/ui
├── eslint.config.js       # Configuration ESLint
├── vitest.config.ts       # Configuration Vitest
├── tailwind.config.js     # Configuration Tailwind CSS
├── tsconfig.json          # Configuration TypeScript
├── tsconfig.test.json     # Configuration TypeScript pour les tests
└── next.config.ts         # Configuration Next.js
```

## 🔧 Configuration

### ESLint

Le projet utilise ESLint avec :

- Configuration Next.js (`next/core-web-vitals`)
- Support TypeScript complet
- **eslint-plugin-prettier** - Intégration Prettier dans ESLint
- **eslint-plugin-import** - Validation des imports
- **eslint-plugin-sonarjs** - Détection des code smells et problèmes de complexité
- **eslint-plugin-security** - Identification des vulnérabilités potentielles
- **eslint-plugin-unicorn** - Suggestions d'améliorations modernes JavaScript
- **eslint-plugin-unused-imports** - Suppression des imports inutiles
- **eslint-plugin-simple-import-sort** - Tri automatique des imports
- **eslint-plugin-jsx-a11y** - Vérifications d'accessibilité pour JSX
- **eslint-plugin-vitest** - Règles ESLint spécialisées pour Vitest

#### Règles personnalisées activées

```javascript
{
  'prettier/prettier': 'error',
  'unused-imports/no-unused-imports': 'error',
  'simple-import-sort/imports': 'error',
  'simple-import-sort/exports': 'error',
  'unicorn/prevent-abbreviations': 'off',
  'unicorn/filename-case': 'off'
}
```

### Prettier

Configuration de formatage automatique avec :

- **prettier-plugin-tailwindcss** - Tri et organisation des classes TailwindCSS
- Formatage cohérent du code (indentation, guillemets, points-virgules)
- Intégration complète avec ESLint

### Tailwind CSS

Configuration avec PostCSS pour un styling moderne et responsive. Le projet utilise :

- **Tailwind CSS 4.1.13** - Framework CSS utility-first
- **Variables CSS** - Système de théorisation avec shadcn/ui
- **Plugin Prettier** - Tri automatique des classes par ordre logique
- **tw-animate-css** ^1.4.0 - Animations CSS supplémentaires

Les classes sont automatiquement triées par ordre logique grâce au plugin Prettier pour une meilleure lisibilité.

### TypeScript

Configuration stricte pour un développement robuste.

## 🎨 shadcn/ui - Système de composants

Le projet utilise **[shadcn/ui](https://ui.shadcn.com/)**, un système de composants moderne basé sur **Radix UI** et **Tailwind CSS**.

### Configuration

shadcn/ui est configuré avec :

```json
{
  "style": "new-york", // Style moderne et élégant
  "baseColor": "slate", // Palette de couleurs slate
  "cssVariables": true, // Variables CSS pour la théorisation
  "iconLibrary": "lucide" // Icônes Lucide React
}
```

### Composants installés

- **Drawer** (`components/ui/drawer.tsx`) - Menu coulissant responsive utilisé dans le header
- **Utilitaires** (`lib/utils.ts`) - Helpers pour la gestion des classes CSS

### Dépendances ajoutées

- **[@radix-ui/react-dialog](https://www.radix-ui.com/docs/primitives/components/dialog)** ^1.1.15 - Primitives accessibles pour les modales
- **[vaul](https://vaul.emilkowal.ski/)** ^1.1.2 - Composant drawer optimisé pour mobile
- **[lucide-react](https://lucide.dev/)** ^0.544.0 - Bibliothèque d'icônes moderne
- **[class-variance-authority](https://cva.style/docs)** ^0.7.1 - Gestion des variantes de composants
- **[clsx](https://github.com/lukeed/clsx)** ^2.1.1 - Utilitaire pour les classes conditionnelles
- **[tailwind-merge](https://github.com/dcastil/tailwind-merge)** ^3.3.1 - Fusion intelligente des classes Tailwind

### Utilisation

```typescript
// Import des composants UI
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerClose
} from "@/components/ui/drawer";

// Exemple d'utilisation dans HeaderMenu.tsx
<Drawer direction="right" open={isOpen} onOpenChange={setIsOpen}>
  <DrawerTrigger asChild>
    <button>Ouvrir le menu</button>
  </DrawerTrigger>
  <DrawerContent className="w-80 sm:w-96">
    {/* Contenu du drawer */}
  </DrawerContent>
</Drawer>
```

### Ajout de nouveaux composants

Pour ajouter un composant shadcn/ui :

```bash
# Installer un composant (exemple: button)
npx shadcn@latest add button

# Le composant sera créé dans components/ui/button.tsx
```

### Avantages

- **Accessibilité** : Composants conformes WCAG avec support clavier complet
- **Personnalisation** : Styles Tailwind CSS entièrement personnalisables
- **Performance** : Composants optimisés et tree-shakable
- **TypeScript** : Support TypeScript natif avec types stricts
- **Responsive** : Composants adaptatifs pour mobile et desktop

## 🧪 Tests

Le projet utilise une stack de test moderne et performante :

### Technologies de test

- **[Vitest](https://vitest.dev/)** - Framework de test rapide et moderne
- **[React Testing Library](https://testing-library.com/)** - Utilitaires pour tester les composants React
- **[@testing-library/jest-dom](https://github.com/testing-library/jest-dom)** - Matchers Jest personnalisés
- **[jsdom](https://github.com/jsdom/jsdom)** - Environnement DOM simulé

### Configuration

Les tests sont configurés avec :

- **Variables globales Vitest** - Plus besoin d'importer `describe`, `it`, `expect`, `vi`
- **Environnement jsdom** - Tests DOM complets
- **Mocks automatiques** - Next.js Image, Link, APIs navigateur
- **Couverture de code** - Rapports détaillés avec V8

### Exemples de tests

```typescript
// Plus besoin d'importer describe, it, expect !
import { render, screen } from "@testing-library/react";
import MonComposant from "@/components/MonComposant";

describe("MonComposant", () => {
  it("should render correctly", () => {
    render(<MonComposant />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
```

### Commandes de test

```bash
# Mode watch (recommandé pour le développement)
yarn test

# Exécution unique
yarn test:run

# Rapport de couverture de code
yarn test:coverage

# Interface utilisateur
yarn test:ui
```

### Couverture

Les métriques de couverture évoluent dans le temps. Générez le rapport localement avec `yarn test:coverage`.

Pour plus de détails, consultez [TESTS.md](./__tests__/TESTS.md).

## � Validation des données

Le projet inclut un système de validation complet pour garantir l'intégrité des données des concerts et éviter les erreurs à l'exécution.

### Validation automatique

Le système valide automatiquement :

- **Structure des données** : Champs requis (title, slug, date, location, media) et optionnels (description, programme)
- **Contraintes d'unicité** : Slugs uniques pour tous les concerts
- **Format des données** : Format des slugs (URL-friendly), format ISO des dates, types de champs
- **Existence des assets** : Vérification que tous les fichiers média référencés existent dans le répertoire public

### Utilisation

```bash
# Valider les données des concerts
yarn validate:concerts

# Validation complète (alias)
yarn validate
```

### Intégration CI/CD

La validation s'exécute automatiquement dans GitHub Actions lors de :

- Push vers les branches principales (`main`, `develop`) ou de feature
- Pull requests vers `main` ou `develop`
- Modifications des fichiers de données ou de validation

### Exemple de sortie

**✅ Succès :**

```
🎵 Validating concerts data...
📄 Found 24 concerts to validate
✅ All concerts data is valid!

📊 Validation Summary:
   • Total concerts: 24
   • All required fields present: ✅
   • All slugs unique: ✅
   • All media files exist: ✅
   • Date formats valid: ✅
```

**❌ Erreurs détectées :**

```
❌ Validation failed with the following errors:

🔍 Structure Validation Errors:
   • concert[0].title: Title is required and must be a non-empty string
   • concert[1].slug: Slug must be URL-friendly (lowercase letters, numbers, and hyphens only)

📁 Missing Media Files:
   • concert[0].media: Media file not found: public/concerts/missing-poster.jpg

❌ Total errors: 3
```

Pour plus de détails sur le système de validation, consultez [VALIDATION.md](./docs/VALIDATION.md).

## ��� Déploiement

Le site est optimisé pour un déploiement sur [Vercel](https://vercel.com/), mais peut être déployé sur d'autres plateformes supportant Next.js.

```bash
yarn build
```

## 📝 Contribution

Pour contribuer au projet :

1. Fork le repository
2. Créer une branche pour votre feature (`git checkout -b feature/ma-feature`)
3. Installer les dépendances (`yarn install`)
4. **Développement avec les outils de qualité :**
   - Vérifier le linting : `yarn lint`
   - Formater le code : `yarn format`
   - Vérifier les types : `yarn type-check`
   - **Exécuter les tests : `yarn test:run`**
5. Commiter vos changements (`git commit -am 'Ajout de ma feature'`)
6. Push vers la branche (`git push origin feature/ma-feature`)
7. Ouvrir une Pull Request

### Standards de code

- Le code doit passer les vérifications ESLint sans erreurs
- Le formatage Prettier doit être respecté
- Les classes TailwindCSS doivent être triées automatiquement
- Les imports doivent être organisés et sans éléments inutiles
- La vérification TypeScript doit passer sans erreurs
- **Les tests doivent passer et maintenir une couverture > 80%**
- **Nouveaux composants doivent inclure des tests unitaires**
- **La validation des données doit passer** : `yarn validate`
- **Utiliser shadcn/ui** pour les nouveaux composants UI quand possible
- **Respecter l'accessibilité** (WCAG) avec les attributs ARIA appropriés

## 📞 Contact

Pour toute question concernant le développement du site, contactez l'équipe de développement.

---

**Site officiel** : [https://choeurdespaysdumontblanc.fr/](https://choeurdespaysdumontblanc.fr/)
