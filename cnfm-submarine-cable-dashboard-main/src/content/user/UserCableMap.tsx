import { Box, Typography, Paper } from '@mui/material';
import { IconButton, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import InfoIcon from '@mui/icons-material/Info';
import DeletedCablesSidebar from '../admin/components/DeletedCablesSidebar';
import HideToolTip from '../admin/components/HideToolTip';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import L from 'leaflet';
import USAMarker from '../admin/components/USAMarker';
import JapanMarker from '../admin/components/JapanMarker';
import HongkongMarker from '../admin/components/HongkongMarker';
import SingaporeMarker from '../admin/components/SingaporeMarker';
import SeaUS from '../admin/dashboard/SeaUS';
import RPLSeaUS1 from '../admin/dashboard/RoutePositionList/RPLSeaUS1';
import RPLSeaUS2 from '../admin/dashboard/RoutePositionList/RPLSeaUS2';
import RPLSeaUS3 from '../admin/dashboard/RoutePositionList/RPLSeaUS3';
import RPLSJC1 from '../admin/dashboard/RoutePositionList/RPLSJC1';
import RPLSJC3 from '../admin/dashboard/RoutePositionList/RPLSJC3';
import RPLSJC4 from '../admin/dashboard/RoutePositionList/RPLSJC4';
import RPLSJC5 from '../admin/dashboard/RoutePositionList/RPLSJC5';
import RPLSJC6 from '../admin/dashboard/RoutePositionList/RPLSJC6';
import RPLSJC7 from '../admin/dashboard/RoutePositionList/RPLSJC7';
import RPLSJC8 from '../admin/dashboard/RoutePositionList/RPLSJC8';
import RPLSJC9 from '../admin/dashboard/RoutePositionList/RPLSJC9';
import RPLSJC10 from '../admin/dashboard/RoutePositionList/RPLSJC10';
import RPLSJC11 from '../admin/dashboard/RoutePositionList/RPLSJC11';
import RPLSJC12 from '../admin/dashboard/RoutePositionList/RPLSJC12';
import RPLSJC13 from '../admin/dashboard/RoutePositionList/RPLSJC13';
import RPLTGNIA1 from '../admin/dashboard/RoutePositionList/RPLTGNIA1';
import RPLTGNIA2 from '../admin/dashboard/RoutePositionList/RPLTGNIA2';
import RPLTGNIA3 from '../admin/dashboard/RoutePositionList/RPLTGNIA3';
import RPLTGNIA4 from '../admin/dashboard/RoutePositionList/RPLTGNIA4';
import RPLTGNIA5 from '../admin/dashboard/RoutePositionList/RPLTGNIA5';
import RPLTGNIA6 from '../admin/dashboard/RoutePositionList/RPLTGNIA6';
import RPLTGNIA7 from '../admin/dashboard/RoutePositionList/RPLTGNIA7';
import RPLTGNIA8 from '../admin/dashboard/RoutePositionList/RPLTGNIA8';
import RPLTGNIA9 from '../admin/dashboard/RoutePositionList/RPLTGNIA9';
import RPLTGNIA10 from '../admin/dashboard/RoutePositionList/RPLTGNIA10';
import RPLTGNIA11 from '../admin/dashboard/RoutePositionList/RPLTGNIA11';
import RPLTGNIA12 from '../admin/dashboard/RoutePositionList/RPLTGNIA12';
import SJC from '../admin/dashboard/SJC';
import C2C from '../admin/dashboard/C2C';
import TGNIA from '../admin/dashboard/TGNIA';
import RPLSeaUS4 from '../admin/dashboard/RoutePositionList/RPLSeaUS4';
import RPLSeaUS5 from '../admin/dashboard/RoutePositionList/RPLSeaUS5';
import RPLSeaUS6 from '../admin/dashboard/RoutePositionList/RPLSeaUS6';

// Define types for better type safety
type CableData = {
  cut_id?: string;
  latitude: number;
  longitude: number;
  distance?: number;
  depth?: number;
  fault_date?: string;
  cut_type?: string;
  cable_type?: string;
  simulated?: string;
  gbps?: number;
  percent?: number;
  [key: string]: any; // for other properties
};

type ChangeViewProps = {
  center: [number, number];
  zoom: number;
};

function ChangeView({ center, zoom }: ChangeViewProps) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  
  return null;
}

