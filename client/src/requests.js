import { getAccessToken, isLoggedIn } from "./auth";
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "apollo-boost";
import gql from "graphql-tag";

const endpointURL = "http://localhost:9000/graphql";

const authLink = new ApolloLink((operation, forward) => {
  if (isLoggedIn()) {
    //request.headers["authorization"] = "Bearer " + getAccessToken();
    operation.setContext({
      headers: {
        authorization: "Bearer " + getAccessToken(),
      },
    });
  }
  return forward(operation);
});

const client = new ApolloClient({
  link: ApolloLink.from([authLink, new HttpLink({ uri: endpointURL })]),
  cache: new InMemoryCache(),
});

/*async function graphqlRequest(query, variables = {}) {
  const request = {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  };
  if (isLoggedIn()) {
    request.headers["authorization"] = "Bearer " + getAccessToken();
  }
  const response = await fetch(endpointURL, request);
  const responseBody = await response.json();
  if (responseBody.errors) {
    const message = responseBody.errors
      .map((error) => error.message)
      .join("\n");
    throw new Error(message);
  }
  return responseBody.data;
}*/

const jobDetailFragment = gql`
  fragment JobDetail on Job {
    id
    title
    description
    company {
      id
      name
    }
  }
`;

const companyQuery = gql`
  query companyQuery($id: ID!) {
    company(id: $id) {
      id
      name
      description
      jobs {
        id
        title
      }
    }
  }
`;
const jobQuery = gql`
  query JobQuery($id: ID!) {
    job(id: $id) {
      ...JobDetail
    }
  }
  ${jobDetailFragment}
`;

const createJobMutation = gql`
  mutation createJobMutation($input: createJobInput) {
    job: createJob(input: $input) {
      ...JobDetail
    }
  }
  ${jobDetailFragment}
`;
const jobsQuery = gql`
  query jobsQuery {
    jobs {
      id
      title
      company {
        id
        name
      }
    }
  }
`;
export async function createJob(input) {
  //const { job } = await graphqlRequest(query, { input });
  const {
    data: { job },
  } = await client.mutate({
    mutation: createJobMutation,
    variables: { input },
    update: (cache, { data }) => {
      cache.writeQuery({
        query: jobQuery,
        variables: { id: data.job.id },
        data,
      });
    },
  });
  return job;
}

export async function loadJobs() {
  //const { jobs } = await graphqlRequest(query);
  const { data } = await client.query({ query: jobsQuery });
  return data.jobs;
}

export async function loadJob(id) {
  //const { job } = await graphqlRequest(query, { id });
  const { data } = await client.query({ query: jobQuery, variables: { id } });
  return data.job;
}

export async function loadCompany(id) {
  //const { company } = await graphqlRequest(query, { id });
  const { data } = await client.query({
    query: companyQuery,
    variables: { id },
  });
  return data.company;
}
