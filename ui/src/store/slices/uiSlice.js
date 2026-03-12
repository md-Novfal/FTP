import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: true,
    snackbar: { open: false, message: '', severity: 'info' },
  },
  reducers: {
    toggleSidebar: (state) => { state.sidebarOpen = !state.sidebarOpen; },
    showSnackbar: (state, action) => {
      state.snackbar = { open: true, ...action.payload };
    },
    hideSnackbar: (state) => {
      state.snackbar = { ...state.snackbar, open: false };
    },
  },
});

export const { toggleSidebar, showSnackbar, hideSnackbar } = uiSlice.actions;
export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectSnackbar = (state) => state.ui.snackbar;

export default uiSlice.reducer;
