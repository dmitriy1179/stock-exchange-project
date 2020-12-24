import { GraphQLClient } from "graphql-request";

export const ENDPOINT =
  "http://marketplace.asmer.fs.a-level.com.ua/graphql";

const client = new GraphQLClient(ENDPOINT);

const token = localStorage.getItem("token");

if (token !== null) {
  console.log("token", token);
  client.setHeader("Authorization", `Bearer ${localStorage.getItem("token")}`);
}

export default client;

