import { Box, Typography, IconButton, Paper } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import InfoIcon from '@mui/icons-material/Info';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import SeaUS from '../dashboard/SeaUS';
import SJC from '../dashboard/SJC';
import C2C from '../dashboard/C2C';
import TGNIA from '../dashboard/TGNIA';
import JapanMarker from './JapanMarker';
import HongkongMarker from './HongkongMarker';
import SingaporeMarker from './SingaporeMarker';
import USAMarker from './USAMarker';
import SimulationButton from 'src/content/environment/components/SimulationButton';
import DeletedCablesSidebar from './DeletedCablesSidebar';
import HideToolTip from './HideToolTip';
import RPLSeaUS1 from '../dashboard/RoutePositionList/RPLSeaUS1';
import RPLSeaUS2 from '../dashboard/RoutePositionList/RPLSeaUS2';
import RPLSeaUS3 from '../dashboard/RoutePositionList/RPLSeaUS3';
import RPLSJC1 from '../dashboard/RoutePositionList/RPLSJC1';
import RPLSJC3 from '../dashboard/RoutePositionList/RPLSJC3';
import RPLSJC4 from '../dashboard/RoutePositionList/RPLSJC4';
import RPLSJC5 from '../dashboard/RoutePositionList/RPLSJC5';
import RPLSJC6 from '../dashboard/RoutePositionList/RPLSJC6';
import RPLSJC7 from '../dashboard/RoutePositionList/RPLSJC7';
import RPLSJC8 from '../dashboard/RoutePositionList/RPLSJC8';
import RPLSJC9 from '../dashboard/RoutePositionList/RPLSJC9';
import RPLSJC10 from '../dashboard/RoutePositionList/RPLSJC10';
import RPLSJC11 from '../dashboard/RoutePositionList/RPLSJC11';
import RPLSJC12 from '../dashboard/RoutePositionList/RPLSJC12';
import RPLSJC13 from '../dashboard/RoutePositionList/RPLSJC13';
import RPLTGNIA1 from '../dashboard/RoutePositionList/RPLTGNIA1';
import RPLTGNIA2 from '../dashboard/RoutePositionList/RPLTGNIA2';
import RPLTGNIA3 from '../dashboard/RoutePositionList/RPLTGNIA3';
import RPLTGNIA4 from '../dashboard/RoutePositionList/RPLTGNIA4';
import RPLTGNIA5 from '../dashboard/RoutePositionList/RPLTGNIA5';
import RPLTGNIA6 from '../dashboard/RoutePositionList/RPLTGNIA6';
import RPLTGNIA7 from '../dashboard/RoutePositionList/RPLTGNIA7';
import RPLTGNIA8 from '../dashboard/RoutePositionList/RPLTGNIA8';
import RPLTGNIA9 from '../dashboard/RoutePositionList/RPLTGNIA9';
import RPLTGNIA10 from '../dashboard/RoutePositionList/RPLTGNIA10';
import RPLTGNIA11 from '../dashboard/RoutePositionList/RPLTGNIA11';
import RPLTGNIA12 from '../dashboard/RoutePositionList/RPLTGNIA12';
import RPLSeaUS4 from '../dashboard/RoutePositionList/RPLSeaUS4';
import RPLSeaUS5 from '../dashboard/RoutePositionList/RPLSeaUS5';
import RPLSeaUS6 from '../dashboard/RoutePositionList/RPLSeaUS6';

function ChangeView({ center, zoom }) {
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
    if (position) {
      map.createPane('markerPane');
      map.getPane('markerPane')!.style.zIndex = '650';

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
        map.removeLayer(marker);
      };
    }
  }, [position, map, label, icon]);

  return null;
}

const RemoveAttribution = () => {
  const map = useMap();

  useEffect(() => {
    map.attributionControl.remove();
  }, [map]);

  return null;
};

interface CableMapProps {
  selectedCable?: any;
  selectedCutType?: string | null;
}

