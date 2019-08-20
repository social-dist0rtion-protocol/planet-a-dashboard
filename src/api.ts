import LeapAPI from "./api-leap";
import FlaskAPI from "./api-flask";

const useLeap = true;
const proxy = useLeap ? LeapAPI : FlaskAPI;
if (proxy) proxy.init();

export const countries = {
  usb: { id: 49155, name: "United States of Balloons" },
  usa: { id: 49156, name: "United States of Ambrosia" }
};

export const countriesById = Object.entries(countries)
  .map(([k, v]) => ({ id: v.id, value: k }))
  .reduce(
    (prev, current) => {
      prev[current.id] = current.value;
      return prev;
    },
    {} as {
      [id: number]: string;
    }
  );

export const setServer = proxy.setServer;

export const getStatus = proxy.getStatus;

export const getPlayerList = proxy.getPlayerList;

export const getLeaderboard = proxy.getLeaderboard;
