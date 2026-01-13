import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Select,
  MenuItem,
  Typography,
  Tooltip,
} from '@mui/material';
import {
  FirstPage,
  LastPage,
  NavigateBefore,
  NavigateNext,
} from '@mui/icons-material';
import '../../styles/Pagination.css';

// Importar datos mock para calcular paginación
import { mockTramites } from '../data/mockData';

const Pagination = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const count = mockTramites.length;
  const totalPages = Math.ceil(count / pageSize);

  const startIndex = count === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, count);

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  const handleRowsPerPageChange = (event) => {
    const newPageSize = event.target.value;
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  return (
    <Box className="custom-pagination-wrapper">
      <Box className="pagination-left">
        <Typography variant="body2" className="pagination-info-text">
          Mostrando <strong>{startIndex}</strong> - <strong>{endIndex}</strong> de{' '}
          <strong>{count}</strong> registros
        </Typography>
      </Box>

      <Box className="pagination-center">
        <Tooltip title="Primera página">
          <span>
            <IconButton
              onClick={handleFirstPage}
              disabled={currentPage === 1}
              className="nav-button"
              size="small"
            >
              <FirstPage fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="Anterior">
          <span>
            <IconButton
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="nav-button"
              size="small"
            >
              <NavigateBefore fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>

        <Box className="page-indicator">
          <Typography variant="body2">
            Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
          </Typography>
        </Box>

        <Tooltip title="Siguiente">
          <span>
            <IconButton
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              className="nav-button"
              size="small"
            >
              <NavigateNext fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="Última página">
          <span>
            <IconButton
              onClick={handleLastPage}
              disabled={currentPage >= totalPages}
              className="nav-button"
              size="small"
            >
              <LastPage fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      <Box className="pagination-right">
        <Typography variant="body2" className="rows-label">
          Filas:
        </Typography>
        <Select
          value={pageSize}
          onChange={handleRowsPerPageChange}
          size="small"
          className="rows-select-input"
        >
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={25}>25</MenuItem>
          <MenuItem value={50}>50</MenuItem>
          <MenuItem value={100}>100</MenuItem>
        </Select>
      </Box>
    </Box>
  );
};

export default Pagination;
