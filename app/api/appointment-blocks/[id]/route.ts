import { NextResponse } from "next/server";
import { requireApiSession } from "@/lib/auth/session";
import { removeDateBlock } from "@/lib/data/appointments";
export async function DELETE(request:Request,{params}:{params:Promise<{id:string}>}){if(!await requireApiSession(request))return NextResponse.json({success:false,message:"Sessão expirada."},{status:401});return await removeDateBlock((await params).id)?NextResponse.json({success:true}):NextResponse.json({success:false,message:"Bloqueio não encontrado."},{status:404});}
