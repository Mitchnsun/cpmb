# Recette accessibilité et responsive — CPMB-16

Recette du site refondu (milestone M5), menée sur les données réelles mises à
jour par CPMB-17.

|                    |                                                                                        |
| ------------------ | -------------------------------------------------------------------------------------- |
| **Date**           | 16 septembre 2026                                                                      |
| **Version testée** | branche `claude/hopeful-cori-kb7jd5`, build de production (`yarn build && yarn start`) |
| **Référentiel**    | WCAG 2.1 niveau AA, plus les règles WCAG 2.2 AA disponibles (`target-size`)            |
| **Résultat**       | **aucune anomalie bloquante** — 2 anomalies trouvées et corrigées, voir « Anomalies »  |

---

## 1. Méthode

### Ce qui est automatisé

`yarn audit:a11y` (`scripts/audit-a11y.mjs`) parcourt le site dans un vrai
navigateur et rejoue la recette à la demande :

- **axe-core 4.13** via `@axe-core/playwright`, Playwright 1.63, Chromium 141 ;
- **10 pages** : accueil, présentation, fiche artiste, agenda, fiche concert,
  revue de presse, article de presse, contact, mentions légales, page 404 ;
- **4 largeurs** : 390 px, 768 px, 1440 px, et 720 px qui simule le 1440 px
  affiché à 200 % ;
- **tags** `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa` et
  `best-practice` (cette dernière apporte les règles de structure : hiérarchie
  des titres, points de repère, `main` unique) ;
- **contrôles maison** en plus d'axe : défilement horizontal, unicité du `h1`,
  niveaux de titre sautés, animations encore actives sous
  `prefers-reduced-motion`, balayage clavier, piège de focus du menu mobile,
  unicité des titres de page.

```bash
yarn build
yarn start &
yarn audit:a11y            # sort en échec s'il reste une anomalie bloquante
AUDIT_JSON=rapport.json yarn audit:a11y   # + rapport détaillé en JSON
```

