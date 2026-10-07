import type { ServiceOrder, ServiceOrderForm, ServiceOrderItem } from "@/types/service-order";
import { assertSupabaseResult, getSupabaseAdmin } from "@/lib/supabase/server";
import { normalizePlate } from "@/lib/utils/formatters";

type ServiceOrderRow = {
  id: number | string;
  customer_name: string;
  whatsapp: string;
  plate: string;
  model: string;
  year: number;
  mileage: number;
  service_date: string;
  services_performed: ServiceOrderItem[];
  replaced_parts: ServiceOrderItem[];
  total_cents: number;
  notes: string | null;
  appointment_id: string | null;
};

const columns = "id,customer_name,whatsapp,plate,model,year,mileage,service_date,services_performed,replaced_parts,total_cents,notes,appointment_id";

function toServiceOrder(row: ServiceOrderRow): ServiceOrder {
  const id = String(row.id);
  return {
    id,
    number: `OS-${id.padStart(6, "0")}`,
    customerName: row.customer_name,
    whatsapp: row.whatsapp,
    plate: row.plate,
    model: row.model,
    year: row.year,
    mileage: row.mileage,
    date: row.service_date,
    servicesPerformed: row.services_performed ?? [],
    replacedParts: row.replaced_parts ?? [],
    totalCents: row.total_cents,
    notes: row.notes ?? undefined,
    appointmentId: row.appointment_id ?? undefined,
  };
}

function toRow(input: ServiceOrderForm) {
  return {
    customer_name: input.customerName,
    whatsapp: input.whatsapp,
    plate: normalizePlate(input.plate),
    model: input.model,
    year: input.year,
    mileage: input.mileage,
    service_date: input.date,
    services_performed: input.servicesPerformed,
    replaced_parts: input.replacedParts,
    total_cents: input.totalCents,
    notes: input.notes || null,
    appointment_id: input.appointmentId || null,
  };
}

function numericId(value: string) {
  const normalized = value.toUpperCase().startsWith("OS-") ? value.slice(3) : value;
  return /^\d+$/.test(normalized) ? Number(normalized) : null;
}

export async function listServiceOrders() {
  const { data, error } = await getSupabaseAdmin().from("service_orders").select(columns).order("service_date", { ascending: false }).order("id", { ascending: false });
  assertSupabaseResult(error);
  return (data as ServiceOrderRow[]).map(toServiceOrder);
}

export async function getServiceOrder(id: string) {
  const parsedId = numericId(id);
  if (parsedId === null) return undefined;
  const { data, error } = await getSupabaseAdmin().from("service_orders").select(columns).eq("id", parsedId).maybeSingle();
  assertSupabaseResult(error);
  return data ? toServiceOrder(data as ServiceOrderRow) : undefined;
}

export async function findByPlate(plate: string) {
  const { data, error } = await getSupabaseAdmin().from("service_orders").select(columns).eq("plate", normalizePlate(plate)).order("service_date", { ascending: false }).order("id", { ascending: false });
  assertSupabaseResult(error);
  return (data as ServiceOrderRow[]).map(toServiceOrder);
}

export async function searchServiceOrders(query: string) {
  const term = query.trim();
  if (!term) return listServiceOrders();
  const safeTerm = term.replace(/[%_,()]/g, "");
  if (!safeTerm) return [];
  const filters = [`plate.ilike.%${normalizePlate(safeTerm)}%`, `model.ilike.%${safeTerm}%`];
  if (/^\d{4}$/.test(safeTerm)) filters.push(`year.eq.${safeTerm}`);
  const { data, error } = await getSupabaseAdmin().from("service_orders").select(columns).or(filters.join(",")).order("service_date", { ascending: false }).order("id", { ascending: false });
  assertSupabaseResult(error);
  return (data as ServiceOrderRow[]).map(toServiceOrder);
}

export async function createServiceOrder(input: ServiceOrderForm) {
  const { data, error } = await getSupabaseAdmin().from("service_orders").insert(toRow(input)).select(columns).single();
  assertSupabaseResult(error);
  return toServiceOrder(data as ServiceOrderRow);
}

export async function updateServiceOrder(id: string, input: ServiceOrderForm) {
  const parsedId = numericId(id);
  if (parsedId === null) return undefined;
  const { data, error } = await getSupabaseAdmin().from("service_orders").update(toRow(input)).eq("id", parsedId).select(columns).maybeSingle();
  assertSupabaseResult(error);
  return data ? toServiceOrder(data as ServiceOrderRow) : undefined;
}

export async function deleteServiceOrder(id: string) {
  const parsedId = numericId(id);
  if (parsedId === null) return false;
  const { data, error } = await getSupabaseAdmin().from("service_orders").delete().eq("id", parsedId).select("id").maybeSingle();
  assertSupabaseResult(error);
  return Boolean(data);
}
