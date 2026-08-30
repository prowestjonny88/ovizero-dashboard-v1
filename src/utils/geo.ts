export interface GeoPoint {
  lat: number;
  lng: number;
}

export const createConvexHull = (points: GeoPoint[]): GeoPoint[] => {
  if (points.length <= 3) return points;
  
  const sorted = [...points].sort((a, b) => a.lat === b.lat ? a.lng - b.lng : a.lat - b.lat);
  
  const cross = (o: GeoPoint, a: GeoPoint, b: GeoPoint) => {
    return (a.lat - o.lat) * (b.lng - o.lng) - (a.lng - o.lng) * (b.lat - o.lat);
  };
  
  const lower: GeoPoint[] = [];
  for (const p of sorted) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
      lower.pop();
    }
    lower.push(p);
  }
  
  const upper: GeoPoint[] = [];
  for (let i = sorted.length - 1; i >= 0; i--) {
    const p = sorted[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
      upper.pop();
    }
    upper.push(p);
  }
  
  upper.pop();
  lower.pop();
  return lower.concat(upper);
};

export const expandPolygonFromCentroid = (points: GeoPoint[], scale = 1.18): GeoPoint[] => {
  if (points.length === 0) return [];
  const cx = points.reduce((sum, p) => sum + p.lat, 0) / points.length;
  const cy = points.reduce((sum, p) => sum + p.lng, 0) / points.length;
  
  return points.map(p => ({
    lat: cx + (p.lat - cx) * scale,
    lng: cy + (p.lng - cy) * scale
  }));
};

export interface ProjectionBounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

export const createProjectionBounds = (points: GeoPoint[], paddingRatio = 0.25): ProjectionBounds => {
  if (points.length === 0) return { minLat: 0, maxLat: 0, minLng: 0, maxLng: 0 };
  const minLat = Math.min(...points.map(p => p.lat));
  const maxLat = Math.max(...points.map(p => p.lat));
  const minLng = Math.min(...points.map(p => p.lng));
  const maxLng = Math.max(...points.map(p => p.lng));
  
  const latPad = (maxLat - minLat) * paddingRatio || 0.002;
  const lngPad = (maxLng - minLng) * paddingRatio || 0.002;
  
  return {
    minLat: minLat - latPad,
    maxLat: maxLat + latPad,
    minLng: minLng - lngPad,
    maxLng: maxLng + lngPad
  };
};

export const projectGeoPoint = (
  point: GeoPoint,
  bounds: ProjectionBounds,
  width = 100,
  height = 100
): { x: number; y: number } => {
  const latRange = bounds.maxLat - bounds.minLat || 1;
  const lngRange = bounds.maxLng - bounds.minLng || 1;
  
  const x = ((point.lng - bounds.minLng) / lngRange) * width;
  const y = height - ((point.lat - bounds.minLat) / latRange) * height;
  
  return { x, y };
};


