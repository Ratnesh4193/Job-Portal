import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Grid } from "@mui/material";
import JobCard from "../components/JobCard";
import ChipComponent from "../components/ChipComponent";
import CustomDropDown from "../components/CustomDropDown";
import CustomTextBox from "../components/CustomTextBox";

const ITEM_FETCHED_PER_PAGE = 12;
const JOB_API = "https://api.weekday.technology/adhoc/getSampleJdJSON";
const experienceList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const locationList = ["onsite", "remote", "hybrid"];
const roleList = ["frontend", "ios", "android", "tech lead", "backend"];
const baseSalaryList = [
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
];

const DashBoard = () => {
  const [loading, setLoading] = useState(false);
  const [lastJobFetched, setLastJobFetched] = useState(0);
  const [jobs, setJobs] = useState([]);
  const observer = useRef(null);
  const [selectedExperience, setSelectedExperience] = useState("");
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [selectedRole, setSelectedRole] = useState([]);
  const [selectedBaseSalary, setSelectedBaseSalary] = useState("");
  const [selectedCompanyName, setSelectedCompanyName] = useState("");

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

    // Clean up function to disconnect the observer when the component unmounts
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, []);

  //useCallback hook to create an IntersectionObserver and observe the last element in the list.
  //Fetches more jobs when the last element is intersecting with the viewport.
  //Disconnects the observer when the component unmounts or when the loading state changes.
  const lastElementRef = useCallback(
    (node) => {
      // Return early if the loading state is true
      if (loading) return;

      // Disconnect the observer if it exists
      if (observer.current) observer.current.disconnect();

      // Create a new IntersectionObserver
      observer.current = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          // Fetch more jobs when the last element is intersecting with the viewport
          if (entry.isIntersecting) {
            fetchJobs();
          }
        });
      });

      // Observe the last element if it exists
      if (node) observer.current.observe(node);
    },
    [loading]
  );

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
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
  }, [
    jobs,
    selectedRole,
    selectedExperience,
    selectedLocation,
    selectedBaseSalary,
    selectedCompanyName,
  ]);

  return (
    <div>
      <div className="flex flex-row flex-wrap">
        {/* CustomDropdown for Experience */}
        <CustomDropDown
          title="Experience"
          items={experienceList}
          selectedItem={selectedExperience}
          setSelectedItem={setSelectedExperience}
        />
        {/* ChipComponent for Location */}
        <ChipComponent
          title="Location"
          items={locationList}
          selectedItems={selectedLocation}
          setSelectedItems={setSelectedLocation}
        />
        {/* ChipComponent for Roles */}
        <ChipComponent
          title="Roles"
          items={roleList}
          selectedItems={selectedRole}
          setSelectedItems={setSelectedRole}
        />
        {/* CustomDropdown for Base Salary */}
        <CustomDropDown
          title="Min. Base Salary"
          items={baseSalaryList}
          selectedItem={selectedBaseSalary}
          setSelectedItem={setSelectedBaseSalary}
        />
        {/* CustomTextBox for Company Name */}
        <CustomTextBox
          title="Search Company Name"
          value={selectedCompanyName}
          selectedValue={setSelectedCompanyName}
        />
      </div>
      {/* Container for the grid */}
      <Grid container spacing={{ xs: 2, sm: 3, md: 3, lg: 3 }}>
        {/* Map over the jobs array and render a JobCard for each job */}
        {filteredJobs &&
          filteredJobs.map((job, index) => (
            <React.Fragment key={`${job.jdUid}-${index}`}>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                {/* Render the JobCard component with the current job */}
                <JobCard job={job} />
              </Grid>
            </React.Fragment>
          ))}
        {/* Div element to serve as the last element for the IntersectionObserver */}
        <div ref={lastElementRef}></div>
      </Grid>
    </div>
  );
};

export default DashBoard;
