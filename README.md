# Cadence

Espace membre pour une agence de community management / stratégie créative — un portail admin (agence) et un portail client (marques).

## Démarrer en local

Nécessite un projet Supabase (base de données + stockage) — voir [DEPLOY.md](DEPLOY.md) pour la mise en place complète (étapes 1 à 6 pour le local, 7+ pour la mise en ligne).

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

## Stack

- **Next.js 16 (App Router) + TypeScript + Tailwind v4 + shadcn/ui**
- **Base de données** : Postgres (Supabase) via Prisma (`prisma/schema.prisma`).
- **Auth** : session JWT maison (cookie httpOnly, `lib/auth.ts` / `lib/session.ts`).
- **Fichiers** : Supabase Storage (`lib/storage.ts`) — bucket `cadence-uploads`.
- **E-mails** : Resend (`lib/email.ts`) — si `RESEND_API_KEY` est absent, les e-mails sont simulés (loggés + écrits en `.eml` dans `/tmp/cadence-emails`), pratique pour développer sans clé.
- **Hébergement** : Vercel.

## Commandes utiles

```bash
npm run dev             # serveur de dev
npm run build            # build de production (vérifie les types)
npm run db:seed          # réinitialise la base avec les données de démo (⚠️ efface tout)
npx prisma db push        # synchronise le schéma vers la base sans créer de migration
npx prisma studio         # explorer la base de données
```

## Déploiement

Voir [DEPLOY.md](DEPLOY.md) pour le guide complet : créer le projet Supabase, le bucket de stockage, le compte Resend, et déployer sur Vercel.

## Personnalisation

Voir [PERSONNALISATION.md](PERSONNALISATION.md) : changer le mot de passe admin, le nom du site, le logo, les couleurs.
