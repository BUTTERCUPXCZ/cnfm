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
    isAdmin?: boolean;
    isUser?: boolean;
    mapRef?: React.RefObject<L.Map>;
    onCloseSidebar?: () => void;
}

const DeletedCablesSidebar: React.FC<DeletedCablesSidebarProps> = ({
    onSelectCable,
    lastUpdate,
    setLastUpdate,
    isAdmin = true,
    isUser = true,
    mapRef,
    onCloseSidebar
}) => {
    const [deletedCables, setDeletedCables] = useState<CableCut[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCable, setSelectedCable] = useState<CableCut | null>(null);
    const [showMapMarker, setShowMapMarker] = useState(false);
    const [markerClickCount, setMarkerClickCount] = useState(0);
    const currentMarkerRef = useRef<L.Marker | null>(null);
    
    // Add refs to prevent race conditions and glitches
    const isAnimatingRef = useRef(false);
    const animationTimeoutsRef = useRef<NodeJS.Timeout[]>([]);
    const lastSelectedCableRef = useRef<string | null>(null);
    
    const [notification, setNotification] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error' | 'warning' | 'info';
    }>({
        open: false,
        message: '',
        severity: 'info'
    });
    
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
                const sortedData = [...data].sort((a, b) => {
                    const dateA = a.fault_date ? new Date(a.fault_date) : new Date(0);
                    const dateB = b.fault_date ? new Date(b.fault_date) : new Date(0);
                    return dateB.getTime() - dateA.getTime();
                });
                setDeletedCables(sortedData);
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
                if (currentMarkerRef.current && mapRef?.current) {
                    currentMarkerRef.current.closePopup();
                    mapRef.current.removeLayer(currentMarkerRef.current);
                    currentMarkerRef.current = null;
                }
                
                setShowMapMarker(false);
                setSelectedCable(null);
                
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

    const handleClosePopup = () => {
        try {
            if (currentMarkerRef.current && (currentMarkerRef.current as any)._customEventCleanup) {
                (currentMarkerRef.current as any)._customEventCleanup();
            }
            
            if (currentMarkerRef.current && mapRef?.current) {
                currentMarkerRef.current.closePopup();
                mapRef.current.removeLayer(currentMarkerRef.current);
                currentMarkerRef.current = null;
            }
            
            setShowMapMarker(false);
            setSelectedCable(null);
        } catch (error) {
            console.error('Error closing popup:', error);
            // Removed error notification to prevent unwanted toaster
        }
    };

    const handlePopupDelete = (cable: CableCut) => {
        try {
            openDeleteDialog(cable);
        } catch (error) {
            console.error('Error initiating popup delete:', error);
            showNotification('Error initiating delete operation', 'error');
        }
    };

    const handlePopupClose = () => {
        try {
            handleClosePopup();
        } catch (error) {
            console.error('Error closing popup:', error);
            // Removed error notification to prevent unwanted toaster
        }
    };

    const openDeleteDialog = (cable: CableCut) => {
        setDeleteDialog({ open: true, cable });
    };

    const closeDeleteDialog = () => {
        setDeleteDialog({ open: false, cable: null });
    };

    // Utility function to clear all ongoing animations and timeouts
    const clearAllAnimations = () => {
        console.log('Clearing all animations and timeouts');
        
        // Clear all stored timeouts
        animationTimeoutsRef.current.forEach(timeout => {
            clearTimeout(timeout);
        });
        animationTimeoutsRef.current = [];
        
        // Reset animation flag
        isAnimatingRef.current = false;
    };

    // Utility function to clean up current marker
    const cleanupCurrentMarker = () => {
        if (currentMarkerRef.current && mapRef?.current) {
            try {
                // Clean up custom event listeners
                if ((currentMarkerRef.current as any)._customEventCleanup) {
                    (currentMarkerRef.current as any)._customEventCleanup();
                }
                
                // Remove marker from map
                mapRef.current.removeLayer(currentMarkerRef.current);
                currentMarkerRef.current = null;
                console.log('Current marker cleaned up successfully');
            } catch (error) {
                console.warn('Error cleaning up marker:', error);
                currentMarkerRef.current = null; // Reset ref anyway
            }
        }
    };

    const handleCableClick = (cable: CableCut, event: React.MouseEvent) => {
        event.stopPropagation();
        
        console.log('Cable clicked:', cable.cut_id, 'Currently animating:', isAnimatingRef.current);
        
        // Prevent rapid clicking and race conditions
        if (isAnimatingRef.current && lastSelectedCableRef.current === cable.cut_id) {
            console.log('Animation already in progress for this cable, ignoring click');
            return;
        }
        
        // Clear any ongoing animations and timeouts
        clearAllAnimations();
        
        // Stop any ongoing map animations immediately
        if (mapRef?.current) {
            mapRef.current.stop();
        }
        
        // Clean up existing marker first
        cleanupCurrentMarker();
        
        // Update refs to track current operation
        lastSelectedCableRef.current = cable.cut_id;
        isAnimatingRef.current = true;
        
        // Start camera movement and marker creation
        if (isAdmin && mapRef?.current) {
            performSmoothCameraMovement(cable);
        }
        
        // Update state for new cable selection
        setSelectedCable(cable);
        setShowMapMarker(true);
        setMarkerClickCount(prev => prev + 1);
        
        // Reset animation flag after a delay to allow for completion
        const resetTimeout = setTimeout(() => {
            isAnimatingRef.current = false;
            console.log('Animation flag reset for cable:', cable.cut_id);
        }, 5000); // 5 seconds should be enough for any animation
        
        animationTimeoutsRef.current.push(resetTimeout);
    };

    const performSmoothCameraMovement = (cable: CableCut) => {
        if (!mapRef?.current || !cable.latitude || !cable.longitude) {
            console.error('Cannot perform camera movement: missing map reference or coordinates');
            return;
        }

        const map = mapRef.current;
        const targetLat = parseFloat(parseFloat(cable.latitude.toString()).toFixed(6));
        const targetLng = parseFloat(parseFloat(cable.longitude.toString()).toFixed(6));
        const targetPosition: [number, number] = [targetLat, targetLng];
        
        if (targetLat < -90 || targetLat > 90 || targetLng < -180 || targetLng > 180) {
            console.error('Invalid coordinates for smooth movement:', { targetLat, targetLng });
            return;
        }

        const currentCenter = map.getCenter();
        const currentZoom = map.getZoom();
        const targetZoom = 13; // Much closer initial zoom for excellent X marker visibility
        
        const distance = currentCenter.distanceTo(L.latLng(targetLat, targetLng));
        
        map.stop();
        
        let animationDuration: number;
        let intermediateZoom: number;
        let useMultiStageAnimation = false;
        
        if (distance > 2000000) {
            animationDuration = 3.5; // Slower, more cinematic
            intermediateZoom = Math.min(currentZoom, 3); // Zoom out more for dramatic effect
            useMultiStageAnimation = true;
        } else if (distance > 500000) {
            animationDuration = 2.8; // Slower transition
            intermediateZoom = Math.min(currentZoom, 5);
            useMultiStageAnimation = true;
        } else if (distance > 100000) {
            animationDuration = 2.2; // More leisurely pace
            intermediateZoom = Math.min(currentZoom, 7);
            useMultiStageAnimation = distance > 200000;
        } else if (distance > 10000) {
            animationDuration = 1.5; // Still smooth but faster
            intermediateZoom = Math.max(currentZoom, 10);
        } else {
            animationDuration = 0.8; // Quick but smooth
            intermediateZoom = currentZoom;
        }

        const mapContainer = map.getContainer();
        const mapHeight = mapContainer.clientHeight;
        const offsetY = mapHeight * 0.12;
        
        const targetPoint = map.project(targetPosition, targetZoom);
        const adjustedPoint = L.point(targetPoint.x, targetPoint.y - offsetY);
        const finalCenter = map.unproject(adjustedPoint, targetZoom);

        if (useMultiStageAnimation) {
            // Multi-stage cinematic animation for very long distances
            console.log('Starting cinematic multi-stage camera movement');
            
            const intermediateLat = (currentCenter.lat + targetLat) / 2;
            const intermediateLng = (currentCenter.lng + targetLng) / 2;
            
            // Stage 1: Smooth zoom out and move to intermediate position
            map.setView([intermediateLat, intermediateLng], intermediateZoom, {
                animate: true,
                duration: animationDuration * 0.35, // Slightly longer for smooth start
                easeLinearity: 0.02 // Very smooth easing for cinematic effect
            });
            
            // Stage 2: Move closer to target area with smooth transition
            const stage2Timeout = setTimeout(() => {
                if (lastSelectedCableRef.current === cable.cut_id) {
                    map.setView(targetPosition, intermediateZoom + 3, {
                        animate: true,
                        duration: animationDuration * 0.4, // Main movement phase
                        easeLinearity: 0.05 // Smooth middle transition
                    });
                }
            }, animationDuration * 350);
            animationTimeoutsRef.current.push(stage2Timeout);
            
            // Stage 3: Final cinematic zoom in to target with precise positioning
            const stage3Timeout = setTimeout(() => {
                if (lastSelectedCableRef.current === cable.cut_id) {
                    map.setView([finalCenter.lat, finalCenter.lng], targetZoom, {
                        animate: true,
                        duration: animationDuration * 0.25, // Smooth finish
                        easeLinearity: 0.1 // Gentle final approach
                    });
                }
            }, animationDuration * 750);
            animationTimeoutsRef.current.push(stage3Timeout);
            
        } else {
            // Enhanced single-stage smooth animation for shorter distances
            console.log('Starting single-stage smooth camera movement');
            
            if (currentZoom > intermediateZoom + 3) {
                // Two-phase animation: zoom out then move and zoom in
                map.setView(currentCenter, intermediateZoom, {
                    animate: true,
                    duration: animationDuration * 0.3,
                    easeLinearity: 0.02 // Very smooth zoom out
                });
                
                const singleStageTimeout = setTimeout(() => {
                    if (lastSelectedCableRef.current === cable.cut_id) {
                        map.setView([finalCenter.lat, finalCenter.lng], targetZoom, {
                            animate: true,
                            duration: animationDuration * 0.7,
                            easeLinearity: 0.08 // Smooth approach to target
                        });
                    }
                }, animationDuration * 300);
                animationTimeoutsRef.current.push(singleStageTimeout);
                
            } else {
                // Single smooth movement to target
                map.setView([finalCenter.lat, finalCenter.lng], targetZoom, {
                    animate: true,
                    duration: animationDuration,
                    easeLinearity: 0.05 // Smooth single movement
                });
            }
        }
        
        // Verify final position after cinematic animation completes
        const verificationTimeout = setTimeout(() => {
            if (lastSelectedCableRef.current === cable.cut_id) {
                const finalActualCenter = map.getCenter();
                const finalActualZoom = map.getZoom();
                console.log('Cinematic camera movement completed:', {
                    cableId: cable.cut_id,
                    targetPosition,
                    finalCenter: [finalCenter.lat, finalCenter.lng],
                    actualCenter: [finalActualCenter.lat, finalActualCenter.lng],
                    targetZoom,
                    actualZoom: finalActualZoom
                });
                
                // Fine-tune position if needed (without animation for final precision)
                const finalDistance = finalActualCenter.distanceTo(L.latLng(finalCenter.lat, finalCenter.lng));
                if (finalDistance > 100) {
                    console.log('Fine-tuning final camera position for cable:', cable.cut_id);
                    map.setView([finalCenter.lat, finalCenter.lng], targetZoom, { 
                        animate: false // Instant final correction
                    });
                }
                
                // Reset animation flag when movement is complete
                isAnimatingRef.current = false;
                console.log('Camera movement completed and animation flag reset for cable:', cable.cut_id);
            }
        }, (animationDuration * 1000) + 200); // Longer buffer for cinematic timing
        animationTimeoutsRef.current.push(verificationTimeout);
    };

    const createMapMarker = (cable: CableCut) => {
        if (!mapRef?.current || !cable.latitude || !cable.longitude) {
            console.error('Cannot create marker: missing map reference or coordinates');
            return;
        }

        const lat = parseFloat(parseFloat(cable.latitude.toString()).toFixed(6));
        const lng = parseFloat(parseFloat(cable.longitude.toString()).toFixed(6));
        
        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            console.error('Invalid coordinates for cable:', { lat, lng, cable: cable.cut_id });
            return;
        }

        const map = mapRef.current;
        const position: [number, number] = [lat, lng];

        if (currentMarkerRef.current) {
            map.removeLayer(currentMarkerRef.current);
            currentMarkerRef.current = null;
        }

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
            zIndexOffset: 1000
        });

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

        addPopupStyles();

        const popup = L.popup({
            className: 'deleted-cable-custom-popup',
            maxWidth: 210,
            minWidth: 200,
            closeButton: false,
            autoClose: false,
            closeOnClick: false,
            offset: [0, -30]
        }).setContent(popupContent);

        marker.bindPopup(popup);

        marker.on('add', function (e) {
            setTimeout(() => {
                this.openPopup();
            }, 50);
        });

        marker.on('popupclose', function (e) {
            if (mapRef?.current) {
                mapRef.current.removeLayer(this);
                if (currentMarkerRef.current === this) {
                    currentMarkerRef.current = null;
                }
            }
            setShowMapMarker(false);
            setSelectedCable(null);
        });

        marker.addTo(map);
        currentMarkerRef.current = marker;

        const handlePopupDeleteEvent = (event: CustomEvent) => {
            const cutId = event.detail?.cutId;
            if (cutId === cable.cut_id) {
                handlePopupDelete(cable);
            }
        };

        const handlePopupCloseEvent = () => {
            handlePopupClose();
        };

        document.addEventListener('popupDeleteCable', handlePopupDeleteEvent as EventListener);
        document.addEventListener('popupClose', handlePopupCloseEvent);

        (marker as any)._customEventCleanup = () => {
            document.removeEventListener('popupDeleteCable', handlePopupDeleteEvent as EventListener);
            document.removeEventListener('popupClose', handlePopupCloseEvent);
        };

        onSelectCable(cable);
    };

    const handleCloseToast = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === 'clickaway') return;
        setShowMapMarker(false);
        setTimeout(() => setSelectedCable(null), 300);
    };

    useEffect(() => {
        fetchDeletedCables();
    }, [lastUpdate]);

    useEffect(() => {
        if (showMapMarker && selectedCable) {
            createMapMarker(selectedCable);
        } else if (currentMarkerRef.current && mapRef?.current) {
            mapRef.current.removeLayer(currentMarkerRef.current);
            currentMarkerRef.current = null;
        }

        return () => {
            if (currentMarkerRef.current && mapRef?.current) {
                if ((currentMarkerRef.current as any)._customEventCleanup) {
                    (currentMarkerRef.current as any)._customEventCleanup();
                }
                mapRef.current.removeLayer(currentMarkerRef.current);
                currentMarkerRef.current = null;
            }
        };
    }, [showMapMarker, selectedCable, markerClickCount, isAdmin, isUser]);

    // Cleanup effect to prevent memory leaks and race conditions
    useEffect(() => {
        return () => {
            console.log('DeletedCablesSidebar unmounting, cleaning up animations');
            clearAllAnimations();
            cleanupCurrentMarker();
        };
    }, []);

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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ pl: 10 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#3854A5' }}>
                            Deleted Cables
                        </Typography>
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
                                <Typography
                                    variant="subtitle1"
                                    sx={{ fontWeight: 600, color: '#1a2a4b' }}
                                >
                                    {cable.distance ?? 'N/A'} km — {cable.cut_id || 'Unknown'}
                                </Typography>

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

                                <Typography
                                    variant="body2"
                                    sx={{ color: '#444', mt: 0.2 }}
                                >
                                    Cut Type: {cable.cut_type || 'Unknown'}
                                </Typography>
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