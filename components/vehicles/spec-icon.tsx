import {
  ArrowDownToLine,
  Battery,
  Camera,
  Code2,
  Cpu,
  Fan,
  Gauge,
  Layers,
  type LucideIcon,
  Radar,
  Radio,
  Ruler,
  Timer,
  Waves,
  Weight,
  Zap,
} from "lucide-react";

/**
 * Sanity'deki `specItem.icon` değerlerinin lucide karşılıkları.
 * Anahtarlar `sanity/schemas/objects/specItem.ts` içindeki SPEC_ICONS ile aynı;
 * bilinmeyen ya da boş değerler Gauge'a düşer.
 */
const SPEC_ICON_MAP: Record<string, LucideIcon> = {
  default: Gauge,
  weight: Weight,
  dimensions: Ruler,
  depth: ArrowDownToLine,
  speed: Waves,
  thruster: Fan,
  battery: Battery,
  power: Zap,
  runtime: Timer,
  camera: Camera,
  sensor: Radar,
  computer: Cpu,
  comms: Radio,
  material: Layers,
  pressure: Gauge,
  software: Code2,
};

export function specIcon(icon: string | null | undefined): LucideIcon {
  return (icon && SPEC_ICON_MAP[icon]) || Gauge;
}
