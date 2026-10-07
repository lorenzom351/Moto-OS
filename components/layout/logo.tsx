import Image from "next/image";

const BRAND_PATH = "/moto-os-identidade-completa/brand";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`relative shrink-0 ${compact ? "h-10 w-[156px]" : "h-20 w-[248px]"}`}>
      <Image
        src={`${BRAND_PATH}/moto-os-logo-white.svg`}
        alt="Moto OS"
        fill
        priority
        className="object-contain object-left"
        sizes={compact ? "156px" : "248px"}
      />
    </div>
  );
}
