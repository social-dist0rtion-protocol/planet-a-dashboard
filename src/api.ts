import { LeaderboardResponse, Country } from "./types";
import countryList from "./countries.json";

const env = process.env.NODE_ENV || "development";

const backend =
  env === "development"
    ? "http://localhost:8080"
    : "https://planet-a-backend.before.coffee";

let lastUpdate: number;

export const countriesById: { [id: string]: Country } = countryList;

const defaultHeaders = {
  Accept: "application/json",
  "Content-Type": "application/json"
};

const get = (url: string) =>
  fetch(`${backend}${url}`, {
    method: "GET",
    headers: defaultHeaders
  });

const fetchJson = async (call: () => Promise<Response>) => {
  const response = await call();
  const json = await response.json();
  return json;
};

export const getLeaderboard = async () => {
  const response: LeaderboardResponse = await fetchJson(() =>
    get(`/stats${lastUpdate ? `?from=${lastUpdate}` : ""}`)
  );
  lastUpdate = response.lastUpdate;
  return response;
};
