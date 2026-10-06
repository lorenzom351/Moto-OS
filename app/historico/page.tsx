import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { HistorySearch } from "@/components/service-orders/history-search";
import { listServiceOrders } from "@/lib/data/service-orders";
export default async function HistoryPage({searchParams}:{searchParams:Promise<{q?:string}>}){const orders=await listServiceOrders();const q=(await searchParams).q??"";return <AppShell><PageHeader eyebrow="Consulta" title="Histórico de manutenções" description="Encontre uma motocicleta pela placa, modelo ou ano."/><HistorySearch orders={orders} initial={q}/></AppShell>}
