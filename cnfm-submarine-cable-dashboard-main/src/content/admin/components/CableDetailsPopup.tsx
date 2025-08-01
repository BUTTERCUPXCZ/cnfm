import React, { useEffect, useRef } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Mini map view component
function MiniMapView({ center, zoom }: { center: [number, number]; zoom: number }) {
    const map = useMap();

    useEffect(() => {
        map.setView(center, zoom);
    }, [map, center, zoom]);

    return null;
}

// X Marker component
function XMarker({ position }: { position: [number, number] }) {
    const map = useMap();

    useEffect(() => {
        if (position) {
            // Create custom X marker
            const xIcon = new L.Icon({
                iconUrl: 'data:image/svg+xml;base64,' + btoa(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" fill="#dc3545" stroke="#fff" stroke-width="2"/>
                        <path d="M15 9l-6 6M9 9l6 6" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                `),
                iconSize: [24, 24],
                iconAnchor: [12, 12],
                popupAnchor: [0, -12]
            });

            const marker = L.marker(position, { icon: xIcon });
            marker.addTo(map);

            return () => {
                map.removeLayer(marker);
            };
        }
    }, [map, position]);

    return null;
}

interface CableCut {
    cut_id: string;
    cut_type: string;
    cable_type?: string;
    fault_date: string;
    distance: number;
    simulated: string;
    latitude: number;
    longitude: number;
    depth: number;
}

interface CableDetailsPopupProps {
    cable: CableCut | null;
    position: { x: number; y: number } | null;
    onClose: () => void;
    onDelete?: (cable: CableCut) => void;
}

const CableDetailsPopup: React.FC<CableDetailsPopupProps> = ({
    cable,
    position,
    onClose,
    onDelete
}) => {
    const mapRef = useRef<any>(null);

    if (!cable || !position) return null;

    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'Unknown';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleDelete = () => {
        if (onDelete) {
            onDelete(cable);
        }
        onClose();
    };

    const mapApiKey = process.env.REACT_APP_GEOAPIFY_API_KEY;

    return (
        <>
            {/* Backdrop to close popup when clicking outside */}
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 1300,
                    background: 'transparent'
                }}
                onClick={onClose}
            />

            {/* Popup content */}
            <Paper
                elevation={8}
                sx={{
                    position: 'fixed',
                    left: position.x,
                    top: position.y,
                    zIndex: 1400,
                    minWidth: 320,
                    maxWidth: 380,
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    transform: 'translateX(-50%)', // Center horizontally relative to click position
                }}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside popup
            >
                {/* Header */}
                <Box
                    sx={{
                        background: '#B71C1C',
                        color: 'white',
                        p: 2,
                        textAlign: 'center'
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {cable.cut_type?.toUpperCase() || 'FULL CUT'}
                    </Typography>
                </Box>

                {/* Mini Map */}
                <Box sx={{ height: 150, position: 'relative' }}>
                    <MapContainer
                        style={{ height: '100%', width: '100%' }}
                        ref={mapRef}
                    >
                        <MiniMapView center={[cable.latitude, cable.longitude]} zoom={8} />
                        <TileLayer
                            url={`https://maps.geoapify.com/v1/tile/klokantech-basic/{z}/{x}/{y}.png?apiKey=${mapApiKey}`}
                        />
                        <XMarker position={[cable.latitude, cable.longitude]} />
                    </MapContainer>
                </Box>

                {/* Content */}
                <Box sx={{ p: 2 }}>
                    <Box sx={{ mb: 1.5 }}>
                        <Typography variant="body2" color="text.secondary">
                            Distance:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {cable.distance ? `${cable.distance.toLocaleString()} km` : 'N/A'}
                        </Typography>
                    </Box>

                    <Box sx={{ mb: 1.5 }}>
                        <Typography variant="body2" color="text.secondary">
                            Depth:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {cable.depth ? `${cable.depth} m` : 'N/A'}
                        </Typography>
                    </Box>

                    <Box sx={{ mb: 1.5 }}>
                        <Typography variant="body2" color="text.secondary">
                            Latitude:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {cable.latitude || 'N/A'}
                        </Typography>
                    </Box>

                    <Box sx={{ mb: 1.5 }}>
                        <Typography variant="body2" color="text.secondary">
                            Longitude:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {cable.longitude || 'N/A'}
                        </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            Fault Date:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {formatDate(cable.fault_date)}
                        </Typography>
                    </Box>

                    {/* Delete Button */}
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleDelete}
                        sx={{
                            backgroundColor: '#dc3545',
                            color: 'white',
                            fontWeight: 'bold',
                            textTransform: 'none',
                            '&:hover': {
                                backgroundColor: '#c82333'
                            }
                        }}
                    >
                        Delete
                    </Button>
                </Box>
            </Paper>
        </>
    );
};

export default CableDetailsPopup;