import { requirePageSession } from "@/lib/auth/session";
export default async function ProtectedLayout({children}:{children:React.ReactNode}){await requirePageSession();return children;}
