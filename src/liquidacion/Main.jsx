import React from 'react';
import { Box } from '@mui/material';
import MainHeader from './components/MainHeader';
import MainTable from './components/MainTable';
import MainDialog from './components/MainDialog';

import { openModalShared, closeModalShared } from "../store/globalStore/globalStore";
import { useSelector, useDispatch } from 'react-redux';

import '../styles/Pages.css';
import Filter from './components/Filter';
import { SimpleBackdrop } from '../components/Backdrop/BackDrop';

const Main = () => {

  const dispatch = useDispatch();

  const { openModalStore } = useSelector(state => state.globalStore);

  // Handlers del Dialog
  const handleCloseDialog = () => {
    dispatch(closeModalShared());
  };

  return (
    <Box className="page-container">
      {/* Header */}
      <MainHeader />

      <Filter />

      {/* Tabla de trámites finalizados */}
      <MainTable />

      {/* Dialog de liquidación */}
      <MainDialog open={openModalStore} onClose={handleCloseDialog}/>

      <SimpleBackdrop />
    </Box>
  );
};

export default Main;