Deux détails de mise en œuvre, documentés dans le script : l'audit attend la
fin des animations d'entrée avant de mesurer (un texte lu en plein fondu est
à moitié transparent, et le contraste relevé n'est pas celui que le visiteur
voit), et il sert les photos depuis `public/` plutôt que par `/_next/image`
(des centaines de variantes demandées d'affilée finissent par saturer
l'optimiseur ; la mise en page, le contraste et les noms accessibles se lisent
aussi bien sur le fichier d'origine).

### Ce qui reste manuel

Une machine ne juge pas si un texte alternatif est vrai, si l'ordre de lecture
a du sens, ni le contraste d'un texte posé sur une photo — axe classe ce
dernier cas en « à vérifier » (2 à 3 occurrences par page à bandeau) plutôt
qu'en violation. Ces points ont été vérifiés à la main et sont détaillés
ci-dessous.

---

## 2. Points de contrôle du ticket

### Contrastes ≥ 4,5:1 (3:1 au-delà de 32 px)

Aucune violation relevée par axe sur les 10 pages aux 4 largeurs. Les couples
de la charte, recalculés :

| Couple                                                 | Rapport | Verdict |
| ------------------------------------------------------ | ------- | ------- |
| Texte courant `#0B0E14` sur fond `#F6F4EF`             | 17,57:1 | ✅      |
| Texte secondaire `#4A5560` sur fond `#F6F4EF`          | 6,92:1  | ✅      |
| Blanc sur turquoise `#0E6E92`                          | 5,73:1  | ✅      |
| Blanc sur turquoise survolé `#0B5876`                  | 7,86:1  | ✅      |
| Titre de section cuivre `#96511F` sur `#F6F4EF`        | 5,47:1  | ✅      |
| Lien turquoise `#0E6E92` sur `#F6F4EF`                 | 5,21:1  | ✅      |
| Lien survolé cuivre `#96511F` sur `#FFFFFF`            | 6,01:1  | ✅      |
| Texte sur fond sombre `#E6E2D9` sur `#0B0E14`          | 14,94:1 | ✅      |
| Ligne légale du pied de page `#8A94A0` sur `#0B0E14`   | 6,28:1  | ✅      |
| Sur-titre `#D9A066` sur `#0B0E14`                      | 8,44:1  | ✅      |
| Bouton sur fond sombre `#0B0E14` sur `#18A6D0`         | 6,81:1  | ✅      |
| Bouton sur fond sombre survolé `#0B0E14` sur `#D9A066` | 8,44:1  | ✅      |
| Bouton sur bandeau turquoise `#0B0E14` sur `#F6F4EF`   | 17,57:1 | ✅      |

**Texte des bandeaux, posé sur une photo.** Le voile est un dégradé de
`rgba(11,14,20,.94)` à gauche, `.8` à 60 %, `.62` à droite. Le pire cas
théorique est une zone de photo entièrement blanche :

| Position du texte      | Fond composé | Blanc (h1) | `#E6E2D9` | `#D9A066` |
| ---------------------- | ------------ | ---------- | --------- | --------- |
| Gauche (voile .94)     | `#1A1C22`    | 17,03:1    | 13,17:1   | 7,44:1    |
| Milieu (voile .80)     | `#3C3E43`    | 10,70:1    | 8,28:1    | 4,67:1    |
| Bord droit (voile .62) | `#686A6D`    | 5,42:1     | 4,20:1    | 2,37:1    |

Le sur-titre cuivre clair et le lien de retour sont calés à gauche, sous le
voile le plus dense. Seul le `h1`, en blanc, peut atteindre le bord droit
quand le titre est long : 5,42:1 dans le pire cas, au-dessus des 4,5:1 exigés
— et il s'agit d'un titre de plus de 32 px, dont le seuil est 3:1. ✅

### Cibles tactiles ≥ 44 px, boutons ≥ 48 px

Règle `target-size` (WCAG 2.2 AA) sans violation aux 4 largeurs. Le
`ButtonLink` de la charte impose `min-h-12` (48 px) et le bouton du menu
mobile `size-11` (44 px). ✅

### Navigation clavier, focus visible, aucun piège

- Balayage de 40 tabulations sur chaque page, à 390 px puis à 1440 px : chaque
  arrêt est sur un élément visible qui affiche un indicateur de focus, et la
  tabulation progresse toujours (aucune répétition en boucle). ✅
- Menu mobile (Radix Dialog via vaul) : ouverture au clavier, 12 tabulations
  qui restent dans le panneau — un piège voulu, celui d'une boîte modale —
  puis `Échap` qui referme et **rend le focus au bouton d'ouverture**. ✅
- Accordéon des saisons passées (`<details>`/`<summary>` natif) et formulaire
  de contact : parcourus par le balayage, sans blocage. ✅
- Le site ne déclare pas de style de focus : l'anneau par défaut de Chromium,
  bicolore, reste visible sur fond clair comme sur fond sombre. Voir la
  recommandation n° 1.

### `prefers-reduced-motion`

Chaque page rechargée avec `prefers-reduced-motion: reduce` : plus aucune
animation active (égaliseur de l'en-tête, tracés du héros, `fadeUp`). La règle
globale de `globals.css` fait son travail. ✅

### Rendu à 390 / 768 / 1440 px, sans défilement horizontal

Aucun débordement horizontal sur les 10 pages aux 4 largeurs — le contrôle
compare `documentElement.scrollWidth` à la largeur de fenêtre, à un pixel
près. ✅

### Hiérarchie des titres, un seul `h1`

Un `h1` par page, aucun niveau sauté. ✅ (une anomalie corrigée, voir
ci-dessous : la page 404 portait un second point de repère `main`.)

### Zoom 200 % sans perte de contenu

Simulé par la largeur 720 px, soit 1440 px affiché à 200 % : aucune violation
axe, aucun débordement, aucun contenu tronqué — le site n'a pas de media
query, les grilles fluides se replient d'elles-mêmes. ✅

### Éléments décoratifs invisibles aux lecteurs d'écran

`aria-hidden="true"` sur l'égaliseur, le voile et la crête des bandeaux, les
chevrons et les icônes (menu, fermeture, lecture/pause), le champ piège du
formulaire. Les photos porteuses de sens gardent un `alt` rédigé ; les
affiches de concert reçoivent « Affiche du concert : … ». ✅

### `lang="fr"`, titres de page distincts

`lang="fr"` sur `<html>` (règles axe `html-has-lang` et `html-lang-valid`
passantes). Les 10 titres relevés sont distincts. ✅ (une anomalie corrigée,
voir ci-dessous.)

---

## 3. Anomalies

| #   | Page | Constat                                                                                                                                                                                                                            | Gravité | Correction                                                                                                                                                      |
| --- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 404  | `not-found.tsx` ouvrait son propre `<main>` à l'intérieur du `<main id="main-content">` du layout : deux points de repère `main`, dont un imbriqué (`landmark-no-duplicate-main`, `landmark-main-is-top-level`, `landmark-unique`) | Modérée | Le contenu de la page 404 est rendu dans un fragment, comme toutes les autres pages                                                                             |
| 2   | 404  | Titre identique à celui de l'accueil : la page héritait du titre par défaut du layout                                                                                                                                              | Mineure | Titre propre « Page non trouvée », et `noindex` — une 404 répond à toutes les adresses disparues, ce sont les redirections de CPMB-18 qui doivent être trouvées |

Une troisième alerte, un contraste de 1,24:1 sur le bouton du héros, s'est
révélée être un artefact de mesure : axe lisait le bouton pendant son fondu
d'entrée, donc à moitié transparent. Le script attend désormais la fin des
animations non infinies avant de mesurer. Le contraste réel de ce bouton est
de 6,81:1.

**Après correction : 0 anomalie, sur 10 pages × 4 largeurs.**

---

## 4. Recommandations (hors périmètre de M5)

1. **Lien d'évitement.** Le layout porte déjà `id="main-content"`, mais aucun
   lien ne pointe dessus. Un « Aller au contenu » visible à la première
   tabulation ferait gagner l'en-tête complet aux utilisateurs de clavier.
   Les points de repère suffisent aujourd'hui à satisfaire la règle `bypass`,
   d'où le classement en recommandation.
2. **Style de focus propre au site.** L'anneau par défaut du navigateur est
   visible partout, mais un `:focus-visible` aux couleurs de la charte
   garantirait le même rendu sur tous les navigateurs.
3. **Relancer la recette après chaque ajout de contenu.** `yarn audit:a11y`
   est fait pour ça : une affiche sans texte alternatif ou un titre de concert
   à rallonge se voient tout de suite.
