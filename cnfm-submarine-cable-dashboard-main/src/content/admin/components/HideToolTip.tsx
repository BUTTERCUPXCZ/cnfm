import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';

const HideToolTip = () => {
    const [ipopUtilization, setIpopUtilization] = useState('0%');
    const [stats, setStats] = useState({
        data: [],
        totalGbps: 0,
        avgUtilization: 0,
        zeroUtilizationCount: 0
    });

    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
    const port = process.env.REACT_APP_PORT;

    // Fetch capacity data
    useEffect(() => {
        let interval: NodeJS.Timeout;
        const fetchData = async () => {
            try {
                const response = await fetch(`${apiBaseUrl}${port}/data-summary`);
                const result = await response.json();
                if (Array.isArray(result) && result.length > 0) {
                    const totalGbps = result.reduce((sum, item) => sum + (item.gbps || 0), 0);
                    const totalUtilization = result.reduce((sum, item) => sum + (item.percent || 0), 0);
                    const avgUtilization = parseFloat((totalUtilization / result.length).toFixed(2));
                    const zeroCount = result.filter((item) => item.percent === 0).length;
                    setStats({ data: result, totalGbps, avgUtilization, zeroUtilizationCount: zeroCount });
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

    // Fetch utilization data
    useEffect(() => {
        let interval: NodeJS.Timeout;
        const fetchIpopUtil = async () => {
            try {
                const response = await fetch(`${apiBaseUrl}${port}/average-util`, {
                    headers: { 'Cache-Control': 'no-cache' }
                });
                const data = await response.json();
                if (data?.current?.length) {
                    const currentVal = parseFloat(data.current[0].a_side);
                    setIpopUtilization(`${currentVal}%`);
                    clearInterval(interval);
                } else {
                    setIpopUtilization('0%');
                }
            } catch (error) {
                console.error('Error fetching IPOP utilization:', error);
            }
        };
        fetchIpopUtil();
        interval = setInterval(fetchIpopUtil, 2000);
        return () => clearInterval(interval);
    }, [apiBaseUrl, port]);
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

            {/* Capacity and Utilization Card */}
            <Paper
                sx={{
                    background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                    p: 2,
                    borderRadius: 2,
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
                </Typography>
            </Paper>

            {/* You can replace the above Paper component with an actual image like this: */}
            {/* 
            <img 
                src="/path/to/your/image.png" 
                alt="Cable System" 
                style={{
                    width: '100%',
                    maxWidth: 300,
                    height: 'auto',
                    borderRadius: 8,
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }}
            />
            */}

            <Typography
                variant="body2"
                sx={{
                    color: '#666',
                    textAlign: 'center',
                    mt: 2,
                    px: 2
                }}
            >
                Monitor submarine cable connections and network status in real-time.
            </Typography>
        </Box>
    );
};

export default HideToolTip;
