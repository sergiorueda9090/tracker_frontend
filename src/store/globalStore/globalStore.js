import { createSlice } from '@reduxjs/toolkit'

export const globalStore = createSlice({
  name: 'globalStore',
  initialState: {
    openBackDropStore: false,
    openModalStore: false,
    alert: null,
  },
  reducers: {
    showBackDropStore: (state) => {
      state.openBackDropStore = true
    },
    hideBackDropStore: (state) => {
      state.openBackDropStore = false
    },
    openModalShared: (state) => {
      state.openModalStore = true;
    },
    closeModalShared: (state) => {
      state.openModalStore = false;
    },
    showAlert: (state, action) => {
      state.alert = action.payload; // { type, title, text, confirmText, action }
    },
    clearAlert: (state) => {
      state.alert = null;
    },
  }
})

export const { 
  showBackDropStore, 
  hideBackDropStore, 
  openModalShared,
  closeModalShared,
  showAlert, 
  clearAlert 
} = globalStore.actions;