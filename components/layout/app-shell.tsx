"use client";
import Link from "next/link";
import { usePathname,useRouter } from "next/navigation";
import { CalendarDays,ClipboardPlus,History,Home,LogOut,Menu,X } from "lucide-react";
import { useState } from "react";
import { Logo } from "./logo";
import { WebMcpTools } from "@/components/webmcp-tools";

const links=[{href:"/dashboard",label:"Início",icon:Home},{href:"/os/nova",label:"Nova OS",icon:ClipboardPlus},{href:"/agenda",label:"Agenda",icon:CalendarDays},{href:"/historico",label:"Histórico",icon:History}];
export function AppShell({children}:{children:React.ReactNode}){
  const pathname=usePathname();const router=useRouter();const [open,setOpen]=useState(false);
  async function logout(){await fetch("/api/auth/logout",{method:"POST"});router.replace("/login");router.refresh();}
  const nav=<><div className="border-b border-[#282828] px-6 py-5"><Logo compact/></div><nav className="flex flex-1 flex-col gap-2 px-3 py-6">{links.map(({href,label,icon:Icon})=>{const active=pathname===href||(href!=="/dashboard"&&pathname.startsWith(href));return <Link key={href} href={href} onClick={()=>setOpen(false)} className={`relative flex min-h-12 items-center gap-3 rounded-md px-4 text-[15px] font-semibold transition ${active?"bg-[#1c1c1c] text-white":"text-[#aaa] hover:bg-[#171717] hover:text-white"}`}>{active&&<span className="absolute inset-y-2 left-0 w-[3px] rounded-full bg-[#e60012]"/>}<Icon className={active?"text-[#e60012]":"text-[#777]"} size={19}/>{label}</Link>})}</nav><button onClick={logout} className="m-3 flex min-h-12 items-center gap-3 rounded-md px-4 text-[15px] font-semibold text-[#999] transition hover:bg-[#171717] hover:text-white"><LogOut size={19}/>Sair</button></>;
  return <div className="shell-bg min-h-screen"><WebMcpTools/><aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-[#282828] bg-[#0d0d0d] lg:flex">{nav}</aside><header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#292929] bg-[#0b0b0b]/95 px-4 backdrop-blur lg:hidden"><Logo compact/><button aria-label="Abrir menu" onClick={()=>setOpen(true)} className="rounded-md border border-[#333] p-2 text-white"><Menu/></button></header>{open&&<div className="fixed inset-0 z-50 lg:hidden"><button aria-label="Fechar menu" className="absolute inset-0 bg-black/75" onClick={()=>setOpen(false)}/><aside className="relative flex h-full w-[82%] max-w-xs flex-col border-r border-[#333] bg-[#0d0d0d]">{nav}<button aria-label="Fechar" onClick={()=>setOpen(false)} className="absolute right-4 top-4 rounded p-2 text-[#aaa]"><X/></button></aside></div>}<main className="min-h-screen lg:pl-64"><div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-10 lg:py-9">{children}</div></main></div>;
}
