import { Box, Typography, Snackbar, Alert } from '@mui/material';
import { IconButton, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import InfoIcon from '@mui/icons-material/Info';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState, useCallback, useMemo, lazy, Suspense } from 'react';
import L from 'leaflet';
import React from 'react';

// Lazy load heavy components for better performance
const DeletedCablesSidebar = lazy(() => import('../admin/components/DeletedCablesSidebar'));
const HideToolTip = lazy(() => import('../admin/components/HideToolTip'));

// Lazy load markers
const USAMarker = lazy(() => import('../admin/components/USAMarker'));
const JapanMarker = lazy(() => import('../admin/components/JapanMarker'));
const HongkongMarker = lazy(() => import('../admin/components/HongkongMarker'));
const SingaporeMarker = lazy(() => import('../admin/components/SingaporeMarker'));

// Lazy load route components - grouped by system for better code splitting
const SeaUSRoutes = lazy(() => Promise.all([
  import('../admin/dashboard/RoutePositionList/RPLSeaUS1'),
  import('../admin/dashboard/RoutePositionList/RPLSeaUS2'),
  import('../admin/dashboard/RoutePositionList/RPLSeaUS3'),
  import('../admin/dashboard/RoutePositionList/RPLSeaUS4'),
  import('../admin/dashboard/RoutePositionList/RPLSeaUS5'),
  import('../admin/dashboard/RoutePositionList/RPLSeaUS6'),
]).then(modules => ({
  default: () => (
    <>
      {modules.map((Module, index) => <Module.default key={`seaus-${index}`} />)}
    </>
  )
})));

const SJCRoutes = lazy(() => Promise.all([
  import('../admin/dashboard/RoutePositionList/RPLSJC1'),
  import('../admin/dashboard/RoutePositionList/RPLSJC3'),
  import('../admin/dashboard/RoutePositionList/RPLSJC4'),
  import('../admin/dashboard/RoutePositionList/RPLSJC5'),
  import('../admin/dashboard/RoutePositionList/RPLSJC6'),
  import('../admin/dashboard/RoutePositionList/RPLSJC7'),
  import('../admin/dashboard/RoutePositionList/RPLSJC8'),
  import('../admin/dashboard/RoutePositionList/RPLSJC9'),
  import('../admin/dashboard/RoutePositionList/RPLSJC10'),
  import('../admin/dashboard/RoutePositionList/RPLSJC11'),
  import('../admin/dashboard/RoutePositionList/RPLSJC12'),
  import('../admin/dashboard/RoutePositionList/RPLSJC13'),
]).then(modules => ({
  default: () => (
    <>
      {modules.map((Module, index) => <Module.default key={`sjc-${index}`} />)}
    </>
  )
})));

const TGNIARoutes = lazy(() => Promise.all([
  import('../admin/dashboard/RoutePositionList/RPLTGNIA1'),
  import('../admin/dashboard/RoutePositionList/RPLTGNIA2'),
  import('../admin/dashboard/RoutePositionList/RPLTGNIA3'),
  import('../admin/dashboard/RoutePositionList/RPLTGNIA4'),
  import('../admin/dashboard/RoutePositionList/RPLTGNIA5'),
  import('../admin/dashboard/RoutePositionList/RPLTGNIA6'),
  import('../admin/dashboard/RoutePositionList/RPLTGNIA7'),
  import('../admin/dashboard/RoutePositionList/RPLTGNIA8'),
  import('../admin/dashboard/RoutePositionList/RPLTGNIA9'),
  import('../admin/dashboard/RoutePositionList/RPLTGNIA10'),
  import('../admin/dashboard/RoutePositionList/RPLTGNIA11'),
  import('../admin/dashboard/RoutePositionList/RPLTGNIA12'),
]).then(modules => ({
  default: () => (
    <>
      {modules.map((Module, index) => <Module.default key={`tgnia-${index}`} />)}
    </>
  )
})));

const C2C = lazy(() => import('../admin/dashboard/C2C'));

// Loading component for better UX during component loading
const LoadingSpinner: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => (
  <Box sx={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    p: 2,
    bgcolor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 2,
    minHeight: '60px'
  }}>
    <Box sx={{
      width: '20px',
      height: '20px',
      border: '2px solid #f3f3f3',
      borderTop: '2px solid #3854A5',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      mr: 2,
      '@keyframes spin': {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' }
      }
    }} />
    <Typography variant="body2" color="textSecondary">{message}</Typography>
  </Box>
);

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

