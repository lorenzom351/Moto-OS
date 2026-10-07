import type { AuthenticatedSession } from "@/types/service-order";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const SESSION_COOKIE = "moto_os_session";
const encoder = new TextEncoder();
const decoder = new TextDecoder();

function encode(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function decode(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
}

function sessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("SESSION_SECRET deve estar configurada com pelo menos 32 caracteres.");
  return secret;
}

async function key() {
  return crypto.subtle.importKey("raw", encoder.encode(sessionSecret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

export async function createSessionToken(username: string) {
  const payload = encode(encoder.encode(JSON.stringify({ username, expiresAt: Date.now() + 1000 * 60 * 60 * 12 } satisfies AuthenticatedSession)));
  const signature = await crypto.subtle.sign("HMAC", await key(), encoder.encode(payload));
  return `${payload}.${encode(new Uint8Array(signature))}`;
}

export async function verifySessionToken(token?: string): Promise<AuthenticatedSession | null> {
  if (!token) return null;
  try {
    const [payload, signature, extra] = token.split(".");
    if (!payload || !signature || extra) return null;
    const valid = await crypto.subtle.verify("HMAC", await key(), decode(signature), encoder.encode(payload));
    if (!valid) return null;
    const session = JSON.parse(decoder.decode(decode(payload))) as AuthenticatedSession;
    return typeof session.username === "string" && session.expiresAt > Date.now() ? session : null;
  } catch {
    return null;
  }
}

export async function requireApiSession(request: Request) {
  const cookie = request.headers.get("cookie")?.split(";").map((item) => item.trim()).find((item) => item.startsWith(`${SESSION_COOKIE}=`))?.slice(SESSION_COOKIE.length + 1);
  return verifySessionToken(cookie);
}

export async function requirePageSession() {
  const session = await verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value);
  if (!session) redirect("/login");
  return session;
}