type DynamicMarkerProps = {
  position: [number, number];
  label: string;
  icon?: L.Icon;
};

function DynamicMarker({ position, label, icon }: DynamicMarkerProps) {
  const map = useMap();

  useEffect(() => {
    if (!position) return;

    // Create pane only if it doesn't exist to prevent memory leaks
    if (!map.getPane('markerPane')) {
      map.createPane('markerPane');
      map.getPane('markerPane')!.style.zIndex = '650';
    }

    let marker: L.Marker | L.CircleMarker;

    if (icon) {
      marker = L.marker(position, {
        icon,
        pane: 'markerPane'
      });
    } else {
      marker = L.circleMarker(position, {
        radius: 4,
        color: 'gray',
        fillColor: 'white',
        fillOpacity: 1,
        pane: 'markerPane'
      });
    }

    marker.bindTooltip(
      `<span style="font-size: 14px; font-weight: bold;">${label}</span>`,
      {
        direction: 'top',
        offset: icon ? [0, -30] : [0, -10],
        permanent: false,
        opacity: 1
      }
    );

    marker.addTo(map);

    return () => {
      if (map.hasLayer(marker)) {
        map.removeLayer(marker);
      }
    };
  }, [position, map, label, icon]);

  return null;
}

type DeletedCableMarkerProps = {
  position: [number, number];
  cable: CableData;
  markerStyle: { color: string; size: number };
  onClose: () => void;
};

