# Personnaliser le site — guide complet pour débutant·e

Ce guide explique comment adapter le site à ta marque (mot de passe, nom, logo, couleurs) **sans connaissances en programmation**. Chaque changement se fait en modifiant un texte dans un fichier — jamais de vraie "programmation".

*(Si le site n'est pas encore installé/en ligne, commence par [DEPLOY.md](DEPLOY.md).)*

## Ce qu'il te faut

- **Visual Studio Code** installé (voir DEPLOY.md si ce n'est pas déjà fait) — c'est le logiciel qui permet d'ouvrir et modifier les fichiers du site.
- Le dossier du projet ouvert dans VS Code : menu **File → Open Folder...**, sélectionne le dossier du site.

À gauche de VS Code, tu vois la liste des fichiers et dossiers du projet — c'est ce qu'on appelle l'**explorateur de fichiers**. C'est là qu'on va cliquer pour ouvrir les fichiers mentionnés dans ce guide.

---

## 1. Changer le mot de passe administrateur

**À faire en tout premier**, avant d'utiliser le site pour de vrai. Ça ne se passe pas dans le code, mais directement sur le site :

1. Ouvre le site dans ton navigateur (l'adresse Vercel, ou `localhost:3000` si tu le testes sur ton ordinateur).
2. Connecte-toi avec les identifiants qu'on t'a transmis (espace agence).
3. Dans le menu de gauche du site, clique sur **Paramètres**.
4. Change ton nom, ton e-mail de connexion si tu veux, et choisis un nouveau mot de passe (8 caractères minimum).
5. Clique sur les boutons "Enregistrer" / "Changer le mot de passe".

C'est terminé — pas besoin de toucher aux fichiers. Si tu oublies ce mot de passe plus tard, un lien "Mot de passe oublié ?" est disponible sur l'écran de connexion.

---

## 2. Changer le nom du site

Le nom actuel ("Cadence") est écrit à un seul endroit du code, ce qui le rend facile à changer partout d'un coup.

1. Dans l'explorateur de fichiers de VS Code, ouvre le dossier `lib`, puis clique sur le fichier `config.ts` pour l'ouvrir.
2. Tu vois ces deux lignes tout en haut :
   ```ts
   export const SITE_NAME = "Cadence";
   export const SITE_TAGLINE = "Espace de collaboration entre l'agence et ses marques.";
   ```
3. Remplace le texte entre guillemets `"Cadence"` par le nom que tu veux (par exemple `"NomDeLaMarque"`). **Garde bien les guillemets** `"` et le point-virgule `;` à la fin de la ligne — ne touche à rien d'autre.
4. Enregistre le fichier : `Ctrl+S` (Windows) ou `Cmd+S` (Mac).

Ce nom se met à jour automatiquement partout dans le site : titre de l'onglet du navigateur, menu de gauche, écrans de connexion, et texte des e-mails envoyés automatiquement.

`SITE_TAGLINE` est une courte phrase de description (utile pour le référencement Google) — tu peux la laisser telle quelle, ou la changer de la même façon.

---

## 3. Changer le logo

Par défaut, le site affiche le **nom en texte** (jolie police), pas une image. Pour utiliser ton propre logo :

1. Prépare ton fichier logo sur ton ordinateur (idéalement au format `.svg` ou `.png`, avec un fond transparent).
2. Dans l'explorateur de fichiers de VS Code, trouve le dossier `public` (à la racine du projet). Fais un glisser-déposer de ton fichier logo directement depuis ton ordinateur vers ce dossier `public` dans VS Code — il s'ajoute au projet. Note bien son nom exact (par exemple `logo.svg`).
3. Ouvre `lib/config.ts` (même fichier qu'à l'étape 2).
4. Trouve cette ligne :
   ```ts
   export const LOGO_IMAGE_PATH: string | null = null;
   ```
5. Remplace `null` par le nom de ton fichier, entre guillemets et précédé d'une barre oblique `/` :
   ```ts
   export const LOGO_IMAGE_PATH: string | null = "/logo.svg";
   ```
   (adapte `logo.svg` si ton fichier a un autre nom, par exemple `/mon-logo.png`)
6. Enregistre (`Ctrl+S` / `Cmd+S`).

Le logo remplace maintenant le texte partout où le nom du site apparaissait.

**Point d'attention** : ce même logo est utilisé à la fois sur fond sombre (le menu de gauche) et sur fond clair (les écrans de connexion). Choisis une image qui reste lisible dans les deux cas — par exemple un tracé qui fonctionne aussi bien en clair qu'en foncé. Si tu veux vraiment deux logos différents (un clair, un foncé), c'est possible mais ça demande une petite modification supplémentaire du code — n'hésite pas à demander de l'aide pour celle-ci.

Pour revenir à l'affichage en texte : remets `null` (sans guillemets) à la place du nom de fichier.

---

## 4. Changer les couleurs

Toutes les couleurs du site sont regroupées **au même endroit**, dans un seul fichier.

1. Dans l'explorateur de fichiers, ouvre le dossier `app`, puis clique sur le fichier `globals.css`.
2. Tout en haut du fichier, tu vois un bloc qui commence par `:root {` et qui ressemble à ça :
   ```css
   --ink: #201626;
   --paper: #faf6f1;
   --magenta: #c4267a;
   --corail: #ff8b6b;
   --sauge: #748a6c;
   --butter: #f4c95d;
   ```
3. Chaque ligne définit une couleur avec un code (ex: `#c4267a`). Voici à quoi correspond chacune :

| Nom | Ce qu'elle colore | Couleur actuelle |
|---|---|---|
| `--ink` | Le fond du menu de gauche et le texte principal | `#201626` — un violet très foncé, presque noir |
| `--paper` | Le fond général de toutes les pages | `#faf6f1` — blanc cassé, crème |
| `--magenta` | La couleur "signature" du site — boutons, liens, éléments sélectionnés | `#c4267a` — rose/magenta vif |
| `--corail` | Couleur secondaire (calendrier, badges) | `#ff8b6b` — corail/orange saumon |
| `--sauge` | Couleur secondaire (calendrier, badges "positifs" : payé, publié) | `#748a6c` — vert sauge |
| `--butter` | Couleur secondaire (badges "en attente") | `#f4c95d` — jaune beurre |

*(Pour visualiser un code couleur avant de l'utiliser, colle-le sur [htmlcolorcodes.com](https://htmlcolorcodes.com) dans la barre de recherche — le site affiche un aperçu.)*

4. Pour changer une couleur, remplace juste le code après le `#` (garde le `#` et le `;` à la fin). Tu peux trouver le code d'une couleur avec un site comme [htmlcolorcodes.com](https://htmlcolorcodes.com) : choisis ta couleur visuellement, il te donne le code à copier (ex: `#3B82F6`).
5. Un peu plus bas dans le même bloc, tu verras aussi des versions "tint" de chaque couleur (`--magenta-tint`, etc.) — ce sont des versions très pâles, utilisées pour les petits badges. Si tu changes une couleur principale, éclaircis-la aussi pour sa version `-tint` (même site htmlcolorcodes.com, choisis une teinte beaucoup plus claire de la même couleur).
6. Enregistre (`Ctrl+S` / `Cmd+S`) après chaque changement.

> 💡 Change une seule couleur à la fois, regarde le résultat, puis passe à la suivante — c'est plus facile de juger si l'ensemble est harmonieux en le voyant en vrai plutôt que de tout changer d'un coup.

---

## Voir le résultat de tes changements

### Sur ton ordinateur (avant de les rendre publics)

Dans VS Code, ouvre un terminal (menu **Terminal → New Terminal**), tape :
```bash
npm run dev
```
Attends le mot `Ready`, puis ouvre [http://localhost:3000](http://localhost:3000) dans ton navigateur. Chaque fois que tu enregistres un fichier modifié, la page se met à jour automatiquement — pas besoin de relancer la commande. Pour arrêter, reviens dans le terminal et appuie sur `Ctrl+C`.

### Pour que tout le monde les voie (site en ligne sur Vercel)

Une fois satisfait·e du résultat en local, il faut envoyer les changements en ligne. Dans le terminal :
```bash
git add .
git commit -m "Personnalisation : nom, logo, couleurs"
git push
```
Vercel détecte automatiquement ce nouvel envoi et redéploie le site tout seul (2-3 minutes) — rien d'autre à faire. Tu peux suivre l'avancement sur [vercel.com](https://vercel.com), dans l'onglet **Deployments** de ton projet.

---

## Récapitulatif — où aller pour changer quoi

| Je veux changer... | Où aller |
|---|---|
| Mon mot de passe admin | Directement sur le site → **Paramètres** |
| Le nom du site | Fichier `lib/config.ts` |
| Le logo | Fichier `lib/config.ts` + déposer l'image dans le dossier `public` |
| Les couleurs | Fichier `app/globals.css`, tout en haut |

## En cas de blocage

- **Je ne trouve pas le fichier mentionné** : utilise la recherche de VS Code (`Ctrl+P` / `Cmd+P`), tape le début du nom du fichier (ex: `config.ts`), il apparaît dans une liste — clique dessus.
- **J'ai fait une erreur et le site ne s'affiche plus / affiche un message rouge** : dans VS Code, `Ctrl+Z` (ou `Cmd+Z`) annule ta dernière modification dans le fichier ouvert. Recommence l'étape en faisant plus attention à ne garder que le texte demandé (guillemets, points-virgules).
- **Après `git push`, rien ne semble avoir changé sur le site en ligne** : attends 2-3 minutes (le temps du redéploiement automatique), puis actualise la page avec `Ctrl+Shift+R` (ou `Cmd+Shift+R`) pour forcer le navigateur à recharger sans utiliser sa mémoire.
