import { NextResponse } from "next/server";
import { createServiceOrder,listServiceOrders,searchServiceOrders } from "@/lib/data/service-orders";
import { requireApiSession } from "@/lib/auth/session";
import { serviceOrderSchema } from "@/lib/validation/schemas";
import { setAppointmentStatus } from "@/lib/data/appointments";
export async function GET(request:Request){if(!await requireApiSession(request))return NextResponse.json({success:false,message:"Sessão expirada."},{status:401});const query=new URL(request.url).searchParams.get("q")??"";return NextResponse.json({success:true,data:query?await searchServiceOrders(query):await listServiceOrders()});}
export async function POST(request:Request){if(!await requireApiSession(request))return NextResponse.json({success:false,message:"Sessão expirada."},{status:401});const body=await request.json() as Record<string,unknown>;const parsed=serviceOrderSchema.safeParse(body);if(!parsed.success)return NextResponse.json({success:false,message:parsed.error.issues[0]?.message??"Revise os dados informados."},{status:400});const appointmentId=typeof body.appointmentId==="string"?body.appointmentId:undefined;const order=await createServiceOrder({...parsed.data,appointmentId});if(appointmentId)await setAppointmentStatus(appointmentId,"COMPLETED",order.id);return NextResponse.json({success:true,data:order},{status:201});}
