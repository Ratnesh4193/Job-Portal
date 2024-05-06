import { createSelector, createSlice } from "@reduxjs/toolkit";
const initialState = {
  selectedExperience: "",
  selectedLocation: [],
  selectedRole: [],
  selectedBaseSalary: "",
  selectedCompanyName: "",
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
  lastFetch: 0,
};

// Define the filterSlice using createSlice
export const filterSlice = createSlice({
  name: "filter",
  initialState: initialState,
  reducers: {
    // Reducer for clearing the state
    clearState: (state) => {
      state = initialState;
    },
    // Reducer for setting the selectedExperience state
    setSelectedExperience: (state, action) => {
      state.selectedExperience = action.payload;
    },
    // Reducer for setting the selectedLocation state
    setSelectedLocation: (state, action) => {
      state.selectedLocation = action.payload;
    },
    // Reducer for setting the selectedRole state
    setSelectedRole: (state, action) => {
      state.selectedRole = action.payload;
    },
    // Reducer for setting the selectedBaseSalary state
    setSelectedBaseSalary: (state, action) => {
      state.selectedBaseSalary = action.payload;
    },
    // Reducer for setting the selectedCompanyName state
    setSelectedCompanyName: (state, action) => {
      state.selectedCompanyName = action.payload;
    },
  },
});

// Export the defined actions
export const {
  clearState,
  setSelectedExperience,
  setSelectedLocation,
  setSelectedRole,
  setSelectedBaseSalary,
  setSelectedCompanyName,
} = filterSlice.actions;

// Define a selector to get filtered jobs based on filter criteria
export const getFilteredJobs = createSelector(
  // Selector input from state data and filter
  [(state) => state.data, (state) => state.filter],
  // Logic to filter jobs based on selected criteria
  (data, filter) => {
    const {
      selectedRole,
      selectedLocation,
      selectedBaseSalary,
      selectedCompanyName,
      selectedExperience,
    } = filter;

    return data.jobs.filter((job) => {
      const { jobRole, minExp, location, minJdSalary, companyName } = job;

      // Check if the job role is not selected or does not match the selected role
      const isRoleMismatch =
        selectedRole.length > 0 && !selectedRole.includes(jobRole);

      // Check if the selected experience is less than the minimum experience required for the job
      const isExperienceMismatch =
        parseInt(selectedExperience) < minExp && selectedExperience !== "";

      // Check if the selected location is "remote" but the job location is not "remote"
      const isLocationMismatchRemote =
        selectedLocation.includes("remote") &&
        location.toLowerCase() !== "remote";

      // Check if the selected location is "onsite" but the job location is "remote"
      const isLocationMismatchOnsite =
        selectedLocation.includes("onsite") &&
        location.toLowerCase() === "remote";

      // Check if the selected base salary is less than the minimum job salary
      const isSalaryMismatch =
        minJdSalary &&
        minJdSalary < parseInt(selectedBaseSalary.split("L")[0]) &&
        selectedBaseSalary !== "";

      // Check if the selected company name is not included in the job company name
      const isCompanyNameMismatch =
        companyName !== "" &&
        !companyName.toLowerCase().includes(selectedCompanyName.toLowerCase());

      // Check if the job role is null but a role is selected
      const isRoleNullMismatch = jobRole === null && selectedRole.length > 0;

      // Check if the selected experience is null but a value is provided
      const isExperienceNullMismatch =
        minExp === null && selectedExperience !== "";

      // Check if the selected location is null but a value is provided
      const isLocationNullMismatch =
        location === null && selectedLocation.length > 0;

      // Check if the selected base salary is null but a value is provided
      const isSalaryNullMismatch =
        minJdSalary === null && selectedBaseSalary !== "";

      // Check if the selected company name is null but a value is provided
      const isCompanyNameNullMismatch =
        companyName === null && selectedCompanyName !== "";

      // If any of the conditions are true, return false to exclude the job from the filtered list
      if (
        isRoleMismatch ||
        isExperienceMismatch ||
        isLocationMismatchRemote ||
        isLocationMismatchOnsite ||
        isSalaryMismatch ||
        isCompanyNameMismatch ||
        isRoleNullMismatch ||
        isExperienceNullMismatch ||
        isLocationNullMismatch ||
        isSalaryNullMismatch ||
        isCompanyNameNullMismatch
      ) {
        return false;
      }

      // If all conditions pass, include the job in the filtered list
      return true;
    });
  }
);

// Export the reducer for the filterSlice
export default filterSlice.reducer;
