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
- **11 pages** : accueil, présentation, fiche artiste, agenda, **deux** fiches
  concert — une avec affiche, programme et distribution, une sans rien de tout
  cela, les deux moitiés facultatives du gabarit —, revue de presse, article
  de presse, contact, mentions légales, page 404 ;
- **4 largeurs** : 390 px, 768 px, 1440 px, et 720 px qui simule le 1440 px
  affiché à 200 % ;
- **tags** `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa` et
  `best-practice` (cette dernière apporte les règles de structure : hiérarchie
  des titres, points de repère, `main` unique) ;
- **contrôles maison** en plus d'axe : taille réelle des cibles tactiles
  (44 px, mesurée par pointage), défilement horizontal, unicité du `h1`,
  niveaux de titre sautés, animations encore actives sous
  `prefers-reduced-motion`, balayage clavier jusqu'à la sortie de la page et
  détection des boucles de focus, pièges de focus des deux boîtes modales —
  menu mobile et visionneuse photo, cette dernière ouverte puis auditée
  couche déployée —, unicité des titres de page.

```bash
yarn audit:a11y:setup      # télécharge Chromium, une fois par machine
yarn build
yarn start &
yarn audit:a11y            # sort en échec s'il reste une anomalie bloquante
AUDIT_JSON=rapport.json yarn audit:a11y   # + rapport détaillé en JSON
```

Installer le paquet `playwright` ne télécharge pas de navigateur : c'est
l'étape `audit:a11y:setup`. Sur une machine qui en a déjà un,
`CHROMIUM_PATH=/chemin/vers/chromium` évite le téléchargement.

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

Aucune violation relevée par axe sur les 11 pages aux 4 largeurs. Les couples
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

La règle `target-size` d'axe ne suffit pas ici : WCAG 2.2 exige 24 px, la
charte 44. Une première version de cette recette s'appuyait sur elle et
concluait à tort ; le contrôle est désormais explicite, et il mesure la
**zone atteinte par le doigt**, pas la boîte CSS — un lien peut être agrandi
par du remplissage, par une boîte plus haute ou par un calque, et seule une
mesure par pointage les couvre toutes : depuis le centre du contrôle, les
points situés à 22 px doivent encore l'atteindre.

**Dans les deux sens**, parce qu'un doigt est rond : un contrôle de 44 px de
haut et de 20 px de large est aussi difficile à viser que l'inverse, et
`TOUCH_TARGET` ne fait grandir que la hauteur — n'interroger que celle-ci
aurait certifié une dimension pour deux. Aucune cible du site n'est en défaut
sur la largeur : la plus étroite mesure exactement 44 px (les pastilles de la
galerie et le bouton du menu, `h-11 w-11`). Vérifié en étranglant ces
pastilles à 20 px de large sans toucher à leur hauteur : la règle à deux
dimensions en relève six, celle par la hauteur seule n'en voyait aucune. Un
échec nomme désormais la dimension fautive.

Ce contrôle a trouvé une cinquantaine de liens autonomes entre 23 et 30 px —
plan du site et partenaires du pied de page, liste de la revue de presse,
liens « Voir le concert » de l'accordéon, « Tous les concerts », lien de
retour des bandeaux, adresse e-mail. Tous corrigés : `TOUCH_TARGET`
(`components/TextLink.tsx`) pose un calque de 44 px centré sur le lien.

Le calque plutôt qu'une boîte plus haute, parce que le soulignement de la
charte est un `border-bottom` : grandir la boîte l'aurait décollé du texte.
Le lien garde donc sa taille, son rythme et son trait ; seul le doigt gagne
la hauteur. Deux conséquences assumées, visibles : l'écart des colonnes du
pied de page passe de 10 à 16 px et celui de la liste de presse de 12 à
20 px, faute de quoi deux cibles voisines se chevaucheraient et un appui près
du bord atteindrait le mauvais lien.

Exceptions, comme WCAG 2.2 les prévoit (2.5.8) : un lien à l'intérieur d'une
phrase, dont la taille est fixée par le texte qui l'entoure — l'agrandir
recouvrirait ce texte. Le `ButtonLink` de la charte (48 px) et le bouton du
menu mobile (44 px) satisfaisaient déjà leur seuil.

Vérifié aussi dans l'autre sens : le contrôle neutralisé sur la page Presse,
20 cibles trop petites réapparaissent immédiatement — il ne passe pas à côté
de ce qu'il prétend mesurer. ✅

### Navigation clavier, focus visible, aucun piège

- Balayage à la tabulation sur chaque page, à 390 px puis à 1440 px, jusqu'à
  la sortie de la page — au-delà du dernier contrôle, le navigateur rend le
  focus au document, et c'est la seule fin acceptée : chaque page y parvient
  (l'agenda compte une soixantaine d'arrêts). Chaque arrêt est sur un élément
  visible qui affiche un indicateur de focus. ✅
- Aucun piège : revenir deux fois sur le même élément avant cette sortie
  signale un circuit fermé, qu'il s'agisse d'un contrôle qui se garde ou d'un
  composant qui fait tourner le focus sur plusieurs — les deux se ressemblent
  pour qui reste appuyé sur Tab. Le détecteur est vérifié contre un vrai
  piège du site, le menu mobile ouvert, dont il relève la boucle de quatre
  éléments. ✅
- Menu mobile (Radix Dialog via vaul) : ouverture au clavier, 12 tabulations
  qui restent dans le panneau — un piège voulu, celui d'une boîte modale —
  puis `Échap` qui referme et **rend le focus au bouton d'ouverture**. ✅
- Visionneuse photo (Radix Dialog) : la couche n'existe pas tant qu'une photo
  n'est pas ouverte, donc toutes les passes sur la page au repos la
  contournaient. Elle est maintenant ouverte au clavier puis auditée comme
  une page — axe, cibles tactiles, débordement — avant les 12 tabulations
  qui doivent rester dedans, `Échap`, et le retour du focus sur la photo qui
  l'a ouverte. Vérifié dans les deux sens : rien à signaler en l'état, et la
  passe relève aussitôt un `button-name` si l'on prive le bouton de
  fermeture de son nom. ✅
- Pour les deux boîtes modales, le retour du focus est **attendu**, non
  échantillonné : Radix le rend pendant le démontage de la couche, qui
  s'achève après que celle-ci a disparu. Lire `activeElement` une seule fois
  tombait donc, une passe sur quelques-unes, sur le `body` transitoire et
  annonçait un focus perdu là où il revenait en 25 ms. Une passe qui ne
  signale un défaut qu'une fois sur cinq est pire qu'une passe absente : elle
  apprend à relancer jusqu'au vert. Le retour est désormais attendu jusqu'à
  2 s, ce qui ne coûte ce délai que lorsqu'il n'arrive jamais. ✅
- Et il est comparé **au déclencheur lui-même**, par identité, non à son
  libellé : les six diapositives de la galerie s'appellent toutes
  « Agrandir la photo : … », donc une restitution atterrissant sur une
  voisine — `aria-hidden` et hors du parcours de tabulation, puisque seule
  celle à l'écran y figure — satisfaisait une règle écrite sur le nom tout en
  laissant le visiteur là où il n'est jamais allé. Démontré en détournant la
  restitution vers une autre diapositive : la règle par identité la refuse,
  celle par libellé l'acceptait. ✅
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

Aucun débordement horizontal sur les 11 pages aux 4 largeurs — le contrôle
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
passantes). Les 11 titres relevés sont distincts. ✅ (une anomalie corrigée,
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

**Après correction : 0 anomalie, sur 11 pages × 4 largeurs.**

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
