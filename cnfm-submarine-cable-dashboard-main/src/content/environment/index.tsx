import { Helmet } from 'react-helmet-async';
import Footer from 'src/components/Footer';
import {
  Card,
  Box,
  Grid,
  Typography,
  useTheme,
  Container,
  IconButton,
  Paper
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Swal from 'sweetalert2';
import React, { useEffect, useState, useRef } from 'react';
import Header from 'src/components/Header';
import SimulationMap from './components/SimulationMap';
import DeletedCablesSidebar from '../admin/components/DeletedCablesSidebar';
import L from 'leaflet';

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

function SimulationEnvironment() {
  const theme = useTheme();
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const port = process.env.REACT_APP_PORT;
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [selectedCable, setSelectedCable] = useState<CableCut | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mapRef = useRef<L.Map | null>(null);

  return (
    <Box
      sx={{
        backgroundColor: '#F1F4FA', // Lightest blue for background
        minHeight: '100vh'
      }}
    >
      <Helmet>
        <title>Simulation Dashboard</title>
      </Helmet>

      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ pb: 3, px: 2 }}
      ></Box>

      <Container maxWidth="xl">
        {/* Simulation Environment Indicator */}
        <Box
          mb={3}
          p={1.5}
          sx={{
            backgroundColor: '#C7D9EF', // Light blue for indicator box
            borderRadius: theme.shape.borderRadius,
            border: '1px solid #3854A5', // Primary blue border
            textAlign: 'center'
          }}
        >
          <Typography
            variant="h5"
            sx={{ color: '#3854A5', fontWeight: 'bold' }} // Primary blue text
          >
            Simulation Environment
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Safe Environment - Changes made here won't affect the data uploaded
            to the main dashboard.
          </Typography>
        </Box>

        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={2}
        >
          <Grid item xs={12}>
            <Card
              sx={{
                overflow: 'visible',
                borderLeft: '4px solid #3854A5', // Primary blue border on cards
                boxShadow: '0 4px 20px 0 rgba(56, 84, 165, 0.1)', // Subtle blue shadow
                position: 'relative',
                height: '70vh', // Set fixed height for the card
                minHeight: '600px' // Minimum height
              }}
            >
              <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                {/* Toggle Button for Sidebar */}
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 16,
                    left: 50,
                    zIndex: 1200,
                    background: '#fff',
                    boxShadow: 2,
                    borderRadius: 1,
                    p: 1,
                    '&:hover': { background: '#e3e8f5' }
                  }}
                  onClick={() => setSidebarOpen((open) => !open)}
                  aria-label="Show Deleted Cables Sidebar"
                >
                  <MenuIcon sx={{ fontSize: 28, color: '#3854A5' }} />
                </IconButton>
                {/* Sidebar Overlay inside the map */}
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
                      onSelectCable={(cable: CableCut) => {
                        setSelectedCable(cable);
                        // Pan the map to the cable's location using mapRef with smooth transition
                        if (cable && cable.latitude && cable.longitude && mapRef.current) {
                          // Stop any ongoing animations before starting new one to prevent conflicts
                          mapRef.current.stop();
                          
                          // Apply smooth transition with enhanced animation parameters
                          mapRef.current.setView([cable.latitude, cable.longitude], 14, { 
                            animate: true,
                            duration: 0.8, // Slightly longer animation for smoother experience
                            easeLinearity: 0.2 // Smoother easing
                          });
                        }
                      }}
                      lastUpdate={lastUpdate}
                      setLastUpdate={setLastUpdate}
                      isAdmin={true}  // <-- Allow admin functionality for simulation environment
                      isUser={true}   // <-- Enable user functionality
                      mapRef={mapRef}
                      onCloseSidebar={() => setSidebarOpen(false)} // Add close function
                    />
                  </Paper>
                )}
                {/* Map Container */}
                <Box sx={{ width: '100%', height: '100%' }}>
                  <SimulationMap selectedCable={selectedCable} mapRef={mapRef} />
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </Box>
  );
}

export default SimulationEnvironment;