// Memoized ChangeView component for better performance
const ChangeView = React.memo<ChangeViewProps>(({ center, zoom }) => {
  const map = useMap();
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    // Only set the view once on initial load, don't override user interactions
    // This prevents the zoom-out bug when users manually zoom in and move the map
    if (!hasInitializedRef.current && map) {
      map.setView(center, zoom);
      hasInitializedRef.current = true;
    }
  }, [map, center, zoom]);

  return null;
});

ChangeView.displayName = 'ChangeView';

type DynamicMarkerProps = {
  position: [number, number];
  label: string;
  icon?: L.Icon;
};

// Memoized DynamicMarker component for better performance
const DynamicMarker = React.memo<DynamicMarkerProps>(({ position, label, icon }) => {
  const map = useMap();

  useEffect(() => {
    if (!position || !map) return;

    // Create pane only if it doesn't exist to prevent memory leaks
    const paneName = 'markerPane';
    if (!map.getPane(paneName)) {
      map.createPane(paneName);
      const pane = map.getPane(paneName);
      if (pane) pane.style.zIndex = '650';
    }

    let marker: L.Marker | L.CircleMarker;

    if (icon) {
      marker = L.marker(position, {
        icon,
        pane: paneName
      });
    } else {
      marker = L.circleMarker(position, {
        radius: 4,
        color: 'gray',
        fillColor: 'white',
        fillOpacity: 1,
        pane: paneName
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
});

DynamicMarker.displayName = 'DynamicMarker';

// Custom popup component removed - functionality now handled by DeletedCablesSidebar

// Memoized component to remove attribution
const RemoveAttribution = React.memo(() => {
  const map = useMap();

  useEffect(() => {
    // Remove attribution control when component mounts
    if (map?.attributionControl) {
      map.attributionControl.remove();
    }
  }, [map]);

  return null;
});

RemoveAttribution.displayName = 'RemoveAttribution';

// Error boundary wrapper component - Memoized for better performance
const UserCableMapErrorBoundary = React.memo<{ children: React.ReactNode }>(({ children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('UserCableMap Error:', error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', bgcolor: '#f5f5f5', borderRadius: 2 }}>
        <Typography variant="h6" color="error" gutterBottom>
          Map Loading Error
        </Typography>
        <Typography variant="body2" color="textSecondary">
          There was an error loading the cable map. Please refresh the page or contact support.
        </Typography>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: '16px',
            padding: '8px 16px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Refresh Page
        </button>
      </Box>
    );
  }

  return <>{children}</>;
});

UserCableMapErrorBoundary.displayName = 'UserCableMapErrorBoundary';

interface UserCableMapProps {
  selectedCable?: CableData;
  selectedCutType?: string | null;
  mapRef?: React.RefObject<L.Map>;
  onCloseCablePopup?: () => void;
}

// Memoized and optimized UserCableMap component for faster rendering
const UserCableMap = React.memo<UserCableMapProps>(({ selectedCable, selectedCutType, mapRef: externalMapRef, onCloseCablePopup }) => {
  // State declarations - using lazy initial state for better performance
  const [mapHeight, setMapHeight] = useState(() => {
    const screenWidth = window.innerWidth;
    return screenWidth > 1600 ? '800px' : screenWidth > 1200 ? '700px' : '600px';
  });
  const [ipopUtilization, setIpopUtilization] = useState('0%');
  const [ipopDifference, setIpopDifference] = useState('0%');
  const [stats, setStats] = useState(() => ({
    data: [] as CableData[],
    totalGbps: 0,
    avgUtilization: 0,
    zeroUtilizationCount: 0
  }));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  // Enhanced notification system for deleted cable information
  const [notification, setNotification] = useState(() => ({
    open: false,
    message: '',
    severity: 'info' as 'success' | 'error' | 'warning' | 'info'
  }));

  // Refs
  const mapRef = useRef<L.Map | null>(null);
  const styleElementRef = useRef<HTMLStyleElement | null>(null);
  const dataFetchIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const ipopFetchIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

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

  // Enhanced notification helper
  const showNotification = useCallback((message: string, severity: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setNotification({ open: true, message, severity });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, open: false }));
  }, []);

  // Cable selection now handled entirely by DeletedCablesSidebar - custom popup removed
  const handleCableSelection = useCallback((cable: CableData) => {
    if (!cable || !cable.latitude || !cable.longitude) return;

    // Use external mapRef if provided, otherwise use internal mapRef
    const map = externalMapRef?.current || mapRef.current;
    if (!map) return;

    // Stop any ongoing animations before starting new one
    map.stop();

    // Cable selection is now handled by DeletedCablesSidebar
    // No custom popup state management needed

    // Calculate distance-based animation timing for optimal UX
    const currentCenter = map.getCenter();
    const targetLat = parseFloat(parseFloat(cable.latitude.toString()).toFixed(6));
    const targetLng = parseFloat(parseFloat(cable.longitude.toString()).toFixed(6));
    const distance = currentCenter.distanceTo(L.latLng(targetLat, targetLng));

    // Determine optimal animation duration based on distance
    let animationDuration: number;
    if (distance > 2000000) animationDuration = 1.2; // Very long distance
    else if (distance > 500000) animationDuration = 0.9; // Long distance  
    else if (distance > 100000) animationDuration = 0.7; // Medium distance
    else if (distance > 10000) animationDuration = 0.5; // Short distance
    else animationDuration = 0.3; // Very short distance

    // Apply immediate smooth transition with offset positioning
    const mapContainer = map.getContainer();
    const mapHeight = mapContainer.clientHeight;

    // Calculate offset to position marker slightly below center of viewport
    const targetPoint = map.project([cable.latitude, cable.longitude], 14);

    // Reduced offset for more centered positioning  
    const offsetY = mapHeight * 0.10; // Further reduced for better centering
    const adjustedPoint = L.point(targetPoint.x, targetPoint.y - offsetY);

    // Convert back to lat/lng
    const adjustedCenter = map.unproject(adjustedPoint, 14);

    map.setView([adjustedCenter.lat, adjustedCenter.lng], 14, {
      animate: true,
      duration: animationDuration, // Dynamic duration based on distance
      easeLinearity: 0.1 // Faster, smoother easing
    });
  }, [externalMapRef]);

  // Optimized delete cable function with better error handling
  const handleDeleteCable = useCallback(async (cable: CableData) => {
    if (!cable?.cut_id) {
      alert('Invalid cable data');
      return;
    }

    try {
      console.log('Making delete request for cable:', cable.cut_id);
      const response = await fetch(
        `${apiConfig.apiBaseUrl}${apiConfig.port}/delete-single-cable-cuts/${cable.cut_id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Delete response:', result);

      if (result.success) {
        // Update the lastUpdate to trigger refresh in sidebar if it exists
        setLastUpdate(Date.now().toString());
        alert('Cable deleted successfully!');
        // Close the popup by clearing selected cable
        if (onCloseCablePopup) {
          onCloseCablePopup();
        }
      } else {
        alert('Failed to delete cable: ' + (result.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting cable:', error);
      alert('Error deleting cable: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }, [apiConfig, setLastUpdate, onCloseCablePopup]);

  // CSS for popup styling removed - functionality now handled by DeletedCablesSidebar
  useEffect(() => {
    return () => {
      if (styleElementRef.current && document.head.contains(styleElementRef.current)) {
        document.head.removeChild(styleElementRef.current);
        styleElementRef.current = null;
      }
    };
  }, []);

  // Automatic panning to selectedCable disabled to prevent conflicts with user map interactions
  // The DeletedCablesSidebar handles its own camera movements, so no automatic panning needed here
  // This prevents the zoom-out bug when users manually interact with the map

  // Simplified initial notifications - reduced for better performance
  useEffect(() => {
    let timer: NodeJS.Timeout;

    timer = setTimeout(() => {
      showNotification(
        '🌟 Enhanced User Cable Map: Click sidebar (☰) to navigate to deleted cables with smooth camera movement!',
        'info'
      );
    }, 3000); // Reduced to single notification after 3 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [showNotification]);

  // Optimized data fetching with caching and abort controller
  const fetchDataSummary = useCallback(async (abortController?: AbortController) => {
    try {
      // Add cache headers for better performance
      const response = await fetch(`${apiConfig.apiBaseUrl}${apiConfig.port}/data-summary`, {
        signal: abortController?.signal,
        headers: {
          'Cache-Control': 'max-age=30', // Cache for 30 seconds
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch data summary');

      const result = await response.json();

      if (!mountedRef.current) return false;

      if (Array.isArray(result) && result.length > 0) {
        // Batch state updates for better performance
        const totalGbps = result.reduce((sum, item) => sum + (item.gbps || 0), 0);
        const totalUtilization = result.reduce((sum, item) => sum + (item.percent || 0), 0);
        const avgUtilization = parseFloat((totalUtilization / result.length).toFixed(2));
        const zeroCount = result.filter((item) => item.percent === 0).length;

        // Single state update instead of multiple
        setStats(prevStats => ({
          ...prevStats,
          data: result,
          totalGbps,
          avgUtilization,
          zeroUtilizationCount: zeroCount
        }));
        return true; // Success
      } else {
        console.log('No data received, will retry...');
        return false; // No data
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return false;
      console.error('Error fetching data:', err);
      return false;
    }
  }, [apiConfig, mountedRef]);

  // Optimized IPOP utilization fetching with caching
  const fetchIpopUtilization = useCallback(async (abortController?: AbortController) => {
    try {
      const response = await fetch(`${apiConfig.apiBaseUrl}${apiConfig.port}/average-util`, {
        headers: {
          'Cache-Control': 'max-age=30', // Cache for 30 seconds
          'Content-Type': 'application/json'
        },
        signal: abortController?.signal
      });

      if (!response.ok) throw new Error('Failed to fetch IPOP utilization');

      const data = await response.json();

      if (!mountedRef.current) return false;

      if (data?.current?.length) {
        const currentVal = parseFloat(data.current[0].a_side);
        // Batch state updates
        setIpopUtilization(`${currentVal}%`);

        if (data?.previous?.length) {
          const previousVal = parseFloat(data.previous[0].a_side);
          const diff = currentVal - previousVal;
          const sign = diff > 0 ? '+' : '';
          setIpopDifference(`${sign}${diff.toFixed(2)}%`);
        } else {
          setIpopDifference('');
        }
        return true;
      } else {
        setIpopUtilization('0%');
        setIpopDifference('');
        return false;
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return false;
      console.error('Error fetching IPOP utilization:', error);
      return false;
    }
  }, [apiConfig, mountedRef]);

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

  // Optimized data fetching effect with reduced frequency for better performance
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 3; // Reduced retries

    const startDataFetching = async () => {
      const abortController = new AbortController();

      const fetchData = async () => {
        const success = await fetchDataSummary(abortController);
        if (success) {
          retryCount = 0; // Reset retry count on success
          if (dataFetchIntervalRef.current) {
            clearInterval(dataFetchIntervalRef.current);
            dataFetchIntervalRef.current = null;
          }
        } else if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying data fetch (${retryCount}/${maxRetries})...`);
        }
      };

      // Initial fetch
      await fetchData();

      // Set up interval only if we haven't succeeded yet - increased interval for better performance
      if (retryCount > 0 && retryCount < maxRetries) {
        dataFetchIntervalRef.current = setInterval(fetchData, 5000); // Increased to 5 seconds
      }

      return abortController;
    };

    const abortController = startDataFetching();

    return () => {
      if (dataFetchIntervalRef.current) {
        clearInterval(dataFetchIntervalRef.current);
        dataFetchIntervalRef.current = null;
      }
      abortController.then(controller => controller.abort());
    };
  }, [fetchDataSummary]);

  // Optimized IPOP utilization fetching effect with reduced frequency
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 3; // Reduced retries

    const startIpopFetching = async () => {
      const abortController = new AbortController();

      const fetchIpop = async () => {
        const success = await fetchIpopUtilization(abortController);
        if (success) {
          retryCount = 0;
          if (ipopFetchIntervalRef.current) {
            clearInterval(ipopFetchIntervalRef.current);
            ipopFetchIntervalRef.current = null;
          }
        } else if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying IPOP fetch (${retryCount}/${maxRetries})...`);
        }
      };

      await fetchIpop();

      // Increased interval for better performance
      if (retryCount > 0 && retryCount < maxRetries) {
        ipopFetchIntervalRef.current = setInterval(fetchIpop, 5000); // Increased to 5 seconds
      }

      return abortController;
    };

    const abortController = startIpopFetching();

    return () => {
      if (ipopFetchIntervalRef.current) {
        clearInterval(ipopFetchIntervalRef.current);
        ipopFetchIntervalRef.current = null;
      }
      abortController.then(controller => controller.abort());
    };
  }, [fetchIpopUtilization]);

  // Component unmount cleanup
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (dataFetchIntervalRef.current) {
        clearInterval(dataFetchIntervalRef.current);
      }
      if (ipopFetchIntervalRef.current) {
        clearInterval(ipopFetchIntervalRef.current);
      }
    };
  }, []);

  // Sidebar cable selection - let DeletedCablesSidebar handle camera movement internally
  const handleSidebarCableSelect = useCallback((cable: CableData) => {
    // Let DeletedCablesSidebar handle all map positioning internally
    // Don't interfere with map panning to avoid conflicts
    console.log('User Cable Map - Cable selected and positioned:', cable.cut_id);
  }, []);

  const handleSidebarToggle = useCallback(() => {
    setSidebarOpen(prev => {
      const newState = !prev;
      // Show helpful notification when opening sidebar
      if (newState) {
        showNotification(
          '🔧 DeletedCablesSidebar Activated: Click any deleted cable to automatically zoom and navigate to its exact location on the map!',
          'info'
        );
      } else {
        showNotification(
          '📋 DeletedCablesSidebar closed. Use the menu button (☰) to access deleted cable viewing and navigation features.',
          'info'
        );
      }
      return newState;
    });
  }, [showNotification]);

  const handleSidebarClose = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  // Popup close handler removed - functionality now handled by DeletedCablesSidebar

  // Optimized formatDate function with memoization
  const formatDate = useCallback((dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }, []);

  // Marker style function removed - functionality now handled by DeletedCablesSidebar

  return (
    <UserCableMapErrorBoundary>
      <Box sx={{ position: 'relative', width: '100%', height: mapHeight }}>
        {/* Enhanced Toggle Button for Comprehensive Sidebar Functionality */}
        {/* Deleted Cable Sidebar Toggle Button - normal position when closed, below sidebar when open */}
        {!sidebarOpen && (
          <Box sx={{ position: 'absolute', top: 80, left: 8, zIndex: 1200 }}>
            {/* 90px from the top to move below the zoom controls; adjust as needed */}
            <IconButton
              sx={{
                background: '#fff',
                boxShadow: 2,
                borderRadius: 1,
                p: 1,
                '&:hover': {
                  background: '#e3e8f5',
                  transform: 'scale(1.05)',
                  transition: 'all 0.2s ease'
                },
                '&:active': {
                  transform: 'scale(0.98)'
                }
              }}
              onClick={handleSidebarToggle}
              aria-label="Access Comprehensive Deleted Cables Management"
            >
              <MenuIcon sx={{ fontSize: 28, color: '#3854A5' }} />
            </IconButton>
          </Box>
        )}
        {/* When sidebar is open, do not render the hamburger/toggle button inside the sidebar area */}

        {/* Right Sidebar Toggle Button */}
        <Box sx={{ position: 'absolute', top: 16, right: 15, zIndex: 1200 }}>
          {/* Wrap Hide Tool Tip toggle button in a Box for grouping */}
          <Box>

            <IconButton
              sx={{
                background: '#fff',
                boxShadow: 2,
                borderRadius: 1,
                '&:hover': { background: '#e3e8f5' }
              }}
              onClick={() => setRightSidebarOpen((open) => !open)}
              aria-label="Show Cable System Overview"
            >
              <InfoIcon sx={{ fontSize: 28, color: '#3854A5' }} />
            </IconButton>

          </Box>
        </Box>

        {/* Capacity and Utilization Display */}
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '8px',
            zIndex: 1000,
            fontSize: '14px',
            flexDirection: 'row'
          }}
        >
          <Typography variant="caption" color="gray">
            Capacity:
          </Typography>
          <Typography variant="h4" color="black">
            {stats.totalGbps} Gbps
          </Typography>

          <Typography variant="caption" color="gray">
            Average Utilization:
          </Typography>
          <Typography variant="h4" color="black">
            {ipopUtilization}
          </Typography>
        </Box>

        {/* 
        ==========================================
        DELETEDCABLESSIDEBAR WITH ZOOM NAVIGATION
        ==========================================
        Enhanced sidebar integration with automatic camera movement:
        
        ✅ New Features Added:
        - Automatic zoom and pan to exact cable location when clicked in sidebar
        - Smooth camera animation with distance-based timing
        - Intelligent positioning with slight offset for better visibility  
        - Enhanced zoom level (15) for detailed cable inspection
        - User-friendly notifications and feedback
        
        ✅ User Benefits:
        - Click any deleted cable in sidebar to navigate to its exact location
        - Smooth, professional camera movements with optimal zoom
        - Distance-based animation duration for natural feeling
        - No manual searching or scrolling needed
        - Professional DeletedCablesSidebar interface with viewing features:
          * Automatic camera navigation to selected cables
          * Detailed cable information display
          * Enhanced error handling (read-only)
          * Material-UI notifications with navigation feedback
          * Responsive design with zoom functionality
          * Delete operations DISABLED for users (isAdmin={false})
        
        The enhanced sidebar now provides intelligent navigation while
        maintaining appropriate user permissions (no delete operations).
      */}
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
            <Suspense fallback={<LoadingSpinner message="Loading sidebar..." />}>
              <DeletedCablesSidebar
                onSelectCable={handleSidebarCableSelect}
                lastUpdate={lastUpdate}
                setLastUpdate={setLastUpdate}
                isAdmin={false}  // Disable admin functionality like Delete button for users
                isUser={true}    // Enable user functionality 
                mapRef={externalMapRef || mapRef}
                onCloseSidebar={handleSidebarClose}
              />
            </Suspense>
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
              width: 330,
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
            <Suspense fallback={<LoadingSpinner message="Loading tooltip..." />}>
              <HideToolTip />
            </Suspense>
          </Box>
        )}

        <Box
          sx={{
            height: '100%',
            width: '100%'
          }}
        >
          <MapContainer
            style={{ height: '100%', width: '100%' }}
            ref={externalMapRef || mapRef}
          >
            <RemoveAttribution />
            <ChangeView center={[18, 134]} zoom={4} />
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

            {/* Location Markers - Lazy loaded for better performance */}
            <Suspense fallback={null}>
              <USAMarker />
              <JapanMarker />
              <HongkongMarker />
              <SingaporeMarker />
            </Suspense>

            {/* Route Components - Lazy loaded and grouped by system for optimal performance */}
            <Suspense fallback={null}>
              <SeaUSRoutes />
            </Suspense>

            <Suspense fallback={null}>
              <SJCRoutes />
            </Suspense>

            <Suspense fallback={null}>
              <TGNIARoutes />
            </Suspense>

            <Suspense fallback={null}>
              <C2C />
            </Suspense>

            {/* Custom deleted cable popup removed - functionality now handled by DeletedCablesSidebar */}

            {/* Enhanced Cable Cut Popup - Full Admin Functionality */}
            {selectedCable && selectedCutType && (
              <Marker
                key={`cable-${selectedCable.cut_id || `${selectedCable.latitude}-${selectedCable.longitude}`}`}
                position={[selectedCable.latitude, selectedCable.longitude]}
              >
                <Popup key={`popup-${selectedCable.cut_id || `${selectedCable.latitude}-${selectedCable.longitude}`}`}>
                  <Box sx={{ minWidth: 270, p: 1 }}>
                    <Box sx={{ background: '#B71C1C', color: 'white', p: 1, borderRadius: 1, mb: 1, textAlign: 'center' }}>
                      <Typography variant="h6">{selectedCutType.toUpperCase()}</Typography>
                    </Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '18px', mb: 1 }}>
                      {selectedCable.distance} km — {selectedCable.cut_id}
                    </Typography>
                    <Typography sx={{ mb: 1 }}>
                      {formatDate(selectedCable.fault_date)} — Depth: {selectedCable.depth}m
                    </Typography>
                    <Typography sx={{ mb: 1 }}>Cut Type: {selectedCutType}</Typography>
                    <Typography sx={{ mb: 1 }}>Cable Type: {selectedCable.cable_type || 'Unknown'}</Typography>
                    <Typography sx={{ mb: 1 }}>Latitude: {selectedCable.latitude}</Typography>
                    <Typography sx={{ mb: 1 }}>Longitude: {selectedCable.longitude}</Typography>
                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
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
                          backgroundColor: '#6c757d',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          width: '100%',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#5a6268'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6c757d'}
                      >
                        Close
                      </button>
                    </Box>
                  </Box>
                </Popup>
              </Marker>
            )}

          </MapContainer>
        </Box>

        {/* Enhanced Notification System with DeletedCablesSidebar Integration Feedback */}
        <Snackbar
          open={notification.open}
          autoHideDuration={7000}  // Increased duration for more detailed messages
          onClose={hideNotification}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{ zIndex: 1300 }}
        >
          <Alert
            onClose={hideNotification}
            severity={notification.severity}
            sx={{
              width: '100%',
              minWidth: '320px',  // Ensure adequate width for detailed messages
              fontSize: '14px',
              '& .MuiAlert-icon': {
                fontSize: '22px'  // Slightly larger icons for better visibility
              },
              '& .MuiAlert-message': {
                display: 'flex',
                alignItems: 'center'
              }
            }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </UserCableMapErrorBoundary>
  );
});

UserCableMap.displayName = 'UserCableMap';

export default UserCableMap;