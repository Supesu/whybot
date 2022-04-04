export type LeagueListDTO = {
  leagueId: string;
  entries: LeagueItemDTO[];
  tier: string;
  name: string;
  queue: string;
};

export type Queue = "RANKED_SOLO_5x5" | "RANKED_FLEX_SR" | "RANKED_FLEX_TT";
export type Division = "I" | "II" | "III" | "IV";
export type Tier =
  | "DIAMOND"
  | "PLATINUM"
  | "GOLD"
  | "SILVER"
  | "BRONZE"
  | "IRON";

export type LeagueItemDTO = {
  freshBlood: boolean;
  wins: number;
  summonerName: string;
  miniSeries: MiniSeriesDTO;
  inactive: boolean;
  veteran: boolean;
  hotStreak: boolean;
  rank: string;
  leaguePoints: number;
  losses: number;
  summonerId: string;
};

export type MiniSeriesDTO = {
  losses: number;
  progress: string;
  target: number;
  wins: number;
};

export type LeagueEntryDTO = {
  leagueId: string;
  summonerId: string;
  summonerName: string;
  queueType: Queue;
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  hotStreak: boolean;
  veteran: boolean;
  freshBlood: boolean;
  inactive: boolean;
  miniSeries: MiniSeriesDTO;
};
