import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { ServiceOrderFormView } from "@/components/forms/service-order-form";
import { getServiceOrder,listServiceOrders } from "@/lib/data/service-orders";
export default async function EditOrderPage({params}:{params:Promise<{id:string}>}){const id=(await params).id;const [orders,current]=await Promise.all([listServiceOrders(),getServiceOrder(id)]);if(!current)notFound();return <AppShell><PageHeader eyebrow={current.number} title="Editar Ordem de Serviço" description="Revise os dados do atendimento e salve as alterações."/><ServiceOrderFormView orders={orders} current={current}/></AppShell>}
