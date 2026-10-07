import type { Appointment, AppointmentDateBlock, AppointmentFormData, AppointmentStatus } from "@/types/appointment";
import { isPastDate, isWorkingDay } from "@/lib/appointments/date-utils";
import { assertSupabaseResult, getSupabaseAdmin } from "@/lib/supabase/server";

type AppointmentRow = {
  id: string;
  appointment_date: string;
  customer_name: string;
  whatsapp: string;
  plate: string;
  model: string;
  year: number;
  planned_service: string;
  notes: string | null;
  status: AppointmentStatus;
  service_order_id: number | string | null;
  created_at: string;
};

type DateBlockRow = { id: string; block_date: string; reason: string };
const appointmentColumns = "id,appointment_date,customer_name,whatsapp,plate,model,year,planned_service,notes,status,service_order_id,created_at";
const blockColumns = "id,block_date,reason";

function toAppointment(row: AppointmentRow): Appointment {
  return {
    id: row.id,
    date: row.appointment_date,
    customerName: row.customer_name,
    whatsapp: row.whatsapp,
    plate: row.plate,
    model: row.model,
    year: row.year,
    plannedService: row.planned_service,
    notes: row.notes ?? undefined,
    status: row.status,
    serviceOrderId: row.service_order_id === null ? undefined : String(row.service_order_id),
    createdAt: row.created_at,
  };
}

function toDateBlock(row: DateBlockRow): AppointmentDateBlock {
  return { id: row.id, date: row.block_date, reason: row.reason };
}

function appointmentRow(input: AppointmentFormData) {
  return {
    appointment_date: input.date,
    customer_name: input.customerName,
    whatsapp: input.whatsapp,
    plate: input.plate,
    model: input.model,
    year: input.year,
    planned_service: input.plannedService,
    notes: input.notes || null,
  };
}

function throwIfDateConflict(error: { code?: string; message: string } | null) {
  if (!error) return;
  if (error.code === "23505" || error.code === "P0001") throw new Error("DATE_UNAVAILABLE");
  assertSupabaseResult(error);
}

export async function listAppointments() {
  const { data, error } = await getSupabaseAdmin().from("appointments").select(appointmentColumns).order("appointment_date");
  assertSupabaseResult(error);
  return (data as AppointmentRow[]).map(toAppointment);
}

export async function getAppointment(id: string) {
  const { data, error } = await getSupabaseAdmin().from("appointments").select(appointmentColumns).eq("id", id).maybeSingle();
  assertSupabaseResult(error);
  return data ? toAppointment(data as AppointmentRow) : undefined;
}

export async function listDateBlocks() {
  const { data, error } = await getSupabaseAdmin().from("appointment_date_blocks").select(blockColumns).order("block_date");
  assertSupabaseResult(error);
  return (data as DateBlockRow[]).map(toDateBlock);
}

export async function getActiveAppointmentByDate(date: string, excludeId?: string) {
  let query = getSupabaseAdmin().from("appointments").select(appointmentColumns).eq("appointment_date", date).eq("status", "SCHEDULED");
  if (excludeId) query = query.neq("id", excludeId);
  const { data, error } = await query.limit(1).maybeSingle();
  assertSupabaseResult(error);
  return data ? toAppointment(data as AppointmentRow) : undefined;
}

export async function isAppointmentDateAvailable(date: string, excludeId?: string) {
  if (isPastDate(date) || !isWorkingDay(date)) return false;
  const [{ data: block, error: blockError }, appointment] = await Promise.all([
    getSupabaseAdmin().from("appointment_date_blocks").select("id").eq("block_date", date).limit(1).maybeSingle(),
    getActiveAppointmentByDate(date, excludeId),
  ]);
  assertSupabaseResult(blockError);
  return !block && !appointment;
}

export async function createAppointment(input: AppointmentFormData) {
  if (!await isAppointmentDateAvailable(input.date)) throw new Error("DATE_UNAVAILABLE");
  const { data, error } = await getSupabaseAdmin().from("appointments").insert(appointmentRow(input)).select(appointmentColumns).single();
  throwIfDateConflict(error);
  return toAppointment(data as AppointmentRow);
}

export async function updateAppointment(id: string, input: AppointmentFormData) {
  if (!await isAppointmentDateAvailable(input.date, id)) throw new Error("DATE_UNAVAILABLE");
  const { data, error } = await getSupabaseAdmin().from("appointments").update(appointmentRow(input)).eq("id", id).select(appointmentColumns).maybeSingle();
  throwIfDateConflict(error);
  return data ? toAppointment(data as AppointmentRow) : undefined;
}

export async function setAppointmentStatus(id: string, status: AppointmentStatus, serviceOrderId?: string) {
  const changes: { status: AppointmentStatus; service_order_id?: number } = { status };
  if (serviceOrderId) changes.service_order_id = Number(serviceOrderId);
  const { data, error } = await getSupabaseAdmin().from("appointments").update(changes).eq("id", id).select(appointmentColumns).maybeSingle();
  throwIfDateConflict(error);
  return data ? toAppointment(data as AppointmentRow) : undefined;
}

export async function createDateBlock(date: string, reason: string) {
  if (isPastDate(date) || !isWorkingDay(date) || await getActiveAppointmentByDate(date)) throw new Error("DATE_UNAVAILABLE");
  const { data, error } = await getSupabaseAdmin().from("appointment_date_blocks").insert({ block_date: date, reason }).select(blockColumns).single();
  throwIfDateConflict(error);
  return toDateBlock(data as DateBlockRow);
}

export async function removeDateBlock(id: string) {
  const { data, error } = await getSupabaseAdmin().from("appointment_date_blocks").delete().eq("id", id).select("id").maybeSingle();
  assertSupabaseResult(error);
  return Boolean(data);
}

export async function upcomingAppointments(limit = 5) {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(new Date());
  const { data, error } = await getSupabaseAdmin().from("appointments").select(appointmentColumns).eq("status", "SCHEDULED").gte("appointment_date", today).order("appointment_date").limit(limit);
  assertSupabaseResult(error);
  return (data as AppointmentRow[]).map(toAppointment);
}
