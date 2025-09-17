# Configuration des Tests Unitaires

Ce projet utilise **Vitest** avec **React Testing Library** et **jest-dom matchers** pour les tests unitaires.

## 🚀 Technologies

- **[Vitest](https://vitest.dev/)** - Framework de test moderne et rapide
- **[React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)** - Utilitaires pour tester les composants React
- **[@testing-library/jest-dom](https://github.com/testing-library/jest-dom)** - Matchers Jest personnalisés pour les éléments DOM
- **[jsdom](https://github.com/jsdom/jsdom)** - Environnement DOM simulé pour les tests

## 📂 Structure des Tests

```text
./__tests__/
├── setup.ts          # Configuration globale des tests
├── Carrousel.test.tsx # Tests du composant Carrousel
├── Header.test.tsx    # Tests du composant Header
└── Footer.test.tsx    # Tests du composant Footer
```

## ⚙️ Configuration

### Vitest (`vitest.config.ts`)

```typescript
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Variables globales (describe, it, expect, vi)
    environment: "jsdom", // Environnement DOM simulé
    setupFiles: ["./__tests__/setup.ts"],
    css: true, // Support CSS dans les tests
    testTimeout: 10000, // Timeout pour les tests
    coverage: {
      provider: "v8", // Fournisseur de couverture
      reporter: ["text", "json", "html"], // Formats de rapport
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
```

### TypeScript Configuration

Les fichiers `tsconfig.json` et `tsconfig.test.json` sont configurés pour reconnaître les globals Vitest :

```json
{
  "compilerOptions": {
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  }
}
```

### ESLint Configuration

ESLint est configuré pour reconnaître les globals Vitest dans les fichiers de test et inclut des règles spécialisées pour Vitest :

```javascript
{
  files: ["**/*.{test,spec}.{js,jsx,ts,tsx}", "__tests__/**/*.{js,jsx,ts,tsx}"],
  plugins: {
    vitest: vitest,
  },
  languageOptions: {
    globals: {
      vi: "readonly",
      describe: "readonly",
      it: "readonly",
      test: "readonly",
      expect: "readonly",
      beforeEach: "readonly",
      afterEach: "readonly",
      beforeAll: "readonly",
      afterAll: "readonly",
    },
  },
  rules: {
    ...vitest.configs.recommended.rules,
    "vitest/no-focused-tests": "error",
    "vitest/no-disabled-tests": "warn",
    "vitest/consistent-test-it": "warn",
  },
}
```

#### Règles ESLint Vitest Actives

- **vitest/no-focused-tests** - Empêche les tests `.only()` en production
- **vitest/no-disabled-tests** - Avertit des tests `.skip()` oubliés
- **vitest/consistent-test-it** - Encourage l'utilisation cohérente de `test` ou `it`
- **Règles recommandées Vitest** - Détection des anti-patterns et bonnes pratiques

````

### Setup Tests (`__tests__/setup.ts`)

- Import automatique de `@testing-library/jest-dom`
- Mocks globaux pour `matchMedia`, `IntersectionObserver`, `ResizeObserver`
- Configuration des APIs du navigateur non disponibles dans jsdom

## 🎯 Scripts Disponibles

```bash
# Exécuter les tests en mode watch
yarn test

# Exécuter les tests une seule fois
yarn test:run

# Générer le rapport de couverture de code
yarn test:coverage

# Ouvrir l'interface utilisateur Vitest
yarn test:ui
````

## 🌍 Variables Globales Vitest

Grâce à la configuration `globals: true`, vous n'avez **plus besoin d'importer** les fonctions Vitest dans vos tests !

### ✅ Variables Disponibles Globalement

- `describe` / `test` / `it` - Structuration des tests
- `expect` - Assertions
- `vi` - Fonctions de mock et utilitaires
- `beforeEach` / `afterEach` - Hooks de cycle de vie
- `beforeAll` / `afterAll` - Hooks globaux

### 💡 Avant vs Maintenant

**❌ Avant (avec imports):**

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

describe("MonComposant", () => {
  // ...
});
```

**✅ Maintenant (sans imports):**

```typescript
import { render, screen } from "@testing-library/react";

describe("MonComposant", () => {
  // describe, it, expect, vi sont disponibles globalement !
});
```

Cette configuration améliore l'expérience de développement en réduisant le boilerplate et en se rapprochant de la syntaxe Jest standard.

## 📝 Exemples de Tests

### Test de Composant React

```typescript
import { render, screen } from "@testing-library/react";

import Header from "@/components/Header";

// Mock des dépendances
vi.mock("next/link", () => ({
  default: ({ children, href }) => <a href={href}>{children}</a>,
}));

describe("Header", () => {
  it("should render the header with logo and title", () => {
    render(<Header />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /chœur des pays du mont-blanc/i })).toBeInTheDocument();
  });
});
```

### Test de Fonction Utilitaire

```typescript
// Aucun import de describe, it, expect nécessaire !

function formatDisplayName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim();
}

describe("formatDisplayName", () => {
  it("should format full name correctly", () => {
    expect(formatDisplayName("Jean", "Dupont")).toBe("Jean Dupont");
  });

  it("should handle empty values", () => {
    expect(formatDisplayName("Jean", "")).toBe("Jean");
  });
});
```

### Test avec Mocks et Timers (Sans Imports Vitest)

````typescript
import { render } from "@testing-library/react";

describe("Tests avec mocks", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should work with mocked dates", () => {
    const mockDate = new Date("2024-01-01");
    vi.setSystemTime(mockDate);

    expect(new Date().getFullYear()).toBe(2024);
  });
});
```
## 🔧 Bonnes Pratiques

### 1. Nommage des Tests

- Utilisez `describe` pour grouper les tests par fonctionnalité
- Utilisez `it` ou `test` avec des descriptions claires en français
- Préfixez avec "should" pour décrire le comportement attendu

### 2. Mocking

- Mockez les dépendances externes (Next.js components, APIs)
- Utilisez `vi.mock()` pour les modules
- Mockez les APIs du navigateur dans le setup

### 3. Tests d'Accessibilité

- Testez avec les rôles ARIA (`getByRole`)
- Vérifiez les attributs d'accessibilité
- Utilisez des queries qui reflètent l'expérience utilisateur

### 4. Structure des Tests

```typescript
describe("ComponentName", () => {
  beforeEach(() => {
    // Setup avant chaque test
  });

  it("should render correctly", () => {
    // Test de rendu de base
  });

  it("should handle user interactions", async () => {
    // Tests d'interaction utilisateur
  });

  it("should have proper accessibility", () => {
    // Tests d'accessibilité
  });
});
```

## 🚨 Dépannage

### Problèmes Courants

1. **Tests qui timeout** - Augmentez `testTimeout` dans la config
2. **Mocks Next.js** - Assurez-vous de mocker `next/image` et `next/link`
3. **CSS non reconnu** - Ajoutez `css: true` dans la config Vitest
4. **APIs du navigateur** - Mockez-les dans le fichier setup

### ESLint pour les Tests

Le projet inclut **eslint-plugin-vitest** qui fournit une configuration ESLint spécialisée pour les tests :

- **Règles recommandées Vitest** - Détection automatique des anti-patterns
- **Globals Vitest** - Reconnaissance des variables globales (vi, describe, it, expect)
- **Règles personnalisées** - Prévention des tests focalisés/désactivés en production
- **Types spécifiques aux tests** - Support TypeScript complet pour Vitest

#### Avantages du Plugin ESLint Vitest

- 🚫 **Prévention des erreurs** - Détecte les erreurs communes dans les tests
- ✅ **Bonnes pratiques** - Encourage l'utilisation correcte des APIs Vitest
- 🎯 **Cohérence** - Assure un style uniforme dans tous les tests
- 🔍 **Debugging** - Identifie les tests problématiques avant l'exécution

## 📊 Couverture de Code

La couverture de code est configurée pour exclure :

- `node_modules/`
- Fichiers de configuration
- Fichiers de setup des tests
- Fichiers spécifiques à Next.js (layout, globals.css)

Pour voir la couverture :

```bash
yarn test:coverage
```

## 🔗 Ressources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest-DOM Matchers](https://github.com/testing-library/jest-dom#custom-matchers)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
````
