import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Divider,
    List,
    ListItem,
    Button
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import CableDetailsPopup from './CableDetailsPopup';

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
}

const DeletedCablesSidebar: React.FC<DeletedCablesSidebarProps> = ({
    onSelectCable,
    lastUpdate,
    setLastUpdate,
    phTime
}) => {
    const [deletedCables, setDeletedCables] = useState<CableCut[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [popupCable, setPopupCable] = useState<CableCut | null>(null);
    const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);

    const fetchDeletedCables = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:8081/fetch-cable-cuts');
            const data = await response.json();
            if (Array.isArray(data)) {
                setDeletedCables(
                    [...data].sort((a, b) => {
                        const dateA = new Date(a.fault_date).getTime();
                        const dateB = new Date(b.fault_date).getTime();
                        return dateB - dateA;
                    })
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
        // Prevent the default onSelectCable behavior
        event.stopPropagation();

        // Get the clicked element's position
        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
        const sidebarRect = (event.currentTarget.closest('[data-sidebar="true"]') as HTMLElement)?.getBoundingClientRect();

        // Calculate position relative to the viewport
        const x = rect.left + rect.width / 2; // Center of the clicked item horizontally
        const y = rect.top + rect.height / 2; // Center of the clicked item vertically

        setPopupCable(cable);
        setPopupPosition({ x, y });

        // Also call the original onSelectCable for map functionality
        onSelectCable(cable);
    };

    const handleClosePopup = () => {
        setPopupCable(null);
        setPopupPosition(null);
    };

    const handleDeleteCable = async (cable: CableCut) => {
        try {
            // Call backend API to delete the cable cut
            const response = await fetch(
                `http://localhost:8081/delete-single-cable-cuts/${cable.cut_id}`,
                { method: 'DELETE' }
            );
            const result = await response.json();
            if (result.success) {
                // Refresh the list after successful deletion
                await fetchDeletedCables();
            } else {
                alert(result.message || 'Failed to delete cable cut.');
            }
        } catch (error) {
            console.error('Error deleting cable:', error);
            alert('Error deleting cable.');
        }
    };

    useEffect(() => {
        fetchDeletedCables();
    }, [lastUpdate]);

    return (
        <>
            <Box
                data-sidebar="true"
                sx={{
                    background: 'rgba(255, 255, 255, 0.7)', // semi-transparent white
                    boxShadow: 4,
                    p: 2,
                    width: 360,
                    minHeight: '100vh',
                    maxHeight: '100vh',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    '&::-webkit-scrollbar': {
                        width: '6px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: '#ccc',
                        borderRadius: '8px',
                    },
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

            {/* Popup Component */}
            <CableDetailsPopup
                cable={popupCable}
                position={popupPosition}
                onClose={handleClosePopup}
                onDelete={handleDeleteCable}
            />
        </>
    );
};

export default DeletedCablesSidebar;
