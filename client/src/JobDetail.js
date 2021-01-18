import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { loadJob } from "./requests";

export default function JobDetail(props) {
  const [job, setJob] = useState(null);
  const jobId = props.match.params.jobId;

  useEffect(() => {
    const fetchData = async () => {
      const job = await loadJob(jobId);
      //console.log(jobs);
      setJob(job);
    };
    fetchData();
  }, []);
  if (!job) {
    return null;
  } else {
    return (
      <div>
        <h1 className="title">{job.title}</h1>
        <h2 className="subtitle">
          <Link to={`/companies/${job.company.id}`}>{job.company.name}</Link>
        </h2>
        <div className="box">{job.description}</div>
      </div>
    );
  }
}
