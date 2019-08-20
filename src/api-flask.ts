import { LeaderboardResponse } from "./types";

export const defaultServer = "https://31c79c70.eu.ngrok.io"; // local "http://192.168.0.11:5000";

let server = defaultServer;

const defaultHeaders = {
  Accept: "application/json",
  "Content-Type": "application/json"
};

const get = (url: string, externalServer: boolean = false) =>
  fetch(externalServer ? url : `${server}${url}`, {
    method: "GET",
    headers: defaultHeaders
  });

const fetchJson = async (call: () => Promise<Response>) => {
  const response = await call();
  const json = await response.json();
  return json;
};

export const FlaskAPI = {
  init: () => null,
  getStatus: async () => fetchJson(() => get("/api/status")),
  getPlayerList: async () => fetchJson(() => get("/api/players")),
  getLeaderboard: async () =>
    fetchJson(() => get("/api/leaderboard")) as Promise<LeaderboardResponse>,
  setServer: (newServer: string) => {
    server = newServer;
  }
};

export default FlaskAPI;
