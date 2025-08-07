import React, { useEffect, useState, useRef } from 'react';
import {
    Box,
    Typography,
    Divider,
    List,
    ListItem,
    Button,
    IconButton
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import L from 'leaflet';

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

interface DeletedCablesSidebarProps {
    onSelectCable: (cable: CableCut) => void;
    lastUpdate?: string | null;
    setLastUpdate?: (val: string) => void;
    phTime?: string;
    isAdmin?: boolean; // <-- Add this prop
    isUser?: boolean; // <-- Add this prop
    mapRef?: React.RefObject<L.Map>; // Add map reference
}

const DeletedCablesSidebar: React.FC<DeletedCablesSidebarProps> = ({
    onSelectCable,
    lastUpdate,
    setLastUpdate,
    phTime,
    isAdmin = true, // <-- Default to true for admin pages
    isUser = true, // <-- Default to true for user pages
    mapRef
}) => {
    const [deletedCables, setDeletedCables] = useState<CableCut[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCable, setSelectedCable] = useState<CableCut | null>(null);
    const [showMapMarker, setShowMapMarker] = useState(false);
    const currentMarkerRef = useRef<L.Marker | null>(null);

    const fetchDeletedCables = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:8081/fetch-cable-cuts');
            const data = await response.json();
            if (Array.isArray(data)) {
                setDeletedCables(
                    [...data].sort((a, b) => 0)
                );
            } else {
                setDeletedCables([]);
            }
        } catch (err) {
            setError('Failed to fetch deleted cables');
        } finally {
            setLoading(false);
        }
    };

    const handleCableClick = (cable: CableCut, event: React.MouseEvent) => {
        event.stopPropagation();
        setSelectedCable(cable);
        setShowMapMarker(true);
        onSelectCable(cable);
    };

    // Function to create map marker
    const createMapMarker = (cable: CableCut) => {
        if (!mapRef?.current || !cable.latitude || !cable.longitude) return;

        const map = mapRef.current;

        // Remove existing marker
        if (currentMarkerRef.current) {
            map.removeLayer(currentMarkerRef.current);
            currentMarkerRef.current = null;
        }

        // Create marker style based on cut type
        const getMarkerStyle = (cutType: string) => {
            const styles: Record<string, any> = {
                'Shunt Fault': { color: '#FBC02D', size: 20 },
                'Partial Fiber Break': { color: '#FF6600', size: 20 },
                'Fiber Break': { color: '#F44336', size: 20 },
                'Full Cut': { color: '#B71C1C', size: 20 }
            };
            return styles[cutType] || { color: '#9E9E9E', size: 20 };
        };

        const markerStyle = getMarkerStyle(cable.cut_type);
        const position: [number, number] = [cable.latitude, cable.longitude];

        // Create marker with custom icon
        const marker = L.marker(position, {
            icon: L.divIcon({
                className: `deleted-cable-marker-${cable.cut_type}`,
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
            zIndexOffset: 1000 // Ensure marker stays visible
        });

        // Create popup content with exact same styling as CableCutFetching
        const popupContent = `
            <div class="cable-cut-popup" style="font-family: Arial, sans-serif; width: 250px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); border-radius: 4px; overflow: hidden;">
                <div style="background-color: ${markerStyle.color}; color: white; padding: 8px; text-align: center; font-weight: bold; font-size: 14px; letter-spacing: 0.5px;">
                    ${cable.cut_type.toUpperCase()}
                </div>
                <div style="background-color: white; padding: 12px;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                        <tr>
                            <td style="font-weight: bold; padding-bottom: 8px;">Distance:</td>
                            <td style="text-align: right; padding-bottom: 8px;">${Number(cable.distance).toFixed(3)} km</td>
                        </tr>
                        <tr>
                            <td style="font-weight: bold; padding-bottom: 8px;">Depth:</td>
                            <td style="text-align: right; padding-bottom: 8px;">${cable.depth || 'Unknown'} m</td>
                        </tr>
                        <tr>
                            <td style="font-weight: bold; padding-bottom: 8px;">Latitude:</td>
                            <td style="text-align: right; padding-bottom: 8px;">${Number(cable.latitude).toFixed(6)}</td>
                        </tr>
                        <tr>
                            <td style="font-weight: bold; padding-bottom: 8px;">Longitude:</td>
                            <td style="text-align: right; padding-bottom: 8px;">${Number(cable.longitude).toFixed(6)}</td>
                        </tr>
                        <tr>
                            <td style="font-weight: bold; padding-bottom: 8px;">Fault Date:</td>
                            <td style="text-align: right; padding-bottom: 8px;">${
                                cable.fault_date
                                    ? new Date(cable.fault_date).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })
                                    : 'Not specified'
                            }</td>
                        </tr>
                    </table>
                </div>
                ${(isAdmin && isUser) ? `
                    <div style="background-color: #f8f9fa; padding: 12px; border-top: 1px solid #dee2e6;">
                        <button class="delete-marker-btn" data-cut-id="${cable.cut_id}" style="
                            background-color: #dc3545;
                            color: white;
                            border: none;
                            padding: 8px 12px;
                            border-radius: 4px;
                            cursor: pointer;
                            font-size: 12px;
                            font-weight: bold;
                            width: 100%;
                            transition: background-color 0.2s;
                        ">
                            Delete
                        </button>
                    </div>
                ` : ''}
            </div>
        `;

        // Add popup styles similar to CableCutFetching
        const addPopupStyles = () => {
            const styleId = `deleted-cable-popup-styles`;
            if (!document.getElementById(styleId)) {
                const style = document.createElement('style');
                style.id = styleId;
                style.innerHTML = `
                    .deleted-cable-custom-popup .leaflet-popup-content-wrapper {
                        padding: 0; margin: 0; background: none; box-shadow: none; border: none;
                    }
                    .deleted-cable-custom-popup .leaflet-popup-content {
                        margin: 0; padding: 0; width: auto !important; background: none; box-shadow: none;
                    }
                    .deleted-cable-custom-popup .leaflet-popup-tip-container,
                    .deleted-cable-custom-popup .leaflet-popup-tip { display: none; }
                    .deleted-cable-custom-popup .leaflet-popup-close-button { display: none; }
                    .deleted-cable-custom-popup.leaflet-popup { 
                        margin-bottom: 0; 
                        z-index: 1000;
                    }
                    .deleted-cable-custom-popup .leaflet-popup-content-wrapper {
                        border-radius: 4px;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                    }
                    .delete-marker-btn:hover {
                        background-color: #c82333 !important;
                    }
                    .delete-marker-btn:active {
                        background-color: #bd2130 !important;
                    }
                `;
                document.head.appendChild(style);
            }
        };

        // Add styles
        addPopupStyles();

        // Create popup with positioning to show above the marker
        const popup = L.popup({
            className: 'deleted-cable-custom-popup',
            maxWidth: 250,
            minWidth: 250,
            closeButton: false,
            autoClose: false,
            closeOnClick: false,
            offset: [0, -30] // Position popup above the marker so X is visible below
        }).setContent(popupContent);

        marker.bindPopup(popup);

        // Add hover event listeners similar to CableCutFetching
        marker.on('mouseover', function (e) {
            this.openPopup();
        });

        marker.on('mouseout', function (e) {
            // Small delay to prevent flickering when moving mouse between marker and popup
            setTimeout(() => {
                const popupElement = this.getPopup().getElement();
                if (!popupElement?.matches(':hover')) {
                    this.closePopup();
                }
            }, 100);
        });

        // Keep popup open when hovering over the popup itself and add delete functionality
        marker.on('popupopen', function (e) {
            const popupElement = this.getPopup().getElement();
            if (popupElement) {
                popupElement.addEventListener('mouseenter', () => {
                    // Keep popup open
                });

                popupElement.addEventListener('mouseleave', () => {
                    this.closePopup();
                });

                // Add click event listener for delete button (only if user can delete)
                if (isAdmin && isUser) {
                    const deleteButton = popupElement.querySelector('.delete-marker-btn');
                    if (deleteButton) {
                        deleteButton.addEventListener('click', (e) => {
                            e.stopPropagation();
                            handleDeleteCable(cable);
                        });
                    }
                }
            }
        });

        // Add marker to map
        marker.addTo(map);
        currentMarkerRef.current = marker;

        // Pan to marker and automatically open popup
        map.setView(position, 8, { animate: true });
        setTimeout(() => {
            marker.openPopup();
        }, 500);
    };

    const handleCloseToast = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === 'clickaway') return;
        setShowMapMarker(false);
        setTimeout(() => setSelectedCable(null), 300); // allow fade out
    };

    const handleDeleteCable = async (cable: CableCut) => {
        try {
            const response = await fetch(
                `http://localhost:8081/delete-single-cable-cuts/${cable.cut_id}`,
                { method: 'DELETE' }
            );
            const result = await response.json();
            if (result.success) {
                fetchDeletedCables();
                if (setLastUpdate) setLastUpdate(Date.now().toString());
                setShowMapMarker(false);
                setTimeout(() => setSelectedCable(null), 300);
            } else {
                alert('Failed to delete cable.');
            }
        } catch (error) {
            console.error('Error deleting cable:', error);
            alert('Error deleting cable.');
        }
    };

    useEffect(() => {
        fetchDeletedCables();
    }, [lastUpdate]);

    // Effect to create map marker when cable is selected
    useEffect(() => {
        if (showMapMarker && selectedCable) {
            createMapMarker(selectedCable);
        } else if (currentMarkerRef.current && mapRef?.current) {
            // Remove marker when showMapMarker is false
            mapRef.current.removeLayer(currentMarkerRef.current);
            currentMarkerRef.current = null;
        }

        // Cleanup function
        return () => {
            if (currentMarkerRef.current && mapRef?.current) {
                mapRef.current.removeLayer(currentMarkerRef.current);
                currentMarkerRef.current = null;
            }
        };
    }, [showMapMarker, selectedCable, isAdmin, isUser]);

    // Format date helper
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

    return (
        <>
            <Box
                data-sidebar="true"
                sx={{
                    background: 'rgba(255, 255, 255, 0.7)',
                    boxShadow: 4,
                    p: 2,
                    width: 360,
                    minHeight: '100vh',
                    maxHeight: '100vh',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    '&::-webkit-scrollbar': { width: '6px' },
                    '&::-webkit-scrollbar-thumb': { background: '#ccc', borderRadius: '8px' },
                }}
            >
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ pl: 10 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#3854A5' }}>
                            Deleted Cables
                        </Typography>
                        {phTime && (
                            <Typography variant="body2" sx={{ color: '#666' }}>
                                PH Time: {phTime}
                            </Typography>
                        )}
                    </Box>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={fetchDeletedCables}
                        disabled={loading}
                        startIcon={<RefreshIcon />}
                        sx={{ textTransform: 'none' }}
                    >
                        Refresh
                    </Button>
                </Box>

                <Divider sx={{ mb: 1 }} />

                {/* List of Deleted Cables */}
                <List sx={{ width: '100%' }}>
                    {loading ? (
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', px: 2 }}>
                            Loading deleted cables...
                        </Typography>
                    ) : error ? (
                        <Typography variant="body2" color="error" sx={{ fontStyle: 'italic', px: 2 }}>
                            {error}
                        </Typography>
                    ) : deletedCables.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', px: 2 }}>
                            No deleted cables yet.
                        </Typography>
                    ) : (
                        deletedCables.map((cable, idx) => (
                            <ListItem
                                key={idx}
                                onClick={(event) => handleCableClick(cable, event)}
                                sx={{
                                    px: 2,
                                    py: 1.5,
                                    borderBottom: '1px solid #eee',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    transition: 'background 0.2s',
                                    '&:hover': {
                                        background: '#f4f8ff',
                                        cursor: 'pointer',
                                    },
                                }}
                            >
                                {/* Line 1: Distance and Cut ID */}
                                <Typography
                                    variant="subtitle1"
                                    sx={{ fontWeight: 600, color: '#1a2a4b' }}
                                >
                                    {cable.distance ?? 'N/A'} km — {cable.cut_id || 'Unknown'}
                                </Typography>

                                {/* Line 2: Date and Depth */}
                                <Typography
                                    variant="body2"
                                    sx={{ color: '#444', mt: 0.5 }}
                                >
                                    {cable.fault_date
                                        ? new Date(cable.fault_date).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                        })
                                        : 'Date Unknown'}
                                    {' — '}
                                    Depth: {cable.depth ? `${cable.depth}m` : 'Unknown'}
                                </Typography>

                                {/* Line 3: Cut Type */}
                                <Typography
                                    variant="body2"
                                    sx={{ color: '#444', mt: 0.2 }}
                                >
                                    Cut Type: {cable.cut_type || 'Unknown'}
                                </Typography>
                                {/* Line 4: Cable Type */}
                                <Typography
                                    variant="body2"
                                    sx={{ color: '#444', mt: 0.2 }}
                                >
                                    Cable Type: {cable.cable_type || 'Unknown'}
                                </Typography>
                            </ListItem>
                        ))
                    )}
                </List>
            </Box>
        </>
    );
};

export default DeletedCablesSidebar;
