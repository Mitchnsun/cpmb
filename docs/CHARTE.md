# Charte graphique — Chœur des Pays du Mont-Blanc

Référence de la refonte (épic #17). Toutes les valeurs vivent dans
`app/globals.css`, dans un seul bloc `@theme` : **aucune valeur graphique ne
doit être réécrite dans un composant**. Chaque token y devient une classe
Tailwind, donc on écrit du Tailwind, jamais du CSS sur mesure.

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
| `--color-text-muted`         | `#4A5560` | `text-text-muted`                     | Texte secondaire sur fond clair                           |
| `--color-text-on-dark`       | `#E6E2D9` | `text-text-on-dark`                   | Texte courant sur fond sombre                             |
| `--color-text-on-dark-muted` | `#8A94A0` | `text-text-on-dark-muted`             | Ligne légale du pied de page                              |

`--color-background`, `--color-foreground`, `--color-muted`,
`--color-muted-foreground` et `--color-ring` sont de simples alias de ces
couleurs, pour que les primitives shadcn/ui (le drawer) n'introduisent pas une
palette parallèle.

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

Les `clamp()` portent eux-mêmes la taille mobile : la première valeur est celle
rendue à 390 px, la dernière celle atteinte à partir de ~1120 px de large.
Aucune media query n'est nécessaire.

| Niveau                       | Classe         | Mobile (390 px) | Desktop (1440 px) | Interligne | Graisse attendue             |
| ---------------------------- | -------------- | --------------- | ----------------- | ---------- | ---------------------------- |
| h1 accueil                   | `text-h1-hero` | 34 px           | 56 px             | 1,08       | `font-display font-semibold` |
| h1 pages intérieures         | `text-h1`      | 34 px           | 50 px             | 1,10       | `font-display font-semibold` |
| h2 titres de section         | `text-h2`      | 30 px           | 30 px             | 1,20       | `font-display font-semibold` |
| h3 dates, saisons, citations | `text-h3`      | 24 px           | 24 px             | 1,25       | `font-display`               |
| h4 intertitres               | `text-h4`      | 20 px           | 20 px             | 1,30       | `font-display font-semibold` |

Les titres n'ont pas de style imposé par défaut sur les balises `h1`–`h4` : on
applique la classe voulue, ce qui laisse libre le choix du niveau sémantique
indépendamment de la taille rendue.

## Échelle de texte

| Rôle                                                 | Classe          | Taille                          | Interligne |
| ---------------------------------------------------- | --------------- | ------------------------------- | ---------- |
| Texte courant                                        | `text-body`     | 18 px                           | 1,6        |
| Liens, boutons, étiquettes, colonnes du pied de page | `text-label`    | 17 px                           | 1,6        |
| Ligne légale                                         | `text-legal`    | 15 px                           | 1,6        |
| Sur-titres mono en majuscules                        | `text-overline` | 12 px, `letter-spacing: 0.16em` | 1,4        |

Le pied de page resserre les sur-titres à `0.14em` avec `tracking-[0.14em]`.

> `tailwind-merge` ignore par défaut ces tailles de texte sur mesure et les
> confond avec des couleurs. L'extension est déclarée dans
> `utils/classnames.ts` : passer toute composition de classes par `cn()`.

## Rayons et mise en page

| Token               | Valeur  | Classe                | Usage                                 |
| ------------------- | ------- | --------------------- | ------------------------------------- |
| `--radius-button`   | 8 px    | `rounded-button`      | Boutons                               |
| `--radius-field`    | 6 px    | `rounded-field`       | Champs de formulaire                  |
| `--radius-image`    | 4 px    | `rounded-image`       | Images et cartes                      |
| `--container-site`  | 1180 px | `max-w-site`          | Conteneur : `max-w-site mx-auto px-6` |
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
