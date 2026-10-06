import { PDFDocument,StandardFonts,rgb,type PDFFont,type PDFPage,type RGB } from "pdf-lib";
import { getServiceOrder } from "@/lib/data/service-orders";
import { requireApiSession } from "@/lib/auth/session";
import { WORKSHOP } from "@/config/workshop";
import { formatCurrencyBRL,formatDateBR,formatMileage,formatWhatsapp } from "@/lib/utils/formatters";
import type { ServiceOrderItem } from "@/types/service-order";

export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){
  if(!await requireApiSession(request))return new Response("Sessão expirada.",{status:401});
  const order=await getServiceOrder((await params).id);if(!order)return new Response("Ordem de Serviço não encontrada.",{status:404});
  const pdf=await PDFDocument.create();const page=pdf.addPage([595.28,841.89]);const regular=await pdf.embedFont(StandardFonts.Helvetica);const bold=await pdf.embedFont(StandardFonts.HelveticaBold);const red=rgb(.9,0,.07);const black=rgb(.05,.05,.05);const gray=rgb(.38,.38,.38);const white=rgb(1,1,1);page.drawRectangle({x:0,y:742,width:595.28,height:99,color:black});page.drawRectangle({x:0,y:736,width:595.28,height:6,color:red});
  try{const logoResponse=await fetch(new URL(WORKSHOP.logo,request.url));if(logoResponse.ok){const logo=await pdf.embedPng(await logoResponse.arrayBuffer());const scale=Math.min(155/logo.width,72/logo.height);page.drawImage(logo,{x:32,y:756,width:logo.width*scale,height:logo.height*scale});}}catch{}
  page.drawText("ORDEM DE SERVIÇO",{x:370,y:794,size:9,font:bold,color:red});page.drawText(order.number,{x:370,y:766,size:20,font:bold,color:white});
  let y=705;const write=(label:string,value:string,x:number,width=245)=>{page.drawText(label.toUpperCase(),{x,y,size:7,font:bold,color:gray});const lines=wrap(value,width,regular,11);lines.forEach((line,index)=>page.drawText(line,{x,y:y-17-index*14,size:11,font:regular,color:black}));};
  write("Cliente",order.customerName,36);write("WhatsApp",formatWhatsapp(order.whatsapp),315);y-=55;write("Motocicleta",order.model,36);write("Ano / Placa",`${order.year}  ·  ${order.plate}`,315);y-=55;write("Quilometragem",formatMileage(order.mileage),36);write("Data",formatDateBR(order.date),315);y-=67;
  page.drawLine({start:{x:36,y:y+20},end:{x:559,y:y+20},thickness:1,color:rgb(.84,.84,.84)});y=drawList(page,"SERVIÇOS REALIZADOS",order.servicesPerformed,36,y,bold,regular,black,gray);y-=18;y=drawList(page,"PEÇAS SUBSTITUÍDAS",order.replacedParts.length?order.replacedParts:[{description:"Nenhuma peça substituída"}],36,y,bold,regular,black,gray);y-=22;
  if(order.notes){page.drawText("OBSERVAÇÕES",{x:36,y,size:8,font:bold,color:gray});y-=17;for(const line of wrap(order.notes,510,regular,10)){page.drawText(line,{x:36,y,size:10,font:regular,color:black});y-=14;}y-=10;}
  page.drawRectangle({x:315,y:y-30,width:244,height:54,color:rgb(.95,.95,.95)});page.drawText("VALOR TOTAL",{x:332,y:y+4,size:8,font:bold,color:gray});page.drawText(formatCurrencyBRL(order.totalCents),{x:332,y:y-19,size:20,font:bold,color:black});
  page.drawLine({start:{x:36,y:48},end:{x:559,y:48},thickness:1,color:rgb(.85,.85,.85)});page.drawText(`${WORKSHOP.name}  ·  ${WORKSHOP.phone}  ·  ${WORKSHOP.address}`,{x:36,y:31,size:7,font:regular,color:gray});page.drawText("Histórico de manutenção registrado pela oficina.",{x:345,y:31,size:7,font:regular,color:gray});
  const bytes=await pdf.save();return new Response(bytes.buffer as ArrayBuffer,{headers:{"content-type":"application/pdf","content-disposition":`inline; filename="${order.number}.pdf"`,"cache-control":"private, no-store"}});
}
function wrap(text:string,maxWidth:number,font:PDFFont,size:number){const words=text.split(/\s+/);const lines:string[]=[];let line="";for(const word of words){const test=line?`${line} ${word}`:word;if(font.widthOfTextAtSize(test,size)>maxWidth&&line){lines.push(line);line=word;}else line=test;}if(line)lines.push(line);return lines;}
function drawList(page:PDFPage,title:string,items:ServiceOrderItem[],x:number,y:number,bold:PDFFont,regular:PDFFont,black:RGB,gray:RGB){page.drawText(title,{x,y,size:8,font:bold,color:gray});y-=19;for(const item of items){const text=item.valueCents===undefined?item.description:`${item.description}  —  ${formatCurrencyBRL(item.valueCents)}`;page.drawCircle({x:x+3,y:y+4,size:2,color:rgb(.9,0,.07)});for(const line of wrap(text,495,regular,10)){page.drawText(line,{x:x+13,y,size:10,font:regular,color:black});y-=14;}y-=3;}return y;}
