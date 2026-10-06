import type { MotorcycleCategory } from "@/types/service-order";
export const MOTORCYCLE_MODELS: Record<MotorcycleCategory,readonly string[]> = {
  Streets:["Honda ADV 150","Honda ADV 160","Honda CB 250F Twister","Honda CB 300F Twister","Honda CB 300R","Honda CBX 200 Strada","Honda CBX 250 Twister","Honda CG 125 Cargo","Honda CG 125 Fan","Honda CG 125 Titan","Honda CG 150 Cargo","Honda CG 150 Fan","Honda CG 150 Job","Honda CG 150 Start","Honda CG 150 Titan","Honda CG 160 Cargo","Honda CG 160 Fan","Honda CG 160 Start","Honda CG 160 Titan"],
  "Scooters e CUBs":["Honda Biz 100","Honda Biz 110i","Honda Biz 125","Honda Elite 125","Honda Lead 110","Honda PCX 150","Honda PCX 160","Honda Pop 100","Honda Pop 110i"],
  Trail:["Honda NXR 125 Bros","Honda NXR 150 Bros","Honda NXR 160 Bros","Honda XR 200R","Honda XR 250 Tornado","Honda XR 300L Tornado","Honda XRE 190","Honda XRE 300","Honda XRE 300 Sahara","Honda XLR 125"],
  "Off-Road":["Honda CRF 230F","Honda CRF 250F"],
};
