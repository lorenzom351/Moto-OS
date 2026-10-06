import { z } from "zod";
import { plateSchema } from "@/lib/validation/schemas";
import { normalizeWhatsapp } from "@/lib/utils/formatters";
export const appointmentSchema=z.object({date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/),customerName:z.string().trim().min(2,"Informe o nome do cliente."),whatsapp:z.string().transform(normalizeWhatsapp).refine(value=>value.length===10||value.length===11,"Informe um WhatsApp válido."),plate:plateSchema,model:z.string().min(1,"Selecione o modelo."),year:z.coerce.number().int().min(1970).max(new Date().getFullYear()+1),plannedService:z.string().trim().min(3,"Informe o serviço previsto."),notes:z.string().trim().optional()});
export const dateBlockSchema=z.object({date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/),reason:z.string().trim().min(3,"Informe o motivo do bloqueio.")});
export const appointmentStatusSchema=z.enum(["SCHEDULED","COMPLETED","CANCELLED","NO_SHOW"]);
