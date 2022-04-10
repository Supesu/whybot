// Imports
import { readdirSync } from "fs";

// Types
import type { Unique } from "../../contract";

const fetchUniques = async (): Promise<Unique[]> => {
  const uniques: Unique[] = [];
  const uniquesToLoad = readdirSync(__dirname).filter((unique) =>
    unique.endsWith(".unique.js")
  );

  for await (const u of uniquesToLoad) {
    import(`${__dirname}/${u}`).then((unique) => {
      if (unique && unique.default) {
        uniques.push(unique.default);
      }
    });
  }

  return uniques;
};

export default fetchUniques;
