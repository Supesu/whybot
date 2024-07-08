import {
  BaseUnique,
  Unique,
  UniqueMetaData,
  Status,
  UniqueData,
} from "../../../contract";
import { compileTriggers, Logger, formatRank } from "../../../../../../utils";
import type {  Region } from "dahvidclient";

export const buildTrackUnique: Unique = (
  id: string,
  triggers: string[],
  summonerId: string,
  region: Region,
  metadata: UniqueMetaData
) => {
  return class TrackCustomUnique extends BaseUnique {
    static UNIQUE_TRIGGERS = triggers;

    public static getConfig() {
      return {
        data: {
          summonerId,
          triggers,
          region,
          type: "track",
        },
        metadata,
        id,
      };
    }

    public static test(message: string): boolean {
      const COMPILED_TRIGGERS = compileTriggers(this.UNIQUE_TRIGGERS);

      return !!COMPILED_TRIGGERS.find(
        (x) => x === message.toLowerCase().split(/\s+/g)[0]
      );
    }

    public async run({
      channel,
      api,
    }: UniqueData): Promise<Status> {
      const id = triggers[0].replace("{PREFIX}", "");
      Logger.debug(`Attempting to trigger ${id} unique`);

      const summoner = await api.summoner.bySummonerId(summonerId, region);
      const account = await api.account.byPuuid(summoner.puuid, "asia")
      const entries = await api.league
        .bySummonerId(summonerId, region)
        .then((queues) =>
          queues.find((entries) => entries.queueType === "RANKED_SOLO_5x5")
        );

      this.client.say(
        channel,
        `User: ${account!.gameName}#${account!.tagLine} | Rank: ${formatRank(
          entries!.tier,
          entries!.rank
        )} | LP: ${entries!.leaguePoints}`
      );

      Logger.debug(`${id} unique has been triggered`);
      return Promise.resolve(Status.OK);
    }
  };
};
