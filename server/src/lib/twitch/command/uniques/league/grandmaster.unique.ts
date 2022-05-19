import { BaseUnique, Status, UniqueData } from "../../contract";
import { compileTriggers, Logger } from "../../../../../utils";
import type { LeagueItemDTO, Region } from "dahvidclient";
import { regionMap } from "dahvidclient";

export default class GrandmasterUnique extends BaseUnique {
  static UNIQUE_TRIGGERS = ["{PREFIX}grandmaster", "{PREFIX}gm"];

  public static getConfig() {
    return {
      data: {
        response: "{CUSTOM_RESPONSE}",
        triggers: this.UNIQUE_TRIGGERS,
        type: "inbuilt",
      },
      metadata: {
        description: "The lowest LP required for grandmaster",
      },
      id: "RrTsOMnaBJouM5GpVBR9",
    };
  }

  public static test(message: string): boolean {
    const COMPILED_TRIGGERS = compileTriggers(this.UNIQUE_TRIGGERS);

    return !!COMPILED_TRIGGERS.find(
      (x) => x === message.toLowerCase().split(/\s+/g)[0]
    );
  }

  public async run({ channel, message, api }: UniqueData): Promise<Status> {
    Logger.debug("Attempting to trigger Grandmaster unique");
    const region = (message.split(/\s+/g)[1] || "oce").toLowerCase() as Region;

    const lowestLP = await Promise.all([
      api.league.grandmasterLeagues("RANKED_SOLO_5x5", region),
      api.league.masterLeagues("RANKED_SOLO_5x5", region),
    ]).then(([grandmasterLeagues, masterLeagues]) => {
      var _leagues: LeagueItemDTO[] = grandmasterLeagues.entries
        .concat(masterLeagues.entries)
        .sort((a, b) => b.leaguePoints - a.leaguePoints);

      return _leagues[grandmasterLeagues.entries.length - 1].leaguePoints + 1;
    });

    this.client.say(
      channel,
      `Lowest LP for grandmaster in ${
        regionMap[region] ? region.toUpperCase() : "OCE"
      } is: ${lowestLP}LP`
    );

    Logger.debug("Grandmaster unique has been triggered");
    return Promise.resolve(Status.OK);
  }
}
