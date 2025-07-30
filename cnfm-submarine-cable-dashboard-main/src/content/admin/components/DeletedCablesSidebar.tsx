import React, { useEffect, useState } from 'react';
import { Box, Typography, Checkbox, FormControlLabel, Divider, List, ListItem, ListItemText, Select, MenuItem, InputLabel, FormControl, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

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

interface DeletedCablesSidebarProps {
    onSelectCable: (cable: CableCut) => void;
    lastUpdate?: string | null;
    setLastUpdate?: (val: string) => void;
    phTime?: string;
}

const DeletedCablesSidebar: React.FC<DeletedCablesSidebarProps> = ({ onSelectCable, lastUpdate, setLastUpdate, phTime }) => {
    const [deletedCables, setDeletedCables] = useState<CableCut[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Fetch function exposed for refresh button
    const fetchDeletedCables = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:8081/fetch-cable-cuts');
            const data = await response.json();
            if (Array.isArray(data)) {
                // Sort by fault_date descending (latest first)
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
        } catch (err: any) {
            setError('Failed to fetch deleted cables');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeletedCables();
    }, [deletingId, lastUpdate]);

    const handleDeleteCable = async (cut_id: string) => {
        setDeletingId(cut_id);
        try {
            const response = await fetch(`http://localhost:8081/delete-single-cable-cuts/${cut_id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                if (typeof setLastUpdate === 'function') {
                    setLastUpdate(new Date().toISOString());
                }
            } else {
                setError('Failed to delete cable');
            }
        } catch (err) {
            setError('Failed to delete cable');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <Box
            sx={{
                background: '#f8fbff',
                borderRadius: 3,
                boxShadow: '0 2px 12px rgba(56, 84, 165, 0.08)',
                p: 3,
                minHeight: '100vh',
                height: '100%',
                maxHeight: '100vh',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                    <Typography variant="h6" sx={{ color: '#3854A5', fontWeight: 700 }}>
                        Deleted Cables, Past Session
                    </Typography>
                    {phTime && (
                        <Typography variant="body2" sx={{ color: '#7a92c7', fontWeight: 400 }}>
                            PH Time: {phTime}
                        </Typography>
                    )}
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={fetchDeletedCables}
                    disabled={loading}
                    sx={{ ml: 2, minWidth: 36, px: 1 }}
                    startIcon={<RefreshIcon />}
                >
                    Refresh
                </Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Format</InputLabel>
                    <Select defaultValue="Name" label="Format">
                        <MenuItem value="Name">Name</MenuItem>
                        <MenuItem value="Date">Date Deleted</MenuItem>
                    </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Sort</InputLabel>
                    <Select defaultValue="Newest First" label="Sort">
                        <MenuItem value="Newest First">Newest First</MenuItem>
                        <MenuItem value="Oldest First">Oldest First</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Divider sx={{ mb: 2 }} />
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
                            onClick={() => onSelectCable(cable)}
                            sx={{
                                borderRadius: 2,
                                mb: 1,
                                background: '#f1f4fa',
                                boxShadow: '0 1px 4px rgba(56, 84, 165, 0.04)',
                                transition: 'background 0.2s',
                                '&:hover': {
                                    background: '#e3f0ff',
                                    cursor: 'pointer',
                                },
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                            }}
                        >
                            <ListItemText
                                primary={
                                    <>
                                        <Typography sx={{ fontWeight: 500, color: '#3854A5' }}>
                                            {cable.cut_type || cable.cut_id || 'Unknown'}
                                        </Typography>
                                        <Typography sx={{ fontSize: 12, color: '#7a92c7' }}>
                                            Deleted: {cable.fault_date || 'N/A'}
                                        </Typography>
                                        <Typography sx={{ fontSize: 12, color: '#7a92c7' }}>
                                            Distance: {cable.distance ?? 'N/A'} km
                                        </Typography>
                                        <Typography sx={{ fontSize: 12, color: '#7a92c7' }}>
                                            Depth: {cable.depth !== undefined && cable.depth !== null ? cable.depth + ' m' : 'N/A'}
                                        </Typography>
                                        <Typography sx={{ fontSize: 12, color: '#7a92c7' }}>
                                            Lat/Lng: {cable.latitude}, {cable.longitude}
                                        </Typography>
                                        <Typography sx={{ fontSize: 12, color: '#7a92c7' }}>
                                            Simulated: {cable.simulated}
                                        </Typography>
                                    </>
                                }
                            />
                            <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                sx={{ mt: 1, alignSelf: 'flex-end' }}
                                disabled={deletingId === cable.cut_id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteCable(cable.cut_id);
                                }}
                            >
                                {deletingId === cable.cut_id ? 'Deleting...' : 'Delete'}
                            </Button>
                        </ListItem>
                    ))
                )}
            </List>
        </Box>
    );
};

export default DeletedCablesSidebar;