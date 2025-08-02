import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Divider,
    List,
    ListItem,
    Button,
    Snackbar,
    Alert,
    IconButton
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloseIcon from '@mui/icons-material/Close';

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
}

const TOAST_AUTO_HIDE = 7000; // ms

const DeletedCablesSidebar: React.FC<DeletedCablesSidebarProps> = ({
    onSelectCable,
    lastUpdate,
    setLastUpdate,
    phTime,
    isAdmin = true // <-- Default to true for admin pages
}) => {
    const [deletedCables, setDeletedCables] = useState<CableCut[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [toastCable, setToastCable] = useState<CableCut | null>(null);
    const [toastOpen, setToastOpen] = useState(false);

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
        setToastCable(cable);
        setToastOpen(true);
        onSelectCable(cable);
    };

    const handleCloseToast = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === 'clickaway') return;
        setToastOpen(false);
        setTimeout(() => setToastCable(null), 300); // allow fade out
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
                setToastOpen(false);
                setTimeout(() => setToastCable(null), 300);
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

            {/* Toast-style Cable Details */}
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={toastOpen}
                autoHideDuration={TOAST_AUTO_HIDE}
                onClose={handleCloseToast}
                sx={{
                    zIndex: 1400,
                    mt: { xs: 8, sm: 10 },
                    '& .MuiSnackbarContent-root': {
                        background: 'transparent',
                        boxShadow: 'none',
                    }
                }}
            >
                {toastCable && (
                    <Alert
                        severity="info"
                        sx={{
                            minWidth: 340,
                            maxWidth: 400,
                            boxShadow: 6,
                            borderRadius: 2,
                            background: '#f9fafb',
                            color: '#1a2a4b',
                            alignItems: 'flex-start',
                            p: 2.5,
                            pr: 4,
                            position: 'relative',
                            fontSize: 16,
                            lineHeight: 1.7
                        }}
                        action={
                            <IconButton
                                size="small"
                                aria-label="close"
                                color="inherit"
                                onClick={handleCloseToast}
                                sx={{ position: 'absolute', top: 8, right: 8 }}
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        }
                    >
                        <Typography variant="h6" sx={{ fontWeight: 800, color: '#B71C1C', mb: 1, fontSize: 20 }}>
                            {toastCable.cut_type?.toUpperCase() || 'FULL CUT'}
                        </Typography>
                        <Typography sx={{ mb: 0.5, fontSize: 16 }}>
                            <b>Distance:</b> <span style={{ fontWeight: 600 }}>{toastCable.distance ? `${toastCable.distance.toLocaleString()} km` : 'N/A'}</span>
                        </Typography>
                        <Typography sx={{ mb: 0.5, fontSize: 16 }}>
                            <b>Depth:</b> <span style={{ fontWeight: 600 }}>{toastCable.depth ? `${toastCable.depth} m` : 'N/A'}</span>
                        </Typography>
                        <Typography sx={{ mb: 0.5, fontSize: 16 }}>
                            <b>Latitude:</b> <span style={{ fontWeight: 600 }}>{toastCable.latitude || 'N/A'}</span>
                        </Typography>
                        <Typography sx={{ mb: 0.5, fontSize: 16 }}>
                            <b>Longitude:</b> <span style={{ fontWeight: 600 }}>{toastCable.longitude || 'N/A'}</span>
                        </Typography>
                        <Typography sx={{ mb: 0.5, fontSize: 16 }}>
                            <b>Cable Type:</b> <span style={{ fontWeight: 600 }}>{toastCable.cable_type || 'Unknown'}</span>
                        </Typography>
                        <Typography sx={{ mb: 1, fontSize: 16 }}>
                            <b>Fault Date:</b> <span style={{ fontWeight: 600 }}>{formatDate(toastCable.fault_date)}</span>
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                            {isAdmin && (
                                <Button
                                    variant="contained"
                                    color="error"
                                    size="small"
                                    onClick={() => handleDeleteCable(toastCable)}
                                    sx={{ fontWeight: 'bold', textTransform: 'none', fontSize: 15 }}
                                >
                                    Delete
                                </Button>
                            )}
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={handleCloseToast}
                                sx={{
                                    color: '#3854A5',
                                    borderColor: '#3854A5',
                                    fontWeight: 'bold',
                                    textTransform: 'none',
                                    fontSize: 15
                                }}
                            >
                                Close
                            </Button>
                        </Box>
                    </Alert>
                )}
            </Snackbar>
        </>
    );
};

export default DeletedCablesSidebar;
