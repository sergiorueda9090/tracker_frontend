import { createSlice } from '@reduxjs/toolkit'


// Intentamos cargar la información del usuario guardada en el navegador
const savedUser = JSON.parse(localStorage.getItem("infoUser")) || null;

export const authStore = createSlice({
  name: 'authStore',
  initialState: {
    infoUser  : savedUser,
    isLogin   : !!savedUser,
    token     : savedUser?.access || "",
    role      : savedUser?.role || "",
    username  : savedUser?.username || "",
    password  : "",
  },
  reducers: {
    loginSuccess: (state, action) => {
      const { token, username, role } = action.payload;
      const userData = {
        access: token,
        username,
        role,
        isLogin: true,
      };
      localStorage.setItem("infoUser", JSON.stringify(userData));
      state.isLogin   = true;
      state.token     = token;
      state.username  = username;
      state.role     = role;
      state.infoUser  = userData;
    },
    loginFail: (state) => {
      localStorage.removeItem("infoUser");
      state.infoUser  = null;
      state.isLogin   = false;
      state.token     = "";
      state.username  = "";
      state.role     = "";
    },
    logout: (state) => {
      localStorage.removeItem("infoUser");
      state.isLogin   = false;
      state.token     = "";
      state.username  = "";
      state.role     = "";
      state.infoUser  = null;
    },
    setAuthenticated: (state, action) => {
      const { access, role, username,  } = action.payload;
      const userData = {
        access,
        role,
        username,
        isLogin: true,
      };
      localStorage.setItem("infoUser", JSON.stringify(userData));
      state.token    = access;
      state.role     = role;
      state.isLogin  = true;
      state.infoUser = userData;
    },
    handleFormStore:(state , action) => {
      const { name, value } = action.payload;
      state[name] = value;
    }
  },
});

export const { loginSuccess, loginFail, logout, setAuthenticated, handleFormStore } = authStore.actions;