function DeletedCableMarker({ position, cable, markerStyle, onClose }: DeletedCableMarkerProps) {
  const map = useMap();

  useEffect(() => {
    if (!position || !cable) return;

    // Create pane for deleted cable markers
    if (!map.getPane('deletedCablePane')) {
      map.createPane('deletedCablePane');
      map.getPane('deletedCablePane')!.style.zIndex = '1001';
    }

    const marker = L.marker(position, {
      icon: L.divIcon({
        className: `deleted-cable-marker-${cable.cut_type || 'default'}`,
        html: `
          <div style="
            position: relative;
            width: ${markerStyle.size}px; 
            height: ${markerStyle.size}px;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1001;
          ">
            <div style="
              color: ${markerStyle.color};
              font-size: ${markerStyle.size - 4}px;
              font-weight: bold;
              text-shadow: 2px 2px 4px rgba(0,0,0,0.9), -1px -1px 2px rgba(255,255,255,0.8);
              line-height: 1;
              z-index: 1002;
              position: relative;
            ">✕</div>
          </div>
        `,
        iconSize: [markerStyle.size, markerStyle.size],
        iconAnchor: [markerStyle.size / 2, markerStyle.size / 2]
      }),
      pane: 'deletedCablePane'
    });

    // Create popup content
    const popupContent = `
      <div class="cable-cut-popup" style="font-family: Arial, sans-serif; width: 200px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); border-radius: 5px; overflow: hidden; border: 2px solid ${markerStyle.color};">
        <div style="background-color: ${markerStyle.color}; color: white; padding: 6px; text-align: center; font-weight: bold; font-size: 13px; letter-spacing: 0.3px; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">
          ${(cable.cut_type || 'UNKNOWN').toUpperCase()}
        </div>
        <div style="background-color: white; padding: 10px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <tr>
              <td style="font-weight: bold; padding-bottom: 5px; color: #333;">Distance:</td>
              <td style="text-align: right; padding-bottom: 5px; color: #666;">${Number(cable.distance || 0).toFixed(2)} km</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding-bottom: 5px; color: #333;">Depth:</td>
              <td style="text-align: right; padding-bottom: 5px; color: #666;">${cable.depth || 'N/A'} m</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding-bottom: 5px; color: #333;">Lat:</td>
              <td style="text-align: right; padding-bottom: 5px; color: #666; font-family: monospace; font-size: 11px;">${Number(cable.latitude).toFixed(4)}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding-bottom: 5px; color: #333;">Lng:</td>
              <td style="text-align: right; padding-bottom: 5px; color: #666; font-family: monospace; font-size: 11px;">${Number(cable.longitude).toFixed(4)}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding-bottom: 5px; color: #333;">Date:</td>
              <td style="text-align: right; padding-bottom: 5px; color: #666; font-size: 11px;">
                ${cable.fault_date 
                  ? new Date(cable.fault_date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: '2-digit'
                    })
                  : 'N/A'
                }
              </td>
            </tr>
            <tr>
              <td style="font-weight: bold; color: #333;">ID:</td>
              <td style="text-align: right; color: #666; font-family: monospace; font-size: 11px;">
                ${cable.cut_id && cable.cut_id.length > 12 
                  ? cable.cut_id.substring(0, 12) + '...' 
                  : cable.cut_id || 'N/A'
                }
              </td>
            </tr>
          </table>
        </div>
        <div style="background-color: #f8f9fa; padding: 10px; border-top: 1px solid #dee2e6; display: flex; justify-content: center;">
          <button class="close-deleted-cable-btn" onclick="
            const closeEvent = new CustomEvent('closeDeletedCable');
            window.dispatchEvent(closeEvent);
          " style="background-color: #666; color: white; border: none; padding: 6px 12px; border-radius: 3px; cursor: pointer; font-size: 11px; font-weight: bold;" onmouseover="this.style.backgroundColor='#555'" onmouseout="this.style.backgroundColor='#666'">
            ✕ Close
          </button>
        </div>
      </div>
    `;

    marker.bindPopup(popupContent, {
      className: 'smart-positioned-popup',
      maxWidth: 250,
      minWidth: 200,
      autoPan: true,
      closeButton: false
    });

    marker.openPopup();
    marker.addTo(map);

    // Listen for close button click
    const handleCloseEvent = () => {
      onClose();
    };
    
    window.addEventListener('closeDeletedCable', handleCloseEvent);

    return () => {
      window.removeEventListener('closeDeletedCable', handleCloseEvent);
      if (map.hasLayer(marker)) {
        map.removeLayer(marker);
      }
    };
  }, [position, cable, markerStyle, onClose, map]);

  return null;
}

// Custom component to remove attribution
const RemoveAttribution = () => {
  const map = useMap();

  useEffect(() => {
    // Remove attribution control when component mounts
    if (map.attributionControl) {
      map.attributionControl.remove();
    }
  }, [map]);

  return null;
};

interface UserCableMapProps {
  selectedCable?: CableData;
  selectedCutType?: string | null;
  mapRef?: React.RefObject<L.Map>;
  onCloseCablePopup?: () => void;
}

