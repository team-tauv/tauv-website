import type { DetailedHTMLProps, HTMLAttributes } from "react";

/**
 * <model-viewer> bir web component; React'in bildiği bir eleman değil.
 * Kullandığımız öznitelikleri JSX'e tanıtıyoruz — hepsini değil, sadece
 * components/vehicles/vehicle-model-viewer.tsx içinde geçenleri.
 *
 * Tam öznitelik listesi: https://modelviewer.dev/docs/
 */
interface ModelViewerAttributes extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  src?: string;
  alt?: string;
  poster?: string;
  ar?: boolean;
  "ar-modes"?: string;
  "camera-controls"?: boolean;
  "touch-action"?: string;
  "shadow-intensity"?: string;
  "environment-image"?: string;
  exposure?: string;
  "auto-rotate"?: boolean;
  "auto-rotate-delay"?: string;
  "rotation-per-second"?: string;
  "interaction-prompt"?: "auto" | "none";
  "camera-orbit"?: string;
  "min-camera-orbit"?: string;
  "max-camera-orbit"?: string;
  "field-of-view"?: string;
  loading?: "auto" | "lazy" | "eager";
  reveal?: "auto" | "manual";
}

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": ModelViewerAttributes;
    }
  }
}
