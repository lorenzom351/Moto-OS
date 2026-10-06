export function normalizePlate(value:string){ return value.toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,7); }
export function isValidBrazilianPlate(value:string){ return /^[A-Z]{3}(?:\d[A-Z]\d{2}|\d{4})$/.test(normalizePlate(value)); }
export function normalizeWhatsapp(value:string){ return value.replace(/\D/g,"").slice(0,11); }
export function formatWhatsapp(value:string){ const d=normalizeWhatsapp(value); if(d.length<=2)return d; if(d.length<=6)return `(${d.slice(0,2)}) ${d.slice(2)}`; if(d.length<=10)return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`; return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`; }
export function formatCurrencyBRL(cents:number){ return new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(cents/100); }
export function parseCurrencyToCents(value:string){ const digits=value.replace(/\D/g,""); return digits?Number(digits):0; }
export function formatMileage(value:number){ return `${new Intl.NumberFormat("pt-BR").format(value)} km`; }
export function formatDateBR(value:string){ const [year,month,day]=value.split("-"); return `${day}/${month}/${year}`; }
