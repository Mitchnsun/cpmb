# Guide d'édition du site — à l'usage du bureau

Ce guide explique comment publier un concert, une affiche ou un article sans
aide extérieure. Il ne demande aucune connaissance technique : tout le contenu
du site tient dans quelques fichiers, modifiables depuis le navigateur.

> **Principe à retenir.** Le site n'a pas d'interface d'administration et pas
> de base de données. Le contenu vit dans des fichiers texte du dépôt GitHub
> `Mitchnsun/cpmb`. Enregistrer une modification déclenche la reconstruction
> du site, mis en ligne quelques minutes plus tard.

---

## 1. Où vit quoi

| Ce que vous voulez changer                                   | Fichier                                                      |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| Les concerts (à venir et passés)                             | `assets/contents/concerts.json`                              |
| Les affiches de concert                                      | dossier `public/concerts/`                                   |
| Les articles de presse                                       | `assets/contents/articles.json` + dossier `public/articles/` |
| Le chef de chœur et les instrumentistes                      | `assets/contents/artists.json`                               |
| Les partenaires du bas de la page d'accueil                  | `assets/contents/medias.ts`                                  |
| Les photos du diaporama de la présentation                   | `assets/contents/carrousel.ts` + `public/carrousel/`         |
| Les textes de présentation, de contact, les mentions légales | pages dans `app/` — demander à un développeur                |

---

## 2. Ajouter un concert

### Étape 1 — préparer l'affiche (facultatif)

- Format **JPG** ou **PNG**, largeur conseillée **1080 px minimum**.
- Nom du fichier en minuscules, sans accent ni espace, les mots séparés par
  des traits d'union. Exemple :
  `affiche-concert-de-noel-12-decembre-2026-gaillard.jpg`.
- Un concert **peut être publié sans affiche** : la fiche s'affiche alors sans
  visuel, et l'affiche pourra être ajoutée plus tard.

### Étape 2 — déposer l'affiche

Sur GitHub : ouvrir le dossier `public/concerts/`, bouton **Add file →
Upload files**, glisser le fichier, puis **Commit changes**.

### Étape 3 — ajouter la fiche du concert

Ouvrir `assets/contents/concerts.json`, cliquer sur le crayon ✏️, et ajouter
un bloc **tout en haut de la liste**, juste après le `[` de la première ligne :

```json
  {
    "title": "Concert de Noël, 12 décembre 2026, Gaillard",
    "slug": "concert-de-noel-12-decembre-2026-gaillard",
    "date": ["2026-12-12T20:00:00+01:00"],
    "location": "Église Saint-Pierre, Gaillard, France",
    "media": "/concerts/affiche-concert-de-noel-12-decembre-2026-gaillard.jpg",
    "description": "Le Chœur des Pays du Mont-Blanc, dirigé par Benoît Dubu, propose un concert de Noël à l'église Saint-Pierre.",
    "programme": ["Magnificat — Jean-Sébastien Bach", "Chants de Noël"],
    "performers": ["Benoît Dubu, direction", "Damien Desbenoit, orgue"]
  },
```

⚠️ **Ne pas oublier la virgule** à la fin du bloc : chaque fiche est séparée
de la suivante par une virgule, sauf la toute dernière de la liste.

### Les champs, un par un

