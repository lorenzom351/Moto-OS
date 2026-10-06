import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "NUNA MOTO | Ordens de Serviço",
  description: "Histórico de manutenção e ordens de serviço da oficina NUNA MOTO.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR" className="dark"><body>{children}<Toaster richColors position="top-right" /></body></html>;
}
