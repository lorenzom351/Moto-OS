import { NextResponse } from "next/server";
import { requireApiSession } from "@/lib/auth/session";
import { dateBlockSchema } from "@/lib/validation/appointment-schema";
import { createDateBlock } from "@/lib/data/appointments";
export async function POST(request:Request){if(!await requireApiSession(request))return NextResponse.json({success:false,message:"Sessão expirada."},{status:401});const parsed=dateBlockSchema.safeParse(await request.json());if(!parsed.success)return NextResponse.json({success:false,message:parsed.error.issues[0]?.message??"Revise os dados informados."},{status:400});try{return NextResponse.json({success:true,data:await createDateBlock(parsed.data.date,parsed.data.reason)},{status:201});}catch(error){if(error instanceof Error&&error.message==="DATE_UNAVAILABLE")return NextResponse.json({success:false,message:"Esta data não pode ser bloqueada."},{status:409});throw error;}}
