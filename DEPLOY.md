# Mettre le site en ligne — guide complet pour débutant·e

Ce guide part du principe que **tu n'as jamais programmé**. Chaque étape explique quoi cliquer, quoi taper, et à quoi doit ressembler le résultat. Ne saute pas d'étape, même si elle te semble évidente — l'ordre compte.

Compte environ **1h à 1h30** la première fois (tranquillement, sans se presser).

## Avant de commencer : le vocabulaire de base

- **Terminal** : une fenêtre où on tape des commandes au clavier au lieu de cliquer sur des boutons. Ça fait peur au début, mais on ne fera que copier-coller des lignes toutes prêtes.
- **Éditeur de code** : un logiciel pour ouvrir et modifier les fichiers du site (un peu comme Word, mais pour le code). On utilise **Visual Studio Code** (gratuit).
- **Dépôt Git / GitHub** : une copie du code du site stockée en ligne, qui permet à Vercel de le récupérer pour le mettre en ligne.
- **Variable d'environnement** : une information secrète ou de configuration (mot de passe de la base de données, clé d'un service...) que le site va lire au démarrage. On les écrit dans un fichier appelé `.env`.
- **Déployer** : mettre le site en ligne, accessible par une adresse internet.

## Les outils à installer (une seule fois)

Télécharge et installe ces logiciels, dans cet ordre. Pour chacun, une fois téléchargé, double-clique sur le fichier et suis les instructions à l'écran (garde toutes les options par défaut, clique juste sur "Suivant"/"Next" jusqu'au bout).

