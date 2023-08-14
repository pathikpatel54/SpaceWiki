import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  launch: {},
  event: {},
  launches: [],
  events: [],
  previous_launches: [],
  sides: [],
  launchidstatus: "idle",
  launchstatus: "idle",
  eventstatus: "idle",
  eventsearchstatus: "idle",
  previous_launchesstatus: "idle",
  searchstatus: "idle",
  sidesstatus: "idle",
  alertstatus: "idle",
  eventidstatus: "idle",
  alerterror: "",
  error: "",
};

export const fetchLaunch = createAsyncThunk("space/fetchLaunch", async (id) => {
  const response = await axios.get(`/api/launches/${id}`);
  return response.data;
});

export const fetchLaunches = createAsyncThunk(
  "space/fetchLaunches",
  async () => {
    const response = await axios.get("/api/launches");
    return response.data;
  }
);

export const searchLaunches = createAsyncThunk(
  "space/searchLaunches",
  async (keyword) => {
    const response = await axios.get(`/api/launches?keyword=${keyword}`);
    return response.data;
  }
);

export const fetchSideLaunches = createAsyncThunk(
  "space/fetchSideLaunches",
  async (keyword) => {
    const response = await axios.get(`/api/launches?keyword=${keyword}`);
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

export const fetchEvent = createAsyncThunk("space/fetchEvent", async (id) => {
  const response = await axios.get(`/api/events/${id}`);
  return response.data;
});

export const searchEvents = createAsyncThunk(
  "space/searchEvents",
  async (keyword) => {
    const response = await axios.get(`/api/events?keyword=${keyword}`);
    return response.data;
  }
);

export const postAlerts = createAsyncThunk(
  "space/postAlerts",
  async (alert) => {
    const response = await axios.post(`/api/subscriptions/`, alert);
    return response.data;
  }
);

const spaceSlice = createSlice({
  name: "space",
  initialState,
  reducers: {
    clearLaunch: (state) => {
      state.launchidstatus = "idle";
      state.launch = {};
      state.error = "";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchLaunches.pending, (state) => {
        state.launchstatus = "pending";
        state.launches = [];
        state.sides = [];
        state.launch = {};
        state.error = "";
      })
      .addCase(fetchLaunches.fulfilled, (state, action) => {
        state.launchstatus = "fulfilled";
        state.launches = action.payload;
        state.error = "";
      })
      .addCase(fetchLaunches.rejected, (state, action) => {
        state.launchstatus = "rejected";
        state.launches = [];
        state.error = action.error.message;
      })
      .addCase(fetchLaunch.pending, (state) => {
        state.launchidstatus = "pending";
        state.launch = {};
        state.error = "";
      })
      .addCase(fetchLaunch.fulfilled, (state, action) => {
        state.launchidstatus = "fulfilled";
        state.launch = action.payload;
        state.error = "";
      })
      .addCase(fetchLaunch.rejected, (state, action) => {
        state.launchidstatus = "rejected";
        state.launch = {};
        state.error = action.error.message;
      })
      .addCase(fetchSideLaunches.pending, (state) => {
        state.sidesstatus = "pending";
        state.error = "";
      })
      .addCase(fetchSideLaunches.fulfilled, (state, action) => {
        state.sidesstatus = "fulfilled";
        state.sides = action.payload;
        state.error = "";
      })
      .addCase(fetchSideLaunches.rejected, (state, action) => {
        state.sidesstatus = "rejected";
        state.sides = [];
        state.error = action.error.message;
      })
      .addCase(searchLaunches.pending, (state) => {
        state.searchstatus = "pending";
        state.error = "";
      })
      .addCase(searchLaunches.fulfilled, (state, action) => {
        state.searchstatus = "fulfilled";
        state.launches = action.payload;
        state.error = "";
      })
      .addCase(searchLaunches.rejected, (state, action) => {
        state.searchstatus = "rejected";
        state.launches = [];
        state.error = action.error.message;
      })
      .addCase(fetchEvents.pending, (state) => {
        state.eventstatus = "pending";
        state.events = [];
        state.error = "";
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.eventstatus = "fulfilled";
        state.events = action.payload;
        state.error = "";
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.eventstatus = "rejected";
        state.events = [];
        state.error = action.error.message;
      })
      .addCase(fetchEvent.pending, (state) => {
        state.eventidstatus = "pending";
        state.event = {};
        state.error = "";
      })
      .addCase(fetchEvent.fulfilled, (state, action) => {
        state.eventidstatus = "fulfilled";
        state.event = action.payload;
        state.error = "";
      })
      .addCase(fetchEvent.rejected, (state, action) => {
        state.eventidstatus = "rejected";
        state.event = {};
        state.error = action.error.message;
      })
      .addCase(searchEvents.pending, (state) => {
        state.eventsearchstatus = "pending";
        state.error = "";
      })
      .addCase(searchEvents.fulfilled, (state, action) => {
        state.eventsearchstatus = "fulfilled";
        state.events = action.payload;
        state.error = "";
      })
      .addCase(searchEvents.rejected, (state, action) => {
        state.eventsearchstatus = "rejected";
        state.events = [];
        state.error = action.error.message;
      })
      .addCase(fetchPreviousLaunches.pending, (state) => {
        state.previous_launchesstatus = "pending";
        state.previous_launches = [];
        state.error = "";
      })
      .addCase(fetchPreviousLaunches.fulfilled, (state, action) => {
        state.previous_launchesstatus = "fulfilled";
        state.previous_launches = action.payload;
        state.error = "";
      })
      .addCase(fetchPreviousLaunches.rejected, (state, action) => {
        state.previous_launchesstatus = "rejected";
        state.previous_launches = [];
        state.error = action.error.message;
      })
      .addCase(postAlerts.pending, (state, action) => {
        state.alertstatus = "pending";
        state.alerterror = "";
      })
      .addCase(postAlerts.fulfilled, (state, action) => {
        state.alertstatus = "fulfilled";
        state.alerterror = "";
      })
      .addCase(postAlerts.rejected, (state, action) => {
        state.alertstatus = "rejected";
        state.alerterror = action.error.message;
      });
  },
});

export const selectAllSpace = (state) => state.space;
export const { clearLaunch } = spaceSlice.actions;
export default spaceSlice.reducer;
