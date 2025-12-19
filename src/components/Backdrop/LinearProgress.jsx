
import {useCallback, useState, useEffect } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';

export const LinearProgressComponent = () => {
    return (
        <div>
            <Box sx={{ width: '100%', mt:'10px' }}>
                <LinearProgress color="primary" />
            </Box>
        </div>
    )
}