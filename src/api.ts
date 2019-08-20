import { LeaderboardResponse, Country } from "./types";

const backend = "https://planet-a-backend.before.coffee/";
let lastUpdate: number;

export const countries = {
  usb: { id: "49155", name: "United States of Balloons", color: "red" },
  usa: { id: "49156", name: "United States of Ambrosia", color: "blue" }
};

export const countriesById = Object.entries(countries)
  .map(([_, v]) => ({ id: v.id, value: v }))
  .reduce(
    (prev, current) => {
      prev[current.id] = current.value;
      return prev;
    },
    {} as {
      [id: string]: Country;
    }
  );

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
