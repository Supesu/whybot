import { BaseUnique, UniqueData, Status } from "../../contract";
import { compileTriggers, Logger } from "../../../../../utils";
import type { LeagueItemDTO, Region } from "dahvidclient";
import { regionMap } from "dahvidclient";

export default class ChallengerUnique extends BaseUnique {
  static UNIQUE_TRIGGERS = [
    "{PREFIX}challenger",
    "{PREFIX}chall",
    "{PREFIX}chal",
  ];
  public static getConfig() {
    return {
      data: {
        response: "{CUSTOM_RESPONSE}",
        triggers: this.UNIQUE_TRIGGERS,
        type: "inbuilt",
      },
      metadata: {
        description: "Lowest LP for challenger in a region",
      },
      id: "OgrbqhkdVW8wzbt5PIU6",
    };
  }

  public static test(message: string): boolean {
    const COMPILED_TRIGGERS = compileTriggers(this.UNIQUE_TRIGGERS);

    return !!COMPILED_TRIGGERS.find(
      (x) => x === message.toLowerCase().split(/\s+/g)[0]
    );
  }

  public async run({ channel, message, api }: UniqueData): Promise<Status> {
    Logger.debug("Attempting to trigger Challenger unique");

    const region = (message.split(/\s+/g)[1] || "oce").toLowerCase() as Region;
    const lowestLP = await Promise.all([
      api.league.challengerLeagues("RANKED_SOLO_5x5", region),
      api.league.grandmasterLeagues("RANKED_SOLO_5x5", region),
    ]).then(([grandmasterLeagues, challengerLeagues]) => {
      const _leagues: LeagueItemDTO[] = grandmasterLeagues.entries
        .concat(challengerLeagues.entries)
        .sort((a, b) => b.leaguePoints - a.leaguePoints);

      return _leagues[challengerLeagues.entries.length - 1].leaguePoints + 1;
    });

    this.client.say(
      channel,
      `Lowest LP for challenger in ${
        regionMap[region] ? region.toUpperCase() : "OCE"
      } is: ${lowestLP}LP`
    );

    Logger.debug("Challenger unique has been triggered");
    return Promise.resolve(Status.OK);
  }
}
