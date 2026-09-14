# Charte graphique — Chœur des Pays du Mont-Blanc

Référence de la refonte (épic #17). Toutes les valeurs vivent dans
`app/globals.css`, dans un seul bloc `@theme` : **aucune valeur graphique ne
doit être réécrite dans un composant**. On écrit du Tailwind, jamais du CSS
sur mesure — mais pas forcément un token maison : dès que Tailwind a déjà la
bonne classe (`rounded-lg`, `text-3xl`…) ou qu'il ne manque qu'un réglage fin
(l'interligne), on **surcharge** son token plutôt que d'en créer un nouveau.
Un token maison n'est déclaré qu'en dernier recours, quand rien dans
l'échelle Tailwind ne s'en approche (les couleurs de la charte, le `clamp()`
du h1…). Voir « Règle d'ajout d'un token » en bas de page, et la table de
correspondance pour retrouver les anciens noms utilisés dans les tickets et
les pages pas encore migrées.

## Couleurs

| Token                        | Valeur    | Classes générées                      | Usage                                                     |
| ---------------------------- | --------- | ------------------------------------- | --------------------------------------------------------- |
| `--color-bg`                 | `#F6F4EF` | `bg-bg`                               | Fond de page (blanc cassé chaud)                          |
| `--color-surface`            | `#FFFFFF` | `bg-surface`                          | Cartes, cartouches partenaires, champs                    |
| `--color-border`             | `#DDD8CE` | `border-border`, `bg-border`          | Filets et séparateurs sur fond clair                      |
| `--color-stage-black`        | `#0B0E14` | `bg-stage-black`, `text-stage-black`  | Fonds sombres, texte principal                            |
| `--color-stage-surface`      | `#11161F` | `bg-stage-surface`                    | Cartes sur fond sombre (encart héros)                     |
| `--color-stage-border`       | `#2A3442` | `border-stage-border`                 | Filets sur fond sombre, portée décorative                 |
| `--color-teal`               | `#0E6E92` | `text-teal`, `bg-teal`, `border-teal` | Liens, dates à venir, bandeau « Nous rejoindre », boutons |
| `--color-teal-dark`          | `#0B5876` | `hover:bg-teal-dark`                  | Survol des boutons turquoise                              |
| `--color-teal-light`         | `#18A6D0` | `text-teal-light`, `bg-teal-light`    | Accents sur fond sombre, tracé de crête                   |
| `--color-copper`             | `#96511F` | `text-copper`, `bg-copper`            | Titres de section, concerts passés, survol des liens      |
| `--color-copper-light`       | `#D9A066` | `text-copper-light`                   | Sur-titres sur fond sombre, filets d'accent               |
| `--color-muted`              | `#4A5560` | `text-muted`                          | Texte secondaire sur fond clair                           |
| `--color-text-on-dark`       | `#E6E2D9` | `text-text-on-dark`                   | Texte courant sur fond sombre                             |
| `--color-text-on-dark-muted` | `#8A94A0` | `text-text-on-dark-muted`             | Ligne légale du pied de page                              |

`--color-background`, `--color-foreground`, `--color-muted-foreground` et
`--color-ring` sont de simples alias de ces couleurs, pour que les primitives
shadcn/ui (le drawer) n'introduisent pas une palette parallèle. `--color-muted`
n'est pas un alias : c'est une couleur de la charte à part entière, qui sert
aussi de source à `--color-muted-foreground`.

## Typographie

Les trois familles sont auto-hébergées par `next/font` dans `app/layout.tsx`,
en `font-display: swap` : le texte reste lisible pendant le chargement, il n'y
a pas de FOIT bloquant.

| Rôle                          | Classe         | Famille                          | Repli                 |
| ----------------------------- | -------------- | -------------------------------- | --------------------- |
| Titres, dates, citations      | `font-display` | Cormorant Garamond (400/500/600) | Georgia, serif        |
| Texte courant, liens, boutons | `font-body`    | Source Sans 3 (400/600)          | system-ui, sans-serif |
| Sur-titres en majuscules      | `font-mono`    | IBM Plex Mono (400)              | monospace             |

`font-body` est appliquée sur `<body>` : c'est la valeur par défaut de tout le
site.

## Échelle de titres

Un seul niveau porte un token maison : le h1. Son `clamp()` porte lui-même sa
taille mobile — 34 px à 390 px de large, jusqu'à 56 px à partir de ~1120 px de
large — et sert indifféremment à la page d'accueil et aux pages intérieures.
Aucune media query n'est nécessaire. Les autres niveaux réutilisent l'échelle
Tailwind, avec l'interligne de la charte porté par une surcharge (voir
« Surcharges de l'échelle Tailwind » ci-dessous).

| Niveau                       | Classe     | Mobile (390 px) | Desktop (1440 px) | Interligne | Graisse attendue             |
| ---------------------------- | ---------- | --------------- | ----------------- | ---------- | ---------------------------- |
| h1 (toutes pages)            | `text-h1`  | 34 px           | 56 px             | 1,10       | `font-display font-semibold` |
| h2 titres de section         | `text-3xl` | 30 px           | 30 px             | 1,20       | `font-display font-semibold` |
| h3 dates, saisons, citations | `text-2xl` | 24 px           | 24 px             | 1,25       | `font-display`               |
| h4 intertitres               | `text-xl`  | 20 px           | 20 px             | 1,30       | `font-display font-semibold` |

Les titres n'ont pas de style imposé par défaut sur les balises `h1`–`h4` : on
applique la classe voulue, ce qui laisse libre le choix du niveau sémantique
indépendamment de la taille rendue.

## Échelle de texte

Un rôle a fusionné avec le texte courant : les liens, boutons et étiquettes
partagent désormais la même taille que le corps de texte (18 px) — il n'y a
plus de distinction séparée pour eux.

| Rôle                                                                | Classe    | Taille                          | Interligne |
| ------------------------------------------------------------------- | --------- | ------------------------------- | ---------- |
| Texte courant, liens, boutons, étiquettes, colonnes du pied de page | `text-lg` | 18 px                           | 1,6        |
| Ligne légale                                                        | `text-sm` | 15 px                           | 1,6        |
| Sur-titres mono en majuscules                                       | `text-xs` | 12 px, `letter-spacing: 0.16em` | 1,4        |

Le pied de page resserre les sur-titres à `0.14em` avec `tracking-[0.14em]`.

> Seul `text-h1` est un token maison. `tailwind-merge` ignore par défaut les
> tailles hors de son échelle et les confond avec des couleurs. L'extension
> est déclarée dans `utils/classnames.ts` : passer toute composition de
> classes par `cn()`.

## Surcharges de l'échelle Tailwind

Ces réglages ne créent aucun nom : ils redéfinissent, dans le `@theme` de
`app/globals.css`, l'interligne (et pour `text-sm`, la taille elle-même)
d'une classe Tailwind qui existe déjà. C'est le premier réflexe avant de
créer un token maison — voir la règle d'ajout ci-dessous. Elles sont
globales : `text-sm` fait 15 px partout, y compris dans les primitives
shadcn/ui, il n'y a qu'une seule échelle sur le site.

| Surcharge                              | Classe     | Valeur de la charte | Défaut Tailwind              |
| -------------------------------------- | ---------- | ------------------- | ---------------------------- |
| `--text-sm` + `--text-sm--line-height` | `text-sm`  | 15 px / 1,6         | 14 px / 1,43                 |
| `--text-xs--line-height`               | `text-xs`  | 12 px / 1,4         | 12 px / 1,33                 |
| `--text-lg--line-height`               | `text-lg`  | 18 px / 1,6         | 18 px / 1,56                 |
| `--text-xl--line-height`               | `text-xl`  | 20 px / 1,3         | 20 px / 1,4                  |
| `--text-2xl--line-height`              | `text-2xl` | 24 px / 1,25        | 24 px / 1,33                 |
| `--text-3xl--line-height`              | `text-3xl` | 30 px / 1,2         | 30 px / 1,2 (déjà le défaut) |

## Table de correspondance des anciens tokens

Les tickets de l'épic #17 encore ouverts et les pages de `app/` toujours en
palette legacy ont pu être rédigés avec les anciens noms, supprimés lors de
la réduction du nombre de tokens du `@theme`. Cette table est transitoire :
elle pourra disparaître une fois la refonte terminée.

| Ancien token / classe | À écrire désormais                                                |
| --------------------- | ----------------------------------------------------------------- |
| `text-h1-hero`        | `text-h1` (fusionné — un seul niveau h1)                          |
| `text-h2`             | `text-3xl`                                                        |
| `text-h3`             | `text-2xl`                                                        |
| `text-h4`             | `text-xl`                                                         |
| `text-body`           | `text-lg`                                                         |
| `text-label`          | `text-lg` (fusionné avec le corps de texte)                       |
| `text-legal`          | `text-sm`                                                         |
| `text-overline`       | `text-xs` (toujours avec `font-mono uppercase tracking-[0.16em]`) |
| `rounded-button`      | `rounded-lg`                                                      |
| `rounded-field`       | `rounded-md`                                                      |
| `rounded-image`       | `rounded-sm`                                                      |
| `text-text-muted`     | `text-muted`                                                      |

## Rayons et mise en page

Les trois rayons de la charte correspondent exactement à des rayons Tailwind
natifs — pas de surcharge, pas de token, on écrit directement la classe.

| Rôle    | Valeur | Classe       | Usage                |
| ------- | ------ | ------------ | -------------------- |
| Boutons | 8 px   | `rounded-lg` | Boutons              |
| Champs  | 6 px   | `rounded-md` | Champs de formulaire |
| Images  | 4 px   | `rounded-sm` | Images et cartes     |

| Token               | Valeur  | Classe                | Usage                                 |
| ------------------- | ------- | --------------------- | ------------------------------------- |
| `--container-site`  | 1536 px | `max-w-site`          | Conteneur : `max-w-site mx-auto px-6` |
| `--breakpoint-menu` | 700 px  | `menu:` / `max-menu:` | Bascule du menu mobile                |

Rythme vertical : `py-14` (56 px) pour les bandeaux, `py-16` à `py-20`
(64–80 px) pour les sections de contenu.

Grilles fluides, sans media query :
`grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-10` — le passage en une
colonne se fait tout seul.

Séparateurs de liste : une grille en `gap-px` sur `bg-border`, chaque item en
`bg-bg` ou `bg-surface`. Les filets sont les interstices, pas des bordures.

## Animations

Les quatre `@keyframes` (`staffDraw`, `ridgeDraw`, `breathe`, `fadeUp`) vivent
dans `app/globals.css` et s'utilisent via `animate-staff-draw`,
`animate-ridge-draw`, `animate-breathe`, `animate-fade-up`. Les durées et
retards propres à chaque barre de l'égaliseur sont passés en style en ligne :
ce sont des données, pas de la mise en forme.

Une règle globale `@media (prefers-reduced-motion: reduce) { * { animation:
none !important } }` arrête toutes les animations du site.

Aucune animation n'est déclenchée au défilement : seuls l'égaliseur de
l'en-tête (en boucle) et le tracé + `fadeUp` du héros s'animent, au chargement.

## Bibliothèque de médias

`assets/contents/medias.ts` est le point d'entrée unique des visuels
éditoriaux : chemin, `alt` rédigé, dimensions natives, cadrage voulu et
priorité de chargement. Les affiches de concert restent portées par le champ
`media` de `assets/contents/concerts.json`.

`next/image` sert automatiquement de l'AVIF/WebP avec repli JPEG et génère le
`srcset` aux largeurs déclarées dans `next.config.ts` (640, 750, 828, 1024,
1440, 1920). Une seule image du site est prioritaire — le héros de l'accueil —
toutes les autres sont différées.

## Règle d'ajout d'un token

Avant d'ajouter un token dans le `@theme` de `app/globals.css`, vérifier
qu'il n'existe pas de correspondance dans l'échelle Tailwind
(`node_modules/tailwindcss/theme.css` fait foi). Trois cas, dans cet ordre :

1. **La valeur existe déjà chez Tailwind** → ne rien ajouter, utiliser la
   classe native (`rounded-lg`, `text-3xl`…).
2. **La taille existe mais un détail diffère** (interligne, graisse,
   approche) → surcharger le token Tailwind (`--text-lg--line-height`), ce
   qui n'ajoute aucun nom au namespace.
3. **Aucune correspondance** (couleurs de la charte, `clamp()` du h1,
   `--container-site`, `--breakpoint-menu`, animations) → alors seulement
   créer un token, le documenter dans ce fichier, et s'il s'agit d'un
   `text-*`, l'ajouter à `extendTailwindMerge` dans `utils/classnames.ts`
   sans quoi `tailwind-merge` le supprimera silencieusement.
