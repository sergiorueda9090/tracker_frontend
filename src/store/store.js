import { configureStore } from '@reduxjs/toolkit'
import { authStore }      from './authStore/authStore';
import { counterSlice }   from './slices/counter/counterSlice';
import { globalStore }    from './globalStore/globalStore';
import { userStore }      from './userStore/userStore';
import {proveedoresStore } from './proveedoresStore/proveedoresStore';
import {  departamentosMunicipiosStore } from './departamentosMunicipiosStore/departamentosMunicipiosStore';

export const store = configureStore({
  reducer: {
    counter      : counterSlice.reducer,
    authStore    : authStore.reducer,
    globalStore  : globalStore.reducer,
    userStore    : userStore.reducer,
    proveedoresStore: proveedoresStore.reducer,
    departamentosMunicipiosStore: departamentosMunicipiosStore.reducer
  }
})
