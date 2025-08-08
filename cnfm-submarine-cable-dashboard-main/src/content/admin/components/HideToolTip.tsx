import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Chip,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Divider,
    CardContent,
    Tabs,
    Tab
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';

// Import the individual chart components
import TGNSingapore from '../charts/TGNIA/TGNSingapore';
import TGNHongkong from '../charts/TGNIA/TGNHongkong';
import TGNJapan from '../charts/TGNIA/TGNJapan';
import SJCSingapore from '../charts/SJC/SJCSingapore';
import SJCHongkong from '../charts/SJC/SJCHongkong';
import SJCJapan from '../charts/SJC/SJCJapan';
import Seattle from '../charts/SeaUS/Seattle';
import LosAngeles from '../charts/SeaUS/LosAngeles';
import C2CSingapore from '../charts/C2C/C2CSingapore';
import C2CHongkong from '../charts/C2C/C2CHongkong';
import C2CJapan from '../charts/C2C/C2CJapan';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 2 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

interface CableSystemData {
    name: string;
    color: string;
    totalCapacity: number;
    totalUtilization: number;
    avgUtilization: number;
    activeSegments: number;
    zeroUtilizationCount: number;
    segments: Array<{
        name: string;
        capacity: number;
        utilization: number;
        endpoint: string;
    }>;
    lastUpdate: Date;
}

