import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { capitalizeFirstCharacter } from "../utils/utils";
import { useState } from "react";

// Component for displaying the job role
const JobRole = ({ name, role, location, img }) => {
  return (
    <div className="flex items-center mb-4">
      <img className="w-[50px] h-[2.5rem]" src={img} alt="logo" />
      <div className="ml-4 text-left w-full">
        <div className="w-full">
          <div className="text-sm font-semibold tracking-wide text-gray-400">
            {name}
          </div>
          <Typography variant="h6">{role}</Typography>
        </div>
        <Typography variant="subtitle2">{location}</Typography>
      </div>
    </div>
  );
};

// Component for displaying a job card
const JobCard = (props) => {
  const { job } = props;
  const [expanded, setExpanded] = useState(false);
  return (
    <Paper className="p-4">
      {/* Display the job role */}
      <JobRole
        name={capitalizeFirstCharacter(job.companyName)}
        role={capitalizeFirstCharacter(job.jobRole)}
        location={capitalizeFirstCharacter(job.location)}
        img={capitalizeFirstCharacter(job.logoUrl)}
      />

      {/* Display the estimated salary */}
      <Typography
        variant="body1"
        className="text-start font-bold tracking-wide text-gray-400"
      >
        Estimated Salary: ${job.minJdSalary || 0} - $
        {job.maxJdSalary || job.minJdSalary || 0}
        <span role="img" aria-label="Offered salary range">
          ✅
        </span>
      </Typography>

      {/* Display information about the company */}
      <div className="flex justify-between text-start mt-4">
        <div className="flex flex-col">
          <Typography variant="body1" className="text-gray-900">
            About Company:
          </Typography>
          <div className="text-gray-900 text-start font-bold tracking-wide">
            About us
          </div>
          <div className="max-w-md overflow-auto">
            <p className="overflow-hidden text-gray-700 leading-relaxed bg-gradient-to-b from-transparent to-gray-300">
              {expanded
                ? job.jobDetailsFromCompany
                : job.jobDetailsFromCompany.length > 200
                ? `${job.jobDetailsFromCompany.substring(0, 200)}...`
                : job.jobDetailsFromCompany}
            </p>
          </div>
        </div>
      </div>

      {/* Display additional job details */}
      <div className=" bg-gray-300 p-4">
        {/* Button to view the job details */}
        <div
          className="cursor-pointer text-blue-500 font-bold p-2"
          onClick={() => setExpanded(!expanded)}
        >
          View Job
        </div>

        {/* Container for minimum experience details */}
        <div className="flex flex-col items-start mt-4">
          {/* Label for minimum experience */}
          <div className="text-md font-bold tracking-wide text-gray-500">
            Minimum Experience
          </div>
          {/* Display the minimum experience in years */}
          <Typography variant="h6" className="ml-2">
            {job.minExp || 0} years
          </Typography>
        </div>

        {/* Container for easy apply button */}
        <div className="text-center">
          {/* Link to the job details page */}
          <a href={job.jdLink}>
            {/* Button for easy apply */}
            <button className="w-full bg-green-500 text-black font-bold py-2 px-4 mt-4">
              ⚡ Easy Apply
            </button>
          </a>
        </div>
      </div>
    </Paper>
  );
};

export default JobCard;
