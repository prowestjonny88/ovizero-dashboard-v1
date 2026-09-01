import React, { useEffect, useRef, useState } from 'react';
import { GeoPoint, createConvexHull, expandPolygonFromCentroid, createProjectionBounds, projectGeoPoint } from '../utils/geo';
import { ProposedGateway } from '../types';
import { PilotNodeViewModel } from '../types';
import { ArrowUpRight } from 'lucide-react';

export interface GoogleRiskMapProps {
  viewModels: PilotNodeViewModel[];
  filteredNodes: PilotNodeViewModel[];
  gateways: ProposedGateway[];
  selectedDeviceId: string | null;
  onDeviceSelect: (deviceId: string) => void;
  getRiskColor: (status: string) => string;
  getRiskBorderColor: (status: string) => string;
  mapMode: 'risk' | 'network';
  showIllustrativeEggCount?: boolean;
  showSignalQuality?: boolean;
  variant?: 'compact' | 'full';
  onOpenRiskMap?: () => void;
}

const mapStyles = [
  { featureType: 'all', elementType: 'labels.text.fill', stylers: [{ color: '#7c93a3' }, { lightness: '-10' }] },
  { featureType: 'administrative.country', elementType: 'geometry', stylers: [{ visibility: 'on' }] },
  { featureType: 'administrative.country', elementType: 'geometry.stroke', stylers: [{ color: '#a0a4a5' }] },
  { featureType: 'administrative.province', elementType: 'geometry.stroke', stylers: [{ color: '#a0a4a5' }] },
  { featureType: 'water', elementType: 'geometry.fill', stylers: [{ color: '#e8ecef' }] },
  { featureType: 'landscape.man_made', elementType: 'geometry.fill', stylers: [{ color: '#fcfcfc' }] },
  { featureType: 'landscape.natural', elementType: 'geometry.fill', stylers: [{ color: '#f5f7f6' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#e2e6e4' }] },
  { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ visibility: 'simplified' }] },
  { featureType: 'transit', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ visibility: 'simplified' }] },
  { featureType: 'administrative', elementType: 'labels', stylers: [{ visibility: 'simplified' }] },
  { featureType: 'road', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] }
];

