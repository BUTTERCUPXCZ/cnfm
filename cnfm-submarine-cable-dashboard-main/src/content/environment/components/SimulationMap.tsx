import { Box, Typography, IconButton, Paper } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import type { MapContainerProps } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';

import SeaUS from 'src/content/admin/dashboard/SeaUS';
import SJC from 'src/content/admin/dashboard/SJC';
import C2C from 'src/content/admin/dashboard/C2C';
import TGNIA from 'src/content/admin/dashboard/TGNIA';

import JapanMarker from 'src/content/admin/components/JapanMarker';
import HongkongMarker from 'src/content/admin/components/HongkongMarker';
import SingaporeMarker from 'src/content/admin/components/SingaporeMarker';
import USAMarker from 'src/content/admin/components/USAMarker';
import HideToolTip from 'src/content/admin/components/HideToolTip';

// Explicit RPL imports (as in your working codebase)
import RPLSeaUS1 from 'src/content/admin/dashboard/RoutePositionList/RPLSeaUS1';
import RPLSeaUS2 from 'src/content/admin/dashboard/RoutePositionList/RPLSeaUS2';
import RPLSeaUS3 from 'src/content/admin/dashboard/RoutePositionList/RPLSeaUS3';
import RPLSeaUS4 from 'src/content/admin/dashboard/RoutePositionList/RPLSeaUS4';
import RPLSeaUS5 from 'src/content/admin/dashboard/RoutePositionList/RPLSeaUS5';
import RPLSeaUS6 from 'src/content/admin/dashboard/RoutePositionList/RPLSeaUS6';

import RPLSJC1 from 'src/content/admin/dashboard/RoutePositionList/RPLSJC1';
import RPLSJC3 from 'src/content/admin/dashboard/RoutePositionList/RPLSJC3';
import RPLSJC4 from 'src/content/admin/dashboard/RoutePositionList/RPLSJC4';
import RPLSJC5 from 'src/content/admin/dashboard/RoutePositionList/RPLSJC5';
import RPLSJC6 from 'src/content/admin/dashboard/RoutePositionList/RPLSJC6';
import RPLSJC7 from 'src/content/admin/dashboard/RoutePositionList/RPLSJC7';
import RPLSJC8 from 'src/content/admin/dashboard/RoutePositionList/RPLSJC8';
import RPLSJC9 from 'src/content/admin/dashboard/RoutePositionList/RPLSJC9';
import RPLSJC10 from 'src/content/admin/dashboard/RoutePositionList/RPLSJC10';
import RPLSJC11 from 'src/content/admin/dashboard/RoutePositionList/RPLSJC11';
import RPLSJC12 from 'src/content/admin/dashboard/RoutePositionList/RPLSJC12';
import RPLSJC13 from 'src/content/admin/dashboard/RoutePositionList/RPLSJC13';

import RPLTGNIA1 from 'src/content/admin/dashboard/RoutePositionList/RPLTGNIA1';
import RPLTGNIA2 from 'src/content/admin/dashboard/RoutePositionList/RPLTGNIA2';
import RPLTGNIA3 from 'src/content/admin/dashboard/RoutePositionList/RPLTGNIA3';
import RPLTGNIA4 from 'src/content/admin/dashboard/RoutePositionList/RPLTGNIA4';
import RPLTGNIA5 from 'src/content/admin/dashboard/RoutePositionList/RPLTGNIA5';
import RPLTGNIA6 from 'src/content/admin/dashboard/RoutePositionList/RPLTGNIA6';
import RPLTGNIA7 from 'src/content/admin/dashboard/RoutePositionList/RPLTGNIA7';
import RPLTGNIA8 from 'src/content/admin/dashboard/RoutePositionList/RPLTGNIA8';
import RPLTGNIA9 from 'src/content/admin/dashboard/RoutePositionList/RPLTGNIA9';
import RPLTGNIA10 from 'src/content/admin/dashboard/RoutePositionList/RPLTGNIA10';
import RPLTGNIA11 from 'src/content/admin/dashboard/RoutePositionList/RPLTGNIA11';
import RPLTGNIA12 from 'src/content/admin/dashboard/RoutePositionList/RPLTGNIA12';

import CutSeaUS from './RPLSeaUS/CutSeaUS';
import CutSJC from './RPLSJC/CutSJC';
import CutTGNIA from './RPLTGNIA/CutTGNIA';
import ResetButton from './ResetButton';
import ReturnButton from './ReturnButton';

// Optional: if you actually use this elsewhere
// import DeletedCablesSidebar from 'src/content/admin/components/DeletedCablesSidebar';

const SimulationMapErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  React.useEffect(() => {
    const handleError = () => setHasError(true);
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
};

function ChangeView({ center, zoom }: { center: L.LatLngExpression; zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
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

    map.createPane('markerPane');
    map.getPane('markerPane')!.style.zIndex = '650';

    let marker: L.Marker | L.CircleMarker;

    if (icon) {
      marker = L.marker(position, { icon, pane: 'markerPane' });
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
      map.removeLayer(marker);
    };
  }, [position, map, label, icon]);

  return null;
}

interface CableCut {
  cut_id: string;
  cut_type: string;
  fault_date: string;
  distance: number;
  simulated: string;
  latitude: number;
  longitude: number;
  depth: number;
}

interface SimulationMapProps {
  selectedCable?: CableCut | null;
  mapRef?: React.RefObject<L.Map>;
}

const SimulationMap: React.FC<SimulationMapProps> = ({ selectedCable, mapRef: externalMapRef }) => {
  const [mapHeight, setMapHeight] = useState('60vh');

  // Right sidebar
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

  // Map ref
  const mapRef = useRef<L.Map | null>(null);

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const port = process.env.REACT_APP_PORT;
  const mapApiKey = process.env.REACT_APP_GEOAPIFY_API_KEY;

  // Resize-driven height
  useEffect(() => {
    const updateMapHeight = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      if (screenHeight > 900 && screenWidth > 1600) setMapHeight('800px');
      else if (screenHeight > 700 && screenWidth > 1200) setMapHeight('700px');
      else if (screenHeight > 900) setMapHeight('70vh');
      else if (screenHeight > 700) setMapHeight('65vh');
      else setMapHeight('60vh');
    };
    updateMapHeight();
    window.addEventListener('resize', updateMapHeight);
    return () => window.removeEventListener('resize', updateMapHeight);
  }, []);

  // Pan/zoom to selected cable (instant)
  useEffect(() => {
    if (selectedCable && selectedCable.latitude && selectedCable.longitude) {
      const map = externalMapRef?.current || mapRef.current;
      if (map) {
        map.setView([selectedCable.latitude, selectedCable.longitude], 14, { animate: false });
      }
    }
  }, [selectedCable, externalMapRef]);

  // Remove attribution control
  const RemoveAttribution = () => {
    const map = useMap();
    useEffect(() => {
      map.attributionControl.remove();
    }, [map]);
    return null;
  };

  // Heavy static layers memoized to avoid re-render churn
  const StaticLayers = useMemo(
    () => (
      <>
        {/* Dynamic hoverable dots */}
        <DynamicMarker position={[1.3678, 125.0788]} label="Kauditan, Indonesia" />
        <DynamicMarker position={[7.0439, 125.542]} label="Davao, Philippines" />
        <DynamicMarker position={[13.464717, 144.69305]} label="Piti, Guam" />
        <DynamicMarker position={[21.4671, 201.7798]} label="Makaha, Hawaii, USA" />
        <DynamicMarker position={[14.0679, 120.6262]} label="Nasugbu, Philippines" />
        <DynamicMarker position={[18.412883, 121.517283]} label="Ballesteros, Philippines" />

        {/* Country/region markers */}
        <USAMarker />
        <JapanMarker />
        <HongkongMarker />
        <SingaporeMarker />

        {/* Route Position Lists */}
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

        {/* Other layers & controls */}
        <C2C />
        <ReturnButton />
        <CutSeaUS />
        <CutSJC />
        <CutTGNIA />
        <ResetButton />
      </>
    ),
    []
  );

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        '& .leaflet-control-zoom': { display: 'none !important' }
      }}
    >
      {/* Right sidebar toggle */}
      <IconButton
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 1200,
          background: '#fff',
          boxShadow: 2,
          borderRadius: 1,
          p: 1,
          '&:hover': { background: '#e3e8f5' }
        }}
        onClick={() => setRightSidebarOpen((open) => !open)}
        aria-label="Show Info Sidebar"
      >
        <InfoIcon sx={{ fontSize: 28, color: '#3854A5' }} />
      </IconButton>

      {rightSidebarOpen && (
        <Paper
          elevation={4}
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
            background: 'rgba(255, 255, 255, 0.9)'
          }}
        >
          <HideToolTip />
        </Paper>
      )}

      <MapContainer
        style={{ height: '100%', width: '100%', willChange: 'transform' }}
        ref={externalMapRef || mapRef}
      >
        <RemoveAttribution />
        <ChangeView center={[18, 134]} zoom={3.5} />
        {/* Keep tile requests fast & crisp without tripping TS types */}
        <TileLayer
          url={`https://maps.geoapify.com/v1/tile/klokantech-basic/{z}/{x}/{y}.png?apiKey=${mapApiKey}`}
        />
        {StaticLayers}
      </MapContainer>
    </Box>
  );
};

export default SimulationMap;
