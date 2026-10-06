export type AppointmentStatus="SCHEDULED"|"COMPLETED"|"CANCELLED"|"NO_SHOW";
export interface Appointment { id:string; date:string; customerName:string; whatsapp:string; plate:string; model:string; year:number; plannedService:string; notes?:string; status:AppointmentStatus; serviceOrderId?:string; createdAt:string; }
export type AppointmentFormData=Omit<Appointment,"id"|"status"|"serviceOrderId"|"createdAt">;
export interface AppointmentDateBlock { id:string; date:string; reason:string; }
