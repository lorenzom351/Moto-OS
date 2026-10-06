import type { AuthenticatedSession } from "@/types/service-order";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export const SESSION_COOKIE="nuna_session"; const encoder=new TextEncoder();
function encode(value:string){return btoa(value).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");}
function decode(value:string){return atob(value.replace(/-/g,"+").replace(/_/g,"/"));}
async function key(){return crypto.subtle.importKey("raw",encoder.encode(process.env.SESSION_SECRET??"development-only-secret-change-me"),{name:"HMAC",hash:"SHA-256"},false,["sign","verify"]);}
export async function createSessionToken(username:string){const payload=encode(JSON.stringify({username,expiresAt:Date.now()+1000*60*60*12} satisfies AuthenticatedSession));const signature=await crypto.subtle.sign("HMAC",await key(),encoder.encode(payload));return `${payload}.${encode(String.fromCharCode(...new Uint8Array(signature)))}`;}
export async function verifySessionToken(token?:string):Promise<AuthenticatedSession|null>{if(!token)return null;try{const [payload,signature]=token.split(".");const bytes=Uint8Array.from(decode(signature),char=>char.charCodeAt(0));const valid=await crypto.subtle.verify("HMAC",await key(),bytes,encoder.encode(payload));const session=JSON.parse(decode(payload)) as AuthenticatedSession;return valid&&session.expiresAt>Date.now()?session:null;}catch{return null;}}
export async function requireApiSession(request:Request){const cookie=request.headers.get("cookie")?.split(";").map(item=>item.trim()).find(item=>item.startsWith(`${SESSION_COOKIE}=`))?.split("=")[1];return verifySessionToken(cookie);}
export async function requirePageSession(){const session=await verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value);if(!session)redirect("/login");return session;}
