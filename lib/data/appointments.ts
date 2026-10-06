import type { Appointment,AppointmentDateBlock,AppointmentFormData,AppointmentStatus } from "@/types/appointment";
import { isPastDate,isWorkingDay } from "@/lib/appointments/date-utils";

const appointmentSeed:Appointment[]=[
  {id:"apt-001",date:"2026-10-07",customerName:"Rafael Lima",whatsapp:"81988776655",plate:"RFL2A45",model:"Honda CG 160 Titan",year:2024,plannedService:"Revisão geral e troca de óleo",notes:"Verificar ruído ao frear.",status:"SCHEDULED",createdAt:"2026-10-02T12:00:00.000Z"},
  {id:"apt-002",date:"2026-10-10",customerName:"Amanda Souza",whatsapp:"81999887744",plate:"AMS7B31",model:"Honda XRE 300 Sahara",year:2025,plannedService:"Primeira revisão",status:"SCHEDULED",createdAt:"2026-10-03T12:00:00.000Z"},
  {id:"apt-003",date:"2026-10-13",customerName:"Carlos Santos",whatsapp:"81991234567",plate:"KCS4D82",model:"Honda NXR 160 Bros",year:2023,plannedService:"Revisão periódica e verificar corrente",status:"SCHEDULED",createdAt:"2026-10-04T12:00:00.000Z"},
  {id:"apt-004",date:"2026-10-02",customerName:"Paulo Mendes",whatsapp:"81995554433",plate:"PMD1C20",model:"Honda Biz 125",year:2022,plannedService:"Revisão e troca de óleo",status:"COMPLETED",serviceOrderId:"127",createdAt:"2026-09-25T12:00:00.000Z"},
];
const blockSeed:AppointmentDateBlock[]=[{id:"block-001",date:"2026-10-15",reason:"Oficina fechada / compromisso externo"}];
const memory=globalThis as typeof globalThis&{__nunaAppointments?:Appointment[];__nunaAppointmentBlocks?:AppointmentDateBlock[]};
const appointments=memory.__nunaAppointments??appointmentSeed.map(item=>({...item}));const blocks=memory.__nunaAppointmentBlocks??blockSeed.map(item=>({...item}));memory.__nunaAppointments=appointments;memory.__nunaAppointmentBlocks=blocks;

export async function listAppointments(){return [...appointments].sort((a,b)=>a.date.localeCompare(b.date));}
export async function getAppointment(id:string){return appointments.find(item=>item.id===id);}
export async function listDateBlocks(){return [...blocks].sort((a,b)=>a.date.localeCompare(b.date));}
export async function getActiveAppointmentByDate(date:string,excludeId?:string){return appointments.find(item=>item.date===date&&item.status==="SCHEDULED"&&item.id!==excludeId);}
export async function isAppointmentDateAvailable(date:string,excludeId?:string){if(isPastDate(date)||!isWorkingDay(date))return false;if(blocks.some(block=>block.date===date))return false;return !await getActiveAppointmentByDate(date,excludeId);}
export async function createAppointment(input:AppointmentFormData){if(!await isAppointmentDateAvailable(input.date))throw new Error("DATE_UNAVAILABLE");const appointment:Appointment={...input,id:`apt-${crypto.randomUUID()}`,status:"SCHEDULED",createdAt:new Date().toISOString()};appointments.push(appointment);return appointment;}
export async function updateAppointment(id:string,input:AppointmentFormData){const index=appointments.findIndex(item=>item.id===id);if(index<0)return undefined;if(!await isAppointmentDateAvailable(input.date,id))throw new Error("DATE_UNAVAILABLE");appointments[index]={...appointments[index],...input};return appointments[index];}
export async function setAppointmentStatus(id:string,status:AppointmentStatus,serviceOrderId?:string){const appointment=appointments.find(item=>item.id===id);if(!appointment)return undefined;appointment.status=status;if(serviceOrderId)appointment.serviceOrderId=serviceOrderId;return appointment;}
export async function createDateBlock(date:string,reason:string){if(isPastDate(date)||!isWorkingDay(date)||await getActiveAppointmentByDate(date))throw new Error("DATE_UNAVAILABLE");const existing=blocks.find(item=>item.date===date);if(existing)return existing;const block={id:`block-${crypto.randomUUID()}`,date,reason};blocks.push(block);return block;}
export async function removeDateBlock(id:string){const index=blocks.findIndex(item=>item.id===id);if(index<0)return false;blocks.splice(index,1);return true;}
export async function upcomingAppointments(limit=5){const today=new Intl.DateTimeFormat("en-CA",{timeZone:"America/Sao_Paulo"}).format(new Date());return (await listAppointments()).filter(item=>item.status==="SCHEDULED"&&item.date>=today).slice(0,limit);}
