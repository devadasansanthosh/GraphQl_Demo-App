import React, { useEffect, useState } from "react";
import JobList from "./JobList";
import { loadCompany } from "./requests";

export default function CompanyDetail(props) {
  const [company, setCompany] = useState(null);
  const companyId = props.match.params.companyId;
  useEffect(() => {
    const fetchData = async () => {
      const company = await loadCompany(companyId);
      setCompany(company);
    };
    fetchData();
  }, []);
  if (!company) {
    return null;
  } else {
    return (
      <div>
        <h1 className="title">{company.name}</h1>
        <div className="box">{company.description}</div>
        <h5 className="title is-5">Jobs at {company.name}</h5>
        {company.jobs.map((job) => (
          <JobList key={job.id} job={job}></JobList>
        ))}
      </div>
    );
  }
}
