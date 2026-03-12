import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import applicationService from '../../services/application.service';

export const fetchApplications = createAsyncThunk(
  'applications/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      return await applicationService.getAll(params);
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch applications');
    }
  }
);

export const submitApplication = createAsyncThunk(
  'applications/submit',
  async (data, { rejectWithValue }) => {
    try {
      return await applicationService.create(data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to submit application');
    }
  }
);

const applicationSlice = createSlice({
  name: 'applications',
  initialState: {
    list: [],
    total: 0,
    selected: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelected: (state, action) => { state.selected = action.payload; },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplications.pending, (state) => { state.loading = true; })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.applications;
        state.total = action.payload.total;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelected, clearError } = applicationSlice.actions;
export const selectApplications = (state) => state.applications.list;
export const selectApplicationsLoading = (state) => state.applications.loading;

export default applicationSlice.reducer;
