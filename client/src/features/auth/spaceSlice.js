import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  launches: [],
  events: [],
  status: "idle",
  error: "",
};

export const fetchLaunches = createAsyncThunk(
  "space/fetchLaunches",
  async () => {
    const response = await axios.get("/api/launches");
    return response.data;
  }
);

export const fetchEvents = createAsyncThunk(
  "space/fetchEvents",
  async () => {
    const response = await axios.get("/api/events");
    return response.data;
  }
);

const spaceSlice = createSlice({
  name: "space",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchLaunches.pending, (state) => {
        state.status = "pending";
        state.error = "";
      })
      .addCase(fetchLaunches.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.launches = action.payload;
        state.error = "";
      })
      .addCase(fetchLaunches.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      }).addCase(fetchEvents.pending, (state) => {
        state.status = "pending";
        state.error = "";
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.events = action.payload;
        state.error = "";
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      });
  },
});

export const selectAllSpace = (state) => state.space;

export default spaceSlice.reducer;
