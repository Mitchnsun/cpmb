# Configuration des Tests Unitaires

Ce projet utilise **Vitest** avec **React Testing Library** et **jest-dom matchers** pour les tests unitaires.

## 🚀 Technologies

- **[Vitest](https://vitest.dev/)** - Framework de test moderne et rapide
- **[React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)** - Utilitaires pour tester les composants React
- **[@testing-library/jest-dom](https://github.com/testing-library/jest-dom)** - Matchers Jest personnalisés pour les éléments DOM
- **[jsdom](https://github.com/jsdom/jsdom)** - Environnement DOM simulé pour les tests

## 📂 Structure des Tests

```
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
    globals: true, // Variables globales (describe, it, expect)
    environment: "jsdom", // Environnement DOM simulé
    setupFiles: ["./src/test/setup.ts"],
    css: true, // Support CSS dans les tests
    testTimeout: 10000, // Timeout pour les tests
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
```

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

# Ouvrir l'interface utilisateur Vitest
yarn test:ui
```

## 📝 Exemples de Tests

### Test de Composant React

```typescript
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

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
import { describe, expect, it } from "vitest";

function formatDisplayName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim();
}

describe("formatDisplayName", () => {
  it("should format full name correctly", () => {
    expect(formatDisplayName("Jean", "Dupont")).toBe("Jean Dupont");
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

Le projet inclut une configuration ESLint spécifique pour les tests qui :

- Autorise les globals Vitest (vi, describe, it, expect)
- Relaxe certaines règles pour les mocks
- Gère les types spécifiques aux tests

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