| Champ         | Obligatoire | Règle                                                                                                                                                                                                                                                                                     |
| ------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`       | oui         | Le titre affiché. Il sert aussi de texte alternatif à l'affiche : l'écrire descriptif (œuvre, date, lieu).                                                                                                                                                                                |
| `slug`        | oui         | L'adresse de la page : `choeurdespaysdumontblanc.fr/nos-concerts/<slug>`. **Minuscules, chiffres et traits d'union uniquement**, pas d'accent, pas d'espace. Jamais deux fois le même sur le site, et **on ne le modifie plus** une fois publié, sous peine de casser les liens partagés. |
| `date`        | oui         | Toujours **entre crochets**, même pour une seule date. Voir ci-dessous.                                                                                                                                                                                                                   |
| `location`    | oui         | Lieu puis commune puis pays : `"Église Saint-Pierre, Gaillard, France"`. C'est cette ligne que Google lit pour situer l'événement, d'où l'ordre.                                                                                                                                          |
| `media`       | non         | Chemin de l'affiche, en commençant par `/concerts/`. À retirer complètement s'il n'y a pas d'affiche.                                                                                                                                                                                     |
| `description` | non         | Un ou plusieurs paragraphes. Pour un paragraphe suivant, écrire `\n\n` entre les deux.                                                                                                                                                                                                    |
| `programme`   | non         | Liste des œuvres, une par ligne, `"Œuvre — Compositeur"`.                                                                                                                                                                                                                                 |
| `performers`  | non         | Liste des solistes et de la direction, `"Prénom Nom, rôle"`.                                                                                                                                                                                                                              |

### Écrire une date

Deux formes acceptées :

- **avec l'heure** — `"2026-12-12T20:00:00+01:00"` : année-mois-jour, un `T`,
  puis l'heure. Le `+01:00` est l'heure française d'hiver (de fin octobre à
  fin mars) ; en été c'est `+02:00`. L'heure s'affiche sur la fiche
  (« 12 décembre 2026 à 20h00 ») ;
- **sans l'heure** — `"2026-12-12"` : à utiliser tant que l'horaire n'est pas
  arrêté. La fiche affiche alors la date seule, et le fichier agenda proposé
  au visiteur devient un événement « toute la journée ».

### Un concert donné deux fois

Un même programme donné deux soirs est **une seule fiche, deux dates** — pas
deux fiches :

```json
  {
    "title": "Concert autour de la Misa Criolla, 7 et 28 juin 2027, Vongy et Boëge",
    "slug": "concert-autour-de-la-misa-criolla-7-et-28-juin-2027-vongy-et-boege",
    "date": ["2027-06-07T20:30:00+02:00", "2027-06-28T18:00:00+02:00"],
    "location": "Vongy et Boëge, France",
    "description": "…"
  },
```

Le site s'occupe du reste : les deux dates sont listées sur la fiche, le
fichier agenda contient deux événements, et le concert reste annoncé comme
« à venir » **tant que la dernière des deux dates n'est pas passée**.

### Étape 4 — enregistrer

En bas de la page GitHub : **Commit changes**, un court message
(« ajout du concert de Noël 2026 »), puis valider.

Un contrôle automatique se déclenche. En cas d'erreur, GitHub affiche une
croix rouge ❌ : ouvrir le détail, le message indique le champ fautif. Les
erreurs les plus fréquentes sont listées au chapitre 7.

---

## 3. L'affiche et son texte alternatif

Le **texte alternatif** est la phrase lue par un lecteur d'écran, et affichée
si l'image ne charge pas. Sur les affiches de concert, il est **construit
automatiquement** à partir du titre :

> `title` : « Concert de Noël, 12 décembre 2026, Gaillard »
> texte alternatif : « Affiche du concert : Concert de Noël, 12 décembre 2026, Gaillard »

Il n'y a donc rien à écrire de plus — mais c'est la raison pour laquelle le
titre doit être descriptif. « Concert de Noël » tout court, répété chaque
année, ne dit rien à quelqu'un qui ne voit pas l'affiche.

Pour les **photos** (diaporama, bandeaux, portraits), le texte alternatif est
écrit à la main dans le fichier correspondant, dans le champ `alt` : décrire
ce que montre la photo, pas ce qu'elle illustre.

---

## 4. Ce qui se passe tout seul quand une date passe

Aucune manipulation n'est nécessaire lorsqu'un concert a eu lieu : **rien
n'est à déplacer, rien n'est à archiver**. Le site relit les dates et se
réorganise, au plus tard une heure après **minuit, heure de Paris**, le
lendemain du concert.

Concrètement, cette nuit-là :

| Où                          | Avant la date                                                | Après la date                                     |
| --------------------------- | ------------------------------------------------------------ | ------------------------------------------------- |
| Encart du haut de l'accueil | « Prochain concert », avec la date et le lieu                | l'encart laisse la place au dernier concert donné |
| Liste de dates de l'accueil | les 3 prochains concerts                                     | les 3 derniers concerts donnés                    |
| Page « Nos concerts »       | dans la section du haut, « à venir »                         | descendu dans l'accordéon des saisons passées     |
| Fiche du concert            | mention « Concert à venir », bouton **Ajouter à mon agenda** | mention « Concert passé », le bouton disparaît    |

**La saison** est calculée elle aussi : elle court du 1er septembre au 31
août. Un concert de décembre 2026 se range donc dans « 2026 – 2027 ».

S'il ne reste aucun concert à venir, la page d'accueil et l'agenda basculent
d'eux-mêmes dans leur version « pas de date annoncée » : c'est le signal qu'il
est temps d'ajouter la saison suivante.

---

## 5. Mettre à jour les partenaires

Les logos du bas de la page d'accueil sont déclarés dans
`assets/contents/medias.ts`, dans la liste `PARTNER_LOGOS`. Déposer d'abord
le logo à la racine de `public/`, puis ajouter le bloc :

```ts
  {
    name: "Ville de Gaillard",
    href: "https://www.gaillard.fr/",
    src: "/logo-gaillard.png",
    alt: "Ville de Gaillard",
    width: 3570,
    height: 1111,
    maxHeight: 56,
    sizes: "200px",
  },
