import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  space: {},
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
