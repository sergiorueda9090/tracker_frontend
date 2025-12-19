import React from 'react';
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
import { useSelector, useDispatch } from 'react-redux';
import { handlePageChange, handlePageSizeChange } from '../../store/proveedoresStore/proveedoresThunks';
import '../../styles/Pagination.css';

const Pagination = () => {
  const dispatch = useDispatch();

  const { paginado_info } = useSelector(state => state.proveedoresStore);
  const { count, current_page, total_pages, page_size } = paginado_info;

  const startIndex = count === 0 ? 0 : (current_page - 1) * page_size + 1;
  const endIndex = Math.min(current_page * page_size, count);

  const handleFirstPage = () => {
    dispatch(handlePageChange(1));
  };

  const handlePreviousPage = () => {
    if (current_page > 1) {
      dispatch(handlePageChange(current_page - 1));
    }
  };

  const handleNextPage = () => {
    if (current_page < total_pages) {
      dispatch(handlePageChange(current_page + 1));
    }
  };

  const handleLastPage = () => {
    dispatch(handlePageChange(total_pages));
  };

  const handleRowsPerPageChange = (event) => {
    const newPageSize = event.target.value;
    dispatch(handlePageSizeChange(newPageSize));
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
              disabled={current_page === 1}
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
              disabled={current_page === 1}
              className="nav-button"
              size="small"
            >
              <NavigateBefore fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>

        <Box className="page-indicator">
          <Typography variant="body2">
            Página <strong>{current_page}</strong> de <strong>{total_pages}</strong>
          </Typography>
        </Box>

        <Tooltip title="Siguiente">
          <span>
            <IconButton
              onClick={handleNextPage}
              disabled={current_page >= total_pages}
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
              disabled={current_page >= total_pages}
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
          value={page_size || 10}
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