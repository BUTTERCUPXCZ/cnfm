import { useEffect, useState, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

type MarkerData = {
  latitude: number;
  longitude: number;
  cut_id: string;
  cut_type: string;
  distance: number;
  depth?: string;
  simulated: string;
  fault_date?: string;
};

type CableCutMarkersProps = {
  cableSegment: string; // e.g., "seaus1", "seaus2", "seaus3"
};

function CableCutMarkers({ cableSegment }: CableCutMarkersProps) {
  const map = useMap();
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const port = process.env.REACT_APP_PORT;
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [canDelete, setCanDelete] = useState<boolean>(false);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  // Inject CSS to hide Leaflet popup default background for our custom popups
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (document.getElementById('cnfm-cut-popup-styles')) return;
    const style = document.createElement('style');
    style.id = 'cnfm-cut-popup-styles';
    style.innerHTML = `
      /* Remove default Leaflet popup wrapper background so our card shows only */
      .cnfm-cut-popup .leaflet-popup-content-wrapper { background: transparent !important; box-shadow: none !important; border: none !important; padding: 0 !important; }
      .cnfm-cut-popup .leaflet-popup-tip { background: transparent !important; box-shadow: none !important; }
      .cnfm-cut-popup .leaflet-popup-close-button { display: none !important; }
    `;
    document.head.appendChild(style);
  }, []);

  // Effect to check permissions on component mount and localStorage changes
  useEffect(() => {
    const checkPermissions = () => {
      setCanDelete(canDeleteMarkers());
    };

    // Check permissions initially
    checkPermissions();

    // Listen for storage events (when localStorage changes in other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'loggedIn' || e.key === 'user_role') {
        checkPermissions();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Optional: Also listen for custom events if you update localStorage in the same tab
    const handleCustomStorageUpdate = () => {
      checkPermissions();
    };

    window.addEventListener('localStorageUpdate', handleCustomStorageUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(
        'localStorageUpdate',
        handleCustomStorageUpdate
      );
    };
  }, []);

  // Function to handle marker removal
  const removeMarker = async (cutId: string) => {
    try {
      // Make API call to delete from backend
      const response = await fetch(
        `${apiBaseUrl}${port}/delete-single-cable-cuts/${cutId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete cable cut');
      }

      // Remove from local state only if backend deletion was successful
      setMarkers((prevMarkers) =>
        prevMarkers.filter((marker) => marker.cut_id !== cutId)
      );

      // Remove from map immediately
      if (markersRef.current[cutId]) {
        map.removeLayer(markersRef.current[cutId]);
        delete markersRef.current[cutId];
      }
    } catch (error) {
      console.error('Error removing marker:', error);
      // Optional: Show user-friendly error message
      alert(
        `Failed to remove marker: ${error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  };

  // Fetch polyline and marker data
  useEffect(() => {
    let interval: NodeJS.Timeout;

    // Fetch Cable Cuts Data
    const fetchCutsData = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}${port}/fetch-cable-cuts`);
        const result = await response.json();

        let markerData: MarkerData[] = [];

        if (Array.isArray(result) && result.length > 0) {
          // Process marker data - filter for events containing the specified cable segment
          markerData = result
            .filter(
              (item: any) =>
                item.cut_id &&
                typeof item.cut_id === 'string' &&
                item.cut_id.includes(cableSegment)
            )
            .map((item: any) => ({
              latitude: item.latitude,
              longitude: item.longitude,
              cut_id: item.cut_id,
              cut_type: item.cut_type,
              distance: item.distance,
              depth: item.depth,
              simulated: item.simulated,
              fault_date: item.fault_date
            }));
        }

        // Always update markers state (even if empty)
        setMarkers(markerData);
      } catch (err) {
        console.error(`Error fetching marker data for ${cableSegment}:`, err);
        // On error, set empty array to clear markers
        setMarkers([]);
      }
    };

    // Fetch both types of data
    const fetchAllData = async () => {
      await fetchCutsData();
    };

    fetchAllData();
    interval = setInterval(fetchCutsData, 2000);

    return () => clearInterval(interval);
  }, [apiBaseUrl, port, cableSegment]);

  // Effect to manage markers based on data changes
  useEffect(() => {
    // Get current marker IDs from data
    const currentMarkerIds = new Set(markers.map((marker) => marker.cut_id));

    // Remove markers that are no longer in the data
    Object.keys(markersRef.current).forEach((markerId) => {
      if (!currentMarkerIds.has(markerId)) {
        // Remove marker from map
        if (markersRef.current[markerId]) {
          map.removeLayer(markersRef.current[markerId]);
          delete markersRef.current[markerId];
        }
      }
    });

    // Add/update markers that are in the data
    markers.forEach((markerData) => {
      const markerId = markerData.cut_id;
      // Check if marker already exists and if data has changed
      const existingMarker = markersRef.current[markerId];
      const hasDataChanged =
        !existingMarker ||
        existingMarker.getLatLng().lat !== markerData.latitude ||
        existingMarker.getLatLng().lng !== markerData.longitude ||
        existingMarker.options.icon?.options.className !==
        `cut-marker-${markerData.cut_type}-${cableSegment}`;

      // Only recreate marker if it doesn't exist or data has changed
      if (hasDataChanged) {
        // Remove existing marker if present
        if (existingMarker) {
          map.removeLayer(existingMarker);
        }

        // Create new marker
        const markerStyle = getMarkerStyle(markerData.cut_type);
        const depth = markerData.depth || 'Unknown';
        const position: [number, number] = [
          markerData.latitude,
          markerData.longitude
        ];

        const marker = L.marker(position, {
          icon: L.divIcon({
            className: `cut-marker-${markerData.cut_type}-${cableSegment}`,
            html: `
              <div style="
                position: relative;
                width: ${markerStyle.size}px; 
                height: ${markerStyle.size}px;
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                <div style="
                  color: ${markerStyle.color};
                  font-size: ${markerStyle.size - 4}px;
                  font-weight: bold;
                  text-shadow: 1px 1px 2px rgba(0,0,0,0.8), -1px -1px 2px rgba(255,255,255,0.8);
                  line-height: 1;
                ">✕</div>
              </div>
            `,
            iconSize: [markerStyle.size, markerStyle.size],
            iconAnchor: [markerStyle.size / 2, markerStyle.size / 2]
          })
        });

        // --- Restore hover popup functionality ---
        // Format date
        let dateStr = markerData.fault_date ? new Date(markerData.fault_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' }) : 'Unknown';
        // Safely format distance
        let distanceStr = 'N/A';
        if (typeof markerData.distance === 'number' && !isNaN(markerData.distance)) {
          distanceStr = markerData.distance.toFixed(2) + ' km';
        } else if (typeof markerData.distance === 'string') {
          const distStr = markerData.distance as string;
          if (distStr.trim() !== '' && !isNaN(Number(distStr))) {
            distanceStr = Number(distStr).toFixed(2) + ' km';
          }
        }

        // Choose header color based on cut type
        const headerColors: { [k: string]: string } = {
          'Shunt Fault': '#f9a825',
          'Partial Fiber Break': '#fb8c00',
          'Fiber Break': '#f44336',
          'Full Cut': '#c62828'
        };
        const headerColor = headerColors[markerData.cut_type] || '#c62828';
        const headerText = markerData.cut_type ? markerData.cut_type.toUpperCase() : 'FULL CUT';

        // Popup HTML content (table-based design matching requested layout)
        const popupHtml = `
      <div class="cable-cut-popup" style="font-family: Arial, sans-serif; width: 200px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); border-radius: 5px; overflow: hidden; border: 2px solid ${markerStyle.color};">
        <div style="background-color: ${markerStyle.color}; color: white; padding: 6px; text-align: center; font-weight: bold; font-size: 13px; letter-spacing: 0.3px; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">
          ${markerData.cut_type ? markerData.cut_type.toUpperCase() : 'FULL CUT'}
        </div>
        <div style="background-color: white; padding: 10px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <tr>
              <td style="font-weight: bold; padding-bottom: 5px; color: #333;">Distance:</td>
              <td style="text-align: right; padding-bottom: 5px; color: #666;">${distanceStr}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding-bottom: 5px; color: #333;">Depth:</td>
              <td style="text-align: right; padding-bottom: 5px; color: #666;">${depth} m</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding-bottom: 5px; color: #333;">Lat:</td>
              <td style="text-align: right; padding-bottom: 5px; color: #666; font-family: monospace; font-size: 11px;">${Number(markerData.latitude).toFixed(4)}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding-bottom: 5px; color: #333;">Lng:</td>
              <td style="text-align: right; padding-bottom: 5px; color: #666; font-family: monospace; font-size: 11px;">${Number(markerData.longitude).toFixed(4)}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding-bottom: 5px; color: #333;">Date:</td>
              <td style="text-align: right; padding-bottom: 5px; color: #666; font-size: 11px;">${dateStr}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding-bottom: 5px; color: #333;">Cable Type:</td>
              <td style="text-align: right; padding-bottom: 5px; color: #666; font-size: 11px;">Unknown</td>
            </tr>
          </table>
        </div>
        ${canDelete ? `
        <div style="background-color: #f8f9fa; padding: 10px; border-top: 1px solid #dee2e6; display: flex; flex-direction: column; gap: 6px;">
          <button id="delete-cut-${markerId}" class="delete-marker-btn" style="background-color: #dc3545; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: bold; width: 100%; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">🗑️ Delete</button>
          <button id="close-cut-${markerId}" class="close-popup-btn" style="background-color: #6c757d; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: bold; width: 100%; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">✕ Close</button>
        </div>
        ` : `
        <div style="background-color: #f8f9fa; padding: 10px; border-top: 1px solid #dee2e6;">
          <button id="close-cut-${markerId}" class="close-popup-btn" style="background-color: #6c757d; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: bold; width: 100%; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">✕ Close</button>
        </div>
        `}
      </div>
    `;
        marker.bindPopup(popupHtml, { closeButton: false, autoPan: true, className: 'cnfm-cut-popup' });

        // Open popup on hover, close on mouseout
        marker.on('mouseover', function () {
          marker.openPopup();
        });
        marker.on('mouseout', function () {
          marker.closePopup();
        });

        // Handle Delete and Close button clicks
        marker.on('popupopen', function () {
          if (canDelete) {
            const deleteBtn = document.getElementById(`delete-cut-${markerId}`);
            if (deleteBtn) {
              deleteBtn.onclick = (e) => {
                e.preventDefault();
                removeMarker(markerId);
                marker.closePopup();
              };
            }
          }
          const closeBtn = document.getElementById(`close-cut-${markerId}`);
          if (closeBtn) {
            closeBtn.onclick = (e) => {
              e.preventDefault();
              marker.closePopup();
            };
          }
        });

        // Add to map and store reference
        marker.addTo(map);
        markersRef.current[markerId] = marker;
      }
    });
  }, [markers, map, cableSegment]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Remove all markers when component unmounts
      Object.values(markersRef.current).forEach((marker) => {
        map.removeLayer(marker);
      });
      markersRef.current = {};
    };
  }, [map]);

  // Helper function to check if user can delete markers
  const canDeleteMarkers = () => {
    try {
      // Check if user is logged in
      const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
      if (!isLoggedIn) return false;

      // Get user role from localStorage
      const userRole = localStorage.getItem('user_role');
      if (!userRole) return false;

      // Define roles that can delete markers
      const allowedRoles = ['administrator', 'simulator'];
      return allowedRoles.includes(userRole.toLowerCase());
    } catch (error) {
      // Handle cases where localStorage is not available or throws an error
      console.error('Error accessing localStorage:', error);
      return false;
    }
  };
  // Helper functions moved to component level
  const getMarkerStyle = (cutType: string) => {
    const styles = {
      'Shunt Fault': { color: '#FBC02D', size: 20, borderColor: 'white' }, // Darker Yellow
      'Partial Fiber Break': {
        color: '#FF6600',
        size: 20,
        borderColor: 'white'
      }, // Orange
      'Fiber Break': { color: '#F44336', size: 20, borderColor: 'white' }, // Red
      'Full Cut': { color: '#B71C1C', size: 20, borderColor: 'white' } // Maroon
    };

    return (
      styles[cutType] || { color: '#9E9E9E', size: 20, borderColor: 'white' }
    );
  };

  return null; // This component manages markers directly, no JSX needed
}

export default CableCutMarkers;
