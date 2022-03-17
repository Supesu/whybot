// Imports
import { readdirSync } from "fs";

// Types
import type { Unique } from "../contract";

const fetchOrdinaries = async (): Promise<Unique[]> => {
  const ordinaries: Unique[] = [];
  const ordinariesToLoad = readdirSync(__dirname + "/base").filter((ordinary) =>
    ordinary.endsWith(".ordinary.js")
  );

  for await (const u of ordinariesToLoad) {
    import(`${__dirname}/base/${u}`).then((ordinary) => {
      if (ordinary && ordinary.default) {
        ordinaries.push(ordinary.default);
      }
    });
  }

  return ordinaries;
};

export default fetchOrdinaries;
