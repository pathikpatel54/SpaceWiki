import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import spaceReducer from "../features/space/spaceSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    space: spaceReducer,
  },
});
