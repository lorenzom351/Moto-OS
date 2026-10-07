import Image from "next/image";

const BRAND_PATH = "/moto-os-identidade-completa/brand";

export function Logo({ compact = false }: { compact?: boolean }) {
  const width = compact ? 156 : 249;
  const height = compact ? 40 : 64;

  return (
    <div className="shrink-0" style={{ width, height }}>
      <Image
        src={`${BRAND_PATH}/moto-os-logo-white.svg`}
        alt="Moto OS"
        width={width}
        height={height}
        priority
        className="block h-full w-full object-contain"
        sizes={`${width}px`}
      />
    </div>
  );
}
