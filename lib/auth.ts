import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, signSession, verifySession, type SessionPayload } from "@/lib/session";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSessionCookie(payload: SessionPayload) {
  const token = await signSession(payload);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}

export async function requireAdmin(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    redirect("/admin/login");
  }
  return session;
}

export async function requireClient(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session || session.role !== "client") {
    redirect("/portal/login");
  }
  return session;
}

/** Authentifie contre la table Admin puis Client. Retourne le payload de session ou null. */
export async function authenticate(email: string, password: string): Promise<SessionPayload | null> {
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (admin && (await verifyPassword(password, admin.passwordHash))) {
    return { sub: admin.id, role: "admin", nom: admin.nom, email: admin.email };
  }

  const client = await prisma.client.findUnique({ where: { email } });
  if (client && client.statut === "actif" && (await verifyPassword(password, client.passwordHash))) {
    return { sub: client.id, role: "client", nom: client.nom, email: client.email };
  }

  return null;
}
