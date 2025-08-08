import React, { useEffect, useState, useRef } from 'react';
import {
    Box,
    Typography,
    Divider,
    List,
    ListItem,
    Button,
    IconButton,
    Snackbar,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText
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
    onCloseSidebar?: () => void; // Add close sidebar function
}

const DeletedCablesSidebar: React.FC<DeletedCablesSidebarProps> = ({
    onSelectCable,
    lastUpdate,
    setLastUpdate,
    phTime,
    isAdmin = true, // <-- Default to true for admin pages
    isUser = true, // <-- Default to true for user pages
    mapRef,
    onCloseSidebar // Add close sidebar function
}) => {
    const [deletedCables, setDeletedCables] = useState<CableCut[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCable, setSelectedCable] = useState<CableCut | null>(null);
    const [showMapMarker, setShowMapMarker] = useState(false);
    const [markerClickCount, setMarkerClickCount] = useState(0); // Force re-render for same cable clicks
    const currentMarkerRef = useRef<L.Marker | null>(null);
    
    // Enhanced notification system
    const [notification, setNotification] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error' | 'warning' | 'info';
    }>({
        open: false,
        message: '',
        severity: 'info'
    });
    
    // Delete confirmation dialog
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        cable: CableCut | null;
    }>({
        open: false,
        cable: null
    });

    const showNotification = (message: string, severity: 'success' | 'error' | 'warning' | 'info' = 'info') => {
        setNotification({ open: true, message, severity });
    };

    const hideNotification = () => {
        setNotification(prev => ({ ...prev, open: false }));
    };

    const fetchDeletedCables = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:8081/fetch-cable-cuts');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            if (Array.isArray(data)) {
                setDeletedCables([...data].sort((a, b) => 0));
            } else {
                setDeletedCables([]);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch deleted cables';
            setError(errorMessage);
            showNotification(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    // Enhanced delete function
    const handleDeleteCable = async (cable: CableCut) => {
        if (!cable?.cut_id) {
            showNotification('Invalid cable data', 'error');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(
                `http://localhost:8081/delete-single-cable-cuts/${cable.cut_id}`,
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
            
            if (result.success) {
                // Close popup and remove marker
                if (currentMarkerRef.current && mapRef?.current) {
                    currentMarkerRef.current.closePopup();
                    mapRef.current.removeLayer(currentMarkerRef.current);
                    currentMarkerRef.current = null;
                }
                
                // Reset states
                setShowMapMarker(false);
                setSelectedCable(null);
                
                // Refresh the deleted cables list
                await fetchDeletedCables();
                if (setLastUpdate) setLastUpdate(Date.now().toString());
                
                showNotification(`Cable ${cable.cut_id} deleted successfully!`, 'success');
            } else {
                throw new Error(result.message || 'Unknown error');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error('Error deleting cable:', error);
            showNotification(`Error deleting cable: ${errorMessage}`, 'error');
        } finally {
            setLoading(false);
            setDeleteDialog({ open: false, cable: null });
        }
    };

    // Enhanced close function
    const handleClosePopup = () => {
        try {
            // Clean up custom event listeners
            if (currentMarkerRef.current && (currentMarkerRef.current as any)._customEventCleanup) {
                (currentMarkerRef.current as any)._customEventCleanup();
            }
            
            // Close popup and remove marker
            if (currentMarkerRef.current && mapRef?.current) {
                currentMarkerRef.current.closePopup();
                mapRef.current.removeLayer(currentMarkerRef.current);
                currentMarkerRef.current = null;
            }
            
            // Reset states
            setShowMapMarker(false);
            setSelectedCable(null);
            
            console.log('Popup closed successfully');
        } catch (error) {
            console.error('Error closing popup:', error);
            showNotification('Error closing popup', 'error');
        }
    };

    // Popup delete function
    const handlePopupDelete = (cable: CableCut) => {
        try {
            console.log('Popup delete initiated for cable:', cable.cut_id);
            // Open confirmation dialog
            openDeleteDialog(cable);
        } catch (error) {
            console.error('Error initiating popup delete:', error);
            showNotification('Error initiating delete operation', 'error');
        }
    };

    // Popup close function (wrapper for consistency)
    const handlePopupClose = () => {
        try {
            console.log('Popup close initiated');
            handleClosePopup();
        } catch (error) {
            console.error('Error closing popup:', error);
            showNotification('Error closing popup', 'error');
        }
    };

    // Open delete confirmation dialog
    const openDeleteDialog = (cable: CableCut) => {
        setDeleteDialog({ open: true, cable });
    };

    // Close delete confirmation dialog
    const closeDeleteDialog = () => {
        setDeleteDialog({ open: false, cable: null });
    };

    const handleCableClick = (cable: CableCut, event: React.MouseEvent) => {
        event.stopPropagation();
        
        console.log('Cable clicked by admin:', cable.cut_id, 'Admin status:', isAdmin);
        
        // Stop any ongoing map animations to prevent conflicts
        if (mapRef?.current) {
            mapRef.current.stop();
        }
        
        // Always remove existing marker first to ensure consistent behavior
        if (currentMarkerRef.current && mapRef?.current) {
            // Clean up event listeners first
            if ((currentMarkerRef.current as any)._customEventCleanup) {
                (currentMarkerRef.current as any)._customEventCleanup();
            }
            mapRef.current.removeLayer(currentMarkerRef.current);
            currentMarkerRef.current = null;
        }
        
        // Immediate execution - no delay to prevent stuttering
        setSelectedCable(cable);
        setShowMapMarker(true);
        setMarkerClickCount(prev => prev + 1); // Force effect to trigger even for same cable
        
        // Show loading notification for admin users
        if (isAdmin) {
            showNotification(`Focusing map on cable ${cable.cut_id}...`, 'info');
        }
        
        // onSelectCable will be called after marker is created and positioned
    };

    // Function to create map marker
    const createMapMarker = (cable: CableCut) => {
        if (!mapRef?.current || !cable.latitude || !cable.longitude) {
            console.error('Cannot create marker: missing map reference or coordinates');
            return;
        }

        // Validate coordinates are within valid ranges and ensure high precision
        const lat = parseFloat(parseFloat(cable.latitude.toString()).toFixed(6));
        const lng = parseFloat(parseFloat(cable.longitude.toString()).toFixed(6));
        
        console.log('Creating marker for cable:', {
            cutId: cable.cut_id,
            originalLat: cable.latitude,
            originalLng: cable.longitude,
            parsedLat: lat,
            parsedLng: lng
        });
        
        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            console.error('Invalid coordinates for cable:', { lat, lng, cable: cable.cut_id });
            return;
        }

        const map = mapRef.current;
        const position: [number, number] = [lat, lng];

        // Remove existing marker
        if (currentMarkerRef.current) {
            map.removeLayer(currentMarkerRef.current);
            currentMarkerRef.current = null;
        }

        // Position the map camera so the marker appears slightly below center for better visibility
        // Only do this for admin (isAdmin)
        if (isAdmin && map.setView) {
            // Stop any ongoing animations first
            map.stop();
            
            // Calculate offset to position marker slightly below center of viewport
            const mapContainer = map.getContainer();
            const mapHeight = mapContainer.clientHeight;
            const mapWidth = mapContainer.clientWidth;
            
            // Convert the target position to pixel coordinates
            const targetPoint = map.project(position, 14);
            
            // Offset the view so marker appears slightly below center (roughly 60% down from top)
            const offsetY = mapHeight * 0.15; // Reduced offset for more centered positioning
            const adjustedPoint = L.point(targetPoint.x, targetPoint.y - offsetY);
            
            // Convert back to lat/lng
            const adjustedCenter = map.unproject(adjustedPoint, 14);
            
            // Use a higher zoom level for better focus (increased from 10 to 14)
            map.setView([adjustedCenter.lat, adjustedCenter.lng], 14, { 
                animate: true,
                duration: 0.8,
                easeLinearity: 0.2
            });
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
        // Use validated coordinates instead of original cable coordinates
        // const position: [number, number] = [cable.latitude, cable.longitude];

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

        // Create popup content with inline functions
        const popupContent = `
            <div class="cable-cut-popup" style="font-family: Arial, sans-serif; width: 200px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); border-radius: 5px; overflow: hidden; border: 2px solid ${markerStyle.color};">
                <div style="background-color: ${markerStyle.color}; color: white; padding: 6px; text-align: center; font-weight: bold; font-size: 13px; letter-spacing: 0.3px; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">
                    ${cable.cut_type.toUpperCase()}
                </div>
                <div style="background-color: white; padding: 10px;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                        <tr>
                            <td style="font-weight: bold; padding-bottom: 5px; color: #333;">Distance:</td>
                            <td style="text-align: right; padding-bottom: 5px; color: #666;">${Number(cable.distance).toFixed(2)} km</td>
                        </tr>
                        <tr>
                            <td style="font-weight: bold; padding-bottom: 5px; color: #333;">Depth:</td>
                            <td style="text-align: right; padding-bottom: 5px; color: #666;">${cable.depth || 'N/A'} m</td>
                        </tr>
                        <tr>
                            <td style="font-weight: bold; padding-bottom: 5px; color: #333;">Lat:</td>
                            <td style="text-align: right; padding-bottom: 5px; color: #666; font-family: monospace; font-size: 11px;">${lat.toFixed(4)}</td>
                        </tr>
                        <tr>
                            <td style="font-weight: bold; padding-bottom: 5px; color: #333;">Lng:</td>
                            <td style="text-align: right; padding-bottom: 5px; color: #666; font-family: monospace; font-size: 11px;">${lng.toFixed(4)}</td>
                        </tr>
                        <tr>
                            <td style="font-weight: bold; padding-bottom: 5px; color: #333;">Date:</td>
                            <td style="text-align: right; padding-bottom: 5px; color: #666; font-size: 11px;">${
                                cable.fault_date
                                    ? new Date(cable.fault_date).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: '2-digit'
                                    })
                                    : 'N/A'
                            }</td>
                        </tr>
                        <tr>
                            <td style="font-weight: bold; color: #333;">ID:</td>
                            <td style="text-align: right; color: #666; font-family: monospace; font-size: 11px;">${cable.cut_id.length > 12 ? cable.cut_id.substring(0, 12) + '...' : cable.cut_id}</td>
                        </tr>
                    </table>
                </div>
                ${(isAdmin && isUser) ? `
                    <div style="background-color: #f8f9fa; padding: 10px; border-top: 1px solid #dee2e6; display: flex; flex-direction: column; gap: 6px;">
                        <button class="delete-marker-btn" data-cut-id="${cable.cut_id}" onclick="
                            console.log('Delete button clicked for cable: ${cable.cut_id}');
                            const deleteEvent = new CustomEvent('popupDeleteCable', { detail: { cutId: '${cable.cut_id}' } });
                            document.dispatchEvent(deleteEvent);
                        " style="
                            background-color: #dc3545;
                            color: white;
                            border: none;
                            padding: 6px 10px;
                            border-radius: 4px;
                            cursor: pointer;
                            font-size: 11px;
                            font-weight: bold;
                            width: 100%;
                            transition: all 0.2s;
                            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                        ">
                            🗑️ Delete
                        </button>
                      <button class="close-popup-btn" onclick="
                            console.log('Close button clicked');
                            const closeEvent = new CustomEvent('popupClose');
                            document.dispatchEvent(closeEvent);
                        " style="
                            background-color: #6c757d;
                            color: white;
                            border: none;
                            padding: 6px 10px;
                            border-radius: 4px;
                            cursor: pointer;
                            font-size: 11px;
                            font-weight: bold;
                            width: 100%;
                            transition: all 0.2s;
                            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                        ">
                            ✕ Close
                        </button>
                    </div>
                ` : `
                    <div style="background-color: #f8f9fa; padding: 10px; border-top: 1px solid #dee2e6;">
                        <button class="close-popup-btn" onclick="
                            console.log('Close button clicked');
                            const closeEvent = new CustomEvent('popupClose');
                            document.dispatchEvent(closeEvent);
                        " style="
                            background-color: #6c757d;
                            color: white;
                            border: none;
                            padding: 6px 10px;
                            border-radius: 4px;
                            cursor: pointer;
                            font-size: 11px;
                            font-weight: bold;
                            width: 100%;
                            transition: all 0.2s;
                            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                        ">
                            ✕ Close
                        </button>
                    </div>
                `}
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
                    .deleted-cable-custom-popup.leaflet-popup { 
                        margin-bottom: 0; 
                        z-index: 1000;
                    }
                    .deleted-cable-custom-popup .leaflet-popup-content-wrapper {
                        border-radius: 6px;
                        box-shadow: 0 4px 20px rgba(0,0,0,0.4);
                    }
                    .delete-marker-btn {
                        background-color: #dc3545 !important;
                        color: white !important;
                        border: none !important;
                        padding: 6px 10px !important;
                        border-radius: 4px !important;
                        cursor: pointer !important;
                        font-size: 11px !important;
                        font-weight: bold !important;
                        width: 100% !important;
                        transition: all 0.3s !important;
                        margin: 0 !important;
                        outline: none !important;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
                    }
                    .delete-marker-btn:hover {
                        background-color: #c82333 !important;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.2) !important;
                        transform: translateY(-1px) !important;
                    }
                    .delete-marker-btn:active {
                        background-color: #bd2130 !important;
                        transform: translateY(0) !important;
                    }
                    .close-popup-btn {
                        background-color: #6c757d !important;
                        color: white !important;
                        border: none !important;
                        padding: 6px 10px !important;
                        border-radius: 4px !important;
                        cursor: pointer !important;
                        font-size: 11px !important;
                        font-weight: bold !important;
                        width: 100% !important;
                        transition: all 0.3s !important;
                        margin: 0 !important;
                        outline: none !important;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
                    }
                    .close-popup-btn:hover {
                        background-color: #5a6268 !important;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.2) !important;
                        transform: translateY(-1px) !important;
                    }
                    .close-popup-btn:active {
                        background-color: #545b62 !important;
                        transform: translateY(0) !important;
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
            maxWidth: 210,
            minWidth: 200,
            closeButton: false, // Remove the X button
            autoClose: false,
            closeOnClick: false,
            offset: [0, -30] // Position popup above the marker so X is visible below
        }).setContent(popupContent);

        marker.bindPopup(popup);

        // Make popup persistent - show immediately and keep open
        marker.on('add', function (e) {
            // Open popup immediately when marker is added - no delay
            this.openPopup();
        });

        // Handle popup close event - remove marker when popup is closed
        marker.on('popupclose', function (e) {
            // Remove the marker when popup is closed
            if (mapRef?.current) {
                mapRef.current.removeLayer(this);
                if (currentMarkerRef.current === this) {
                    currentMarkerRef.current = null;
                }
            }
            // Reset the state
            setShowMapMarker(false);
            setSelectedCable(null);
        });

        // Add marker to map
        marker.addTo(map);
        currentMarkerRef.current = marker;

        // Add custom event listeners for popup buttons
        const handlePopupDeleteEvent = (event: CustomEvent) => {
            const cutId = event.detail?.cutId;
            if (cutId === cable.cut_id) {
                console.log('Custom delete event received for:', cutId);
                handlePopupDelete(cable);
            }
        };

        const handlePopupCloseEvent = () => {
            console.log('Custom close event received');
            handlePopupClose();
        };

        // Add event listeners
        document.addEventListener('popupDeleteCable', handlePopupDeleteEvent as EventListener);
        document.addEventListener('popupClose', handlePopupCloseEvent);

        // Store cleanup function in marker for later removal
        (marker as any)._customEventCleanup = () => {
            document.removeEventListener('popupDeleteCable', handlePopupDeleteEvent as EventListener);
            document.removeEventListener('popupClose', handlePopupCloseEvent);
        };

        // Stop any ongoing animations before starting new one to prevent conflicts
        map.stop();
        
        // Force map to focus exactly on the marker coordinates with appropriate zoom
        const targetZoom = 14; // Increased zoom level for better detail view
        console.log('Panning map to:', { position, targetZoom });
        
        // Enhanced map positioning for admin clicks
        if (isAdmin) {
            // Calculate offset to position marker slightly below center of viewport for final positioning
            const mapContainer = map.getContainer();
            const mapHeight = mapContainer.clientHeight;
            
            // Convert the target position to pixel coordinates
            const targetPoint = map.project(position, 14);
            
            // Offset the view so marker appears slightly below center (roughly 60% down from top)
            const offsetY = mapHeight * 0.15; // Reduced offset for more centered positioning
            const adjustedPoint = L.point(targetPoint.x, targetPoint.y - offsetY);
            
            // Convert back to lat/lng
            const adjustedCenter = map.unproject(adjustedPoint, 14);
            
            map.setView([adjustedCenter.lat, adjustedCenter.lng], 14, { 
                animate: true,
                duration: 0.8, // Slightly longer animation for smoother experience
                easeLinearity: 0.2 // Smoother easing
            });
        }
        
        // Simplified positioning verification with minimal delay
        setTimeout(() => {
            // Quick position check and correction if needed for centered positioning
            if (isAdmin) {
                const currentCenter = map.getCenter();
                const mapContainer = map.getContainer();
                const mapHeight = mapContainer.clientHeight;
                
                // Calculate what the center should be for slightly below center positioning
                const targetPoint = map.project(position, 14);
                const offsetY = mapHeight * 0.15; // Reduced offset for more centered positioning
                const adjustedPoint = L.point(targetPoint.x, targetPoint.y - offsetY);
                const expectedCenter = map.unproject(adjustedPoint, 14);
                
                const distance = Math.abs(currentCenter.lat - expectedCenter.lat) + Math.abs(currentCenter.lng - expectedCenter.lng);
                
                if (distance > 0.01) { // If map is not close enough to expected position, correct it
                    console.log('Map not at expected centered position, correcting...');
                    map.setView([expectedCenter.lat, expectedCenter.lng], 14, { animate: false });
                }
            }
            
            console.log('Final marker position:', marker.getLatLng());
            console.log('Final map center:', map.getCenter());
            
            // Ensure popup opens after positioning is complete
            marker.openPopup();
            
            // Now that marker is created and positioned, notify the parent component
            onSelectCable(cable);
        }, 850); // Match animation duration plus buffer
    };

    const handleCloseToast = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === 'clickaway') return;
        setShowMapMarker(false);
        setTimeout(() => setSelectedCable(null), 300); // allow fade out
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
                // Clean up custom event listeners
                if ((currentMarkerRef.current as any)._customEventCleanup) {
                    (currentMarkerRef.current as any)._customEventCleanup();
                }
                mapRef.current.removeLayer(currentMarkerRef.current);
                currentMarkerRef.current = null;
            }
        };
    }, [showMapMarker, selectedCable, markerClickCount, isAdmin, isUser]);

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

            {/* Enhanced Notification System */}
            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={hideNotification}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={hideNotification} severity={notification.severity} sx={{ width: '100%' }}>
                    {notification.message}
                </Alert>
            </Snackbar>

            {/* Enhanced Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialog.open}
                onClose={closeDeleteDialog}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle id="delete-dialog-title" sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
                    ⚠️ Confirm Cable Deletion
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Are you sure you want to permanently delete cable{' '}
                        <strong>{deleteDialog.cable?.cut_id}</strong>?
                        <br />
                        <br />
                        This action cannot be undone and will remove all associated data.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button 
                        onClick={closeDeleteDialog} 
                        variant="outlined" 
                        color="primary"
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={() => deleteDialog.cable && handleDeleteCable(deleteDialog.cable)} 
                        variant="contained" 
                        color="error"
                        disabled={loading}
                        sx={{ minWidth: 100 }}
                    >
                        {loading ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default DeletedCablesSidebar;