```

- `width` et `height` sont les **dimensions réelles du fichier** (clic droit →
  Informations / Propriétés sur l'image). Elles réservent la place du logo
  pendant le chargement ; fausses, elles font sauter la mise en page.
- `maxHeight` est la hauteur d'affichage en pixels : c'est le réglage à
  ajuster pour qu'un logo ne paraisse ni écrasé ni démesuré à côté des autres.
- `alt` est le nom du partenaire, rien de plus — pas « logo de… ».

Retirer un partenaire, c'est supprimer son bloc ; le fichier image peut
rester, il ne gêne pas.

---

## 6. Où arrivent les messages du formulaire de contact

Le formulaire de la page Contact **n'envoie rien par lui-même** et
n'enregistre rien : quand le visiteur valide, le site prépare un courriel
dans **son propre logiciel de messagerie**, déjà adressé à
**bureau@choeurdespaysdumontblanc.fr**, avec l'objet choisi, ses coordonnées
et son message. C'est lui qui appuie sur « Envoyer ».

Ce qu'il faut en retenir :

- les messages arrivent dans la **boîte bureau@choeurdespaysdumontblanc.fr**,
  comme n'importe quel courriel — c'est cette boîte qu'il faut relever ;
- le site ne conserve **aucune trace** d'un message : rien à consulter, rien
  à purger, et rien à déclarer côté RGPD pour ce formulaire ;
- si un visiteur n'a pas de logiciel de messagerie configuré, la page lui
  affiche l'adresse en clair pour qu'il écrive depuis son webmail ;
- l'adresse est donc **le seul point d'entrée** : si elle change, prévenir un
  développeur, elle est écrite à un seul endroit du code.

---

## 7. Vérifier avant de publier

Un contrôle automatique tourne à chaque modification du contenu. Il vérifie
que chaque concert a un titre, un identifiant valide et unique, au moins une
date lisible, un lieu, et que l'affiche déclarée existe bien dans le dépôt.

Les erreurs les plus fréquentes, et leur traduction :

| Message                                          | Ce qu'il faut corriger                                                                                                  |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `Slug must be URL-friendly`                      | Le `slug` contient une majuscule, un accent ou un espace                                                                |
| `Duplicate slug "…" found`                       | Deux concerts portent le même identifiant : en changer un                                                               |
| `Date is required and must be a non-empty array` | La date n'est pas entre crochets, ou la liste est vide                                                                  |
| `Date must be a valid ISO date string`           | La date n'est pas au format `AAAA-MM-JJ`                                                                                |
| `Media file not found: public/concerts/…`        | Le nom du fichier dans `media` ne correspond pas au fichier déposé (souvent une majuscule ou `.jpeg` au lieu de `.jpg`) |
| `Title is required…`, `Location is required…`    | Un champ obligatoire est vide                                                                                           |
| Erreur de syntaxe JSON                           | Presque toujours une **virgule** en trop à la fin de la liste, ou manquante entre deux fiches                           |

Sur un poste préparé par un développeur, la même vérification se lance
localement avec `yarn validate`.

---

## 8. Mémo

- Une fiche = un concert, même s'il est donné plusieurs fois.
- Les dates sont toujours entre crochets.
- Le `slug` ne change jamais après publication.
- Un titre descriptif vaut texte alternatif pour l'affiche.
- Rien à archiver : le passage d'une date est automatique.
- Les messages du formulaire arrivent dans la boîte du bureau, pas sur le site.
