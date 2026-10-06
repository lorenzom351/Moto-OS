import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { ServiceOrderFormView } from "@/components/forms/service-order-form";
import { listServiceOrders } from "@/lib/data/service-orders";
import { getAppointment } from "@/lib/data/appointments";
export default async function NewOrderPage({searchParams}:{searchParams:Promise<{appointment?:string}>}){const appointmentId=(await searchParams).appointment;const [orders,appointment]=await Promise.all([listServiceOrders(),appointmentId?getAppointment(appointmentId):undefined]);const prefill=appointment?{customerName:appointment.customerName,whatsapp:appointment.whatsapp,plate:appointment.plate,model:appointment.model,year:appointment.year}:undefined;return <AppShell><PageHeader eyebrow="Atendimento" title="Nova Ordem de Serviço" description="Informe a placa primeiro para aproveitar os dados do último atendimento."/><ServiceOrderFormView orders={orders} prefill={prefill} appointmentId={appointment?.id} appointmentReference={appointment?.plannedService}/></AppShell>}
