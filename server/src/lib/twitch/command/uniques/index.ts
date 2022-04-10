// Imports
import { default as getBaseUniques } from "./base";
import { default as getLeagueUniques } from "./league";
import { default as getDittoUniques } from "./ditto";

// Types
import type { Unique } from "../contract";

const fetchUniques = async (): Promise<Unique[]> => {
  const baseUniques = await getBaseUniques();
  const leagueUniques = await getLeagueUniques();
  const dittoUniques = await getDittoUniques();

  return [...baseUniques, ...leagueUniques, ...dittoUniques];
};

export default fetchUniques;
