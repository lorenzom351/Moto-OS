import { WORKSHOP_SCHEDULE } from "@/config/workshop-schedule";

export function todayISO(){return new Intl.DateTimeFormat("en-CA",{timeZone:WORKSHOP_SCHEDULE.timeZone}).format(new Date());}
export function parseISODate(value:string){const [year,month,day]=value.split("-").map(Number);return new Date(year,month-1,day,12);}
export function toISODate(date:Date){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;}
export function addDays(value:string,days:number){const date=parseISODate(value);date.setDate(date.getDate()+days);return toISODate(date);}
export function isPastDate(value:string){return value<todayISO();}
export function isWorkingDay(value:string){return WORKSHOP_SCHEDULE.workingWeekdays.includes(parseISODate(value).getDay() as 1|2|3|4|5|6);}
export function formatLongDate(value:string){return new Intl.DateTimeFormat("pt-BR",{day:"2-digit",month:"long",year:"numeric"}).format(parseISODate(value));}
export function formatShortDate(value:string){return new Intl.DateTimeFormat("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric"}).format(parseISODate(value));}
export function formatDayMonth(value:string){return new Intl.DateTimeFormat("pt-BR",{day:"2-digit",month:"2-digit"}).format(parseISODate(value));}
export function weekdayName(value:string){return new Intl.DateTimeFormat("pt-BR",{weekday:"long"}).format(parseISODate(value));}
export function monthLabel(year:number,month:number){return new Intl.DateTimeFormat("pt-BR",{month:"long",year:"numeric"}).format(new Date(year,month,1));}
