import { createSlice } from '@reduxjs/toolkit'

export const userStore = createSlice({
  name: 'userStore',
  initialState: {
    // Formulario de usuario (CRUD)
    id:null,
    username: '',
    password: '',
    email: '',
    first_name: '',
    last_name: '',
    role: 'cliente',
    is_active: true,
    users: [],
    paginado_info: {
      count: 0,
      next: null,
      previous: null,
      page_size: 10,
      current_page: 0,
      total_pages: 0,
    },
    filters: {
      search: '',
      role: '',
      status: '',
      startDate: '',
      endDate: '',
    },
  },
  reducers: {
    // Actualizar campo del formulario de usuario
    handleFormStore:(state , action) => {
      const { name, value } = action.payload;
      state[name] = value;
    },
    hanbleDataStore:(state, action) => {
      state.users = action.payload.users;
      state.paginado_info = action.payload.paginado_info;
    },
    // Resetear formulario de usuario
    resetFormStore: (state) => {
      state.username = '';
      state.password = '';
      state.email = '';
      state.first_name = '';
      state.last_name = '';
      state.role = 'cliente';
      state.usuarios = [];
      state.paginado_info = {
        count: 0,
        next: null,
        page_size: 10,
        previous: null,
        current_page: 0,
        total_pages: 0,
      };
      state.filters = {
        search: '',
        role: '',
        status: '',
        startDate: '',
        endDate: '',
      };
    },
    // Cargar usuario para edición
    loadForEditStore: (state, action) => {
      const user = action.payload;
      state.id       = user.id;
      state.username = user.username || '';
      state.password = ''; // No cargar contraseña por seguridad
      state.email = user.email || '';
      state.first_name = user.first_name || '';
      state.last_name = user.last_name || '';
      state.role = user.role || 'cliente';
    },
    setPaginationPage: (state, action) => {
      state.paginado_info.current_page = action.payload;
    },
    setPaginationPageSize: (state, action) => {
      state.paginado_info.page_size = action.payload;
      state.paginado_info.current_page = 1; // Resetear a página 1
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.paginado_info.current_page = 1; // Resetear a página 1 al filtrar
    },
    setFilterField: (state, action) => {
      const { field, value } = action.payload;
      state.filters[field] = value;
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        role: '',
        status: '',
        startDate: '',
        endDate: '',
      };
      state.paginado_info.current_page = 1;
    },
  },
});

export const { 
  handleFormStore,
  resetFormStore,
  loadForEditStore,
  hanbleDataStore,
  setPaginationPage,
  setPaginationPageSize,
  setFilters,
  setFilterField,
  clearFilters,
} = userStore.actions;

export default userStore.reducer;
