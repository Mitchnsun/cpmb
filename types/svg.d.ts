/**
 * SVG module declarations for @svgr/webpack loader.
 * This allows importing SVG files as React components.
 */
declare module "*.svg" {
  import type { FC, SVGProps } from "react";
  const content: FC<SVGProps<SVGSVGElement>>;
  export default content;
}