const createNodeMarkerSvg = (deviceId: string, riskColor: string, borderColor: string, isSelected: boolean, isDimmed: boolean) => {
  const width = isSelected ? 70 : 60;
  const height = isSelected ? 56 : 48;
  const cx = width / 2;
  const cy = height / 2;
  const r = isSelected ? 16 : 14;
  const strokeWidth = isSelected ? 3 : 2;
  const opacity = isDimmed ? 0.5 : 1;

  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="${isSelected ? 3 : 2}" flood-color="#000" flood-opacity="${isSelected ? 0.3 : 0.15}"/>
        </filter>
      </defs>
      
      ${isSelected ? `<circle cx="${cx}" cy="${cy}" r="${r + 4}" fill="none" stroke="${borderColor}" stroke-width="2" stroke-opacity="0.25" />` : ''}
      
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="#ffffff" fill-opacity="${opacity}" stroke="${borderColor}" stroke-width="${strokeWidth}" filter="url(#shadow)" />
      
      <circle cx="${cx}" cy="${cy}" r="${r - 2.5}" fill="${riskColor}" fill-opacity="${opacity * 0.9}" stroke="none" />
      
      <!-- ID Pill -->
      <rect x="${cx - 22}" y="${cy - 22}" width="44" height="15" rx="4" fill="#ffffff" stroke="${isDimmed ? '#d4d4d8' : borderColor}" stroke-width="1" />
      <text x="${cx}" y="${cy - 11}" font-family="sans-serif" font-size="11" font-weight="bold" fill="${isDimmed ? '#a1a1aa' : '#052e1a'}" text-anchor="middle">${deviceId}</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const createGatewayMarkerSvg = (gateway: ProposedGateway) => {
  const isFuture = gateway.stage === 'Future';
  const opacity = isFuture ? 0.4 : 1;
  const strokeColor = isFuture ? '#9ca3af' : '#1b7f47';
  const circleColor = isFuture ? '#f3f4f6' : '#e8f4ed';
  
  const svg = `
    <svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" opacity="${opacity}">
      <defs>
        <filter id="gw-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.15"/>
        </filter>
      </defs>
      <circle cx="30" cy="24" r="14" fill="${circleColor}" stroke="${strokeColor}" stroke-width="2" filter="url(#gw-shadow)"/>
      <path d="M 30,16 L 30,32" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round"/>
      <circle cx="30" cy="14" r="2.5" fill="${strokeColor}"/>
      <path d="M 24,20 A 8 8 0 0 1 36,20" fill="none" stroke="${strokeColor}" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M 20,24 A 14 14 0 0 1 40,24" fill="none" stroke="${strokeColor}" stroke-width="1.5" stroke-linecap="round"/>
      
      <rect x="15" y="42" width="30" height="14" rx="4" fill="#ffffff" stroke="${strokeColor}" stroke-width="1" />
      <text x="30" y="52" font-family="sans-serif" font-size="9" font-weight="bold" fill="#052e1a" text-anchor="middle">${gateway.id}</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

export default function GoogleRiskMap({
  viewModels,
  filteredNodes,
  gateways,
  selectedDeviceId,
  onDeviceSelect,
  getRiskColor,
  getRiskBorderColor,
  mapMode,
  showIllustrativeEggCount,
  showSignalQuality,
  variant,
  onOpenRiskMap
}: GoogleRiskMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  
  const markerRefs = useRef<google.maps.Marker[]>([]);
  const circleRefs = useRef<google.maps.Circle[]>([]);
  const polygonRefs = useRef<google.maps.Polygon[]>([]);
  const polylineRefs = useRef<google.maps.Polyline[]>([]);
  const labelRefs = useRef<google.maps.Marker[]>([]);

  const clearMapOverlays = () => {
    markerRefs.current.forEach(m => {
      google.maps.event.clearInstanceListeners(m);
      m.setMap(null);
    });
    markerRefs.current = [];
    circleRefs.current.forEach(c => c.setMap(null));
    circleRefs.current = [];
    polygonRefs.current.forEach(p => p.setMap(null));
    polygonRefs.current = [];
    polylineRefs.current.forEach(p => p.setMap(null));
    polylineRefs.current = [];
    labelRefs.current.forEach(l => {
      google.maps.event.clearInstanceListeners(l);
      l.setMap(null);
    });
    labelRefs.current = [];
  };
  
  // Helper for Egg Count bubble sizing
  const getEggBubbleRadius = (eggCount: number, isSvg: boolean = false): number => {
    if (viewModels.length === 0) return isSvg ? 3 : 15;
    const minEggCount = Math.min(...viewModels.map(n => n.riskProfile.syntheticEggActivity || 0));
    const maxEggCount = Math.max(...viewModels.map(n => n.riskProfile.syntheticEggActivity || 0));
    
    const minRadius = isSvg ? 3 : 14;
    const maxRadius = isSvg ? 8 : 34;
    
    if (maxEggCount === minEggCount) return (minRadius + maxRadius) / 2;
    const normalized = (eggCount - minEggCount) / (maxEggCount - minEggCount);
    return minRadius + Math.sqrt(normalized) * (maxRadius - minRadius);
  };

  const apiKey = (import.meta as unknown as { env: { VITE_GOOGLE_MAPS_API_KEY: string } }).env.VITE_GOOGLE_MAPS_API_KEY;
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [apiError, setApiError] = useState(false);

  // Initialize Map API
  useEffect(() => {
    if (!apiKey) {
      setApiError(true);
      return;
    }
    
    // Add global auth failure handler
    (window as any).gm_authFailure = () => {
      console.error("Google Maps authentication failed (e.g. RefererNotAllowedMapError). Falling back to schematic map.");
      setApiError(true);
    };

    const google = (window as any).google;
    if (google && google.maps) {
      setIsApiLoaded(true);
      return;
    }
    const scriptId = 'google-maps-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
      script.async = true;
      script.defer = true;
      script.onload = () => setIsApiLoaded(true);
      script.onerror = () => setApiError(true);
      document.head.appendChild(script);
    } else {
      const checkLoaded = setInterval(() => {
        if ((window as any).google?.maps) {
          clearInterval(checkLoaded);
          setIsApiLoaded(true);
        }
      }, 100);
      return () => clearInterval(checkLoaded);
    }
  }, [apiKey]);

  // Effect A: Map Initialization
  useEffect(() => {
    if (!isApiLoaded || apiError || !containerRef.current || mapInstanceRef.current) return;
    try {
      const google = (window as unknown as { google: typeof google }).google;
      
      // Calculate pilot center
      let centerLat = 0, centerLng = 0;
      if (viewModels.length > 0) {
        centerLat = viewModels.reduce((acc, vm) => acc + vm.latitude, 0) / viewModels.length;
        centerLng = viewModels.reduce((acc, vm) => acc + vm.longitude, 0) / viewModels.length;
      } else {
        centerLat = 3.0838; centerLng = 101.7380;
      }

      mapInstanceRef.current = new google.maps.Map(containerRef.current, {
        center: { lat: centerLat, lng: centerLng },
        zoom: 16,
        styles: mapStyles,
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: 'cooperative',
        clickableIcons: false,
        keyboardShortcuts: false
      });
    } catch (e) {
      console.error('Error initializing map', e);
    }
  }, [isApiLoaded, apiError, viewModels]);

  // Effect B: Viewport Fitting
  useEffect(() => {
    if (!mapInstanceRef.current || !isApiLoaded) return;
    
    const fitMap = () => {
      try {
        const google = (window as unknown as { google: typeof google }).google;
        const bounds = new google.maps.LatLngBounds();
        let hasPoints = false;

        // Fit all device locations
        viewModels.forEach(vm => {
          bounds.extend({ lat: vm.latitude, lng: vm.longitude });
          hasPoints = true;
        });
        
        // Fit pilot boundary hull
        const allPoints: GeoPoint[] = viewModels.map(vm => ({ lat: vm.latitude, lng: vm.longitude }));
        const hull = createConvexHull(allPoints);
        const expandedHull = expandPolygonFromCentroid(hull, 1.18);
        expandedHull.forEach(p => {
          bounds.extend({ lat: p.lat, lng: p.lng });
        });

        // Fit active gateways
        if (mapMode === 'network') {
          gateways.filter(g => g.stage !== 'Future').forEach(g => {
            bounds.extend({ lat: g.latitude, lng: g.longitude });
            hasPoints = true;
          });
        }

        if (hasPoints) {
          const padding = window.innerWidth < 640 ? 28 : (window.innerWidth < 1024 ? 48 : 72);
          mapInstanceRef.current.fitBounds(bounds, padding);
          
          const map = mapInstanceRef.current;
          google.maps.event.addListenerOnce(map, 'idle', () => {
            const zoom = map.getZoom();
            if (zoom && zoom < 15) {
              map.setZoom(15);
            }
            if (zoom && zoom > 17) {
              map.setZoom(17);
            }
          });
        }
      } catch (e) {
        console.error('Error fitting bounds', e);
      }
    };
    
    fitMap();
    
    window.addEventListener('resize', fitMap);
    return () => window.removeEventListener('resize', fitMap);
  }, [viewModels, mapMode, gateways, isApiLoaded]);

  // Effect C: Overlays
  useEffect(() => {
    if (!mapInstanceRef.current || !isApiLoaded) return;
    try {
      const google = (window as unknown as { google: typeof google }).google;
      const map = mapInstanceRef.current;
      
      clearMapOverlays();
      
      const allPoints: GeoPoint[] = viewModels.map(vm => ({ lat: vm.latitude, lng: vm.longitude }));
      const hull = createConvexHull(allPoints);
      const expandedHull = expandPolygonFromCentroid(hull, 1.18);

      const boundaryPolygon = new google.maps.Polygon({
        paths: expandedHull,
        strokeColor: '#1B7F47',
        strokeOpacity: 0.35,
        strokeWeight: 1.25,
        fillColor: '#EAF5EE',
        fillOpacity: 0.08,
        map,
        zIndex: 1,
        clickable: false
      });
      polygonRefs.current.push(boundaryPolygon);
      


      // Gateways & Links (Network View)
      if (mapMode === 'network') {
        gateways.filter(g => g.stage !== 'Future').forEach(gw => {
          const gwMarker = new google.maps.Marker({
            position: { lat: gw.latitude, lng: gw.longitude },
            map,
            icon: {
              url: createGatewayMarkerSvg(gw),
              scaledSize: new google.maps.Size(60, 60),
              anchor: new google.maps.Point(30, 30)
            },
            title: `Proposed Gateway: ${gw.id}`,
            zIndex: 10,
            clickable: false
          });
          markerRefs.current.push(gwMarker);
        });

        // Direct dashed links
        filteredNodes.forEach(vm => {
          if (!vm.gateway || vm.gateway.stage === 'Future') return;
          const isSelected = selectedDeviceId === vm.deviceId;
          
          const line = new google.maps.Polyline({
            path: [
              { lat: vm.gateway.latitude, lng: vm.gateway.longitude },
              { lat: vm.latitude, lng: vm.longitude }
            ],
            geodesic: true,
            strokeOpacity: 0,
            icons: [{
              icon: {
                path: 'M 0,-1 0,1',
                strokeColor: '#1B7F47',
                strokeOpacity: isSelected ? 0.85 : 0.5,
                strokeWeight: isSelected ? 2.5 : 1.5,
                scale: 2
              },
              offset: '0',
              repeat: '14px'
            }],
            map,
            zIndex: 5,
            clickable: false
          });
          polylineRefs.current.push(line);
        });
      }

      // Nodes & Overlays
      filteredNodes.forEach(vm => {
        const isSelected = selectedDeviceId === vm.deviceId;
        const color = getRiskColor(vm.riskProfile.demoPriorityBand);
        const borderColor = getRiskBorderColor(vm.riskProfile.demoPriorityBand);
        const isDimmed = false;

        // Illustrative Egg Count Bubbles (Risk View)
        if (mapMode === 'risk' && showIllustrativeEggCount) {
          const riskCircle = new google.maps.Circle({
            strokeColor: '#2C7F79',
            strokeOpacity: 0.25,
            strokeWeight: 1,
            fillColor: '#3BA7A0',
            fillOpacity: 0.08,
            map,
            center: { lat: vm.latitude, lng: vm.longitude },
            radius: getEggBubbleRadius(vm.riskProfile.syntheticEggActivity || 0, false),
            zIndex: 4,
            clickable: false
          });
          circleRefs.current.push(riskCircle);
        }

        // Main Device Marker
        const marker = new google.maps.Marker({
          position: { lat: vm.latitude, lng: vm.longitude },
          map,
          icon: {
            url: createNodeMarkerSvg(vm.deviceId, color, borderColor, isSelected, isDimmed),
            scaledSize: new google.maps.Size(isSelected ? 70 : 60, isSelected ? 56 : 48),
            anchor: new google.maps.Point(isSelected ? 35 : 30, isSelected ? 28 : 24)
          },
          title: `OviZero Node ${vm.deviceId}`,
          zIndex: isSelected ? 30 : 20
        });

        marker.addListener('click', () => {
          onDeviceSelect(vm.deviceId);
        });
        
        markerRefs.current.push(marker);

        // Signal Quality labels (Network View)
        if (mapMode === 'network' && showSignalQuality && vm.signalQuality && vm.signalQuality !== 'Not assessed') {
          const signalLabel = new google.maps.Marker({
            position: { lat: vm.latitude - 0.00032, lng: vm.longitude },
            map,
            clickable: false,
            icon: { path: google.maps.SymbolPath.CIRCLE, scale: 0 },
            label: {
              text: vm.signalQuality,
              color: '#1b7f47',
              fontSize: '10px',
              fontWeight: 'bold',
              className: 'bg-white/95 px-1.5 py-0.5 rounded shadow-sm border border-[#1b7f47]/20 mt-4'
            },
            zIndex: 25
          });
          labelRefs.current.push(signalLabel);
        }
      });

      
    } catch (e) {
      console.error('Error updating overlays', e);
    }
  }, [
    isApiLoaded, filteredNodes, gateways, mapMode, showIllustrativeEggCount, 
    showSignalQuality, selectedDeviceId, getRiskColor, getRiskBorderColor, onDeviceSelect
  ]);

  const useGoogleGIS = Boolean(apiKey && isApiLoaded && !apiError);

  // Fallback map projection helper
  const allPointsSVG: GeoPoint[] = viewModels.map(vm => ({ lat: vm.latitude, lng: vm.longitude }));
  const hullSVG = createConvexHull(allPointsSVG);
  const expandedHull = expandPolygonFromCentroid(hullSVG, 1.18);
  
  const pilotHullPoints = expandedHull;

  const activeGatewayPoints = gateways
    .filter(g => g.stage !== 'Future')
    .map(g => ({ lat: g.latitude, lng: g.longitude }));

  const projectionPoints =
    mapMode === 'network'
      ? [...expandedHull, ...activeGatewayPoints]
      : expandedHull;

  const bounds = createProjectionBounds(projectionPoints, 0.15);

  const project = (lat: number, lng: number) => {
    return projectGeoPoint({ lat, lng }, bounds, 100, 100);
  };

  return (
    <div className={`relative w-full h-full flex flex-col ${variant === 'compact' ? 'min-h-[220px]' : ''}`}>
      
      {/* Map Container - always in DOM */}
      <div 
        ref={containerRef} 
        className={`w-full h-full flex-1 rounded-xl overflow-hidden ${useGoogleGIS ? 'block' : 'hidden'}`} 
      />

      {/* SCHEMATIC VECTOR FALLBACK */}
      {!useGoogleGIS && (
        <div className="w-full h-full flex-1 bg-[#f4faf6] border border-zinc-200/60 rounded-xl relative overflow-hidden flex flex-col justify-between p-2 lg:p-4 select-none">
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet" viewBox="0 0 100 100">
            {/* Pilot Boundary */}
            {(() => {
              const pointsStr = expandedHull.map(p => {
                const { x, y } = project(p.lat, p.lng);
                return `${x},${y}`;
              }).join(' ');
              
              

              return (
                <>
                  <polygon points={pointsStr} fill="#EAF5EE" fillOpacity="0.08" stroke="#1B7F47" strokeOpacity="0.35" strokeWidth="0.5" />
                  
                </>
              );
            })()}
            
            {/* Links */}
            {mapMode === 'network' && filteredNodes.map((vm, i) => {
              if (!vm.gateway || vm.gateway.stage === 'Future') return null;
              const { x: nx, y: ny } = project(vm.latitude, vm.longitude);
              const { x: gx, y: gy } = project(vm.gateway.latitude, vm.gateway.longitude);
              const isSelected = selectedDeviceId === vm.deviceId;
              return (
                <line key={`link-${i}`} x1={gx} y1={gy} x2={nx} y2={ny} stroke="#1b7f47" strokeWidth={isSelected ? "0.8" : "0.5"} strokeDasharray="3,3" opacity={isSelected ? "0.85" : "0.5"} />
              );
            })}

            {/* Egg Count Bubbles */}
            {mapMode === 'risk' && showIllustrativeEggCount && filteredNodes.map((vm, i) => {
              const { x: nx, y: ny } = project(vm.latitude, vm.longitude);
              return (
                <circle key={`egg-${i}`} cx={nx} cy={ny} r={getEggBubbleRadius(vm.riskProfile.syntheticEggActivity || 0, true)} fill="#3BA7A0" fillOpacity={0.08} stroke="#2C7F79" strokeOpacity={0.25} strokeWidth={0.5} />
              );
            })}

            {/* Nodes */}
            {filteredNodes.map((vm, i) => {
              const { x: nx, y: ny } = project(vm.latitude, vm.longitude);
              const isSelected = selectedDeviceId === vm.deviceId;
              const color = getRiskColor(vm.riskProfile.demoPriorityBand);
              const borderColor = getRiskBorderColor(vm.riskProfile.demoPriorityBand);
              
              return (
                <g 
                  key={`node-${i}`} 
                  className="cursor-pointer" 
                  onClick={() => onDeviceSelect(vm.deviceId)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Select ${vm.deviceId}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onDeviceSelect(vm.deviceId);
                    }
                  }}
                >
                  {isSelected && <circle cx={nx} cy={ny} r={4.2} fill="none" stroke={borderColor} strokeWidth={0.4} strokeOpacity={0.25} />}
                  <circle cx={nx} cy={ny} r={isSelected ? 3.2 : 2.8} fill="#ffffff" stroke={borderColor} strokeWidth={isSelected ? "0.6" : "0.4"} />
                  <circle cx={nx} cy={ny} r={isSelected ? 2.6 : 2.2} fill={color} fillOpacity="0.9" stroke="none" />
                  <rect x={nx-4} y={ny-4.5} width={8} height={2.5} rx="0.5" fill="#ffffff" stroke={borderColor} strokeWidth="0.1" />
                  <text x={nx} y={ny - 2.8} fill="#052e1a" fontSize="1.8" fontWeight="bold" textAnchor="middle">{vm.deviceId}</text>
                  
                  {mapMode === 'network' && showSignalQuality && vm.signalQuality && (
                    <g>
                      <rect x={nx-3.5} y={ny+2.5} width={7} height={2.5} fill="#ffffff" fillOpacity="0.95" rx="0.5" stroke="#1b7f47" strokeWidth="0.1" strokeOpacity="0.2" />
                      <text x={nx} y={ny + 4.2} fill="#1b7f47" fontSize="1.8" fontWeight="bold" textAnchor="middle">{vm.signalQuality}</text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Gateways */}
            {mapMode === 'network' && gateways.filter(g => g.stage !== 'Future').map((gw, i) => {
              const { x: gx, y: gy } = project(gw.latitude, gw.longitude);
              const strokeColor = "#1b7f47";
              return (
                <g key={`gw-${i}`} className="pointer-events-none">
                  <circle cx={gx} cy={gy} r={2.5} fill="#e8f4ed" stroke={strokeColor} strokeWidth="0.4" filter="drop-shadow(0 1px 1px rgba(0,0,0,0.1))" />
                  <path d={`M ${gx},${gy-1} L ${gx},${gy+1.5}`} stroke={strokeColor} strokeWidth="0.4" strokeLinecap="round" />
                  <circle cx={gx} cy={gy-1.2} r={0.4} fill={strokeColor} />
                  <path d={`M ${gx-1},${gy-0.5} A 1.5 1.5 0 0 1 ${gx+1},${gy-0.5}`} fill="none" stroke={strokeColor} strokeWidth="0.3" strokeLinecap="round" />
                  <path d={`M ${gx-1.6},${gy+0.2} A 2.2 2.2 0 0 1 ${gx+1.6},${gy+0.2}`} fill="none" stroke={strokeColor} strokeWidth="0.3" strokeLinecap="round" />
                  <rect x={gx-3} y={gy+3.5} width={6} height={2} rx="0.5" fill="#ffffff" stroke={strokeColor} strokeWidth="0.1" />
                  <text x={gx} y={gy + 5} fill="#052e1a" fontSize="1.5" fontWeight="bold" textAnchor="middle">{gw.id}</text>
                </g>
              );
            })}
          </svg>

          {variant === 'full' && (
            <div className="relative z-10 w-full flex justify-between items-end pointer-events-none">
              <div className="bg-white/80 backdrop-blur-sm border border-zinc-200/60 p-2 rounded-lg shadow-xs pointer-events-auto">
                <div className="text-[10px] font-mono text-zinc-500 font-bold mb-1">OFFLINE SCHEMATIC</div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
                  <span className="text-[9px] text-zinc-600">Maps API disconnected</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {variant === 'compact' && onOpenRiskMap && useGoogleGIS && (
        <button
          onClick={onOpenRiskMap}
          className="absolute top-3 right-3 bg-[#052e1a] hover:bg-[#0b5a31] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-md transition-all z-10 cursor-pointer"
        >
          <span>Open Full Risk Map</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
