export type Player = {
  avatar?: string;
  name: string;
  countryId: string;
};

export type Country = {
  id: string;
  name: string;
  shortName: string;
  color: string;
  textColor: string;
  event: string;
  pattern?: string;
};

export type LeaderboardResponse = {
  lastUpdate: number;
  goeMillisCirculating: number;
  players: { [id: string]: Player };
  trees: Array<[string, string]>;
  emissions: Array<[string, string]>;
  netCO2History: { [countryId: string]: Array<[string, string]> };
  co2ByCountry: { [countryId: string]: string };
  treesByCountry: { [countryId: string]: string };
};
