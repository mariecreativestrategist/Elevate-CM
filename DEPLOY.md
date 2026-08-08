# Mettre le site en ligne — guide complet pour débutant·e

Ce guide part du principe que **tu n'as jamais programmé**. Tout se passe dans le navigateur — aucun logiciel à installer, aucun terminal à ouvrir. Chaque étape explique quoi cliquer et à quoi doit ressembler le résultat. Ne saute pas d'étape, même si elle te semble évidente.

Compte environ **30-45 minutes** la première fois.

## Avant de commencer : le vocabulaire de base

- **Variable d'environnement** : une information secrète ou de configuration (mot de passe de la base de données, clé d'un service...) que le site va lire au démarrage.
- **Déployer** : mettre le site en ligne, accessible par une adresse internet.
- **Dépôt (repository)** : l'endroit où le code du site est rangé sur GitHub — un peu comme un dossier partagé.

Crée-toi un compte (gratuit) sur ces 4 sites — juste créer le compte pour l'instant, on configure chacun au fur et à mesure :
- [github.com](https://github.com)
- [supabase.com](https://supabase.com)
- [resend.com](https://resend.com)
- [vercel.com](https://vercel.com) *(tu peux "Sign up" directement avec ton compte GitHub, c'est plus simple)*

---

## Étape 1 — Créer le projet Supabase (la base de données)

Supabase va stocker toutes les données du site (clients, publications, factures...) et les fichiers déposés (documents, visuels).

1. Va sur [supabase.com](https://supabase.com), connecte-toi.
2. Clique **New project**.
3. Remplis :
   - **Name** : le nom que tu veux (ex: `mon-espace-membre`)
   - **Database Password** : clique sur "Generate a password" pour en générer un fort, puis **copie-le et colle-le dans un fichier texte que tu gardes de côté** — tu en auras besoin plusieurs fois dans ce guide, et Supabase ne le remontrera plus après.
   - **Region** : la région la plus proche de tes utilisateurs (ex: `West EU (Paris)` pour la France).
4. Clique **Create new project** et attends environ 2 minutes.

## Étape 2 — Récupérer l'adresse de connexion à la base

1. Menu de gauche, tout en bas : **Project Settings** (icône d'engrenage) → **Database**.
2. Fais défiler jusqu'à **Connection string**.
3. Dans l'onglet **"Transaction pooler"**, copie l'adresse affichée (elle contient `:6543`) dans ton fichier texte de côté.
4. Remplace, dans le texte copié, `[YOUR-PASSWORD]` par le mot de passe généré à l'étape 1.

## Étape 3 — Créer les tables de la base (copier-coller un script)

1. Toujours dans Supabase, menu de gauche : **SQL Editor**.
2. Clique **New query**.
3. Ouvre ce lien dans un nouvel onglet : **[supabase/schema.sql](https://github.com/mariecreativestrategist/Elevate-CM/blob/main/supabase/schema.sql)**.
4. Sur cette page GitHub, clique le bouton **"Raw"** (en haut à droite de l'aperçu du fichier) — le texte brut du script s'affiche. Sélectionne tout (`Ctrl+A` / `Cmd+A`) et copie (`Ctrl+C` / `Cmd+C`).
5. Reviens dans Supabase, colle le script dans la zone de requête (`Ctrl+V` / `Cmd+V`).
6. Clique **Run** (ou `Ctrl+Entrée`).

Un message de succès s'affiche en bas — toutes les tables sont créées, **avec un compte administrateur de démarrage déjà prêt** :
- E-mail : `admin@exemple.com`
- Mot de passe : `changeme123`

*(Tu changeras ce mot de passe juste après le premier déploiement — voir tout en bas de ce guide.)*

## Étape 4 — Créer l'espace de stockage des fichiers

1. Menu de gauche : **Storage → New bucket**.
2. Nom : `cadence-uploads` (copie-le exactement, en minuscules, avec le tiret).
3. Active l'interrupteur **Public bucket**.
4. Clique **Create bucket**.

## Étape 5 — Récupérer les clés Supabase

1. Menu de gauche : **Project Settings → API**.
2. Section "Project URL" : copie cette adresse (`https://xxxxxxxxxxxx.supabase.co`) dans ton fichier texte.
3. Section "Project API keys" : trouve la ligne **`service_role`** (pas `anon`/`public`) → clique sur "reveal", copie-la dans ton fichier texte.

> ⚠️ Cette clé `service_role` est secrète — ne la partage jamais publiquement.

## Étape 6 — Créer un compte Resend (pour les e-mails)

1. Va sur [resend.com](https://resend.com), connecte-toi.
2. Menu de gauche : **API Keys → Create API Key**. Donne-lui un nom, clique **Add**.
3. Copie la clé affichée (une seule fois) dans ton fichier texte.
4. *Sans étape supplémentaire, Resend n'autorise l'envoi qu'à l'adresse e-mail de ton propre compte.* **Tu peux déployer sans faire l'étape suivante maintenant** et la faire plus tard — le site fonctionne très bien sans.

### Vérifier ton propre nom de domaine sur Resend (optionnel)

Pour envoyer de vrais e-mails à tes clients (pas juste à toi-même), il faut prouver à Resend que tu es bien propriétaire d'un nom de domaine (ex: `tonagence.com`). Ça se fait en ajoutant quelques lignes de configuration chez l'endroit où tu as acheté ce nom de domaine (OVH, Namecheap, Google Domains...) — pas besoin de compétences techniques, juste de copier-coller.

1. Sur [resend.com](https://resend.com), menu de gauche : **Domains → Add Domain**.
2. Tape ton nom de domaine (ex: `tonagence.com`, sans "www" ni "https://") → **Add**.
3. Resend affiche un tableau de **plusieurs lignes** (souvent 3 à 5), chacune avec un **Type** (`TXT`, `MX`, ou `CNAME`), un **Name/Host** et une **Value**. C'est ça qu'il faut recopier chez ton fournisseur de domaine.
4. Ouvre un nouvel onglet, connecte-toi au site où tu as acheté ton domaine, cherche une section appelée **"DNS"**, **"Zone DNS"** ou **"Gérer le domaine"**.
5. Pour **chaque ligne** affichée par Resend, crée un nouvel enregistrement DNS avec exactement le même Type, Name/Host et Value (souvent un bouton "Add record" ou "Ajouter un enregistrement"). Enregistre après chaque ligne.
6. Reviens sur Resend, clique **Verify** (ou "Verify DNS Records"). Ça peut être immédiat ou prendre jusqu'à quelques heures selon le fournisseur de domaine — si ça échoue, attends un peu et réessaie.
7. Une fois vérifié (coche verte), utilise une adresse sur ce domaine comme `RESEND_FROM_EMAIL`, par exemple :
   ```
   Cadence <contact@tonagence.com>
   ```
   (l'adresse n'a pas besoin d'exister réellement comme boîte mail — c'est juste l'expéditeur affiché)

> 💡 Chaque fournisseur de domaine a une interface différente pour les DNS — si tu ne trouves pas où ajouter ces enregistrements, cherche "gérer DNS [nom de ton fournisseur]" ou demande de l'aide en montrant la page.

---

## Étape 7 — Déployer le site sur Vercel

Clique sur ce bouton (ou colle l'adresse dans ton navigateur) :

**➜ [Déployer sur Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmariecreativestrategist%2FElevate-CM&env=DATABASE_URL,SESSION_SECRET,NEXT_PUBLIC_APP_URL,NEXT_PUBLIC_SUPABASE_URL,SUPABASE_SERVICE_ROLE_KEY,SUPABASE_STORAGE_BUCKET,RESEND_API_KEY,RESEND_FROM_EMAIL&envDescription=Voir%20le%20guide%20DEPLOY.md%20du%20projet%20pour%20obtenir%20ces%20valeurs&envLink=https%3A%2F%2Fgithub.com%2Fmariecreativestrategist%2FElevate-CM%2Fblob%2Fmain%2FDEPLOY.md&project-name=espace-membre&repository-name=espace-membre)**

1. Connecte-toi (avec ton compte GitHub, le plus simple).
2. Vercel te propose de créer une **copie du code dans ton propre compte GitHub** — accepte (bouton "Create" ou similaire). C'est important : c'est *ta* copie, indépendante de l'originale.
3. Un formulaire de variables d'environnement (**Environment Variables**) apparaît. Remplis chaque champ avec les informations récoltées plus haut :

| Nom de la variable | Valeur à coller |
|---|---|
| `DATABASE_URL` | l'adresse de l'étape 2 (avec le mot de passe déjà remplacé) |
| `SESSION_SECRET` | n'importe quelle longue phrase aléatoire, ex: `un-secret-vraiment-random-a-changer-12345` |
| `NEXT_PUBLIC_APP_URL` | laisse vide pour l'instant |
| `NEXT_PUBLIC_SUPABASE_URL` | l'adresse de l'étape 5 |
| `SUPABASE_SERVICE_ROLE_KEY` | la clé `service_role` de l'étape 5 |
| `SUPABASE_STORAGE_BUCKET` | `cadence-uploads` |
| `RESEND_API_KEY` | la clé de l'étape 6 |
| `RESEND_FROM_EMAIL` | `Cadence <onboarding@resend.dev>` (ou ton domaine vérifié) |

4. Clique **Deploy**. Une page avec un chargement animé apparaît — patiente 2-3 minutes.

## Étape 8 — Dernier réglage après le premier déploiement

1. Une fois déployé, Vercel affiche "Congratulations" avec une adresse du type `https://espace-membre-xxxx.vercel.app` — clique dessus pour vérifier que le site s'affiche.
2. Copie cette adresse. Dans Vercel : **Project → Settings → Environment Variables**, trouve `NEXT_PUBLIC_APP_URL`, clique sur les "..." à droite → **Edit**, colle l'adresse, **Save**.
3. Onglet **Deployments** en haut → "..." du déploiement le plus récent → **Redeploy** → confirme (pour que ce changement soit pris en compte).
4. Connecte-toi au site avec `admin@exemple.com` / `changeme123`, va dans **Paramètres** (menu de gauche) et **change immédiatement ce mot de passe** (et l'e-mail si tu veux).
5. Teste : upload d'un document, envoi d'un message dans le chat (vérifie la réception de l'e-mail).

## Étape 9 (optionnel) — Changer l'adresse du site

L'adresse `https://espace-membre-xxxx.vercel.app` fonctionne très bien telle quelle, mais tu peux la changer.

### Option A — Renommer juste le sous-domaine gratuit (aucun achat nécessaire)

1. Dans Vercel : **Project → Settings → Domains**.
2. Dans le champ pour ajouter un domaine, tape le nom que tu veux en `.vercel.app`, ex: `tonagence.vercel.app` → **Add** (si le nom est déjà pris par quelqu'un d'autre, essaie une variante).
3. Il devient l'adresse principale du site.

### Option B — Utiliser ton propre nom de domaine

Si tu as un nom de domaine (acheté chez OVH, Namecheap...) :

1. Dans Vercel : **Project → Settings → Domains** → tape ton adresse souhaitée (ex: `espace.tonagence.com`) → **Add**.
2. Suis les instructions DNS affichées (même principe que pour Resend à l'étape 6 : des enregistrements à ajouter chez ton fournisseur de domaine).

### Dans les deux cas

Une fois la nouvelle adresse active, refais l'étape 8 : mets à jour `NEXT_PUBLIC_APP_URL` avec cette nouvelle adresse dans les Environment Variables, puis **Redeploy** — sinon les liens dans les e-mails pointeraient encore vers l'ancienne adresse.

---

## Personnaliser le site (nom, logo, couleurs)

Voir [PERSONNALISATION.md](https://github.com/mariecreativestrategist/Elevate-CM/blob/main/PERSONNALISATION.md) — tout se fait aussi depuis le navigateur, sans rien installer.

## En cas de blocage

- **Le déploiement échoue avec un message mentionnant "Prisma" ou "database"** : vérifie `DATABASE_URL` (mot de passe bien remplacé, pas d'espace en trop).
- **Les e-mails ne partent pas** : va sur [resend.com](https://resend.com) → **Emails** → l'historique affiche l'erreur exacte (souvent : domaine non vérifié + envoi à une adresse autre que la tienne). *Pas besoin d'attendre d'avoir vérifié un domaine pour inviter des clients* : si l'e-mail échoue, l'app affiche quand même le lien d'invitation à l'écran (avec un bouton "copier") — tu peux le transmettre toi-même en attendant.
- **L'upload d'un fichier échoue** : vérifie dans Supabase que le bucket `cadence-uploads` existe et est "Public", et que tu as bien mis la clé `service_role` (pas `anon`).
- **Impossible de se connecter avec `admin@exemple.com`** : vérifie que l'étape 3 (script SQL) s'est bien terminée par un message de succès dans Supabase.
