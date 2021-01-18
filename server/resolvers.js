const db = require("./db");
const Query = {
  //job: (root, args) => db.jobs.get(args.id),-- Using destructuring instead of args
  job: (root, { id }) => db.jobs.get(id),
  jobs: () => db.jobs.list(),
  company: (root, { id }) => db.companies.get(id),
};

const Mutation = {
  createJob: (root, { input }, context) => {
    if (!context.user) {
      throw new Error("Unauthorized");
    }
    const id = db.jobs.create({ ...input, companyId: context.user.companyId });
    return db.jobs.get(id);
  },
};

const Company = {
  jobs: (company) =>
    db.jobs.list().filter((job) => job.companyId === company.id),
};
const Job = {
  company: (job) => db.companies.get(job.companyId),
};
module.exports = { Query, Mutation, Company, Job };
