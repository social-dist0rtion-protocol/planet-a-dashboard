export type Player = {
  avatar?: string;
  name: string;
  event: string;
};

export type Country = {
  id: string;
  name: string;
  color: string;
};

export type LeaderboardResponse = {
  lastUpdate: number;
  players: { [id: string]: Player };
  trees: Array<[string, string]>;
  emissions: Array<[string, string]>;
  netCO2History: { [countryId: string]: Array<[string, string]> };
};