const CableMap: React.FC<CableMapProps> = ({ selectedCable, selectedCutType }) => {
  const [mapHeight, setMapHeight] = useState('600px');
  const [ipopUtilization, setIpopUtilization] = useState('0%');
  const [ipopDifference, setIpopDifference] = useState('0%');
  const [stats, setStats] = useState({
    data: [],
    totalGbps: 0,
    avgUtilization: 0,
    zeroUtilizationCount: 0
  });
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const port = process.env.REACT_APP_PORT;
  const mapApiKey = process.env.REACT_APP_GEOAPIFY_API_KEY;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const mapRef = useRef<any>(null);

  // Helper function to format date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  useEffect(() => {
    const updateMapHeight = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth > 1600) {
        setMapHeight('800px');
      } else if (screenWidth > 1200) {
        setMapHeight('700px');
      } else {
        setMapHeight('600px');
      }
    };
    updateMapHeight();
    window.addEventListener('resize', updateMapHeight);
    return () => window.removeEventListener('resize', updateMapHeight);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}${port}/data-summary`);
        const result = await response.json();
        if (Array.isArray(result) && result.length > 0) {
          const totalGbps = result.reduce((sum, item) => sum + (item.gbps || 0), 0);
          const totalUtilization = result.reduce((sum, item) => sum + (item.percent || 0), 0);
          const avgUtilization = parseFloat((totalUtilization / result.length).toFixed(2));
          const zeroCount = result.filter((item) => item.percent === 0).length;
          setStats({ data: result, totalGbps, avgUtilization, zeroUtilizationCount: zeroCount });
          clearInterval(interval);
        } else {
          console.log('No data received, retrying...');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
    interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, [apiBaseUrl, port]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const fetchIpopUtil = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}${port}/average-util`, { headers: { 'Cache-Control': 'no-cache' } });
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
          clearInterval(interval);
        } else {
          setIpopUtilization('0%');
          setIpopDifference('');
        }
      } catch (error) {
        console.error('Error fetching IPOP utilization:', error);
      }
    };
    fetchIpopUtil();
    interval = setInterval(fetchIpopUtil, 2000);
    return () => clearInterval(interval);
  }, [apiBaseUrl, port]);

  useEffect(() => {
    if (selectedCable && selectedCable.latitude && selectedCable.longitude && mapRef.current) {
      mapRef.current.setView([selectedCable.latitude, selectedCable.longitude], 10, { animate: true });
    }
  }, [selectedCable]);

  return (
    <Box sx={{ position: 'relative', width: '100%', height: mapHeight }}>
      {/* Left sidebar toggle button */}
      <IconButton
        sx={{ position: 'absolute', top: 16, left: 16, zIndex: 1200, background: '#fff', boxShadow: 2 }}
        onClick={() => setSidebarOpen((open) => !open)}
        aria-label="Show Deleted Cables Sidebar"
      >
        <MenuIcon />
      </IconButton>

      {/* Right sidebar toggle button */}
      <IconButton
        sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1200, background: '#fff', boxShadow: 2 }}
        onClick={() => setRightSidebarOpen((open) => !open)}
        aria-label="Show Info Sidebar"
      >
        <InfoIcon />
      </IconButton>

      {/* Left Sidebar - Deleted Cables */}
      {sidebarOpen && (
        <Paper
          elevation={4}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: 360,
            zIndex: 1100,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 4,
            borderRadius: '8px',
            overflow: 'hidden',
            background: 'rgba(255, 255, 255, 0.7)',
          }}
        >
          <DeletedCablesSidebar
            onSelectCable={(cable) => {
              if (cable && cable.latitude && cable.longitude && mapRef.current) {
                mapRef.current.setView([cable.latitude, cable.longitude], 8, { animate: true });
              }
            }}
            lastUpdate={lastUpdate}
            setLastUpdate={setLastUpdate}
          />
        </Paper>
      )}

      {/* Right Sidebar - HideToolTip */}
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
            background: 'rgba(255, 255, 255, 0.9)',
          }}
        >
          <HideToolTip />
        </Paper>
      )}

      <MapContainer style={{ height: '100%', width: '100%' }} ref={mapRef}>
        <RemoveAttribution />
        <ChangeView center={[18, 134]} zoom={3.5} />
        <TileLayer
          url={`https://maps.geoapify.com/v1/tile/klokantech-basic/{z}/{x}/{y}.png?apiKey=${mapApiKey}`}
        />

        {/* Capacity and Utilization Display Box */}
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            color: 'black',
            padding: '12px 16px',
            borderRadius: '8px',
            zIndex: 1000,
            fontSize: '14px',
            boxShadow: 3,
            border: '1px solid rgba(0,0,0,0.1)'
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box>
              <Typography variant="caption" color="gray" sx={{ fontSize: '11px', fontWeight: 600 }}>
                Capacity:
              </Typography>
              <Typography variant="h6" color="black" sx={{ fontWeight: 700, lineHeight: 1 }}>
                {stats.totalGbps} Gbps
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="gray" sx={{ fontSize: '11px', fontWeight: 600 }}>
                Average Utilization:
              </Typography>
              <Typography variant="h6" color="black" sx={{ fontWeight: 700, lineHeight: 1 }}>
                {ipopUtilization}
              </Typography>
            </Box>
          </Box>
        </Box>


        <DynamicMarker position={[1.3678, 125.0788]} label="Kauditan, Indonesia" />
        <DynamicMarker position={[7.0439, 125.542]} label="Davao, Philippines" />
        <DynamicMarker position={[13.464717, 144.69305]} label="Piti, Guam" />
        <DynamicMarker position={[21.4671, 201.7798]} label="Makaha, Hawaii, USA" />
        <USAMarker />
        <DynamicMarker position={[14.0679, 120.6262]} label="Nasugbu, Philippines" />
        <DynamicMarker position={[18.412883, 121.517283]} label="Ballesteros, Philippines" />
        <JapanMarker />
        <HongkongMarker />
        <SingaporeMarker />
        <SeaUS />
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
        <SJC />
        <C2C />
        <TGNIA />
        <SimulationButton />

        {selectedCable && selectedCutType && (
          <Marker
            key={selectedCable.cut_id || `${selectedCable.latitude}-${selectedCable.longitude}`}
            position={[selectedCable.latitude, selectedCable.longitude]}
          >
            <Popup key={selectedCable.cut_id || `${selectedCable.latitude}-${selectedCable.longitude}`}>
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
                <Box sx={{ mt: 2 }}>
                  <button style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', width: '100%' }}>Delete</button>
                </Box>
              </Box>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </Box>
  );
};

export default CableMap;