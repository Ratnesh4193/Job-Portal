import React, { useCallback, useEffect, useRef, useState } from "react";
import { Grid } from "@mui/material";
import JobCard from "../components/JobCard";

const ITEM_FETCHED_PER_PAGE = 12;
const JOB_API = "https://api.weekday.technology/adhoc/getSampleJdJSON";

const DashBoard = () => {
  const [loading, setLoading] = useState(false);
  const [lastJobFetched, setLastJobFetched] = useState(0);
  const [jobs, setJobs] = useState([]);

  //Fetches jobs from the API and updates the state with the fetched jobs.
  //It also updates the last job fetched and sets the loading state.
  const fetchJobs = async () => {
    setLoading(true);

    // Set the headers for the request
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    // Create the request body with the limit and offset
    const raw = JSON.stringify({
      limit: ITEM_FETCHED_PER_PAGE,
      offset: lastJobFetched,
    });

    // Set the request options
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    // Send the request to the API
    const res = await fetch(JOB_API, requestOptions);

    // Parse the response as JSON
    const fetchedJobsObj = await res.json();

    // Update the jobs state by adding the fetched jobs to the existing jobs
    setJobs((prev) => [...prev, ...(fetchedJobsObj?.jdList || [])]);

    // Update the last job fetched state by adding the number of items fetched
    setLastJobFetched((prev) => prev + ITEM_FETCHED_PER_PAGE);

    // Set the loading state to false
    setLoading(false);
  };

  // Use useEffect hook to fetch jobs when the component mounts and clean up any resources when the component unmounts.
  useEffect(() => {
    // Call the fetchJobs function when the component mounts
    fetchJobs();
  }, []);

  return (
    <div>
      {/* Container for the grid */}
      <Grid container spacing={{ xs: 2, sm: 3, md: 3, lg: 3 }}>
        {/* Map over the jobs array and render a JobCard for each job */}
        {jobs &&
          jobs.map((job, index) => (
            <React.Fragment key={`${job.jdUid}-${index}`}>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                {/* Render the JobCard component with the current job */}
                <JobCard job={job} />
              </Grid>
            </React.Fragment>
          ))}
      </Grid>
    </div>
  );
};

export default DashBoard;
