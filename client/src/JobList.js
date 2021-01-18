import React from "react";
import { Link } from "react-router-dom";

export default function JobList(props) {
  const { job } = props;
  const title = job.company ? `${job.title} at ${job.company.name}` : job.title;
  return (
    <ul className="box">
      <li className="media" key={job.id}>
        <div className="media-content">
          <Link to={`/jobs/${job.id}`}>{title}</Link>
        </div>
      </li>
    </ul>
  );
}
