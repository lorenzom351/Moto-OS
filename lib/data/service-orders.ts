import type { ServiceOrder,ServiceOrderForm } from "@/types/service-order";
import { normalizePlate } from "@/lib/utils/formatters";
const seed:ServiceOrder[]=[
  {id:"127",number:"OS-000127",customerName:"João da Silva",whatsapp:"81999999999",plate:"ABC1D23",model:"Honda CG 160 Fan",year:2024,mileage:18540,date:"2026-09-28",servicesPerformed:[{description:"Troca de óleo",valueCents:5000},{description:"Revisão dos freios",valueCents:10000}],replacedParts:[{description:"Óleo Honda 10W30",valueCents:15000},{description:"Filtro de óleo",valueCents:8500}],totalCents:38500,notes:"Corrente ajustada e lubrificada."},
  {id:"118",number:"OS-000118",customerName:"João da Silva",whatsapp:"81999999999",plate:"ABC1D23",model:"Honda CG 160 Fan",year:2024,mileage:14310,date:"2026-07-11",servicesPerformed:[{description:"Regulagem da corrente"},{description:"Inspeção geral"}],replacedParts:[],totalCents:16500},
  {id:"126",number:"OS-000126",customerName:"Mariana Costa",whatsapp:"81987654321",plate:"PGH4A82",model:"Honda NXR 160 Bros",year:2023,mileage:22780,date:"2026-09-27",servicesPerformed:[{description:"Revisão periódica",valueCents:20000},{description:"Troca de óleo",valueCents:5000}],replacedParts:[{description:"Óleo 10W30",valueCents:19000}],totalCents:44000},
  {id:"125",number:"OS-000125",customerName:"Carlos Almeida",whatsapp:"81981234567",plate:"KLM4821",model:"Honda Biz 125",year:2020,mileage:31405,date:"2026-09-25",servicesPerformed:[{description:"Troca de pneu traseiro",valueCents:8000}],replacedParts:[{description:"Pneu traseiro",valueCents:45000}],totalCents:53000},
];
const memory=globalThis as typeof globalThis&{__nunaOrders?:ServiceOrder[]};
const orders=memory.__nunaOrders??seed.map(order=>({...order})); memory.__nunaOrders=orders;
export async function listServiceOrders(){return [...orders].sort((a,b)=>b.date.localeCompare(a.date)||b.number.localeCompare(a.number));}
export async function getServiceOrder(id:string){return orders.find(order=>order.id===id||order.number===id);}
export async function findByPlate(plate:string){const p=normalizePlate(plate);return (await listServiceOrders()).filter(order=>order.plate===p);}
export async function searchServiceOrders(query:string){const term=query.trim().toLocaleLowerCase("pt-BR");if(!term)return listServiceOrders();return (await listServiceOrders()).filter(order=>order.plate.toLowerCase().includes(term)||order.model.toLowerCase().includes(term)||String(order.year).includes(term));}
export async function createServiceOrder(input:ServiceOrderForm){const next=Math.max(0,...orders.map(order=>Number(order.id)))+1;const order:ServiceOrder={...input,id:String(next),number:`OS-${String(next).padStart(6,"0")}`,plate:normalizePlate(input.plate)};orders.push(order);return order;}
export async function updateServiceOrder(id:string,input:ServiceOrderForm){const index=orders.findIndex(order=>order.id===id);if(index<0)return undefined;orders[index]={...orders[index],...input,plate:normalizePlate(input.plate)};return orders[index];}
export async function deleteServiceOrder(id:string){const index=orders.findIndex(order=>order.id===id);if(index<0)return false;orders.splice(index,1);return true;}