const UserCableMap = ({ selectedCable, selectedCutType, mapRef: externalMapRef, onCloseCablePopup }: UserCableMapProps) => {
  // State declarations
  const [mapHeight, setMapHeight] = useState('600px'); // Matches admin dashboard initial height
  const [ipopUtilization, setIpopUtilization] = useState('0%');
  const [ipopDifference, setIpopDifference] = useState('0%');
  const [stats, setStats] = useState({
    data: [] as CableData[],
    totalGbps: 0,
    avgUtilization: 0,
    zeroUtilizationCount: 0
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [selectedDeletedCable, setSelectedDeletedCable] = useState<CableData | null>(null);
  const [showDeletedCablePopup, setShowDeletedCablePopup] = useState(false);

  // Refs
  const mapRef = useRef<L.Map | null>(null);
  const styleElementRef = useRef<HTMLStyleElement | null>(null);
  const dataFetchIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const ipopFetchIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Environment variables - memoized to prevent unnecessary re-renders
  const apiConfig = useMemo(() => ({
    apiBaseUrl: process.env.REACT_APP_API_BASE_URL || '',
    port: process.env.REACT_APP_PORT || '',
    mapApiKey: process.env.REACT_APP_GEOAPIFY_API_KEY || ''
  }), []);

  // Optimized map height calculation (matches admin dashboard exactly)
  const updateMapHeight = useCallback(() => {
    const screenWidth = window.innerWidth;
    if (screenWidth > 1600) {
      setMapHeight('800px');
    } else if (screenWidth > 1200) {
      setMapHeight('700px');
    } else {
      setMapHeight('600px');
    }
  }, []);

  // Optimized cable selection handler with proper cleanup
  const handleCableSelection = useCallback((cable: CableData) => {
    if (!cable || !cable.latitude || !cable.longitude) return;
    
    // Use external mapRef if provided, otherwise use internal mapRef
    const map = externalMapRef?.current || mapRef.current;
    if (!map) return;
    
    // Stop any ongoing animations before starting new one
    map.stop();
    
    // Set the selected deleted cable for popup display
    setSelectedDeletedCable(cable);
    setShowDeletedCablePopup(true);
    
    // Apply smooth transition with offset positioning to show marker slightly below center
    setTimeout(() => {
      const mapContainer = map.getContainer();
      const mapHeight = mapContainer.clientHeight;
      
      // Calculate offset to position marker slightly below center of viewport
      const targetPoint = map.project([cable.latitude, cable.longitude], 14);
      
      // Offset the view so marker appears slightly below center (roughly 60% down from top)
      const offsetY = mapHeight * 0.15; // Reduced offset for more centered positioning
      const adjustedPoint = L.point(targetPoint.x, targetPoint.y - offsetY);
      
      // Convert back to lat/lng
      const adjustedCenter = map.unproject(adjustedPoint, 14);
      
      map.setView([adjustedCenter.lat, adjustedCenter.lng], 14, { 
        animate: true,
        duration: 0.8,
        easeLinearity: 0.2
      });
    }, 50);
  }, [externalMapRef]);

  // Add custom CSS for smart popup positioning with proper cleanup
  useEffect(() => {
    // Remove existing style if it exists
    if (styleElementRef.current && document.head.contains(styleElementRef.current)) {
      document.head.removeChild(styleElementRef.current);
    }

    const style = document.createElement('style');
    styleElementRef.current = style;
    style.textContent = `
      .smart-positioned-popup .leaflet-popup-content-wrapper {
        background: white;
        border-radius: 4px;
        box-shadow: 0 3px 8px rgba(0,0,0,0.12);
        border: 1px solid #ccc;
        max-width: 140px !important;
        min-width: 120px !important;
        font-size: 9px;
        line-height: 1.2;
        padding: 0 !important;
      }
      
      .smart-positioned-popup .leaflet-popup-content {
        margin: 0 !important;
        padding: 0 !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        width: 100% !important;
      }
      
      .smart-positioned-popup .leaflet-popup-tip {
        background: white;
        border: 1px solid #ccc;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      }
      
      .smart-positioned-popup {
        z-index: 1200 !important;
      }
      
      .leaflet-popup {
        margin-bottom: 10px;
        pointer-events: auto !important;
      }
      
      .smart-positioned-popup .leaflet-popup-content button {
        font-family: inherit;
        font-size: 8px;
        padding: 3px 6px;
        margin: 0;
        border-radius: 2px;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
        font-weight: bold;
      }
      
      .leaflet-popup-close-button {
        display: none !important;
      }
      
      @media (max-width: 768px) {
        .smart-positioned-popup .leaflet-popup-content-wrapper {
          max-width: 120px !important;
          min-width: 100px !important;
          font-size: 8px;
        }
        
        .smart-positioned-popup .leaflet-popup-content button {
          font-size: 7px;
          padding: 2px 4px;
        }
      }
      
      @media (max-width: 480px) {
        .smart-positioned-popup .leaflet-popup-content-wrapper {
          max-width: 110px !important;
          min-width: 90px !important;
        }
      }
      
      .cable-cut-popup {
        box-sizing: border-box;
        width: 100% !important;
        max-width: 140px;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      if (styleElementRef.current && document.head.contains(styleElementRef.current)) {
        document.head.removeChild(styleElementRef.current);
        styleElementRef.current = null;
      }
    };
  }, []);

  // Pan/zoom to selected cable location with smooth transition (from Simulator)
  useEffect(() => {
    if (selectedCable && selectedCable.latitude && selectedCable.longitude) {
      // Use external mapRef if provided, otherwise use internal mapRef
      const map = externalMapRef?.current || mapRef.current;
      if (map) {
        // Small delay to ensure map is fully ready and prevent flickering
        const timeoutId = setTimeout(() => {
          // Stop any ongoing animations before starting new one to prevent conflicts
          map.stop();
          
          // Apply smooth transition with enhanced animation parameters
          map.setView([selectedCable.latitude, selectedCable.longitude], 14, {
            animate: true,
            duration: 0.8, // Slightly longer animation for smoother experience
            easeLinearity: 0.2 // Smoother easing
          });
        }, 50); // 50ms delay to prevent flickering

        return () => clearTimeout(timeoutId);
      }
    }
  }, [selectedCable, externalMapRef]);

  // Map height update with debounced resize handler
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const debouncedUpdateMapHeight = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateMapHeight, 100);
    };

    updateMapHeight(); // Initial call
    window.addEventListener('resize', debouncedUpdateMapHeight);
    
    return () => {
      window.removeEventListener('resize', debouncedUpdateMapHeight);
      clearTimeout(timeoutId);
    };
  }, [updateMapHeight]);

  // Optimized data fetching with proper cleanup
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiConfig.apiBaseUrl}${apiConfig.port}/data-summary`, {
          headers: { 'Cache-Control': 'no-cache' }
        });
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const result = await response.json();

        if (Array.isArray(result) && result.length > 0) {
          const totalGbps = result.reduce((sum, item) => sum + (item.gbps || 0), 0);
          const totalUtilization = result.reduce((sum, item) => sum + (item.percent || 0), 0);
          const avgUtilization = parseFloat((totalUtilization / result.length).toFixed(2));
          const zeroCount = result.filter(item => item.percent === 0).length;

          setStats({
            data: result,
            totalGbps,
            avgUtilization,
            zeroUtilizationCount: zeroCount
          });

          // Clear interval after successful fetch
          if (dataFetchIntervalRef.current) {
            clearInterval(dataFetchIntervalRef.current);
            dataFetchIntervalRef.current = null;
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    // Run immediately
    fetchData();

    // Set up interval with ref tracking
    dataFetchIntervalRef.current = setInterval(fetchData, 2000);

    return () => {
      if (dataFetchIntervalRef.current) {
        clearInterval(dataFetchIntervalRef.current);
        dataFetchIntervalRef.current = null;
      }
    };
  }, [apiConfig.apiBaseUrl, apiConfig.port]);

  // Optimized IPOP utilization fetching
  useEffect(() => {
    const fetchIpopUtil = async () => {
      try {
        const response = await fetch(`${apiConfig.apiBaseUrl}${apiConfig.port}/average-util`, {
          headers: { 'Cache-Control': 'no-cache' }
        });
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();

        if (data?.current?.length) {
          const currentVal = parseFloat(data.current[0].a_side);
          setIpopUtilization(`${currentVal}%`);

          if (data?.previous?.length) {
            const previousVal = parseFloat(data.previous[0].a_side);
            const diff = currentVal - previousVal;
            const sign = diff > 0 ? '+' : '';
            setIpopDifference(`${sign}${diff.toFixed(2)}%`);
          } else {
            setIpopDifference('');
          }

          // Clear interval after successful fetch
          if (ipopFetchIntervalRef.current) {
            clearInterval(ipopFetchIntervalRef.current);
            ipopFetchIntervalRef.current = null;
          }
        } else {
          setIpopUtilization('0%');
          setIpopDifference('');
        }
      } catch (error) {
        console.error('Error fetching IPOP utilization:', error);
      }
    };

    // Run immediately
    fetchIpopUtil();

    // Set up interval with ref tracking
    ipopFetchIntervalRef.current = setInterval(fetchIpopUtil, 2000);

    return () => {
      if (ipopFetchIntervalRef.current) {
        clearInterval(ipopFetchIntervalRef.current);
        ipopFetchIntervalRef.current = null;
      }
    };
  }, [apiConfig.apiBaseUrl, apiConfig.port]);

  // Memoized sidebar handler to prevent unnecessary re-renders
  const handleSidebarCableSelect = useCallback((cable: CableData) => {
    setSelectedDeletedCable(cable);
    setShowDeletedCablePopup(true);
    handleCableSelection(cable);
  }, [handleCableSelection]);

  const handleSidebarToggle = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const handleSidebarClose = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  // Handler to close deleted cable popup
  const handleCloseDeletedCablePopup = useCallback(() => {
    setShowDeletedCablePopup(false);
    setSelectedDeletedCable(null);
  }, []);

  // Optimized formatDate function with memoization
  const formatDate = useCallback((dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }, []);

  // Get marker style based on cut type
  const getMarkerStyle = useCallback((cutType: string) => {
    const styles: Record<string, any> = {
      'Shunt Fault': { color: '#FBC02D', size: 20 },
      'Partial Fiber Break': { color: '#FF6600', size: 20 },
      'Fiber Break': { color: '#F44336', size: 20 },
      'Full Cut': { color: '#B71C1C', size: 20 }
    };
    return styles[cutType] || { color: '#9E9E9E', size: 20 };
  }, []);

  return (
    <Box sx={{ position: 'relative', width: '100%', height: mapHeight }}>
      {/* Toggle Button for Sidebar */}
      <Box sx={{ position: 'absolute', top: 16, left: 32, zIndex: 1200 }}>
        <Tooltip title="Show Deleted Cables Sidebar" arrow>
          <IconButton
            sx={{ 
              background: '#fff', 
              boxShadow: 2, 
              borderRadius: 1, 
              p: 1, 
              '&:hover': { background: '#e3e8f5' } 
            }}
            onClick={handleSidebarToggle}
            aria-label="Show Deleted Cables Sidebar"
          >
            <MenuIcon sx={{ fontSize: 28, color: '#3854A5' }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Right Sidebar Toggle Button */}
      <Box sx={{ position: 'absolute', top: 16, right: 32, zIndex: 1200 }}>
        <Tooltip title="Show Cable System Overview" arrow>
          <IconButton
            sx={{ 
              background: '#fff', 
              boxShadow: 2, 
              borderRadius: 1, 
              p: 1, 
              '&:hover': { background: '#e3e8f5' } 
            }}
            onClick={() => setRightSidebarOpen((open) => !open)}
            aria-label="Show Cable System Overview"
          >
            <InfoIcon sx={{ fontSize: 28, color: '#3854A5' }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: 360, // Restored to admin size
            zIndex: 1100,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 4,
            borderRadius: '8px',
            overflow: 'hidden',
            background: 'rgba(255, 255, 255, 0.7)', // Restored to admin transparency
          }}
        >
          <DeletedCablesSidebar
            onSelectCable={handleSidebarCableSelect}
            lastUpdate={lastUpdate}
            setLastUpdate={setLastUpdate}
            isAdmin={true}  // Enable admin functionality for full Deleted Cables features
            isUser={true}   // Enable user functionality
            mapRef={externalMapRef || mapRef}
            onCloseSidebar={handleSidebarClose}
          />
        </Box>
      )}

      {/* Right Sidebar - HideToolTip */}
      {rightSidebarOpen && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            height: '100%',
            width: 360,
            zIndex: 1100,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 4,
            borderRadius: '8px',
            overflow: 'hidden',
            background: 'rgba(255, 255, 255, 0.9)',
            // Ensure proper scrollbar styling
            '& > *': {
              overflowY: 'auto',
              '&::-webkit-scrollbar': { 
                width: '8px',
                backgroundColor: 'rgba(0,0,0,0.05)'
              },
              '&::-webkit-scrollbar-thumb': { 
                background: 'rgba(0,0,0,0.3)', 
                borderRadius: '4px',
                '&:hover': {
                  background: 'rgba(0,0,0,0.4)'
                }
              },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(0,0,0,0.1)',
                borderRadius: '4px'
              }
            }
          }}
        >
          <HideToolTip />
        </Box>
      )}

      <MapContainer 
        style={{ height: '100%', width: '100%' }} 
        ref={externalMapRef || mapRef}
      >
        <RemoveAttribution />
        <ChangeView center={[18, 134]} zoom={3.5} />
        <TileLayer
          url={`https://maps.geoapify.com/v1/tile/klokantech-basic/{z}/{x}/{y}.png?apiKey=${apiConfig.mapApiKey}`}
        />
        
        {/* Dynamic Markers */}
      <DynamicMarker position={[1.3678, 125.0788]} label="Kauditan, Indonesia" />
      <DynamicMarker position={[7.0439, 125.542]} label="Davao, Philippines" />
      <DynamicMarker position={[13.464717, 144.69305]} label="Piti, Guam" />
      <DynamicMarker position={[21.4671, 201.7798]} label="Makaha, Hawaii, USA" />
      <DynamicMarker position={[14.0679, 120.6262]} label="Nasugbu, Philippines" />
      <DynamicMarker position={[18.412883, 121.517283]} label="Ballesteros, Philippines" />
      
      {/* Location Markers */}
      <USAMarker />
      <JapanMarker />
      <HongkongMarker />
      <SingaporeMarker />
      
      {/* Route Components */}

      <RPLSeaUS1 />
      <RPLSeaUS2 />
      <RPLSeaUS3 />
      <RPLSeaUS4 />
      <RPLSeaUS5 />
      <RPLSeaUS6 />
      <RPLSJC1 />
      <RPLSJC3 />
      <RPLSJC4 />
      <RPLSJC5 />
      <RPLSJC6 />
      <RPLSJC7 />
      <RPLSJC8 />
      <RPLSJC9 />
      <RPLSJC10 />
      <RPLSJC11 />
      <RPLSJC12 />
      <RPLSJC13 />
      <RPLTGNIA1 />
      <RPLTGNIA2 />
      <RPLTGNIA3 />
      <RPLTGNIA4 />
      <RPLTGNIA5 />
      <RPLTGNIA6 />
      <RPLTGNIA7 />
      <RPLTGNIA8 />
      <RPLTGNIA9 />
      <RPLTGNIA10 />
      <RPLTGNIA11 />
      <RPLTGNIA12 />
      <C2C />

      {/* Deleted Cable Popup - shows when a deleted cable is selected from sidebar */}
      {selectedDeletedCable && showDeletedCablePopup && (
        <DeletedCableMarker
          key={`deleted-cable-${selectedDeletedCable.cut_id || `${selectedDeletedCable.latitude}-${selectedDeletedCable.longitude}`}`}
          position={[selectedDeletedCable.latitude, selectedDeletedCable.longitude]}
          cable={selectedDeletedCable}
          markerStyle={getMarkerStyle(selectedDeletedCable.cut_type || 'default')}
          onClose={handleCloseDeletedCablePopup}
        />
      )}

      {/* Cable Cut Popup - matches admin/simulator design */}
      {selectedCable && selectedCutType && (
        <Marker
          key={`cable-${selectedCable.cut_id || `${selectedCable.latitude}-${selectedCable.longitude}`}`}
          position={[selectedCable.latitude, selectedCable.longitude]}
        >
          <Popup 
            key={`popup-${selectedCable.cut_id || `${selectedCable.latitude}-${selectedCable.longitude}`}`}
          >
            <div className="cable-cut-popup">
              <Box sx={{ minWidth: 120, maxWidth: 140, p: 0 }}>
                <Box sx={{ 
                  background: '#d32f2f', 
                  color: 'white', 
                  p: 0.5, 
                  textAlign: 'center',
                  borderRadius: '3px 3px 0 0',
                  marginBottom: 0.3
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '10px', margin: 0 }}>
                    {selectedCutType.toUpperCase()}
                  </Typography>
                </Box>
                
                <Box sx={{ px: 1, pb: 0.3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.2 }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '8px', color: '#666' }}>
                      Distance:
                    </Typography>
                    <Typography sx={{ fontSize: '8px', fontWeight: '600', color: '#1976d2' }}>
                      {selectedCable.distance || '3.00'} km
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.2 }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '8px', color: '#666' }}>
                      Depth:
                    </Typography>
                    <Typography sx={{ fontSize: '8px', fontWeight: '600', color: '#1976d2' }}>
                      {selectedCable.depth || '1950'} m
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.2 }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '8px', color: '#666' }}>
                      Lat:
                    </Typography>
                    <Typography sx={{ fontSize: '8px', fontWeight: '600', color: '#1976d2' }}>
                      {Number(selectedCable.latitude).toFixed(4)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.2 }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '8px', color: '#666' }}>
                      Lng:
                    </Typography>
                    <Typography sx={{ fontSize: '8px', fontWeight: '600', color: '#1976d2' }}>
                      {Number(selectedCable.longitude).toFixed(4)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.2 }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '8px', color: '#666' }}>
                      Date:
                    </Typography>
                    <Typography sx={{ fontSize: '8px', fontWeight: '600', color: '#1976d2' }}>
                      Aug 20, 25
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '8px', color: '#666' }}>
                      ID:
                    </Typography>
                    <Typography sx={{ fontSize: '7px', fontWeight: '600', color: '#1976d2' }}>
                      s3c7-1754636...
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  gap: 0.3,
                  borderTop: '1px solid #eee',
                  pt: 0.3,
                  px: 1,
                  pb: 0.3
                }}>
                  <button 
                    style={{ 
                      backgroundColor: '#d32f2f', 
                      color: 'white', 
                      border: 'none', 
                      padding: '3px 6px', 
                      borderRadius: '2px', 
                      cursor: 'pointer', 
                      fontSize: '7px', 
                      fontWeight: 'bold',
                      flex: 1,
                      marginRight: '2px'
                    }}
                  >
                    🗑 Delete
                  </button>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Close button clicked');
                      
                      // Close the popup using the callback function
                      if (onCloseCablePopup) {
                        onCloseCablePopup();
                      }
                    }}
                    style={{ 
                      backgroundColor: '#666', 
                      color: 'white', 
                      border: 'none', 
                      padding: '3px 6px', 
                      borderRadius: '2px', 
                      cursor: 'pointer', 
                      fontSize: '7px', 
                      fontWeight: 'bold',
                      flex: 1
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#555'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#666'}
                  >
                    ✕ Close
                  </button>
                </Box>
              </Box>
            </div>
          </Popup>
        </Marker>
      )}
    
      </MapContainer>
    </Box>
  );
};

export default UserCableMap;
