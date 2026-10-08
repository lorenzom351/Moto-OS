import type { Metadata, Viewport } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  applicationName: "Moto-OS",
  title: "Moto-OS",
  description: "Gestão de ordens de serviço, manutenções e agenda da oficina.",
  manifest: "/moto-os-identidade-completa/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/moto-os-identidade-completa/icons/favicon.ico" },
      { url: "/moto-os-identidade-completa/icons/favicon.svg", type: "image/svg+xml" },
      { url: "/moto-os-identidade-completa/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/moto-os-identidade-completa/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/moto-os-identidade-completa/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#080808",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR" className="dark"><body>{children}<Toaster richColors position="top-right" /></body></html>;
}
