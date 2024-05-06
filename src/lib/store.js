import { configureStore } from "@reduxjs/toolkit";
import dataSlice from "./slices/dataSlice";
import filterSlice from "./slices/filterSlice";

// Configure the Redux store with the defined reducers
export const store = configureStore({
  reducer: {
    data: dataSlice,
    filter: filterSlice,
  },
});
