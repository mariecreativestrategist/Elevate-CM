# Personnaliser le site — guide complet pour débutant·e

Ce guide explique comment adapter le site à ta marque (mot de passe, nom, logo, couleurs) **sans rien installer** — tout se passe dans le navigateur, directement sur GitHub (là où le code est rangé) et sur le site lui-même.

*(Si le site n'est pas encore installé/en ligne, commence par [DEPLOY.md](DEPLOY.md).)*

## Comment ça marche

Ton code vit dans un dépôt GitHub (ta propre copie, créée pendant le déploiement). GitHub permet d'éditer un fichier **directement dans le navigateur** :

1. Va sur la page du dépôt, clique sur le fichier à modifier.
2. Clique sur l'icône **crayon** (✏️) en haut à droite de l'aperçu du fichier — le contenu devient modifiable.
3. Fais ton changement.
4. Fais défiler tout en bas de la page → un encart "Commit changes" apparaît → clique le bouton vert **Commit changes** (les options par défaut conviennent).

Dès que tu valides, **Vercel redéploie automatiquement le site** avec ce changement (1 à 2 minutes). Pas d'autre action nécessaire.

---

## 1. Changer le mot de passe administrateur

**À faire en tout premier**, avant d'utiliser le site pour de vrai. Ça ne se passe pas dans le code, mais directement sur le site :

1. Ouvre le site dans ton navigateur, connecte-toi avec les identifiants de démarrage (`admin@exemple.com` / `changeme123`, ou ceux qu'on t'a transmis).
2. Menu de gauche : **Paramètres**.
3. Change ton nom, ton e-mail de connexion si tu veux, et choisis un nouveau mot de passe (8 caractères minimum).
4. Clique sur les boutons "Enregistrer" / "Changer le mot de passe".

---

## 2. Changer le nom du site

1. Va sur la page de ton dépôt GitHub, ouvre le dossier **`lib`**, clique sur le fichier **`config.ts`**.
2. Clique sur l'icône crayon (✏️) en haut à droite.
3. Tu vois ces deux lignes tout en haut :
   ```ts
   export const SITE_NAME = "Cadence";
   export const SITE_TAGLINE = "Espace de collaboration entre l'agence et ses marques.";
   ```
4. Remplace le texte entre guillemets `"Cadence"` par le nom que tu veux. **Garde bien les guillemets** `"` et le point-virgule `;` à la fin de la ligne.
5. Fais défiler en bas de la page, clique **Commit changes**.

Ce nom se met à jour automatiquement partout : titre de l'onglet du navigateur, menu de gauche, écrans de connexion, texte des e-mails automatiques.

---

## 3. Changer le logo

Par défaut, le site affiche le **nom en texte** (jolie police), pas une image. Pour utiliser ton propre logo :

1. Sur la page de ton dépôt GitHub, ouvre le dossier **`public`**.
2. Clique le bouton **Add file → Upload files** (en haut à droite).
3. Glisse ton fichier logo (idéalement `.svg` ou `.png`, fond transparent) dans la zone qui apparaît. Note bien son nom exact (ex: `logo.svg`).
4. Fais défiler en bas, clique **Commit changes**.
5. Retourne dans `lib/config.ts` (comme à l'étape 2), clique sur le crayon ✏️.
6. Trouve cette ligne :
   ```ts
   export const LOGO_IMAGE_PATH: string | null = null;
   ```
7. Remplace `null` par le nom de ton fichier, entre guillemets et précédé d'une barre oblique `/` :
   ```ts
   export const LOGO_IMAGE_PATH: string | null = "/logo.svg";
   ```
8. **Commit changes.**

**Point d'attention** : ce même logo est utilisé sur fond sombre (le menu de gauche) et sur fond clair (les écrans de connexion) — choisis une image lisible dans les deux cas.

Pour revenir au texte : remets `null` (sans guillemets) à la place du nom de fichier.

---

## 4. Changer les couleurs

1. Sur ton dépôt GitHub, ouvre le dossier **`app`**, clique sur **`globals.css`**, puis sur le crayon ✏️.
2. Tout en haut du fichier, bloc `:root {` :
   ```css
   --ink: #201626;
   --paper: #faf6f1;
   --magenta: #c4267a;
   --corail: #ff8b6b;
   --sauge: #748a6c;
   --butter: #f4c95d;
   ```
3. Voici à quoi correspond chaque couleur :

| Nom | Ce qu'elle colore | Couleur actuelle |
|---|---|---|
| `--ink` | Fond du menu de gauche + texte principal | `#201626` — violet très foncé, presque noir |
| `--paper` | Fond général des pages | `#faf6f1` — blanc cassé |
| `--magenta` | Couleur "signature" — boutons, liens, éléments sélectionnés | `#c4267a` — rose/magenta vif |
| `--corail` | Couleur secondaire (calendrier, badges) | `#ff8b6b` — corail |
| `--sauge` | Couleur secondaire (badges "positifs") | `#748a6c` — vert sauge |
| `--butter` | Couleur secondaire (badges "en attente") | `#f4c95d` — jaune |

4. Pour trouver le code d'une couleur : va sur [htmlcolorcodes.com](https://htmlcolorcodes.com), choisis ta couleur visuellement, copie le code affiché (ex: `#3B82F6`).
5. Remplace juste le code après le `#` (garde le `#` et le `;`).
6. Un peu plus bas, les versions `-tint` de chaque couleur sont des variantes pâles (pour les petits badges) — si tu changes une couleur principale, éclaircis-la aussi pour sa version `-tint`.
7. **Commit changes.**

> 💡 Change une seule couleur à la fois, valide, regarde le résultat sur le site (redéploiement automatique, 1-2 min), puis passe à la suivante.

---

## Récapitulatif — où aller pour changer quoi

| Je veux changer... | Où aller |
|---|---|
| Mon mot de passe admin | Directement sur le site → **Paramètres** |
| Le nom du site | Dépôt GitHub → `lib/config.ts` |
| Le logo | Dépôt GitHub → dossier `public` + `lib/config.ts` |
| Les couleurs | Dépôt GitHub → `app/globals.css` |

## En cas de blocage

- **Je ne trouve pas le bouton crayon** : il apparaît seulement quand tu es connecté·e à GitHub et que tu as un accès en écriture sur le dépôt (normal si c'est ta propre copie créée pendant le déploiement).
- **Après "Commit changes", rien ne semble avoir changé sur le site** : attends 1-2 minutes (redéploiement automatique), regarde l'onglet **Deployments** de ton projet sur [vercel.com](https://vercel.com) pour voir si c'est en cours, puis actualise la page du site avec `Ctrl+Shift+R` (ou `Cmd+Shift+R`) pour forcer le rechargement.
- **J'ai fait une erreur dans un fichier** : sur GitHub, ouvre le fichier concerné → onglet **History** (ou "Blame") en haut → tu peux voir et restaurer une version précédente. Ou recommence l'édition en faisant attention à ne garder que le texte demandé (guillemets, points-virgules).
