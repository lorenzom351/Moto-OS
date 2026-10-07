import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/validation/schemas";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth/session";

function requiredCredential(name: "ADMIN_USER" | "ADMIN_PASSWORD") {
  const value = process.env[name];
  if (!value) throw new Error(`A variável de ambiente ${name} não foi configurada.`);
  return value;
}

function constantTimeEqual(received: string, expected: string) {
  const receivedBytes = new TextEncoder().encode(received);
  const expectedBytes = new TextEncoder().encode(expected);
  let difference = receivedBytes.length ^ expectedBytes.length;
  const length = Math.max(receivedBytes.length, expectedBytes.length);
  for (let index = 0; index < length; index++) difference |= (receivedBytes[index] ?? 0) ^ (expectedBytes[index] ?? 0);
  return difference === 0;
}

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ success: false, message: "Informe usuário e senha." }, { status: 400 });
  const expectedUser = requiredCredential("ADMIN_USER");
  const expectedPassword = requiredCredential("ADMIN_PASSWORD");
  if (!constantTimeEqual(parsed.data.username, expectedUser) || !constantTimeEqual(parsed.data.password, expectedPassword)) {
    return NextResponse.json({ success: false, message: "Usuário ou senha inválidos." }, { status: 401 });
  }
  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, await createSessionToken(expectedUser), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 12 });
  return response;
}
