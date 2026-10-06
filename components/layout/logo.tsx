import Image from "next/image";
export function Logo({ compact=false }: { compact?:boolean }) { return <div className={`relative ${compact?"h-12 w-32":"h-20 w-52"}`}><Image src="/images/nuna-moto-logo.png" alt="NUNA MOTO" fill priority className="object-contain object-left" sizes={compact?"128px":"208px"}/></div>; }
