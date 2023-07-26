import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  launches: [],
  events: [],
  previous_launches: [],
  launchstatus: "idle",
  eventstatus: "idle",
  previous_launchesstatus: "idle",
  error: "",
};

export const fetchLaunches = createAsyncThunk(
  "space/fetchLaunches",
  async () => {
    const response = await axios.get("/api/launches");
    return response.data;
  }
);

export const fetchPreviousLaunches = createAsyncThunk(
  "space/fetchPreviousLaunches",
  async () => {
    const response = await axios.get("/api/previous_launches");
    return response.data;
  }
);

export const fetchEvents = createAsyncThunk("space/fetchEvents", async () => {
  const response = await axios.get("/api/events");
  return response.data;
});

const spaceSlice = createSlice({
  name: "space",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchLaunches.pending, (state) => {
        state.launchstatus = "pending";
        state.error = "";
      })
      .addCase(fetchLaunches.fulfilled, (state, action) => {
        state.launchstatus = "fulfilled";
        state.launches = action.payload;
        state.error = "";
      })
      .addCase(fetchLaunches.rejected, (state, action) => {
        state.launchstatus = "rejected";
        state.error = action.error.message;
      })
      .addCase(fetchEvents.pending, (state) => {
        state.eventstatus = "pending";
        state.error = "";
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.eventstatus = "fulfilled";
        state.events = action.payload;
        state.error = "";
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.eventstatus = "rejected";
        state.error = action.error.message;
      })
      .addCase(fetchPreviousLaunches.pending, (state) => {
        state.previous_launchesstatus = "pending";
        state.error = "";
      })
      .addCase(fetchPreviousLaunches.fulfilled, (state, action) => {
        state.previous_launchesstatus = "fulfilled";
        state.previous_launches = action.payload;
        state.error = "";
      })
      .addCase(fetchPreviousLaunches.rejected, (state, action) => {
        state.previous_launchesstatus = "rejected";
        state.error = action.error.message;
      });
  },
});

export const selectAllSpace = (state) => state.space;

export default spaceSlice.reducer;
