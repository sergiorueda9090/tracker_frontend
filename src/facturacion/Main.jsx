import React from 'react';
import { Box } from '@mui/material';
import MainHeader from './components/MainHeader';
import MainTable from './components/MainTable';

import '../styles/Pages.css';
import Filter from './components/Filter';
import { SimpleBackdrop } from '../components/Backdrop/BackDrop';

const Main = () => {
  return (
    <Box className="page-container">
      {/* Header */}
      <MainHeader />

      {/* Filtros */}
      <Filter />

      {/* Tabla de facturas */}
      <MainTable />

      {/* Backdrop */}
      <SimpleBackdrop />
    </Box>
  );
};

export default Main;
