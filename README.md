# Chœur des Pays du Mont-Blanc

Ce projet contient le code source du site web officiel du **Chœur des Pays du Mont-Blanc**, accessible à l'adresse : [https://choeurdespaysdumontblanc.fr/](https://choeurdespaysdumontblanc.fr/)

## 📖 Description

Site web moderne développé avec Next.js pour présenter le Chœur des Pays du Mont-Blanc, ses activités, concerts, et permettre aux visiteurs de découvrir l'ensemble vocal.

## 🚀 Technologies utilisées

- **Framework** : [Next.js 15.5.2](https://nextjs.org/) avec Turbopack
- **Langage** : TypeScript
- **Styling** : [Tailwind CSS 4.1.13](https://tailwindcss.com/)
- **Runtime** : React 19.1.1
- **Gestionnaire de paquets** : Yarn 4.9.4
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

## 📁 Structure du projet

```
├── app/                    # Pages et layouts Next.js (App Router)
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Page d'accueil
│   └── globals.css        # Styles globaux
├── public/                # Assets statiques
├── .vscode/               # Configuration VS Code
├── .prettierrc            # Configuration Prettier
├── eslint.config.js       # Configuration ESLint
├── tailwind.config.js     # Configuration Tailwind CSS
├── tsconfig.json          # Configuration TypeScript
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

Configuration avec PostCSS pour un styling moderne et responsive. Les classes sont automatiquement triées par ordre logique grâce au plugin Prettier.

### TypeScript

Configuration stricte pour un développement robuste.

## 🚀 Déploiement

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
5. Commiter vos changements (`git commit -am 'Ajout de ma feature'`)
6. Push vers la branche (`git push origin feature/ma-feature`)
7. Ouvrir une Pull Request

### Standards de code

- Le code doit passer les vérifications ESLint sans erreurs
- Le formatage Prettier doit être respecté
- Les classes TailwindCSS doivent être triées automatiquement
- Les imports doivent être organisés et sans éléments inutiles
- La vérification TypeScript doit passer sans erreurs

## 📞 Contact

Pour toute question concernant le développement du site, contactez l'équipe de développement.

---

**Site officiel** : [https://choeurdespaysdumontblanc.fr/](https://choeurdespaysdumontblanc.fr/)
