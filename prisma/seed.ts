import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg(process.env.DATABASE_URL ?? "");
const prisma = new PrismaClient({ adapter });

const ADMIN_PASSWORD = "cadence123";
const CLIENT_PASSWORD = "cadence123";

function daysFromNow(days: number, hour = 10) {
  const d = new Date();
  d.setHours(hour, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d;
}

async function main() {
  console.log("Nettoyage de la base...");
  await prisma.$transaction([
    prisma.message.deleteMany(),
    prisma.conversation.deleteMany(),
    prisma.modificationRequest.deleteMany(),
    prisma.editorialPost.deleteMany(),
    prisma.call.deleteMany(),
    prisma.invoice.deleteMany(),
    prisma.document.deleteMany(),
    prisma.onboardingAnswer.deleteMany(),
    prisma.onboardingQuestion.deleteMany(),
    prisma.collaborationStage.deleteMany(),
    prisma.task.deleteMany(),
    prisma.passwordResetToken.deleteMany(),
    prisma.client.deleteMany(),
    prisma.admin.deleteMany(),
  ]);

  const adminPasswordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const admin = await prisma.admin.create({
    data: {
      nom: "Marie",
      email: "admin@cadence.app",
      passwordHash: adminPasswordHash,
      role: "admin",
    },
  });

  const clientPasswordHash = await bcrypt.hash(CLIENT_PASSWORD, 10);

  const lior = await prisma.client.create({
    data: {
      nom: "Maison Lior",
      email: "contact@maisonlior.com",
      passwordHash: clientPasswordHash,
      offre: "Pack Stratégique",
      statut: "actif",
    },
  });

  const naya = await prisma.client.create({
    data: {
      nom: "Atelier Naya",
      email: "hello@ateliernaya.com",
      passwordHash: clientPasswordHash,
      offre: "Sprint Créatif",
      statut: "actif",
    },
  });

  const base = await prisma.client.create({
    data: {
      nom: "Base Studio",
      email: "team@basestudio.co",
      passwordHash: clientPasswordHash,
      offre: "Partenaire Créatif",
      statut: "actif",
    },
  });

  const archived = await prisma.client.create({
    data: {
      nom: "Ancien Client SAS",
      email: "contact@ancienclient.com",
      passwordHash: clientPasswordHash,
      offre: "Sprint Créatif",
      statut: "archive",
    },
  });

  console.log("Étapes de collaboration...");
  await prisma.collaborationStage.createMany({
    data: [
      // Maison Lior : onboarding fait, en pleine stratégie
      { clientId: lior.id, etape: "onboarding", statut: "complete" },
      { clientId: lior.id, etape: "strategie", statut: "en_cours" },
      { clientId: lior.id, etape: "calendrier", statut: "a_faire" },
      { clientId: lior.id, etape: "resultats", statut: "a_faire" },
      // Atelier Naya : tout début, onboarding en cours
      { clientId: naya.id, etape: "onboarding", statut: "en_cours" },
      { clientId: naya.id, etape: "strategie", statut: "a_faire" },
      { clientId: naya.id, etape: "calendrier", statut: "a_faire" },
      { clientId: naya.id, etape: "resultats", statut: "a_faire" },
      // Base Studio : client avancé, en résultats
      { clientId: base.id, etape: "onboarding", statut: "complete" },
      { clientId: base.id, etape: "strategie", statut: "complete" },
      { clientId: base.id, etape: "calendrier", statut: "complete" },
      { clientId: base.id, etape: "resultats", statut: "en_cours" },
      // Ancien client : archivé en fin de parcours
      { clientId: archived.id, etape: "onboarding", statut: "complete" },
      { clientId: archived.id, etape: "strategie", statut: "complete" },
      { clientId: archived.id, etape: "calendrier", statut: "complete" },
      { clientId: archived.id, etape: "resultats", statut: "complete" },
    ],
  });

  console.log("Questionnaire onboarding (template)...");
  const q1 = await prisma.onboardingQuestion.create({
    data: { texte: "Quel est le nom de votre marque ?", type: "texte_court", obligatoire: true, ordre: 1 },
  });
  const q2 = await prisma.onboardingQuestion.create({
    data: {
      texte: "Décrivez votre marque et son positionnement en quelques phrases.",
      type: "texte_long",
      obligatoire: true,
      ordre: 2,
    },
  });
  const q3 = await prisma.onboardingQuestion.create({
    data: {
      texte: "Quel est votre objectif principal avec Cadence ?",
      type: "choix_multiple",
      options: JSON.stringify(["Notoriété", "Conversion", "Communauté", "Image de marque"]),
      obligatoire: true,
      ordre: 3,
    },
  });
  const q4 = await prisma.onboardingQuestion.create({
    data: {
      texte: "Avez-vous une charte graphique à nous transmettre ?",
      type: "upload",
      obligatoire: false,
      ordre: 4,
    },
  });
  const q5 = await prisma.onboardingQuestion.create({
    data: {
      texte: "Quels comptes (concurrents ou inspirants) suivez-vous ?",
      type: "texte_long",
      obligatoire: false,
      ordre: 5,
    },
  });

  console.log("Réponses onboarding...");
  for (const [client, answers] of [
    [
      lior,
      [
        "Maison Lior",
        "Marque de bijoux fins et intemporels, fabriqués en France, pour une clientèle urbaine 25-40 ans.",
        "Image de marque",
        null,
        "@sezane, @jacquemus, @yseult.paris",
      ],
    ],
    [
      base,
      [
        "Base Studio",
        "Studio de design d'intérieur pour espaces commerciaux, positionnement premium et minimaliste.",
        "Conversion",
        null,
        "@august.studio, @norm.architects",
      ],
    ],
  ] as const) {
    await prisma.onboardingAnswer.createMany({
      data: [q1, q2, q3, q4, q5].map((q, i) => ({
        clientId: client.id,
        questionId: q.id,
        reponse: answers[i],
      })).filter((a) => a.reponse !== null) as { clientId: string; questionId: string; reponse: string }[],
    });
  }
  // Atelier Naya : brouillon partiel (onboarding en_cours, pas encore soumis)
  await prisma.onboardingAnswer.create({
    data: { clientId: naya.id, questionId: q1.id, reponse: "Atelier Naya" },
  });

  console.log("Documents...");
  await prisma.document.createMany({
    data: [
      { clientId: lior.id, type: "strategie", nomFichier: "strategie-maison-lior-v1.pdf", url: "#", statut: "depose" },
      { clientId: lior.id, type: "contrat", nomFichier: "contrat-maison-lior.pdf", url: "#", statut: "depose" },
      { clientId: base.id, type: "strategie", nomFichier: "strategie-base-studio-v2.pdf", url: "#", statut: "depose" },
      { clientId: base.id, type: "resultats", nomFichier: "bilan-base-studio-t2.pdf", url: "#", statut: "depose" },
      { clientId: base.id, type: "resultats", nomFichier: "bilan-base-studio-t1.pdf", url: "#", statut: "depose" },
      { clientId: base.id, type: "contrat", nomFichier: "contrat-base-studio.pdf", url: "#", statut: "depose" },
      { clientId: naya.id, type: "contrat", nomFichier: "contrat-atelier-naya.pdf", url: "#", statut: "depose" },
    ],
  });

  console.log("Factures...");
  await prisma.invoice.createMany({
    data: [
      { clientId: lior.id, montant: 1800, statut: "payee", echeance: daysFromNow(-20) },
      { clientId: lior.id, montant: 1800, statut: "en_attente", echeance: daysFromNow(10) },
      { clientId: naya.id, montant: 900, statut: "en_retard", echeance: daysFromNow(-5) },
      { clientId: base.id, montant: 3200, statut: "payee", echeance: daysFromNow(-15) },
      { clientId: base.id, montant: 3200, statut: "payee", echeance: daysFromNow(-45) },
      { clientId: base.id, montant: 3200, statut: "en_attente", echeance: daysFromNow(15) },
    ],
  });

  console.log("Publications éditoriales...");
  const posts = await Promise.all([
    prisma.editorialPost.create({
      data: {
        clientId: lior.id,
        titre: "Nouveauté",
        typeContenu: "reel",
        pilier: "Nouveauté",
        description: "Présentation de la nouvelle collection été en situation, ambiance ensoleillée.",
        datePlanifiee: daysFromNow(1),
        statut: "a_valider",
      },
    }),
    prisma.editorialPost.create({
      data: {
        clientId: lior.id,
        titre: "Coulisses",
        typeContenu: "carrousel",
        pilier: "Coulisses",
        description: "5 photos de l'atelier : matières premières, gestes, finitions.",
        datePlanifiee: daysFromNow(3),
        statut: "planifie",
      },
    }),
    prisma.editorialPost.create({
      data: { clientId: lior.id, titre: "Story — témoignage client", typeContenu: "story", datePlanifiee: daysFromNow(0), statut: "publie" },
    }),
    prisma.editorialPost.create({
      data: { clientId: lior.id, titre: "Post — annonce partenariat", typeContenu: "post", datePlanifiee: daysFromNow(6), statut: "approuve" },
    }),
    prisma.editorialPost.create({
      data: { clientId: base.id, titre: "TikTok — process de conception", typeContenu: "tiktok", datePlanifiee: daysFromNow(0), statut: "a_valider" },
    }),
    prisma.editorialPost.create({
      data: { clientId: base.id, titre: "Carrousel — avant/après projet", typeContenu: "carrousel", datePlanifiee: daysFromNow(2), statut: "planifie" },
    }),
    prisma.editorialPost.create({
      data: { clientId: base.id, titre: "Reel — visite showroom", typeContenu: "reel", datePlanifiee: daysFromNow(4), statut: "approuve" },
    }),
    prisma.editorialPost.create({
      data: { clientId: base.id, titre: "Post — étude de cas", typeContenu: "post", datePlanifiee: daysFromNow(9), statut: "planifie" },
    }),
  ]);

  console.log("Demandes de modification...");
  await prisma.modificationRequest.createMany({
    data: [
      {
        clientId: lior.id,
        editorialPostId: posts[1].id,
        titre: "Ajuster le carrousel coulisses",
        description: "Peut-on remplacer la 2e photo, elle ne correspond pas à la charte graphique ?",
        statut: "nouveau",
      },
      {
        clientId: base.id,
        editorialPostId: posts[5].id,
        titre: "Revoir la légende avant/après",
        description: "La légende est trop longue, peut-on la raccourcir de moitié ?",
        statut: "en_cours",
      },
      {
        clientId: lior.id,
        editorialPostId: null,
        titre: "Ajouter un post spécial soldes",
        description: "Serait-il possible d'ajouter une publication dédiée aux soldes d'été la semaine prochaine ?",
        statut: "traite",
      },
    ],
  });

  console.log("Appels...");
  await prisma.call.createMany({
    data: [
      { clientId: lior.id, titre: "Point mensuel stratégie", date: daysFromNow(2, 14), dureeMin: 30, lienVisio: "https://meet.google.com/lior-point" },
      { clientId: base.id, titre: "Revue de bilan T2", date: daysFromNow(5, 11), dureeMin: 45, lienVisio: "https://meet.google.com/base-bilan" },
      { clientId: naya.id, titre: "Kick-off onboarding", date: daysFromNow(1, 9), dureeMin: 30, lienVisio: "https://meet.google.com/naya-kickoff" },
    ],
  });

  console.log("Conversations & messages...");
  for (const client of [lior, naya, base]) {
    const conv = await prisma.conversation.create({ data: { clientId: client.id } });
    await prisma.message.createMany({
      data: [
        { conversationId: conv.id, expediteurRole: "admin", adminId: admin.id, contenu: `Bonjour ${client.nom}, bienvenue sur Cadence !`, lu: true },
        { conversationId: conv.id, expediteurRole: "client", contenu: "Merci, hâte de démarrer !", lu: true },
      ],
    });
  }
  // Message non lu récent côté admin pour Maison Lior
  const liorConv = await prisma.conversation.findUnique({ where: { clientId: lior.id } });
  if (liorConv) {
    await prisma.message.create({
      data: {
        conversationId: liorConv.id,
        expediteurRole: "client",
        contenu: "Est-ce qu'on peut avancer le post du carrousel à demain ?",
        lu: false,
      },
    });
  }

  console.log("Tâches Kanban...");
  await prisma.task.createMany({
    data: [
      { titre: "Préparer le brief stratégie Maison Lior", clientId: lior.id, colonne: "a_faire", assigneId: admin.id, ordre: 0 },
      { titre: "Relancer Atelier Naya pour l'onboarding", clientId: naya.id, colonne: "a_faire", assigneId: admin.id, ordre: 1 },
      { titre: "Tourner les reels de la semaine", clientId: base.id, colonne: "en_cours", assigneId: admin.id, ordre: 0 },
      { titre: "Monter le bilan T2 Base Studio", clientId: base.id, colonne: "en_validation", assigneId: admin.id, ordre: 0 },
      { titre: "Facturation du mois", clientId: null, colonne: "a_faire", assigneId: admin.id, ordre: 2 },
      { titre: "Mettre à jour le questionnaire onboarding", clientId: null, colonne: "termine", assigneId: admin.id, ordre: 0 },
    ],
  });

  console.log("\nSeed terminé.");
  console.log(`Admin      → admin@cadence.app / ${ADMIN_PASSWORD}`);
  console.log(`Client     → contact@maisonlior.com / ${CLIENT_PASSWORD} (avancé, en stratégie)`);
  console.log(`Client     → hello@ateliernaya.com / ${CLIENT_PASSWORD} (démarrage, onboarding en cours)`);
  console.log(`Client     → team@basestudio.co / ${CLIENT_PASSWORD} (avancé, en résultats)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
