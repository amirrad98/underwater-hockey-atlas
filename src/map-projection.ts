// Plate carrée / equirectangular: the full world, north up, centred on 0°.
// Keep this extent and the rendered map's 2:1 aspect ratio together. The local
// Natural Earth SVG generator and community pins both use this projection.
export const WORLD_EXTENT = { width: 360, height: 180 } as const;

export function projectWorldPoint(latitude: number, longitude: number) {
  return { x: longitude + 180, y: 90 - latitude };
}
