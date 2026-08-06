# Cadence

Espace membre pour une agence de community management / stratégie créative — un portail admin (agence) et un portail client (marques).

**➜ Pour mettre ce site en ligne sans écrire de code, suis [DEPLOY.md](DEPLOY.md).** Une fois en ligne, [PERSONNALISATION.md](PERSONNALISATION.md) explique comment changer le mot de passe admin, le nom, le logo et les couleurs — aussi sans écrire de code.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmariecreativestrategist%2FElevate-CM&env=DATABASE_URL,SESSION_SECRET,NEXT_PUBLIC_APP_URL,NEXT_PUBLIC_SUPABASE_URL,SUPABASE_SERVICE_ROLE_KEY,SUPABASE_STORAGE_BUCKET,RESEND_API_KEY,RESEND_FROM_EMAIL&envDescription=Voir%20le%20guide%20DEPLOY.md%20du%20projet%20pour%20obtenir%20ces%20valeurs&envLink=https%3A%2F%2Fgithub.com%2Fmariecreativestrategist%2FElevate-CM%2Fblob%2Fmain%2FDEPLOY.md&project-name=espace-membre&repository-name=espace-membre)

---

## Développement local (optionnel, pour qui code)

Nécessite un projet Supabase (base de données + stockage) — voir [DEPLOY.md](DEPLOY.md) étapes 1 à 6 pour le mettre en place.

```bash
npm install
cp .env.example .env   # puis renseigner les valeurs (voir DEPLOY.md)
npx prisma db push     # crée les tables dans Supabase
npm run db:seed        # (ré)initialise la base avec des données de démo
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Comptes de démo (mot de passe : `cadence123` pour tous)

| Rôle | E-mail | Portail |
|---|---|---|
| Admin (agence) | `admin@cadence.app` | `/admin` |
| Client — avancé, en stratégie | `contact@maisonlior.com` | `/portal` |
| Client — démarrage, onboarding en cours | `hello@ateliernaya.com` | `/portal` |
| Client — avancé, en résultats | `team@basestudio.co` | `/portal` |

*(Ces comptes viennent de `npm run db:seed`, utile en développement local. Le déploiement via le bouton "Deploy with Vercel" crée uniquement un compte admin de démarrage — voir DEPLOY.md.)*

## Stack

- **Next.js 16 (App Router) + TypeScript + Tailwind v4 + shadcn/ui**
- **Base de données** : Postgres (Supabase) via Prisma (`prisma/schema.prisma`). Script SQL prêt à l'emploi : `supabase/schema.sql`.
- **Auth** : session JWT maison (cookie httpOnly, `lib/auth.ts` / `lib/session.ts`).
- **Fichiers** : Supabase Storage (`lib/storage.ts`) — bucket `cadence-uploads`.
- **E-mails** : Resend (`lib/email.ts`) — si `RESEND_API_KEY` est absent, les e-mails sont simulés (loggés + écrits en `.eml` dans `/tmp/cadence-emails`), pratique pour développer sans clé.
- **Personnalisation** : nom/logo dans `lib/config.ts`, couleurs dans `app/globals.css` (voir PERSONNALISATION.md).
- **Hébergement** : Vercel.

## Commandes utiles

```bash
npm run dev             # serveur de dev
npm run build            # build de production (vérifie les types)
npm run db:seed          # réinitialise la base avec les données de démo (⚠️ efface tout)
npx prisma db push        # synchronise le schéma vers la base sans créer de migration
npx prisma studio         # explorer la base de données
```