const HideToolTip = () => {
    const [ipopUtilization, setIpopUtilization] = useState('0%');
    const [ipopDifference, setIpopDifference] = useState('0%');
    const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
    const [isLoading, setIsLoading] = useState(false);
    const [stats, setStats] = useState({
        data: [],
        totalGbps: 0,
        avgUtilization: 0,
        zeroUtilizationCount: 0
    });

    // Modal state management
    const [open, setOpen] = useState(false);
    const [selectedSystem, setSelectedSystem] = useState<CableSystemData | null>(null);
    const [tabValue, setTabValue] = useState(0);

    // Four main cable systems matching the map tooltips
    const [cableSystemsData, setCableSystemsData] = useState<CableSystemData[]>([
        {
            name: 'TGN-IA',
            color: '#B8860B', // Gold
            totalCapacity: 0,
            totalUtilization: 0,
            avgUtilization: 0,
            activeSegments: 0,
            zeroUtilizationCount: 0,
            segments: [
                { name: 'Hong Kong', capacity: 0, utilization: 0, endpoint: '/tgnia-hongkong' },
                { name: 'Japan', capacity: 0, utilization: 0, endpoint: '/tgnia-japan' },
                { name: 'Singapore', capacity: 0, utilization: 0, endpoint: '/tgnia-singapore' }
            ],
            lastUpdate: new Date()
        },
        {
            name: 'SJC',
            color: '#1976D2', // Blue
            totalCapacity: 0,
            totalUtilization: 0,
            avgUtilization: 0,
            activeSegments: 0,
            zeroUtilizationCount: 0,
            segments: [
                { name: 'Hong Kong', capacity: 0, utilization: 0, endpoint: '/sjc-hongkong' },
                { name: 'Japan', capacity: 0, utilization: 0, endpoint: '/sjc-japan' },
                { name: 'Singapore', capacity: 0, utilization: 0, endpoint: '/sjc-singapore' }
            ],
            lastUpdate: new Date()
        },
        {
            name: 'SEA-US',
            color: '#2E7D32', // Green
            totalCapacity: 0,
            totalUtilization: 0,
            avgUtilization: 0,
            activeSegments: 0,
            zeroUtilizationCount: 0,
            segments: [
                { name: 'Seattle', capacity: 0, utilization: 0, endpoint: '/sea-us-seattle' },
                { name: 'Los Angeles', capacity: 0, utilization: 0, endpoint: '/sea-us-la' }
            ],
            lastUpdate: new Date()
        },
        {
            name: 'C2C',
            color: '#F57C00', // Orange
            totalCapacity: 0,
            totalUtilization: 0,
            avgUtilization: 0,
            activeSegments: 0,
            zeroUtilizationCount: 0,
            segments: [
                { name: 'Hong Kong', capacity: 0, utilization: 0, endpoint: '/c2c-hongkong' },
                { name: 'Japan', capacity: 0, utilization: 0, endpoint: '/c2c-japan' },
                { name: 'Singapore', capacity: 0, utilization: 0, endpoint: '/c2c-singapore' }
            ],
            lastUpdate: new Date()
        }
    ]);

    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost';
    const port = process.env.REACT_APP_PORT || ':8081';

    // Debug: Log API configuration
    console.log('HideToolTip API Config:', { apiBaseUrl, port, fullUrl: `${apiBaseUrl}${port}` });

    // Fetch individual cable system data
    const fetchCableSystemData = async (system: CableSystemData) => {
        const updatedSegments = await Promise.all(
            system.segments.map(async (segment) => {
                try {
                    const url = `${apiBaseUrl}${port}${segment.endpoint}`;
                    console.log(`Fetching ${system.name} ${segment.name} from:`, url);
                    const response = await fetch(url);
                    const result = await response.json();
                    console.log(`${system.name} ${segment.name} response:`, result);

                    if (Array.isArray(result) && result.length > 0) {
                        const totalCapacity = result.reduce((sum, item) => sum + (item.gbps_capacity || item.gbps || 0), 0);
                        const totalUtilization = result.reduce((sum, item) => sum + (item.percent_utilization || item.percent || 0), 0);
                        const avgUtilization = parseFloat((totalUtilization / result.length).toFixed(2));

                        return {
                            ...segment,
                            capacity: totalCapacity,
                            utilization: avgUtilization,
                            rawData: result // Store raw data for zero utilization counting
                        };
                    }
                } catch (error) {
                    console.error(`Error fetching ${system.name} ${segment.name}:`, error);
                }
                return { ...segment, rawData: [] };
            })
        );

        // Calculate system totals
        const totalCapacity = updatedSegments.reduce((sum, seg) => sum + seg.capacity, 0);
        const totalUtilization = updatedSegments.reduce((sum, seg) => sum + seg.utilization, 0);
        const avgUtilization = updatedSegments.length > 0 ? parseFloat((totalUtilization / updatedSegments.length).toFixed(2)) : 0;
        const activeSegments = updatedSegments.filter(seg => seg.utilization > 0).length;

        // Calculate zero utilization count from all raw data
        const allRawData = updatedSegments.flatMap(seg => seg.rawData || []);
        const zeroUtilizationCount = allRawData.filter(item =>
            (item.percent_utilization || item.percent || 0) === 0
        ).length;

        return {
            ...system,
            segments: updatedSegments.map(seg => ({
                name: seg.name,
                capacity: seg.capacity,
                utilization: seg.utilization,
                endpoint: seg.endpoint
            })), // Remove rawData from segments
            totalCapacity,
            totalUtilization,
            avgUtilization,
            activeSegments,
            zeroUtilizationCount,
            lastUpdate: new Date()
        };
    };

    // Fetch all cable systems data
    useEffect(() => {
        const fetchAllCableSystems = async () => {
            console.log('Fetching all cable systems data...');
            const updatedSystems = await Promise.all(
                cableSystemsData.map(system => fetchCableSystemData(system))
            );
            setCableSystemsData(updatedSystems);
            console.log('All cable systems updated:', updatedSystems);
        };

        fetchAllCableSystems();
        const interval = setInterval(fetchAllCableSystems, 10000); // Update every 10 seconds
        return () => clearInterval(interval);
    }, [apiBaseUrl, port]);

    // Fetch capacity data - EXACT COPY from CableMap
    useEffect(() => {
        let interval: NodeJS.Timeout;
        const fetchData = async () => {
            try {
                const url = `${apiBaseUrl}${port}/data-summary`;
                console.log('Fetching from:', url);
                const response = await fetch(url);
                const result = await response.json();
                console.log('Data summary response:', result);

                if (Array.isArray(result) && result.length > 0) {
                    const totalGbps = result.reduce((sum, item) => sum + (item.gbps || 0), 0);
                    const totalUtilization = result.reduce((sum, item) => sum + (item.percent || 0), 0);
                    const avgUtilization = parseFloat((totalUtilization / result.length).toFixed(2));
                    const zeroCount = result.filter((item) => item.percent === 0).length;
                    setStats({ data: result, totalGbps, avgUtilization, zeroUtilizationCount: zeroCount });
                    console.log('Stats updated:', { totalGbps, avgUtilization, zeroCount });
                    clearInterval(interval);
                } else {
                    console.log('No data received, retrying...');
                }
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };
        fetchData();
        interval = setInterval(fetchData, 2000);
        return () => clearInterval(interval);
    }, [apiBaseUrl, port]);

    // Fetch utilization data - EXACT COPY from CableMap
    useEffect(() => {
        let interval: NodeJS.Timeout;
        const fetchIpopUtil = async () => {
            try {
                const url = `${apiBaseUrl}${port}/average-util`;
                console.log('Fetching utilization from:', url);
                const response = await fetch(url, { headers: { 'Cache-Control': 'no-cache' } });
                const data = await response.json();
                console.log('Utilization response:', data);

                if (data?.current?.length) {
                    const currentVal = parseFloat(data.current[0].a_side);
                    setIpopUtilization(`${currentVal}%`);
                    if (data?.previous?.length) {
                        const previousVal = parseFloat(data.previous[0].a_side);
                        const diff = currentVal - previousVal;
                        const sign = diff > 0 ? '+' : '';
                        setIpopDifference(`${sign}${diff.toFixed(2)}%`);
                    } else {
                        setIpopDifference('');
                    }
                    console.log('Utilization updated:', currentVal);
                    clearInterval(interval);
                } else {
                    setIpopUtilization('0%');
                    setIpopDifference('');
                }
            } catch (error) {
                console.error('Error fetching IPOP utilization:', error);
            }
        };
        fetchIpopUtil();
        interval = setInterval(fetchIpopUtil, 2000);
        return () => clearInterval(interval);
    }, [apiBaseUrl, port]);

    // Manual refresh function
    const handleRefresh = async () => {
        setIsLoading(true);
        setLastRefresh(new Date());

        try {
            // Fetch all cable systems data
            const updatedSystems = await Promise.all(
                cableSystemsData.map(system => fetchCableSystemData(system))
            );
            setCableSystemsData(updatedSystems);

            // Also refresh overall stats
            const url = `${apiBaseUrl}${port}/data-summary`;
            const response = await fetch(url);
            const result = await response.json();

            if (Array.isArray(result) && result.length > 0) {
                const totalGbps = result.reduce((sum, item) => sum + (item.gbps || 0), 0);
                const totalUtilization = result.reduce((sum, item) => sum + (item.percent || 0), 0);
                const avgUtilization = parseFloat((totalUtilization / result.length).toFixed(2));
                const zeroCount = result.filter((item) => item.percent === 0).length;
                setStats({ data: result, totalGbps, avgUtilization, zeroUtilizationCount: zeroCount });
            }
        } catch (error) {
            console.error('Error refreshing data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Modal handler functions
    const handleSystemClick = (system: CableSystemData) => {
        setSelectedSystem(system);
        setTabValue(0); // Reset to first tab
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedSystem(null);
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    // Function to render the appropriate chart component based on system and segment
    const renderChartComponent = (systemName: string, segmentIndex: number) => {
        switch (systemName) {
            case 'TGN-IA':
                switch (segmentIndex) {
                    case 0: return <TGNSingapore />;
                    case 1: return <TGNHongkong />;
                    case 2: return <TGNJapan />;
                    default: return <TGNSingapore />;
                }
            case 'SJC':
                switch (segmentIndex) {
                    case 0: return <SJCSingapore />;
                    case 1: return <SJCHongkong />;
                    case 2: return <SJCJapan />;
                    default: return <SJCSingapore />;
                }
            case 'SEA-US':
                switch (segmentIndex) {
                    case 0: return <Seattle />;
                    case 1: return <LosAngeles />;
                    default: return <Seattle />;
                }
            case 'C2C':
                switch (segmentIndex) {
                    case 0: return <C2CSingapore />;
                    case 1: return <C2CHongkong />;
                    case 2: return <C2CJapan />;
                    default: return <C2CSingapore />;
                }
            default:
                return <div>No data available</div>;
        }
    };

    // Remove the old useEffect for cable systems data
    // The new implementation fetches data for all systems in the main useEffect above

    return (
        <Box
            sx={{
                background: 'rgba(255, 255, 255, 0.3)',
                p: 3,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                overflowY: 'auto',
            }}
        >
            <Typography
                variant="h5"
                sx={{
                    fontWeight: 700,
                    color: '#3854A5',
                    mb: 3,
                    mt: 2,
                    textAlign: 'center'
                }}
            >
                Cable System Overview
            </Typography>

            {/* Refresh Button and Last Update */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: 280, mb: 2 }}>
                <Typography variant="caption" sx={{ color: '#666', fontSize: '10px' }}>
                    Last updated: {lastRefresh.toLocaleTimeString()}
                </Typography>
                <Tooltip title="Refresh Data">
                    <IconButton
                        size="small"
                        onClick={handleRefresh}
                        disabled={isLoading}
                        sx={{
                            color: '#3854A5',
                            '&:disabled': { color: '#ccc' }
                        }}
                    >
                        <RefreshIcon
                            fontSize="small"
                            sx={{
                                animation: isLoading ? 'spin 1s linear infinite' : 'none',
                                '@keyframes spin': {
                                    '0%': { transform: 'rotate(0deg)' },
                                    '100%': { transform: 'rotate(360deg)' }
                                }
                            }}
                        />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Capacity and Utilization Card */}
            <Paper
                sx={{
                    background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                    p: 2,
                    boxShadow: 2,
                    mb: 3,
                    width: '100%',
                    maxWidth: 280,
                    border: '1px solid rgba(56, 84, 165, 0.2)'
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: '#666', fontSize: '12px', textTransform: 'uppercase', letterSpacing: 1 }}>
                        CAPACITY:
                    </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#3854A5', mb: 2 }}>
                    {stats.totalGbps} Gbps
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#666', fontSize: '12px', textTransform: 'uppercase', letterSpacing: 1 }}>
                        AVERAGE UTILIZATION:
                    </Typography>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#3854A5' }}>
                    {ipopUtilization}
                    {ipopDifference && (
                        <Chip
                            label={ipopDifference}
                            size="small"
                            sx={{
                                ml: 1,
                                fontSize: '10px',
                                height: '20px',
                                color: ipopDifference.startsWith('+') ? '#d32f2f' : '#388e3c',
                                backgroundColor: ipopDifference.startsWith('+') ? '#ffebee' : '#e8f5e8'
                            }}
                            icon={ipopDifference.startsWith('+') ? <TrendingUpIcon /> : <TrendingDownIcon />}
                        />
                    )}
                </Typography>
            </Paper>

            {/* System Statistics */}
            <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%', maxWidth: 280, mb: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#3854A5' }}>
                        {cableSystemsData.reduce((sum, system) => sum + system.activeSegments, 0)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#666', fontSize: '10px' }}>
                        ACTIVE SYSTEMS
                    </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#FF9800' }}>
                        {cableSystemsData.reduce((sum, system) => sum + (system.segments.length - system.activeSegments), 0)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#666', fontSize: '10px' }}>
                        IDLE SYSTEMS
                    </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#4CAF50' }}>
                        {cableSystemsData.length > 0 ?
                            Math.round(cableSystemsData.reduce((sum, system) => sum + system.avgUtilization, 0) / cableSystemsData.length) : 0}%
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#666', fontSize: '10px' }}>
                        AVG LOAD
                    </Typography>
                </Box>
            </Box>

            {/* Four Main Cable Systems - Replicating Map Tooltips */}
            <Typography
                variant="h6"
                sx={{
                    fontWeight: 600,
                    color: '#3854A5',
                    mb: 2,
                    textAlign: 'center'
                }}
            >
                Cable Systems Details
            </Typography>

            {cableSystemsData.map((system, index) => (
                    <Paper
                        key={system.name}
                        onClick={() => handleSystemClick(system)}
                        sx={{
                            background: `linear-gradient(135deg, ${system.color}20 0%, ${system.color}10 100%)`,
                            p: 2,
                            borderRadius: 2,
                            boxShadow: 2,
                            mb: 2,
                            width: '100%',
                            maxWidth: 280,
                            border: `2px solid ${system.color}`,
                            position: 'relative',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                                boxShadow: 4,
                                transform: 'translateY(-2px)',
                                background: `linear-gradient(135deg, ${system.color}30 0%, ${system.color}20 100%)`
                            }
                        }}
                    >
                        {/* System Color Indicator */}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: -8,
                                right: -8,
                                background: system.color,
                                color: 'white',
                                borderRadius: '50%',
                                width: 24,
                                height: 24,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px',
                                fontWeight: 700,
                                boxShadow: 2
                            }}
                        >
                            {index + 1}
                        </Box>

                        {/* System Header */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: system.color }}>
                                {system.name}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <Chip
                                    label={`${system.activeSegments}/${system.segments.length} active`}
                                    size="small"
                                    sx={{
                                        fontSize: '10px',
                                        height: '18px',
                                        backgroundColor: system.activeSegments > 0 ? '#e8f5e8' : '#ffebee',
                                        color: system.activeSegments > 0 ? '#388e3c' : '#d32f2f'
                                    }}
                                    icon={<SignalCellularAltIcon style={{ fontSize: '12px' }} />}
                                />
                                {/* Links Not Working Badge - matching map tooltip style */}
                                {system.zeroUtilizationCount > 0 && (
                                    <Chip
                                        label={system.zeroUtilizationCount}
                                        size="small"
                                        sx={{
                                            fontSize: '10px',
                                            height: '18px',
                                            minWidth: '22px',
                                            backgroundColor: '#f44336',
                                            color: 'white',
                                            fontWeight: 'bold',
                                            '& .MuiChip-label': {
                                                padding: '0 6px'
                                            }
                                        }}
                                    />
                                )}
                            </Box>
                        </Box>

                        {/* System Totals */}
                        <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="body2" sx={{ color: '#666', fontSize: '11px' }}>
                                    Total Capacity:
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: system.color }}>
                                    {system.totalCapacity.toLocaleString()} Gbps
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="body2" sx={{ color: '#666', fontSize: '11px' }}>
                                    Average Utilization:
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: system.color }}>
                                    {system.avgUtilization}%
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body2" sx={{ color: '#666', fontSize: '11px' }}>
                                    Links Not Working:
                                </Typography>
                                <Typography variant="body2" sx={{
                                    fontWeight: 600,
                                    color: system.zeroUtilizationCount > 0 ? '#f44336' : '#4caf50'
                                }}>
                                    {system.zeroUtilizationCount}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Segments List */}
                        <Box sx={{ mt: 1 }}>
                            <Typography variant="caption" sx={{ color: '#888', fontSize: '10px', textTransform: 'uppercase' }}>
                                Segments:
                            </Typography>
                            {system.segments.map((segment, segIndex) => (
                                <Box key={segIndex} sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mt: 0.5,
                                    p: 0.5,
                                    borderRadius: 1,
                                    backgroundColor: segment.utilization > 0 ? `${system.color}10` : 'rgba(0,0,0,0.05)'
                                }}>
                                    <Typography variant="caption" sx={{ fontSize: '10px', color: '#555' }}>
                                        {segment.name}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                        <Typography variant="caption" sx={{ fontSize: '9px', color: '#777' }}>
                                            {segment.capacity.toLocaleString()}G
                                        </Typography>
                                        <Chip
                                            label={`${segment.utilization}%`}
                                            size="small"
                                            sx={{
                                                fontSize: '8px',
                                                height: '14px',
                                                minWidth: '30px',
                                                backgroundColor: segment.utilization > 0 ? system.color : '#eee',
                                                color: segment.utilization > 0 ? 'white' : '#999'
                                            }}
                                        />
                                    </Box>
                                </Box>
                            ))}
                        </Box>

                        {/* Last Update */}
                        <Typography variant="caption" sx={{ color: '#999', fontSize: '9px', mt: 1, display: 'block' }}>
                            Last updated: {system.lastUpdate.toLocaleTimeString()}
                        </Typography>
                        
                        
                    </Paper>
            ))}            {/* Modal Dialog */}
            {selectedSystem && (
                <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        <Typography variant="h4">{selectedSystem.name} Submarine Cable</Typography>
                    </DialogTitle>
                    <Divider />
                    <DialogContent sx={{ pb: 2 }}>
                        <CardContent>
                            <Box sx={{ width: '100%' }}>
                                <Tabs
                                    variant="scrollable"
                                    scrollButtons="auto"
                                    textColor="primary"
                                    indicatorColor="primary"
                                    value={tabValue}
                                    onChange={handleTabChange}
                                    aria-label="cable system tabs"
                                >
                                    {selectedSystem.segments.map((segment, index) => (
                                        <Tab key={index} label={segment.name} {...a11yProps(index)} />
                                    ))}
                                </Tabs>
                                {selectedSystem.segments.map((segment, index) => (
                                    <TabPanel key={index} value={tabValue} index={index}>
                                        {renderChartComponent(selectedSystem.name, index)}
                                    </TabPanel>
                                ))}
                            </Box>
                        </CardContent>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Box>
    );
};

export default HideToolTip;
