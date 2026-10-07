import { requirePageSession } from "@/lib/auth/session";
import { SessionExpiry } from "@/components/auth/session-expiry";
export const dynamic="force-dynamic";
export default async function ProtectedLayout({children}:{children:React.ReactNode}){const session=await requirePageSession();return <><SessionExpiry expiresAt={session.expiresAt}/>{children}</>;}
