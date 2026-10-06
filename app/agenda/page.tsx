import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { AppointmentCalendar } from "@/components/appointments/appointment-calendar";
import { HistorySearch } from "@/components/service-orders/history-search";
import { listAppointments,listDateBlocks } from "@/lib/data/appointments";
import { listServiceOrders } from "@/lib/data/service-orders";
export default async function AgendaPage(){const [appointments,blocks,orders]=await Promise.all([listAppointments(),listDateBlocks(),listServiceOrders()]);return <AppShell><PageHeader eyebrow="Planejamento" title="Agenda de revisões" description="Uma revisão por dia. Clique em uma data disponível para agendar ou em uma data ocupada para ver os detalhes."/><AppointmentCalendar initialAppointments={appointments} initialBlocks={blocks}/><section className="mt-8 border-t border-[#2b2b2b] pt-8"><div className="mb-5"><p className="text-xs font-black uppercase tracking-[.18em] text-[#e60012]">Consulta</p><h2 className="mt-2 text-2xl font-black text-white">Revisões realizadas</h2><p className="mt-2 text-sm text-[#999]">Consulte ordens de serviço concluídas sem sair da agenda.</p></div><HistorySearch orders={orders}/></section></AppShell>}
