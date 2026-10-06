export type MotorcycleCategory = "Streets" | "Scooters e CUBs" | "Trail" | "Off-Road";
export interface ServiceOrderItem { description:string; valueCents?:number; }
export interface ServiceOrder { id:string; number:string; customerName:string; whatsapp:string; plate:string; model:string; year:number; mileage:number; date:string; servicesPerformed:ServiceOrderItem[]; replacedParts:ServiceOrderItem[]; totalCents:number; notes?:string; appointmentId?:string; }
export type ServiceOrderForm = Omit<ServiceOrder,"id"|"number">;
export interface Motorcycle { plate:string; model:string; year:number; lastCustomerName:string; lastWhatsapp:string; orders:ServiceOrder[]; }
export interface AuthenticatedSession { username:string; expiresAt:number; }
export type ApiResponse<T> = { success:true; data:T } | { success:false; message:string };
