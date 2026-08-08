import "server-only";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { Resend } from "resend";
import { SITE_NAME } from "@/lib/config";

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
};

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

/**
 * Interface unique d'envoi d'e-mail. Envoie réellement via Resend si
 * RESEND_API_KEY est défini ; sinon, fallback local (log console + fichier
 * .eml dans /tmp/cadence-emails) pratique pour développer sans clé API.
 * Retourne `{ ok: false }` si l'envoi a échoué (ex: domaine Resend non
 * vérifié) — l'appelant peut alors proposer une solution de repli (ex:
 * afficher un lien à transmettre à la main) plutôt que de supposer que
 * l'e-mail est bien arrivé.
 */
export async function sendEmail({ to, subject, html }: SendEmailInput): Promise<{ ok: boolean }> {
  if (resend) {
    const from = process.env.RESEND_FROM_EMAIL ?? `${SITE_NAME} <onboarding@resend.dev>`;
    const { error } = await resend.emails.send({ from, to, subject, html });
    if (error) {
      console.error(`[email] échec d'envoi Resend vers ${to} :`, error);
      return { ok: false };
    }
    return { ok: true };
  }

  console.log(`[email] (mode test, pas de RESEND_API_KEY) → ${to} : ${subject}`);
  const dir = path.join(process.cwd(), "tmp", "cadence-emails");
  await mkdir(dir, { recursive: true });
  const filename = `${Date.now()}-${to.replace(/[^a-z0-9]/gi, "_")}.eml`;
  const content = `To: ${to}\nSubject: ${subject}\nContent-Type: text/html\n\n${html}`;
  await writeFile(path.join(dir, filename), content, "utf-8");
  return { ok: false };
}

export function inviteClientEmail(nom: string, loginUrl: string) {
  return {
    subject: `Bienvenue sur ${SITE_NAME} — créez votre mot de passe`,
    html: `<p>Bonjour ${nom},</p><p>Votre espace client ${SITE_NAME} est prêt. Créez votre mot de passe pour y accéder :</p><p><a href="${loginUrl}">${loginUrl}</a></p>`,
  };
}

export function newDocumentEmail(nom: string, typeLabel: string) {
  return {
    subject: `Nouveau document déposé : ${typeLabel}`,
    html: `<p>Bonjour ${nom},</p><p>Un nouveau document (${typeLabel}) a été déposé dans votre espace ${SITE_NAME}.</p>`,
  };
}

export function newMessageForAdminEmail(clientNom: string) {
  return {
    subject: `Nouveau message de ${clientNom}`,
    html: `<p>${clientNom} vous a envoyé un message sur ${SITE_NAME}.</p>`,
  };
}

export function newContractFromClientEmail(clientNom: string) {
  return {
    subject: `Contrat signé déposé par ${clientNom}`,
    html: `<p>${clientNom} a déposé un contrat signé sur ${SITE_NAME}.</p>`,
  };
}

export function newRequestForAdminEmail(clientNom: string, titre: string) {
  return {
    subject: `Nouvelle demande de ${clientNom}`,
    html: `<p>${clientNom} a envoyé une nouvelle demande : "${titre}".</p>`,
  };
}

export function requestPasswordResetEmail(nom: string, resetUrl: string) {
  return {
    subject: `Réinitialisation de votre mot de passe ${SITE_NAME}`,
    html: `<p>Bonjour ${nom},</p><p>Cliquez sur ce lien pour choisir un nouveau mot de passe (valable 1h) :</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
  };
}

export function requestTreatedEmail(nom: string, titre: string) {
  return {
    subject: `Votre demande "${titre}" a été traitée`,
    html: `<p>Bonjour ${nom},</p><p>Votre demande "${titre}" a été traitée par l'agence.</p>`,
  };
}
