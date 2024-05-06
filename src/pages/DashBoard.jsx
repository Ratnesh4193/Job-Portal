import React, { useEffect, useRef } from "react";
import { Box, Grid, LinearProgress } from "@mui/material";
import JobCard from "../components/JobCard";
import ChipComponent from "../components/ChipComponent";
import CustomDropDown from "../components/CustomDropDown";
import CustomTextBox from "../components/CustomTextBox";
import { useDispatch, useSelector } from "react-redux";
import { fetchNewJobs } from "../lib/slices/dataSlice";
import {
  getFilteredJobs,
  setSelectedBaseSalary,
  setSelectedCompanyName,
  setSelectedExperience,
  setSelectedLocation,
  setSelectedRole,
} from "../lib/slices/filterSlice";

const DashBoard = () => {
  const observer = useRef(null);

  const { experienceList, locationList, roleList, baseSalaryList } =
    useSelector((state) => state.data);

  const {
    selectedExperience,
    selectedLocation,
    selectedRole,
    selectedBaseSalary,
    selectedCompanyName,
  } = useSelector((state) => state.filter);

  const { isLoading: jobFetchLoading, allJobsFetched } = useSelector(
    (state) => state.data
  );
  const filteredJobs = useSelector(getFilteredJobs);
  const dispatch = useDispatch();

  // Use useEffect hook to fetch jobs when the component mounts and clean up any resources when the component unmounts.
  useEffect(() => {
    // Call the fetchJobs function when the component mounts
    dispatch(fetchNewJobs({}));
    // Clean up function to disconnect the observer when the component unmounts
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [dispatch]);

  //useCallback hook to create an IntersectionObserver and observe the last element in the list.
  //Fetches more jobs when the last element is intersecting with the viewport.
  //Disconnects the observer when the component unmounts or when the loading state changes.
  const lastElementRef = (node) => {
    // Disconnect the observer if it exists
    if (observer.current) observer.current.disconnect();

    // Create a new IntersectionObserver
    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // Fetch more jobs when the last element is intersecting with the viewport
        console.log(
          "Last element",
          entry.isIntersecting,
          jobFetchLoading,
          allJobsFetched
        );
        if (entry.isIntersecting && !jobFetchLoading && !allJobsFetched) {
          dispatch(fetchNewJobs({}));
        }
      });
    });

    // Observe the last element if it exists
    if (node) observer.current.observe(node);
  };

  return (
    <div>
      <div className="flex flex-row flex-wrap items-center justify-around">
        {/* CustomDropdown for Experience */}
        <CustomDropDown
          title="Experience"
          items={experienceList}
          selectedItem={selectedExperience}
          setter={(val) => {
            dispatch(setSelectedExperience(val));
          }}
        />
        {/* ChipComponent for Location */}
        <ChipComponent
          title="Location"
          items={locationList}
          selectedItems={selectedLocation}
          addChip={(val) => {
            dispatch(setSelectedLocation([...selectedLocation, val]));
          }}
          removeChip={(val) => {
            dispatch(
              setSelectedLocation(
                selectedLocation.filter((chipItem) => chipItem !== val)
              )
            );
          }}
        />
        {/* ChipComponent for Roles */}
        <ChipComponent
          title="Roles"
          items={roleList}
          selectedItems={selectedRole}
          addChip={(val) => {
            dispatch(setSelectedRole([...selectedRole, val]));
          }}
          removeChip={(val) => {
            dispatch(
              setSelectedRole(
                selectedRole.filter((chipItem) => chipItem !== val)
              )
            );
          }}
        />
        {/* CustomDropdown for Base Salary */}
        <CustomDropDown
          title="Min. Base Salary"
          items={baseSalaryList}
          selectedItem={selectedBaseSalary}
          setter={(val) => {
            dispatch(setSelectedBaseSalary(val));
          }}
        />
        {/* CustomTextBox for Company Name */}
        <CustomTextBox
          title="Search Company Name"
          value={selectedCompanyName}
          setter={(val) => {
            dispatch(setSelectedCompanyName(val));
          }}
        />
      </div>
      {/* Container for the grid */}
      <Grid container spacing={{ xs: 2, sm: 3, md: 3, lg: 3 }}>
        {/* Map over the jobs array and render a JobCard for each job */}
        {filteredJobs && (
          <>
            {filteredJobs.map((job, index) => (
              <React.Fragment key={`${job.jdUid}-${index}`}>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  {/* Render the JobCard component with the current job */}
                  <JobCard job={job} />
                </Grid>
              </React.Fragment>
            ))}
            {jobFetchLoading}
            {/* Div element to serve as the last element for the IntersectionObserver */}
            <div ref={lastElementRef}></div>
            {/* Loading indicator */}
          </>
        )}
      </Grid>
      {jobFetchLoading && (
        <Box className="my-5" sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      )}
    </div>
  );
};

export default DashBoard;