1. **Visual Studio Code** → [code.visualstudio.com](https://code.visualstudio.com) → bouton "Download".
2. **Node.js** → [nodejs.org](https://nodejs.org) → télécharge la version marquée **"LTS"** (pas "Current").
3. **Git** → [git-scm.com](https://git-scm.com/downloads) → télécharge la version pour ton système.

Crée-toi ensuite un compte (gratuit) sur ces 4 sites — juste créer le compte pour l'instant, on configurera chacun au fur et à mesure :
- [github.com](https://github.com)
- [vercel.com](https://vercel.com) *(tu peux "Sign up" directement avec ton compte GitHub, c'est plus simple)*
- [supabase.com](https://supabase.com)
- [resend.com](https://resend.com)

## Ouvrir le projet et le terminal

1. Ouvre **Visual Studio Code**.
2. Menu **File → Open Folder...** (ou "Fichier → Ouvrir un dossier...") → sélectionne le dossier du projet (celui qui contient ce fichier, `DEPLOY.md`).
3. Sur la gauche, tu vois la liste de tous les fichiers du site — c'est l'explorateur de fichiers du projet.
4. En haut de VS Code : menu **Terminal → New Terminal**. Un panneau s'ouvre en bas de l'écran avec un curseur qui clignote : c'est ton terminal, déjà positionné dans le bon dossier. C'est ici que tu vas coller les commandes de ce guide.

> Pour chaque commande de ce guide (texte dans un bloc gris avec un fond foncé), clique dans le terminal, colle la commande (Ctrl+V ou clic droit → Coller), puis appuie sur **Entrée**. Laisse la commande se terminer (le curseur redevient disponible) avant de passer à la suivante.

## Installer les briques du site

Dans le terminal, colle et lance :

```bash
npm install
```

Ça télécharge tout ce dont le site a besoin pour fonctionner. Beaucoup de texte va défiler pendant 1 à 2 minutes — c'est normal, attends que ça s'arrête et que tu retrouves une ligne libre.

---

## Étape 1 — Créer le projet Supabase (la base de données)

Supabase va stocker toutes les données du site (clients, publications, factures...) et les fichiers déposés (documents, visuels).

1. Va sur [supabase.com](https://supabase.com), connecte-toi.
2. Clique **New project**.
3. Remplis :
   - **Name** : le nom que tu veux (ex: `cadence`)
   - **Database Password** : clique sur "Generate a password" pour en générer un fort, puis **copie-le et colle-le dans un fichier texte que tu gardes de côté** (bloc-notes, ou dans un gestionnaire de mots de passe) — tu en auras besoin plusieurs fois dans ce guide, et Supabase ne te le remontrera plus après.
   - **Region** : choisis la région la plus proche de tes utilisateurs (ex: `West EU (Paris)` pour la France).
4. Clique **Create new project** et attends environ 2 minutes (une barre de progression s'affiche).

## Étape 2 — Récupérer l'adresse de connexion à la base

Une fois le projet créé, tu arrives sur son tableau de bord.

1. Dans le menu de gauche, tout en bas : **Project Settings** (icône d'engrenage).
2. Puis **Database** dans le sous-menu.
3. Fais défiler jusqu'à la section **Connection string**.
4. Tu vas avoir besoin de **deux versions** de cette adresse — note-les toutes les deux dans ton fichier texte de côté :
   - Dans l'onglet **"Transaction pooler"**, copie l'adresse affichée (elle contient `:6543` et ressemble à `postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-xx-xxxx-1.pooler.supabase.com:6543/postgres`). C'est la version qu'on utilisera **au quotidien**.
   - Dans l'onglet **"Session"** ou en connexion directe (elle contient `:5432`), copie aussi cette adresse. On l'utilisera **une seule fois**, à l'étape 6.
5. Dans les deux adresses copiées, remplace le texte `[YOUR-PASSWORD]` par le mot de passe que tu as généré à l'étape 1 (juste ce mot de passe, sans les crochets).

> ⚠️ Ne confonds pas les deux : la version `:6543` (pooler) sert au site en fonctionnement normal ; la version `:5432` (directe) sert uniquement, une fois, à créer les tables de la base.

## Étape 3 — Créer l'espace de stockage des fichiers

1. Toujours dans Supabase, menu de gauche : **Storage**.
2. Clique **New bucket**.
3. Nom : `cadence-uploads` (copie-le exactement, en minuscules, avec le tiret).
4. Active l'interrupteur **Public bucket**.
5. Clique **Create bucket**.

## Étape 4 — Récupérer les clés Supabase

1. Menu de gauche : **Project Settings → API**.
2. Tu vois une section "Project URL" : copie cette adresse (elle ressemble à `https://xxxxxxxxxxxx.supabase.co`) dans ton fichier texte.
3. Un peu plus bas, section "Project API keys" : trouve la ligne **`service_role`** (attention, pas `anon` / `public` — c'est bien `service_role`). Clique sur l'icône "œil" ou "reveal" pour l'afficher, puis copie-la dans ton fichier texte.

> Cette clé `service_role` est secrète — elle donne un accès complet à ta base. Ne la mets jamais sur un site public ou dans un message partagé publiquement.

## Étape 5 — Créer un compte Resend (pour les e-mails)

1. Va sur [resend.com](https://resend.com), connecte-toi.
2. Menu de gauche : **API Keys → Create API Key**. Donne-lui un nom (ex: `cadence-prod`), clique **Add**.
3. Une clé s'affiche **une seule fois** — copie-la immédiatement dans ton fichier texte.
4. *Remarque* : sans étape supplémentaire, Resend n'autorise l'envoi qu'à l'adresse e-mail de ton propre compte (mode test). Pour envoyer de vrais e-mails à tes clients, il faut vérifier un nom de domaine (menu **Domains → Add Domain**, puis suivre les instructions pour ajouter des enregistrements chez ton fournisseur de domaine — demande de l'aide si tu n'as jamais fait ça). **Tu peux tout à fait déployer le site sans faire cette étape maintenant** et la faire plus tard — rien d'autre à changer que la variable `RESEND_FROM_EMAIL` le moment venu.

## Étape 6 — Créer les tables dans la base de données

Retour dans VS Code, terminal ouvert.

1. Dans l'explorateur de fichiers à gauche, trouve le fichier `.env.example` (à la racine du projet). Clique droit dessus → **Copy**. Clique droit sur le dossier racine du projet → **Paste**. Un fichier `.env.example copy` (ou similaire) apparaît : clique droit dessus → **Rename** → renomme-le en `.env` (bien avec le point devant, et rien après).
2. Ouvre ce fichier `.env` en cliquant dessus. Remplis chaque ligne avec les informations récoltées aux étapes précédentes :
   - `DATABASE_URL` → colle la version **directe** (`:5432`) de l'étape 2, pour l'instant (on la changera juste après).
   - `SESSION_SECRET` → n'importe quelle longue phrase aléatoire, ex: `un-secret-vraiment-random-a-changer-12345`.
   - `NEXT_PUBLIC_APP_URL` → laisse `http://localhost:3000` pour l'instant.
   - `NEXT_PUBLIC_SUPABASE_URL` → l'adresse de l'étape 4.
   - `SUPABASE_SERVICE_ROLE_KEY` → la clé `service_role` de l'étape 4.
   - `SUPABASE_STORAGE_BUCKET` → `cadence-uploads`.
   - `RESEND_API_KEY` → la clé de l'étape 5.
   - `RESEND_FROM_EMAIL` → laisse `Cadence <onboarding@resend.dev>` pour l'instant.
3. Enregistre le fichier (Ctrl+S / Cmd+S).
4. Dans le terminal, lance :
   ```bash
   npx prisma db push
   ```
   Ça crée toutes les tables (clients, publications, factures...) dans ta base Supabase. Tu dois voir un message vert de succès à la fin.
5. (Recommandé pour démarrer) Lance :
   ```bash
   npm run db:seed
   ```
   Ça remplit la base avec des données de démonstration (un compte admin, 3 clients d'exemple) — pratique pour tester le site tout de suite. Les identifiants s'affichent dans le terminal à la fin.

   > ⚠️ Cette commande **efface tout** avant de repeupler. Ne la relance jamais une fois que tu as de vraies données de clients dedans.

6. Retourne dans le fichier `.env`, et remplace la valeur de `DATABASE_URL` par la version **pooler** (`:6543`) de l'étape 2 — c'est celle-ci que le site doit utiliser au quotidien, en local comme en ligne. Enregistre (Ctrl+S).

### Vérifier que ça marche en local

Dans le terminal :
```bash
npm run dev
```
Attends le message `Ready` puis ouvre ton navigateur à l'adresse [http://localhost:3000](http://localhost:3000). Tu dois voir l'écran de connexion du site. Pour arrêter le site, reviens dans le terminal et appuie sur `Ctrl+C`.

---

## Étape 7 — Mettre le code sur GitHub

GitHub va héberger une copie du code, que Vercel ira lire pour construire le site en ligne.

1. Dans le terminal :
   ```bash
   git init
   git add .
   git commit -m "Premier envoi"
   ```
2. Va sur [github.com](https://github.com), connecté à ton compte. Clique sur le **+** en haut à droite → **New repository**.
3. Donne-lui un nom (ex: `cadence`), laisse-le **vide** (ne coche aucune case "Add README" etc.), clique **Create repository**.
4. GitHub affiche une page avec des commandes sous "…or push an existing repository from the command line". Copie ces lignes (elles ressemblent à ça, mais avec TON adresse) et colle-les dans le terminal VS Code :
   ```bash
   git remote add origin https://github.com/TON-COMPTE/cadence.git
   git branch -M main
   git push -u origin main
   ```
   Une fenêtre peut s'ouvrir te demandant de te connecter à GitHub — connecte-toi.

## Étape 8 — Déployer sur Vercel

1. Va sur [vercel.com](https://vercel.com), connecte-toi (idéalement avec ton compte GitHub).
2. Clique **Add New... → Project**.
3. Trouve ton dépôt `cadence` dans la liste et clique **Import**.
4. Vercel détecte automatiquement qu'il s'agit d'un projet Next.js — ne change rien aux réglages de build.
5. Avant de cliquer sur "Deploy", ouvre la section **Environment Variables** et ajoute, une par une, toutes les lignes de ton fichier `.env` local (nom de la variable à gauche, valeur à droite, clique "Add" après chacune) :

| Nom de la variable | Valeur à coller |
|---|---|
| `DATABASE_URL` | la version **pooler** (`:6543`) |
| `SESSION_SECRET` | la même que dans ton `.env` |
| `NEXT_PUBLIC_APP_URL` | laisse vide pour l'instant |
| `NEXT_PUBLIC_SUPABASE_URL` | la même que dans ton `.env` |
| `SUPABASE_SERVICE_ROLE_KEY` | la même que dans ton `.env` |
| `SUPABASE_STORAGE_BUCKET` | `cadence-uploads` |
| `RESEND_API_KEY` | la même que dans ton `.env` |
| `RESEND_FROM_EMAIL` | la même que dans ton `.env` |

6. Clique **Deploy**. Une page avec un chargement animé apparaît — patiente 2-3 minutes.

## Étape 9 — Dernier réglage après le premier déploiement

1. Une fois le déploiement terminé, Vercel affiche "Congratulations" avec une image du site et une adresse du type `https://cadence-xxxx.vercel.app` — clique dessus pour vérifier que le site s'affiche.
2. Copie cette adresse. Retourne dans Vercel : **Project → Settings → Environment Variables**, trouve `NEXT_PUBLIC_APP_URL`, clique sur les "..." à droite → **Edit**, colle l'adresse, **Save**.
3. Il faut redéployer pour que ce changement soit pris en compte : onglet **Deployments** en haut, clique sur les "..." du déploiement le plus récent → **Redeploy** → confirme.
4. Une fois terminé, teste le site en ligne : connexion admin, connexion client (utilise les identifiants de démo si tu as fait l'étape 6.5), essaie de déposer un document, envoie un message dans le chat et vérifie que l'e-mail arrive.

## Étape 10 (optionnel) — Utiliser ton propre nom de domaine

Si tu as un nom de domaine (ex: acheté chez OVH, Namecheap...) et que tu veux que le site soit accessible via `espace.tonagence.com` plutôt que l'adresse Vercel :

1. Dans Vercel : **Project → Settings → Domains** → tape ton adresse souhaitée → **Add**.
2. Vercel affiche des instructions techniques (enregistrements DNS) à ajouter chez ton fournisseur de domaine — suis-les (ou demande de l'aide si ce n'est pas clair, chaque fournisseur a une interface différente).
3. Une fois validé, refais l'étape 9 (mettre à jour `NEXT_PUBLIC_APP_URL` avec la nouvelle adresse, puis redéployer).

---

## À faire juste après, avant d'inviter de vrais clients

1. **Change le mot de passe admin par défaut** (`cadence123`) : connecte-toi au site, va dans **Paramètres** (menu de gauche de l'espace agence), choisis ton propre mot de passe. Voir [PERSONNALISATION.md](PERSONNALISATION.md).
2. Le stockage des fichiers est **public** : n'importe qui possédant le lien direct d'un fichier peut le voir (mais personne ne peut deviner ces liens au hasard). Suffisant pour démarrer.

## Personnaliser le site (nom, logo, couleurs)

Une fois le site en ligne, voir [PERSONNALISATION.md](PERSONNALISATION.md) pour l'adapter à ta marque (ou à celle de la personne à qui tu le transmets).

## En cas de blocage

- **Le déploiement Vercel échoue avec un message mentionnant "Prisma" ou "database"** : la cause la plus fréquente est une erreur dans `DATABASE_URL` (vérifie que c'est bien la version *pooler* `:6543`, sans espace ni caractère en trop, mot de passe bien remplacé).
- **Les e-mails ne partent pas** : va sur [resend.com](https://resend.com) → **Emails** → regarde l'historique, l'erreur exacte y est affichée (le cas le plus fréquent : domaine non vérifié + tentative d'envoi à une adresse autre que la tienne).
- **L'upload d'un fichier échoue** : vérifie dans Supabase que le bucket `cadence-uploads` existe bien (Storage) et qu'il est marqué "Public", et que tu as bien mis la clé `service_role` (pas `anon`) dans `SUPABASE_SERVICE_ROLE_KEY`.
- **Une commande dans le terminal affiche du texte rouge** : ce n'est pas forcément grave (souvent des "warnings"), mais si le mot **"Error"** apparaît, copie tout le message et n'hésite pas à demander de l'aide en le montrant tel quel.
