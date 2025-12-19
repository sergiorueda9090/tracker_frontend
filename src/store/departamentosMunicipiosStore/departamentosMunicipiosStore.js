import { createSlice } from '@reduxjs/toolkit'

export const departamentosMunicipiosStore = createSlice({
  name: 'departamentosMunicipiosStore',
  initialState: {
    departamento_id : null,
    municipio_id    : null,
    departamentos   : [],
    municipios      : [],
  },
  reducers: {
    // Actualizar campo del formulario de usuario
    handleFormStore:(state , action) => {
      const { name, value } = action.payload;
      state[name] = value;
    },
    hanbleDataDepartamentosStore:(state, action) => {
      state.departamentos = action.payload.departamentos || [];
    },
    hanbleDataMunicipiosStore:(state, action) => {
      state.municipios    = action.payload.municipios || [];
    },
    // Resetear formulario de usuario
    resetFormStore: (state) => {
      state.departamento_id = null;
      state.municipio_id = null;
      state.departamentos = [];
      state.municipios = [];
    },
    // Cargar localidad para edición
    loadForEditStore: (state, action) => {
      const localidad = action.payload;
      state.departamento_id = localidad.departamento_id;
      state.municipio_id = localidad.municipio_id;
    },
  },
});

export const { 
  handleFormStore,
  resetFormStore,
  loadForEditStore,
  hanbleDataDepartamentosStore,
  hanbleDataMunicipiosStore
} = departamentosMunicipiosStore.actions;

export default departamentosMunicipiosStore.reducer;
