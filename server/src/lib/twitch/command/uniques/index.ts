// Imports
import { default as getBaseUniques } from "./base";
import { default as getLeagueUniques } from "./league";

// Types
import type { Unique } from "../contract";

const fetchUniques = async (): Promise<Unique[]> => {
  const baseUniques = await getBaseUniques();
  const leagueUniques = await getLeagueUniques();

  return [...baseUniques, ...leagueUniques];
};

export default fetchUniques;
