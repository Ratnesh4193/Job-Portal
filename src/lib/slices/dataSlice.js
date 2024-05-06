import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Define initial state for the data slice
const initialState = {
  jobs: [], // List of jobs
  api: "https://api.weekday.technology/adhoc/getSampleJdJSON", // API endpoint for fetching jobs
  batchSize: 12, // Number of jobs to fetch per request
  lastJobFetched: 0, // Index of the last job fetched
  allJobsFetched: false, // Flag indicating if all jobs have been fetched
  experienceList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // List of available experience levels
  locationList: ["onsite", "remote", "hybrid"], // List of available job locations
  roleList: ["frontend", "ios", "android", "tech lead", "backend"], // List of available job roles
  baseSalaryList: [
    "0L",
    "10L",
    "20L",
    "30L",
    "40L",
    "50L",
    "60L",
    "70L",
    "80L",
    "90L",
    "100L",
  ], // List of available base salaries
  isLoading: false, // Flag indicating if a fetch request is in progress
  isSuccess: false, // Flag indicating if the last fetch request was successful
  isError: false, // Flag indicating if the last fetch request encountered an error
  error: null, // Error message if the last fetch request encountered an error
  lastFetch: 0, // Timestamp of the last fetch request
};

// Define an async thunk for fetching new jobs
export const fetchNewJobs = createAsyncThunk(
  "data/fetchNewJobs",
  async ({}, thunkAPI) => {
    try {
      // Get the current state of the data slice
      const currentState = thunkAPI.getState().data;
      const { api, batchSize, lastJobFetched, allJobsFetched } = currentState;

      // Check if all jobs have been fetched
      if (allJobsFetched) {
        return [];
      } else {
        // Set the headers for the request
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        // Create the request body with the limit and offset
        const raw = JSON.stringify({
          limit: batchSize,
          offset: lastJobFetched,
        });

        // Set the request options
        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
        };

        // Send the request to the API
        const res = await fetch(api, requestOptions);

        // Parse the response as JSON
        const fetchedJobsObj = await res.json();

        // Check if all jobs have been fetched
        if (fetchedJobsObj.totalCount <= lastJobFetched + batchSize) {
          thunkAPI.dispatch(setAllJobsFetched(true));
        }

        // Update the lastJobFetched state
        thunkAPI.dispatch(setLastJobFetched(lastJobFetched + batchSize));

        // Return the fetched jobs
        return fetchedJobsObj?.jdList || [];
      }
    } catch (error) {
      // Reject the thunk with the error message
      return thunkAPI.rejectWithValue(error.message || "An error occurred");
    }
  }
);

// Define the dataSlice using createSlice
export const dataSlice = createSlice({
  name: "data",
  initialState: initialState,
  reducers: {
    // Reducer for clearing the state
    clearState: (state) => {
      state = initialState;
    },
    // Reducer for setting the lastJobFetched state
    setLastJobFetched: (state, action) => {
      state.lastJobFetched = action.payload;
    },
    // Reducer for setting the allJobsFetched state
    setAllJobsFetched: (state, action) => {
      state.allJobsFetched = action.payload;
    },
  },
  extraReducers(builder) {
    // Handle pending state of fetchNewJobs
    builder
      .addCase(fetchNewJobs.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.error = "";
      })
      // Handle fulfilled state of fetchNewJobs
      .addCase(fetchNewJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.jobs = [...state.jobs, ...action.payload];
        state.lastFetch = Date.now();
      })
      // Handle rejected state of fetchNewJobs
      .addCase(fetchNewJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.error = action.payload;
      });
  },
});

// Export the defined actions
export const { clearState, setLastJobFetched, setAllJobsFetched } =
  dataSlice.actions;

// Export the reducer for the dataSlice
export default dataSlice.reducer;
