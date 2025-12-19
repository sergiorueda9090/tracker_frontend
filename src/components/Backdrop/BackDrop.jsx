import { useSelector } from 'react-redux';
import Backdrop from '@mui/material/Backdrop';
import TrackChanges from '@mui/icons-material/TrackChanges';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import './SimpleBackdrop.css';

export const SimpleBackdrop = () => {

  const { openBackDropStore } = useSelector(state => state.globalStore);

  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1000000000,
        background: 'linear-gradient(135deg, rgba(0, 168, 89, 0.95) 0%, rgba(0, 138, 71, 0.95) 100%)',
        backdropFilter: 'blur(10px)',
      }}
      open={openBackDropStore}
    >
      <Box className="loading-container">
        <Box className="loading-icon-wrapper">
          <TrackChanges className="tracker-icon" />
          <Box className="loading-ring"></Box>
        </Box>
        <Typography variant="h5" className="loading-title">
          Tracker
        </Typography>
        <Box className="loading-dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </Box>
        <Typography variant="body1" className="loading-text">
          Procesando trámites...
        </Typography>
      </Box>
    </Backdrop>
  );
}