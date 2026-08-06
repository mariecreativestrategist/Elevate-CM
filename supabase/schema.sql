-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('admin', 'membre_equipe');

-- CreateEnum
CREATE TYPE "ClientStatus" AS ENUM ('actif', 'archive');

-- CreateEnum
CREATE TYPE "CollaborationStageName" AS ENUM ('onboarding', 'strategie', 'calendrier', 'resultats');

-- CreateEnum
CREATE TYPE "CollaborationStageStatus" AS ENUM ('a_faire', 'en_cours', 'complete');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('texte_court', 'texte_long', 'choix_multiple', 'upload');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('strategie', 'resultats', 'contrat', 'facture');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('en_attente', 'depose');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('payee', 'en_attente', 'en_retard');

-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('reel', 'carrousel', 'story', 'post', 'tiktok');

-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('planifie', 'a_valider', 'approuve', 'publie');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('nouveau', 'en_cours', 'traite');

-- CreateEnum
CREATE TYPE "KanbanColumn" AS ENUM ('a_faire', 'en_cours', 'en_validation', 'termine');

-- CreateEnum
CREATE TYPE "SenderRole" AS ENUM ('admin', 'client');

-- CreateEnum
CREATE TYPE "AuthRole" AS ENUM ('admin', 'client');

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'admin',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "offre" TEXT NOT NULL,
    "statut" "ClientStatus" NOT NULL DEFAULT 'actif',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollaborationStage" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "etape" "CollaborationStageName" NOT NULL,
    "statut" "CollaborationStageStatus" NOT NULL DEFAULT 'a_faire',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CollaborationStage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OnboardingQuestion" (
    "id" TEXT NOT NULL,
    "texte" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL,
    "options" TEXT,
    "obligatoire" BOOLEAN NOT NULL DEFAULT true,
    "ordre" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "OnboardingQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OnboardingAnswer" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "reponse" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OnboardingAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL,
    "nomFichier" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "statut" "DocumentStatus" NOT NULL DEFAULT 'depose',
    "deposeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "statut" "InvoiceStatus" NOT NULL DEFAULT 'en_attente',
    "echeance" TIMESTAMP(3) NOT NULL,
    "url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EditorialPost" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "typeContenu" "ContentType" NOT NULL,
    "pilier" TEXT,
    "description" TEXT,
    "visuelUrl" TEXT,
    "datePlanifiee" TIMESTAMP(3) NOT NULL,
    "statut" "PostStatus" NOT NULL DEFAULT 'planifie',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EditorialPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModificationRequest" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "editorialPostId" TEXT,
    "titre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "statut" "RequestStatus" NOT NULL DEFAULT 'nouveau',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ModificationRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Call" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "dureeMin" INTEGER NOT NULL,
    "lienVisio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Call_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "expediteurRole" "SenderRole" NOT NULL,
    "adminId" TEXT,
    "contenu" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lu" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "clientId" TEXT,
    "colonne" "KanbanColumn" NOT NULL DEFAULT 'a_faire',
    "assigneId" TEXT,
    "date" TIMESTAMP(3),
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "role" "AuthRole" NOT NULL,
    "clientId" TEXT,
    "adminId" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CollaborationStage_clientId_etape_key" ON "CollaborationStage"("clientId", "etape");

-- CreateIndex
CREATE UNIQUE INDEX "OnboardingAnswer_clientId_questionId_key" ON "OnboardingAnswer"("clientId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_clientId_key" ON "Conversation"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");

-- AddForeignKey
ALTER TABLE "CollaborationStage" ADD CONSTRAINT "CollaborationStage_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OnboardingAnswer" ADD CONSTRAINT "OnboardingAnswer_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OnboardingAnswer" ADD CONSTRAINT "OnboardingAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "OnboardingQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EditorialPost" ADD CONSTRAINT "EditorialPost_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModificationRequest" ADD CONSTRAINT "ModificationRequest_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModificationRequest" ADD CONSTRAINT "ModificationRequest_editorialPostId_fkey" FOREIGN KEY ("editorialPostId") REFERENCES "EditorialPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assigneId_fkey" FOREIGN KEY ("assigneId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================================
-- Compte administrateur de démarrage — connecte-toi avec ces
-- identifiants puis change-les immédiatement dans "Paramètres" :
--   E-mail        : admin@exemple.com
--   Mot de passe  : changeme123
-- ============================================================
INSERT INTO "Admin" ("id", "nom", "email", "passwordHash", "role", "createdAt")
VALUES (
  'admin_default_001',
  'Admin',
  'admin@exemple.com',
  '$2b$10$YKJ.QvWivNfMuhAyEgKxY.kv03R3Wg/C8Ea40r9JN2jcCXoPpGqPK',
  'admin',
  CURRENT_TIMESTAMP
);

