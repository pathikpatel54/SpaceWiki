import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import spaceReducer from "../features/auth/spaceSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    space: spaceReducer
  },
});
