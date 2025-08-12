import { Box, Typography, IconButton, Paper } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import USAMarker from 'src/content/admin/components/USAMarker';
import JapanMarker from 'src/content/admin/components/JapanMarker';
import HideToolTip from 'src/content/admin/components/HideToolTip';
import TGNIA from 'src/content/admin/dashboard/TGNIA';
import SJC from 'src/content/admin/dashboard/SJC';
import HongkongMarker from 'src/content/admin/components/HongkongMarker';
import SingaporeMarker from 'src/content/admin/components/SingaporeMarker';
import C2C from 'src/content/admin/dashboard/C2C';
import SeaUS from 'src/content/admin/dashboard/SeaUS';
import ReturnButton from './ReturnButton';
import CutSeaUS from './RPLSeaUS/CutSeaUS';
import RPLSeaUS1 from 'src/content/admin/dashboard/RoutePositionList/RPLSeaUS1';
import RPLSeaUS2 from 'src/content/admin/dashboard/RoutePositionList/RPLSeaUS2';
import RPLSeaUS3 from 'src/content/admin/dashboard/RoutePositionList/RPLSeaUS3';
import CutSJC from './RPLSJC/CutSJC';
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
import CutTGNIA from './RPLTGNIA/CutTGNIA';
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
import ResetButton from './ResetButton';
import RPLSeaUS4 from 'src/content/admin/dashboard/RoutePositionList/RPLSeaUS4';
import RPLSeaUS5 from 'src/content/admin/dashboard/RoutePositionList/RPLSeaUS5';
import RPLSeaUS6 from 'src/content/admin/dashboard/RoutePositionList/RPLSeaUS6';

function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

type DynamicMarkerProps = {
  position: [number, number];
  label: string;
  icon?: L.Icon; // make it optional with the `?`
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
          offset: icon ? [0, -30] : [0, -10], // 👈 Tooltip offset adjusted here
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
  
  // Pan/zoom to selected cable location (revamped: instant jump, no animation, like admin)
  useEffect(() => {
    if (selectedCable && selectedCable.latitude && selectedCable.longitude) {
      const map = externalMapRef?.current || mapRef.current;
      if (map) {
        map.setView([selectedCable.latitude, selectedCable.longitude], 14, {
          animate: false
        });
      }
    }
  }, [selectedCable, externalMapRef]);

  const [ipopUtilization, setIpopUtilization] = useState('0%');
  const [ipopDifference, setIpopDifference] = useState('0%');
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    data: [],
    totalGbps: 0,
    avgUtilization: 0,
    zeroUtilizationCount: 0
  });
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const port = process.env.REACT_APP_PORT;
  const mapApiKey = process.env.REACT_APP_GEOAPIFY_API_KEY;

  // Single consolidated map height update function
  useEffect(() => {
    const updateMapHeight = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      
      // Calculate height based on available space, prioritizing screen height
      if (screenHeight > 900 && screenWidth > 1600) {
        setMapHeight('800px');
      } else if (screenHeight > 700 && screenWidth > 1200) {
        setMapHeight('700px');
      } else if (screenHeight > 900) {
        setMapHeight('70vh');
      } else if (screenHeight > 700) {
        setMapHeight('65vh');
      } else {
        setMapHeight('60vh');
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
          const totalGbps = result.reduce(
            (sum, item) => sum + (item.gbps || 0),
            0
          );

          const totalUtilization = result.reduce(
            (sum, item) => sum + (item.percent || 0),
            0
          );

          const avgUtilization = parseFloat(
            (totalUtilization / result.length).toFixed(2)
          );

          const zeroCount = result.filter((item) => item.percent === 0).length;

          setStats({
            data: result,
            totalGbps,
            avgUtilization,
            zeroUtilizationCount: zeroCount
          });

          // ✅ Stop interval after successful fetch
          clearInterval(interval);
        } else {
          console.log('No data received, retrying...');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    // Run immediately on mount
    fetchData();

    // Set up interval to retry every 2s if no data yet
    interval = setInterval(fetchData, 2000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [apiBaseUrl, port]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const fetchIpopUtil = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}${port}/average-util`, {
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
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

    // Run immediately on mount
    fetchIpopUtil();

    // Set up interval to retry every 2s if no data yet
    interval = setInterval(fetchIpopUtil, 2000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [apiBaseUrl, port]);

  // Custom component to remove attribution
  const RemoveAttribution = () => {
    const map = useMap();

    useEffect(() => {
      // Remove attribution control when component mounts
      map.attributionControl.remove();
    }, [map]);

    return null;
  };

  // Ref for map instance
  const mapRef = useRef<L.Map | null>(null);
  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%', '& .leaflet-control-zoom': { display: 'none !important' } }}>
      {/* Right sidebar toggle button */}
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

      <MapContainer
        style={{ height: '100%', width: '100%' }}
        ref={externalMapRef || mapRef}
      >

        <RemoveAttribution />
        <ChangeView center={[18, 134]} zoom={3.5} />
        {/*<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />*/}
        <TileLayer
          url={`https://maps.geoapify.com/v1/tile/klokantech-basic/{z}/{x}/{y}.png?apiKey=${mapApiKey}`}
        />
    
        {/* Dynamic Hoverable Dot Markers*/}
        <DynamicMarker
          position={[1.3678, 125.0788]}
          label="Kauditan, Indonesia"
        />
        <DynamicMarker
          position={[7.0439, 125.542]}
          label="Davao, Philippines"
        />
        <DynamicMarker position={[13.464717, 144.69305]} label="Piti, Guam" />
        <DynamicMarker
          position={[21.4671, 201.7798]}
          label="Makaha, Hawaii, USA"
        />
        <USAMarker />
        <DynamicMarker
          position={[14.0679, 120.6262]}
          label="Nasugbu, Philippines"
        />
        <DynamicMarker
          position={[18.412883, 121.517283]}
          label="Ballesteros, Philippines"
        />
        <JapanMarker />
        <HongkongMarker />
        <SingaporeMarker />
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
       
        <ReturnButton />
        <CutSeaUS />
        <CutSJC />
        <CutTGNIA />
        <ResetButton />
      </MapContainer>
    </Box>
  );
};

export default SimulationMap;
