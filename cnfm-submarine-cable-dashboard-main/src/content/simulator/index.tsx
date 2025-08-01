import { Helmet } from 'react-helmet-async';
import Footer from 'src/components/Footer';
import {
  Card,
  Box,
  Grid,
  Typography,
  useTheme,
  Container,
  Button
} from '@mui/material';
import Swal from 'sweetalert2';
import Header from 'src/components/Header';
import React, { useCallback, useEffect, useState } from 'react';
import CableMap from '../admin/components/CableMap';
import DeletedCablesSidebar from '../admin/components/DeletedCablesSidebar';

const legendItems = [
  { name: 'TGN-IA', color: 'yellow' },
  { name: 'SJC', color: 'blue' },
  { name: 'SEA-US', color: 'green' },
  { name: 'C2C', color: 'orange' }
];

function SimulatorDashboard() {
  const theme = useTheme();
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const port = process.env.REACT_APP_PORT;
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCable, setSelectedCable] = useState(null);
  const [selectedCutType, setSelectedCutType] = useState<string | null>(null);

  // ✅ Create a reusable fetch function
  const fetchLastUpdate = useCallback(async () => {
    try {
      const response = await fetch(`${apiBaseUrl}${port}/latest-update`);
      const data = await response.json();

      if (data?.update?.date_time) {
        const fileName = data.update.file_name;

        // ✅ Remove .csv extension for display
        const displayName = fileName
          ? fileName.replace(/\.csv$/i, '')
          : fileName;

        setLastUpdate(displayName);
        return true;
      } else {
        console.log('No update timestamp received');
        return false;
      }
    } catch (err) {
      console.error('Error fetching latest update:', err);
      return false;
    }
  }, [apiBaseUrl, port]);

  // ✅ Add useEffect to actually call the fetch function
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const initialFetch = async () => {
      const success = await fetchLastUpdate();

      if (!success) {
        // Retry every 2s until we get the data
        interval = setInterval(async () => {
          const retrySuccess = await fetchLastUpdate();
          if (retrySuccess) {
            clearInterval(interval);
          }
        }, 2000);
      }
    };

    initialFetch();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [fetchLastUpdate]);

  return (
    <>
      <Helmet>
        <title>Main Dashboard</title>
      </Helmet>

      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ pt: 5, px: 2 }}></Box>
      <Container maxWidth="xl">
        <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={2}>
          <Grid item xs={12}>
            <Card>
              <Grid spacing={0} container>
                <Grid item xs={12}>
                  <Box p={4} sx={{ position: 'relative' }}>
                    <Header />
                    {/* Legend */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                        flexWrap: 'wrap',
                        mb: 1
                      }}
                    >
                      <Typography variant="h6">Legend:</Typography>
                      {legendItems.map((item, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ width: 20, height: 10, backgroundColor: item.color, borderRadius: '2px', mr: 1 }} />
                          <Typography variant="body2">{item.name}</Typography>
                        </Box>
                      ))}
                      <Box sx={{ flexGrow: 1 }} />
                      <Box>
                        <Typography variant="body2">
                          Source File: {lastUpdate || 'No Source Found'}
                        </Typography>
                      </Box>
                    </Box>
                    {/* Cut Type Selection */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="body2" sx={{ mr: 2 }}>Select cut type:</Typography>
                      {['Shunt Fault', 'Partial Fiber Break', 'Fiber Break', 'Full Cut'].map((type) => (
                        <Box key={type} sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
                          <input
                            type="radio"
                            id={type}
                            name="cutType"
                            value={type}
                            checked={selectedCutType === type}
                            onChange={() => setSelectedCutType(type)}
                            style={{ marginRight: 6 }}
                          />
                          <label htmlFor={type} style={{ color: '#5A6278', fontSize: 16 }}>{type}</label>
                        </Box>
                      ))}
                    </Box>
                    {/* Toggle Button for Sidebar */}
                    <Box sx={{ position: 'absolute', top: 16, left: 32, zIndex: 1200 }}>
                      <Button
                        variant="contained"
                        sx={{ minWidth: 0, p: 1, background: '#fff', boxShadow: 2 }}
                        onClick={() => setSidebarOpen((open) => !open)}
                        aria-label="Show Deleted Cables Sidebar"
                      >
                        <span style={{ fontSize: 24, color: '#3854A5' }}>&#9776;</span>
                      </Button>
                    </Box>
                    {/* Sidebar Overlay inside the map */}
                    {sidebarOpen && (
                      <Box
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
                            setSelectedCable(cable);
                            // Pan the map to the cable's location if available
                            // You may need to pass mapRef if you want to pan the map
                          }}
                          lastUpdate={lastUpdate}
                          setLastUpdate={setLastUpdate}
                        />
                      </Box>
                    )}
                    {/* Map Container */}
                    <CableMap selectedCable={selectedCable} selectedCutType={selectedCutType} />
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default SimulatorDashboard;
