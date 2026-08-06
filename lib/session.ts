import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "cadence_session";

export type SessionRole = "admin" | "client";

export type SessionPayload = {
  sub: string; // id de l'admin ou du client
  role: SessionRole;
  nom: string;
  email: string;
};

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET manquant dans l'environnement");
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getSecretKey());
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}
