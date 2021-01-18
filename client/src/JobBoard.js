import React, { useEffect, useState } from "react";
import JobList from "./JobList";
import { loadJobs } from "./requests";

export default function JobBoard(props) {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const jobs = await loadJobs();
      //console.log(jobs);
      setJobs(jobs);
    };
    fetchData();
  }, []);
  return (
    <div>
      <h1 className="title">Job board</h1>
      {jobs.map((job) => (
        <JobList key={job.id} job={job}></JobList>
      ))}
    </div>
  );
}
