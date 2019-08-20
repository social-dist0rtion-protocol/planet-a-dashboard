export type Player = {
  avatar: string;
  name: string;
  event: string;
};

export type Country = {
  id: number;
  name: string;
};

export type LeaderboardResponse = {
  players: { [id: string]: Player };
  trees: Array<[string, number]>;
  emissions: Array<[string, number]>;
  emissionsByCountry: { [countryId: string]: number };
  treesByCountry: { [countryId: string]: number };
};
